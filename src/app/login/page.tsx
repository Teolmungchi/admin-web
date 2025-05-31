import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/images/login.png')] bg-cover bg-center">
      <div className="mb-7 ml-220 w-full h-100 max-w-md p-8 bg-white bg-opacity-90 rounded-lg ">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <LoginForm />
      </div>
    </div>
  )
}