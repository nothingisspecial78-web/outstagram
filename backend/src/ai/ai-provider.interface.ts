export interface AICompletionOptions {
  systemPrompt: string;
  userMessage: string;
  timeoutMs?: number;
}

export interface IAIProvider {
  readonly providerId: string;
  readonly name: string;
  checkHealth(): Promise<{ online: boolean; message: string; activeModel: string }>;
  generateCompletion(options: AICompletionOptions): Promise<string>;
}
