import { callStreamingAgent } from '../services/anthropic.js';

export const analyzeTechnology = async (req, res) => {
    const { query } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        // Mock mode fallback
        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('mock-key')) {
            const mockResponse = {
                techName: query,
                setupDocs: `## 📌 Architectural Overview\n\n${query} represents a paradigm shift in modern engineering. It provides a distributed, highly-resilient abstraction layer for complex systems, enabling seamless scalability and production-grade reliability without the overhead of traditional infrastructure management.\n\n## 🚀 Technical Guide\n\n### Installation Pattern\n\`\`\`bash\n# Global CLI distribution\nnpm install -g @snapdoc/engine-${query.toLowerCase()}\n\n# System-level dependency\nbrew install ${query.toLowerCase()}-core\n\`\`\`\n\n### Advanced Configuration\n\`\`\`javascript\n// snapdoc.config.js\nmodule.exports = {\n    engine: "${query.toLowerCase()}",\n    environment: "production",\n    scaling: {\n        min: 3,\n        max: 50,\n        policy: "aggressive_optimization"\n    },\n    security: {\n        encryption: "AES-256-GCM",\n        mfa: true\n    }\n};\n\`\`\`\n\n### Practical Implementation\n\`\`\`javascript\nimport { Engine, Strategy } from '@${query.toLowerCase()}/core';\n\n// Initialize the high-fidelity instance\nconst instance = new Engine({\n    id: 'ENGINE_0x88',\n    strategy: Strategy.DEEP_SPACE\n});\n\nawait instance.pipeline({\n    input: 'SNAP_DOC_STREAM',\n    mode: 'INTELLIGENT_ANALYSIS'\n});\n\nconsole.log('${query} analysis complete.');\n\`\`\`\n\n## 📚 External Intelligence\n- [Primary Documentation Hub](https://docs.${query.toLowerCase()}.io)\n- [System Architecture Whitepaper](https://github.com/snapdoc/whitepapers)`,
                recommendations: [
                    "Implement a robust TLS 1.3 strategy for all inter-node communication channels.",
                    "Utilize environment-specific config injection for zero-downtime deployments.",
                    "Leverage the built-in observability dashboard for real-time telemetry tracking."
                ]
            };

            const mockJSON = JSON.stringify(mockResponse);
            for (let char of mockJSON) {
                res.write(`data: ${JSON.stringify({ text: char })}\n\n`);
                await new Promise(r => setTimeout(r, 5));
            }
            res.write('data: [DONE]\n\n');
            res.end();
            return;
        }

        const systemPrompt = `Generate a high-fidelity technical roadmap for: "${query}"

## Required Content:
1. **Architectural Profile**: Detailed 2-3 paragraph breakdown of core concepts, strengths, and utility.
2. **Implementation Flow**:
   - Technical Installation (Shell commands for multiple platforms)
   - Advanced Configuration (Detailed JS/JSON/YAML config blocks)
   - Production-Grade Example (A substantial, 10-15 line code block showing a real-world use case)
3. **External References**: Direct documentation and repository links.

## JSON Format:
{
  "techName": "${query}",
  "setupDocs": "Comprehensive Markdown including 3+ professional code blocks",
  "recommendations": [
    "Architectural best practice or high-level strategy tip",
    "Performance optimization or security hardening tip",
    "Scalability or complex integration strategy tip"
  ]
}

## Critical Rules:
- Output RAW JSON ONLY. No preamble or conversational filler.
- Prioritize technical depth and high-fidelity code frames.
- Ensure 'setupDocs' is rich markdown with proper heading hierarchy.
- Include real-world, executable commands where possible.`;

        console.log('[TechController] Starting stream for:', query);

        await callStreamingAgent(
            "You are a high-performance documentation architect. Output RAW JSON ONLY. Be technical and precise.",
            systemPrompt,
            (chunk) => {
                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
            }
        );

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('[TechController] Analysis Error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
};
