"use server";

import { InsertSource } from "@/db/schema";
import { ActionState } from "@/types";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue, StreamableValue } from "ai/rsc";

export async function generateOpenAIResponseAction(userQuery: string, sources: InsertSource[]): Promise<ActionState<StreamableValue<any, any>>> {
  try {
    const stream = createStreamableValue();

    const sourcesContext = sources.map((r, i) => `Source ${i + 1}: ${r.title}\nURL: ${r.url}\nSummary: ${r.summary}\nText: ${r.text}\n`).join("");

    const systemPrompt = `You are a helpful assistant. Use the following sources to answer the user's query. If the sources don't contain relevant information, you can use your general knowledge to answer.

Today's date is ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.

Sources:
${sourcesContext}

Always cite your sources when using information from them. If you use general knowledge, state that it's based on your general understanding.

Respond in markdown format.`;

    (async () => {
      const { textStream } = await streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: [{ role: "user", content: userQuery }]
      });

      for await (const text of textStream) {
        stream.update(text);
      }

      stream.done();
    })();

    return {
      isSuccess: true,
      message: "Successfully generated OpenAI response",
      data: stream.value
    };
  } catch (error) {
    console.error("Error generating OpenAI response:", error);
    return {
      isSuccess: false,
      message: "Failed to generate OpenAI response"
    };
  }
}
