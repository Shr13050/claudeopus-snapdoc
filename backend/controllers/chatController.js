import { callStreamingAgent } from '../services/anthropic.js';

export const chatWithAI = async (req, res) => {
    const { message } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        console.log('[ChatController] Starting stream for:', message);

        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('mock-key')) {
            const mockText = `[Simulation Mode] I am currently in developer mode. To enable real-time intelligence, please provide a valid Anthropic API key.`;
            // Simulate streaming for mock
            for (let word of mockText.split(' ')) {
                res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
                await new Promise(r => setTimeout(r, 50));
            }
            res.write('data: [DONE]\n\n');
            res.end();
            return;
        }

        await callStreamingAgent(
            "You are a strategic intelligence assistant. Respond in concise markdown.",
            message,
            (chunk) => {
                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
            }
        );

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('[ChatController] Stream Error:', error.message);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
};
