import "reflect-metadata";
import OpenAI from "openai";
import { Service } from "typedi";
import { ConfigService } from "../../domain/services/config-service";

@Service()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: ConfigService.openAIConfig.apiKey,
    });
  }

  public async processPrompt(
    content: string
  ): Promise<string | undefined | null> {
    let completion = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });

    return completion.choices.find(() => true)?.message.content;
  }
}
