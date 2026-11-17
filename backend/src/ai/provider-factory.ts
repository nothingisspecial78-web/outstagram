import { IAIProvider } from './ai-provider.interface.js';
import { GroqProvider } from './groq-provider.js';
import { GeminiProvider } from './gemini-provider.js';
import { OpenRouterProvider } from './openrouter-provider.js';
import { AnthropicProvider } from './anthropic-provider.js';
import { config } from '../config.js';

export function getAIProvider(explicitProvider?: string): IAIProvider {
  const chosen = (explicitProvider || config.ai.activeProvider).toLowerCase();

  switch (chosen) {
    case 'groq':
      return new GroqProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'openrouter':
      return new OpenRouterProvider();
    case 'anthropic':
    case 'claude':
      return new AnthropicProvider();
    default:
      // Try providers based on available keys
      if (config.ai.groq.apiKey) return new GroqProvider();
      if (config.ai.gemini.apiKey) return new GeminiProvider();
      if (config.ai.openrouter.apiKey) return new OpenRouterProvider();
      if (config.ai.anthropic.apiKey) return new AnthropicProvider();
      return new GroqProvider();
  }
}
