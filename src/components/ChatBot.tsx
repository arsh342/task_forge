import { useState, useEffect, useRef } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateStreamingResponse } from "@/lib/gemini"
import { Send, Bot } from "lucide-react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatBot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you manage your tasks and answer any questions you have. What would you like to know?",
    },
  ])
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "tasks"), where("createdBy", "==", user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      setTasks(tasks)
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const taskSummary = tasks.map((task) => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        startTime: task.startTime,
        dueTime: task.dueTime,
        dueDate: new Date(task.dueDate).toLocaleDateString(),
        description: task.description,
      }))

      const prompt = `
        Context: User has ${tasks.length} tasks.
        Task Details:
        ${JSON.stringify(taskSummary, null, 2)}

        User Question: ${userMessage}

        Instructions:
        1. If the question is about tasks, analyze the task data and provide specific insights
        2. If it's a general question, provide a helpful response based on your knowledge
        3. Format the response in a clear, readable way without using markdown or special formatting
        4. For task analysis, consider:
           - Task priorities and deadlines
           - Current task status
           - Time management suggestions
        5. Keep responses concise but informative
        6. Use simple formatting like new lines for readability
        7. Provide a natural, conversational response that directly addresses the user's question

        Please respond in a clear, easy-to-read format without any special characters or markdown.
      `

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      const stream = generateStreamingResponse(prompt)
      let fullResponse = ""

      for await (const chunk of stream) {
        fullResponse += chunk
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = fullResponse
          return newMessages
        })
      }
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
      inputRef.current?.focus()
    }
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto max-w-3xl">
      <CardContent className="flex-1 p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex items-start gap-2", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-black">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] rounded-lg p-3 border-2 border-black",
                    message.role === "user"
                      ? "bg-[#FFD700] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center border-2 border-black">
                    {user?.email?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-black">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          <Button
            type="submit"
            disabled={loading}
            className="border-2 border-black bg-[#4CAF50] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}