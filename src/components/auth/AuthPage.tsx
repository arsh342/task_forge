import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { AuthForm } from "./AuthForm"

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[400px] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black text-center">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm mode={mode} />
          <div className="mt-4 text-center text-sm">
            {mode === "signin" ? (
              <div className="space-x-1">
                <span>Don't have an account?</span>
                <Button variant="link" className="px-0" onClick={() => setMode("signup")}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="space-x-1">
                <span>Already have an account?</span>
                <Button variant="link" className="px-0" onClick={() => setMode("signin")}>
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
