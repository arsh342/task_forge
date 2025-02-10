import { useState } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateTaskSuggestions } from "@/lib/gemini"
import { Send } from "lucide-react"

interface ChatBotProps {
  tasks: Task[]
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatBot({ tasks }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I can help you manage your tasks more effectively. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const prompt = `
        Context: User has ${tasks.length} tasks.
        Task Summary:
        ${tasks.map((task) => `- ${task.title} (${task.status}, ${task.priority})`).join("\n")}

        User Question: ${userMessage}

        Please provide a helpful response based on the tasks and the user's question.
        Focus on practical advice and actionable insights.
      `

      const response = await generateTaskSuggestions(prompt)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-[600px] lg:h-[calc(100vh-2rem)] flex flex-col">
      <CardContent className="flex-1 p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">Thinking...</div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your tasks..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

