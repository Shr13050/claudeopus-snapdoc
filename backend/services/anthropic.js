import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
});

const DEFAULT_MODEL = "claude-opus-4-6";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Simple Text Call (Scout / Architect / Critic)
 */
export async function callTextAgent(systemPrompt, userContent, retries = 3) {
    let lastError = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[Anthropic] Text Agent Call - Attempt ${attempt}/${retries}`);

            const response = await anthropic.messages.create({
                model: DEFAULT_MODEL,
                max_tokens: 3000,
                system: systemPrompt,
                messages: [{ role: "user", content: userContent }],
            });

            return response.content[0].text;

        } catch (error) {
            console.error(`⚠ Claude call failed (attempt ${attempt}/${retries}):`, error.message);
            lastError = error;

            if (error.status === 401) {
                throw new Error("AUTHENTICATION_ERROR: Invalid API Key. Please check your .env file.");
            }

            if (attempt < retries) {
                await sleep(2000);
            }
        }
    }

    throw lastError;
}

/**
 * Streaming Text Call (Chat)
 */
export async function callStreamingAgent(systemPrompt, userContent, onUpdate) {
    try {
        console.log(`[Anthropic] Streaming Agent Call Start`);

        const stream = await anthropic.messages.create({
            model: DEFAULT_MODEL,
            max_tokens: 3000,
            system: systemPrompt,
            messages: [{ role: "user", content: userContent }],
            stream: true,
        });

        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.text) {
                onUpdate(event.delta.text);
            }
        }

    } catch (error) {
        console.error(`⚠ Claude streaming failed:`, error.message);
        if (error.status === 401) {
            throw new Error("AUTHENTICATION_ERROR: Invalid API Key.");
        }
        throw error;
    }
}

/**
 * Tool Call Version (Executor)
 */
export async function callToolAgent(systemPrompt, messages, tools, retries = 3) {
    let lastError = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[Anthropic] Tool Agent Call - Attempt ${attempt}/${retries}`);

            const response = await anthropic.messages.create({
                model: DEFAULT_MODEL,
                max_tokens: 3000,
                system: systemPrompt,
                messages: messages,
                tools: tools,
            });

            return response;

        } catch (error) {
            console.error(`⚠ Claude tool call failed (attempt ${attempt}/${retries}):`, error.message);
            lastError = error;

            if (error.status === 401) {
                throw new Error("AUTHENTICATION_ERROR: Invalid API Key. Please check your .env file.");
            }

            if (attempt < retries) {
                await sleep(2000);
            }
        }
    }

    throw lastError;
}
