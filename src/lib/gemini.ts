import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateTaskSuggestions(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error generating task suggestions:", error)
    return "Failed to generate task suggestions. Please try again."
  }
}

export async function generateStreamingResponse(prompt: string) {
  try {
    const stream = await streamText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return stream.textStream
  } catch (error) {
    console.error("Error generating streaming response:", error)
    throw error
  }
}

