export interface IOpenAIService {
    processPrompt(content: string): Promise<string | undefined | null>;
}