import { IAIProvider, AICompletionOptions } from './ai-provider.interface.js';
import { config } from '../config.js';

export class GroqProvider implements IAIProvider {
  readonly providerId = 'groq';
  readonly name = 'Groq Cloud (Llama 3.3)';
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.ai.groq.apiKey;
    this.model = config.ai.groq.model;
  }

  async checkHealth(): Promise<{ online: boolean; message: string; activeModel: string }> {
    if (!this.apiKey) {
      return { online: false, message: 'GROQ_API_KEY is not set', activeModel: this.model };
    }
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return {
        online: res.ok,
        message: res.ok ? 'Groq API is ready' : `Groq returned ${res.status}`,
        activeModel: this.model,
      };
    } catch (err: any) {
      return { online: false, message: err.message, activeModel: this.model };
    }
  }

  async generateCompletion(options: AICompletionOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is required');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || 8000);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
          ],
          max_tokens: 300,
          temperature: 0.6,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API error (${res.status}): ${errorText}`);
      }

      const data = await res.json() as any;
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Groq returned empty response');
      }

      return content.trim();
    } finally {
      clearTimeout(timer);
    }
  }
}
