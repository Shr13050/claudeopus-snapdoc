import { useState, useEffect } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import Chat from './components/Chat';
import Search from './components/Search';
import Read from './components/Read';
import Write from './components/Write';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // New state for detected technology guides
  const [detectedGuide, setDetectedGuide] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');

  // Interruption handling state
  const [currentlyAnalyzingQuery, setCurrentlyAnalyzingQuery] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(null);
  const [showInterruptModal, setShowInterruptModal] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // Listen for messages from service worker and content script
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === "TECH_SEARCH_DETECTED") {
        console.log("Technology Search Detected:", message.query);
        analyzeTech(message.query);
      } else if (message.type === "AUTO_TECH_DETECTED") {
        console.log("🎯 Auto-detected tech domain:", message.data);
        // Switch to search tab and analyze
        setActiveTab('search');
        analyzeTech(message.data.domain || message.data.url);
      }
    };

    const checkActiveTab = async () => {
      if (window.chrome && chrome.tabs) {
        try {
          const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          if (tab && tab.url) {
            const url = new URL(tab.url);
            const domain = url.hostname;
            if (domain !== currentDomain) {
              setCurrentDomain(domain);
              // If it's a known tech domain or not a search engine, analyze it
              if (!domain.includes('google.com') && !domain.includes('bing.com')) {
                analyzeTech(domain);
              }
            }
          }
        } catch (e) {
          console.error("Tab detection error:", e);
        }
      }
    };

    if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);

      // Check active tab on mount and periodically or on focus
      checkActiveTab();

      // Listener for tab changes
      const tabListener = () => checkActiveTab();
      chrome.tabs.onActivated.addListener(tabListener);
      chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.status === 'complete') checkActiveTab();
      });

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
        chrome.tabs.onActivated.removeListener(tabListener);
      };
    }
  }, [currentDomain]);

  // Separate histories for Chat and Search
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('snapdoc_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('snapdoc_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Save histories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('snapdoc_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('snapdoc_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const analyzeTech = async (query) => {
    // List of common non-tech domains to ignore
    const ignoreDomains = ['google.com', 'bing.com', 'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'amazon.com', 'netflix.com', 'youtube.com'];
    if (ignoreDomains.some(d => query.toLowerCase().includes(d))) return;

    // List of tech-related suffixes/keywords
    const techKeywords = [
      'npm', 'install', 'react', 'node', 'python', 'docker', 'api', 'setup',
      'how to', 'database', 'framework', 'github', 'vercel', 'aws', 'azure',
      'rust', 'golang', 'typescript', 'tailwind', 'mongodb', 'postgres', 'redis',
      'documentation', 'developer', 'docs', 'stack', 'library', 'sdk', 'graphql',
      'kubernetes', 'serverless', 'microservices'
    ];

    // Check if query is a domain or contains tech keywords
    const isTech = techKeywords.some(k => query.toLowerCase().includes(k)) ||
      (query.includes('.') && !query.includes('/') && query.length > 3);

    if (!isTech) return;

    // ⚠️ INTERRUPTION CHECK: If already analyzing something, show confirmation modal
    if (isAnalyzing && currentlyAnalyzingQuery && currentlyAnalyzingQuery !== query) {
      console.log('⚠️ Analysis in progress. Asking user for confirmation...');
      setPendingQuery(query);
      setShowInterruptModal(true);
      return;
    }

    setActiveTab('search');
    setCurrentlyAnalyzingQuery(query);

    // 🚀 CACHE CHECK: Look for existing result in search history
    const normalizedQuery = query.toLowerCase().trim();
    const cachedResult = searchHistory.find(item =>
      item.query && item.query.toLowerCase().trim() === normalizedQuery && item.result
    );

    if (cachedResult) {
      console.log('✅ Loading from cache:', query);
      setIsAnalyzing(true);
      // Simulate a brief loading for better UX
      setTimeout(() => {
        setDetectedGuide(cachedResult.result);
        setIsAnalyzing(false);
        setCurrentlyAnalyzingQuery(null);
      }, 300);
      return;
    }

    // No cache found, proceed with AI analysis
    console.log('🔍 Cache miss, fetching from AI:', query);
    setIsAnalyzing(true);

    // Create AbortController to allow cancellation
    const controller = new AbortController();
    setAbortController(controller);

    // Save to search history (will be updated with result later)
    const searchId = Date.now();
    const newSearchSession = {
      id: searchId,
      title: query.slice(0, 50) + (query.length > 50 ? '...' : ''),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      query: query,
      result: null // Will be populated after AI completes
    };
    setSearchHistory(prev => [newSearchSession, ...prev]);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
        signal: controller.signal // Add abort signal
      });

      if (!response.ok) throw new Error('Backend failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let finalResult = { techName: 'Analyzing...', setupDocs: '', recommendations: [] };

      // Initial placeholder
      setDetectedGuide(finalResult);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;

                // Try to extract fields from the growing partial JSON
                // This is a simple but effective approach for streaming JSON
                const techMatch = fullText.match(/"techName":\s*"((?:[^"\\]|\\.)*)"/);
                const docsMatch = fullText.match(/"setupDocs":\s*"((?:[^"\\]|\\.)*)/);
                const recsMatch = fullText.match(/"recommendations":\s*\[([\s\S]*?)\]/);

                finalResult = {
                  ...finalResult,
                  techName: techMatch ? techMatch[1] : (finalResult.techName || 'Analyzing...'),
                  setupDocs: docsMatch ? docsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : finalResult.setupDocs,
                  recommendations: recsMatch ? (() => {
                    try { return JSON.parse(`[${recsMatch[1]}]`); } catch { return finalResult.recommendations; }
                  })() : finalResult.recommendations
                };

                setDetectedGuide(finalResult);

                // Once we have docs starting, we can stop the main analysis loader
                if (docsMatch && docsMatch[1].length > 10) {
                  setIsAnalyzing(false);
                }
              }
            } catch {
              console.warn("Stream processing error");
            }
          }
        }
      }

      // 💾 CACHE SAVE: Update search history with the final result
      setSearchHistory(prev => prev.map(item =>
        item.id === searchId ? { ...item, result: finalResult } : item
      ));
      console.log('💾 Saved to cache:', query);

    } catch (error) {
      // Don't show error if request was aborted (user switched to another query)
      if (error.name === 'AbortError') {
        console.log('🚫 Request aborted:', query);
        return;
      }

      console.error("Analysis error", error);
      setIsAnalyzing(false);
      setDetectedGuide({
        techName: "Research Error",
        setupDocs: `### ⚠️ Failed to Research "${query}"\n\nThe intelligence engine encountered a parsing error. Please try searching again.\n\n[Try Google Search](https://google.com/search?q=${encodeURIComponent(query)})`,
        recommendations: ["Check API Key", "Retry Search"]
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentlyAnalyzingQuery(null);
      setAbortController(null);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;

    const userMsg = { id: userMsgId, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Save to chat history if it's a new conversation
    if (messages.length === 0) {
      const newChatSession = {
        id: userMsgId,
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      };
      setChatHistory(prev => [newChatSession, ...prev]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      // Add actual assistant message placeholder
      setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                assistantText += parsed.text;
                // Update specific assistant message
                setMessages((prev) => prev.map(msg =>
                  msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg
                ));
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.warn("Stream parse error", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg = `⚠️ Error: ${error.message}. Please check your connection or API key.`;
      setMessages((prev) => prev.map(msg =>
        msg.id === assistantMsgId ? { ...msg, content: errorMsg } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setDetectedGuide(null);
    setActiveTab('chat');
  };

  const handleSelectHistory = (id) => {
    // For now, just close the sidebar. In future, could restore the session
    setHistoryOpen(false);
  };

  const handleDeleteHistory = (id) => {
    if (activeTab === 'chat') {
      setChatHistory(prev => prev.filter(item => item.id !== id));
    } else if (activeTab === 'search') {
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleContinueCurrent = () => {
    console.log('👍 User chose to continue with:', currentlyAnalyzingQuery);
    setShowInterruptModal(false);
    setPendingQuery(null);
  };

  const handleStartFresh = () => {
    console.log('🔄 User chose to start fresh with:', pendingQuery);

    // IMMEDIATELY clear frontend and abort request
    setDetectedGuide(null);
    setIsAnalyzing(false);
    setShowInterruptModal(false);

    // Abort the ongoing request
    if (abortController) {
      console.log('🛑 Aborting current request:', currentlyAnalyzingQuery);
      abortController.abort();
    }

    const queryToAnalyze = pendingQuery;
    setPendingQuery(null);
    setCurrentlyAnalyzingQuery(null);
    setAbortController(null);

    // Start new analysis immediately
    setTimeout(() => analyzeTech(queryToAnalyze), 50);
  };

  return (
    <div className="relative flex flex-col h-screen w-full mx-auto bg-bg-base text-text-main shadow-[0_0_80px_rgba(0,0,0,0.8)] border-x border-white/5 overflow-hidden">
      {/* Fixed Background Elements */}
      <div className="mesh-container">
        <div className="mesh-blob mesh-1" />
        <div className="mesh-blob mesh-2" />
        <div className="mesh-blob mesh-3" />
      </div>

      {/* App Content */}
      <div className="flex flex-col h-full relative z-10">
        <Header
          onNewChat={handleNewChat}
          onToggleHistory={() => setHistoryOpen(true)}
          onToggleSettings={() => setSettingsOpen(true)}
        />

        <main className="flex-1 relative overflow-hidden transition-all duration-500">
          {activeTab === 'chat' && (
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          )}
          {activeTab === 'search' && (
            <Search
              detectedGuide={detectedGuide}
              isAnalyzing={isAnalyzing}
            />
          )}
          {activeTab === 'read' && <Read />}
          {activeTab === 'write' && <Write />}
        </main>

        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <Sidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={activeTab === 'chat' ? chatHistory : activeTab === 'search' ? searchHistory : []}
        onSelectChat={handleSelectHistory}
        onDeleteChat={handleDeleteHistory}
      />

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Interruption Modal */}
      {showInterruptModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[200] flex items-center justify-center animate-fade-in px-4">
          <div className="glass rounded-[32px] p-10 max-w-lg w-full animate-scale-up relative overflow-hidden">
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-5xl">⚠️</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-black text-white text-center mb-4 tracking-tight">
                Switch Analysis?
              </h2>

              {/* Description */}
              <div className="text-center mb-10 space-y-2">
                <p className="text-[15px] text-text-dim leading-relaxed">
                  Currently analyzing:
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
                  <span className="text-brand-cyan font-bold text-[15px]">"{currentlyAnalyzingQuery}"</span>
                </div>
                <p className="text-[15px] text-text-dim leading-relaxed mt-4">
                  Want to switch to:
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                  <span className="text-brand-purple font-bold text-[15px]">"{pendingQuery}"</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStartFresh}
                  className="w-full px-6 py-5 rounded-[20px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-cyan bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-black text-[15px] transition-all duration-500 shadow-[0_0_30px_rgba(0,242,254,0.3)] hover:shadow-[0_0_40px_rgba(0,242,254,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  ⚡ Start Fresh with {pendingQuery?.slice(0, 20)}{pendingQuery?.length > 20 ? '...' : ''}
                </button>
                <button
                  onClick={handleContinueCurrent}
                  className="w-full px-6 py-4 rounded-[20px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-bold text-[14px] transition-all duration-300"
                >
                  Continue with {currentlyAnalyzingQuery?.slice(0, 20)}{currentlyAnalyzingQuery?.length > 20 ? '...' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
