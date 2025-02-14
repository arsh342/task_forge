"use client"

import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { AuthPage } from "@/components/auth/AuthPage"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const { user, loading } = useAuth()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
      }
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {user ? <Dashboard /> : <AuthPage />}
      <Toaster />
    </div>
  )
}

export default App

