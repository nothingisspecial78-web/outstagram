import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowDemoMode: (process.env.ALLOW_DEMO_MODE || 'false').toLowerCase() === 'true',

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },

  ai: {
    activeProvider: (process.env.COPILOT_AI_PROVIDER || 'groq').toLowerCase(),
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.COACH_MODEL || 'claude-3-haiku-20240307',
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
      model: process.env.OLLAMA_CHAT_MODEL || 'llama3.1:8b',
    },
  },
};
