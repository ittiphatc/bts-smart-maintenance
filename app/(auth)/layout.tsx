// app/(auth)/layout.tsx
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    // ถ้า login แล้ว → redirect ไป dashboard เลย
    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen flex">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
                <div className="max-w-md w-full mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">BTS Smart Maintenance </span>
                    </div>

                    {children}
                </div>
            </div>

            {/* Right: Testimonial */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://www.prachachat.net/wp-content/uploads/2019/12/8E9233FF-695F-430F-A75D-7EC1C3453B82.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <p className="text-sm font-medium text-blue-300 mb-4">Smart Maintenance</p>
                    <blockquote className="text-2xl lg:text-3xl font-semibold leading-snug mb-6">
                        &ldquo;Smart Maintenance has revolutionized how we handle our machine learning
                        pipelines. The scalability is unmatched.&rdquo;
                    </blockquote>
                    <div>
                        <p className="font-semibold text-lg">Natthawut Srisuwan</p>
                        <p className="text-gray-300 text-sm">Student at BTS</p>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <span className="w-2 h-2 rounded-full bg-white/50" />
                        <span className="w-6 h-2 rounded-full bg-white" />
                        <span className="w-2 h-2 rounded-full bg-white/50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
