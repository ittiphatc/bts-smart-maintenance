"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function UserMenu() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // กำลังโหลด Session
    if (status === "loading") {
        return <div className="animate-pulse w-9 h-9 bg-gray-200 rounded-full" />
    }

    // ยังไม่ได้ Login
    if (!session) {
        return null
    }

    // สร้าง Avatar Initials จากชื่อผู้ใช้
    const initials = (session.user?.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 rounded-full hover:bg-gray-100 transition pl-3 pr-1.5 py-1.5"
            >
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session.user?.name}
                </span>

                {session.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full ring-2 ring-gray-100"
                        width={36}
                        height={36}
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100">
                        <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                )}

                {/* Chevron */}
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{session.user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                            {(session.user as { role?: string })?.role?.toUpperCase() || "USER"}
                        </span>
                    </div>

                    {/* Logout */}
                    <div className="px-2 pt-2 pb-1">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}