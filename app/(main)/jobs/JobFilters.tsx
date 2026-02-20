"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function JobFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get("search") || "")

    function applyFilters(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "ALL") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/jobs?${params.toString()}`)
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        applyFilters("search", search)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="ค้นหาเลขที่ใบงาน, สถานที่, หัวข้อ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        />
                    </div>
                </form>

                {/* Status Filter */}
                <select
                    value={searchParams.get("status") || "ALL"}
                    onChange={(e) => applyFilters("status", e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                >
                    <option value="ALL">สถานะทั้งหมด</option>
                    <option value="PENDING">⏳ รอตรวจสอบ</option>
                    <option value="IN_PROGRESS">🔧 กำลังซ่อม</option>
                    <option value="COMPLETED">✅ เสร็จแล้ว</option>
                    <option value="CANCELLED">❌ ยกเลิก</option>
                </select>

                {/* Priority Filter */}
                <select
                    value={searchParams.get("priority") || "ALL"}
                    onChange={(e) => applyFilters("priority", e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                >
                    <option value="ALL">ความเร่งด่วนทั้งหมด</option>
                    <option value="CRITICAL">🔴 วิกฤต</option>
                    <option value="HIGH">🟠 สูง</option>
                    <option value="MEDIUM">🟡 ปานกลาง</option>
                    <option value="LOW">🟢 ต่ำ</option>
                </select>
            </div>
        </div>
    )
}