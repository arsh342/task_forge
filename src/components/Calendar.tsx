"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Trash2, Bell, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  isPast,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import type { Task } from "@/types/task"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { doc, deleteDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "tasks"), where("createdBy", "==", user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      setTasks(tasks)

      // Check for upcoming tasks
      // const today = new Date()
      // const tomorrow = addDays(today, 1)

      tasks.forEach((task) => {
        const dueDate = new Date(task.dueDate)

        if (isToday(dueDate) || isTomorrow(dueDate)) {
          toast({
            title: `Task Due ${isToday(dueDate) ? "Today" : "Tomorrow"}`,
            description: task.title,
            duration: 5000,
          })
        }
      })
    })

    return () => unsubscribe()
  }, [user, toast])

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId))
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const getDayTasks = (day: Date) => {
    return tasks.filter((task) => format(new Date(task.dueDate), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
  }

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const daysInMonth = getDaysInMonth()

  return (
    <div className="container mx-auto p-4">
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((prevMonth) => addDays(prevMonth, -30))}
                className="border-2 border-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((prevMonth) => addDays(prevMonth, 30))}
                className="border-2 border-black"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {days.map((day) => (
              <div key={day} className="text-center font-semibold py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map((day) => {
              const dayTasks = getDayTasks(day)
              const isSelected = format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] p-1 border rounded-lg transition-all cursor-pointer",
                    isSelected ? "border-primary bg-primary/10" : "border-gray-200",
                    isCurrentDay && "bg-accent/20",
                    !isCurrentMonth && "opacity-50",
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn("font-semibold text-sm", isCurrentDay && "text-primary")}>
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          task.priority === "high"
                            ? "bg-red-100"
                            : task.priority === "medium"
                              ? "bg-yellow-100"
                              : "bg-green-100",
                        )}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Day Tasks */}
          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {getDayTasks(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between p-3 border-2 border-black rounded-lg",
                      "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                      "transition-all",
                      isPast(new Date(task.dueDate)) && task.status !== "completed" ? "bg-red-50" : "bg-white",
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {isPast(new Date(task.dueDate)) && task.status !== "completed" && (
                          <Bell className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-green-600">{task.startTime}</span>
                        <span>-</span>
                        <span className="text-red-600">{task.dueTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="border-2 border-black"
                      >
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {getDayTasks(selectedDate).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No tasks scheduled for this day</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

