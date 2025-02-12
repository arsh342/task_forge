"use client"

import { useState, useEffect, useRef } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateStreamingResponse } from "@/lib/gemini"
import { Send } from "lucide-react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"

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
  }, [scrollAreaRef]) //Fixed unnecessary dependency

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
           - Workload balance
           - Time management suggestions
        5. Keep responses concise but informative
        6. Use simple formatting like new lines for readability
        7. Provide a natural, conversational response that directly addresses the user's question

        Please respond in a clear, easy-to-read format without any special characters or markdown.
      `

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      const stream = await generateStreamingResponse(prompt)
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
    }
  }

  return (
    <Card className="h-[600px] flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardContent className="flex-1 p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 border-2 border-black ${
                    message.role === "user"
                      ? "bg-[#FFD700] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your tasks..."
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

