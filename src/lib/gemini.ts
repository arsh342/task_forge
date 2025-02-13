import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export async function generateTaskSuggestions(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating response:", error)
    return "I apologize, but I encountered an error. Please try again."
  }
}

export async function* generateStreamingResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContentStream(prompt)

    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      yield chunkText
    }
  } catch (error) {
    console.error("Error generating streaming response:", error)
    throw error
  }
}

