import { IAIProvider, AICompletionOptions } from './ai-provider.interface.js';
import { config } from '../config.js';

export class AnthropicProvider implements IAIProvider {
  readonly providerId = 'anthropic';
  readonly name = 'Anthropic Claude';
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.ai.anthropic.apiKey;
    this.model = config.ai.anthropic.model;
  }

  async checkHealth(): Promise<{ online: boolean; message: string; activeModel: string }> {
    if (!this.apiKey) {
      return { online: false, message: 'ANTHROPIC_API_KEY is not set', activeModel: this.model };
    }
    return { online: true, message: 'Anthropic Claude is configured', activeModel: this.model };
  }

  async generateCompletion(options: AICompletionOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || 8000);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 300,
          system: options.systemPrompt,
          messages: [{ role: 'user', content: options.userMessage }],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Anthropic API error (${res.status}): ${errorText}`);
      }

      const data = await res.json() as any;
      const content = data.content?.[0]?.text;
      if (!content) {
        throw new Error('Anthropic returned empty response');
      }

      return content.trim();
    } finally {
      clearTimeout(timer);
    }
  }
}
