"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/actions/registerAction"
import Link from "next/link"
import OAuthButtons from "@/app/components/OAuthButtons"

export default function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")
        setSuccess("")

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        }

        const res = await registerUser(data)

        setIsPending(false)

        if (res.error) {
            setError(res.error)
        } else {
            setSuccess(res.success || "สมัครสมาชิกสำเร็จ!")
            setTimeout(() => router.push("/login"), 2000)
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500 mb-8">Sign up to get started</p>

            <OAuthButtons />

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ✅ {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Your name"
                    />
                </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter your password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Confirm your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition text-base"
                >
                    {isPending ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign in
                </Link>
            </p>

            <p className="mt-4 text-center text-xs text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:underline">Terms of Service ↗</Link>
            </p>
            </div>
        </div>
    )
}