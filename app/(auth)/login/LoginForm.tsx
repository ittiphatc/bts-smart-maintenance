// app/(auth)/login/LoginForm.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import OAuthButtons from "@/app/components/OAuthButtons"

export default function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        setIsPending(false)

        if (res?.error) {
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

            <OAuthButtons />

            <div className="relative my-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900/80 text-gray-500">Or continue with email</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition text-base"
                >
                    {isPending ? "Signing in..." : "Continue"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign up
                </Link>
            </p>

            <p className="mt-4 text-center text-xs text-gray-400">
                By signing in, you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:underline">Terms of Service ↗</Link>
            </p>
            </div>
        </div>
    )
}

