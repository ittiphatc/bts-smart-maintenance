"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateJobStatus } from "@/app/actions/maintenanceActions"

export default function StatusUpdater({
    jobId,
    currentStatus,
}: {
    jobId: number
    currentStatus: string
}) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState("")

    async function handleStatusChange(newStatus: string) {
        setIsPending(true)
        setMessage("")

        const res = await updateJobStatus(jobId, newStatus)

        setIsPending(false)

        if (res.error) {
            setMessage(`❌ ${res.error}`)
        } else {
            setMessage(`✅ ${res.success}`)
            router.refresh()
        }
    }

    // กำหนด Actions ที่สามารถทำได้ตามสถานะปัจจุบัน
    const actions: Record<string, { label: string; status: string; color: string }[]> = {
        PENDING: [
            { label: "🔧 เริ่มซ่อม", status: "IN_PROGRESS", color: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25" },
            { label: "❌ ยกเลิก", status: "CANCELLED", color: "bg-red-100 hover:bg-red-200 text-red-700" },
        ],
        IN_PROGRESS: [
            { label: "✅ ซ่อมเสร็จแล้ว", status: "COMPLETED", color: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25" },
            { label: "❌ ยกเลิก", status: "CANCELLED", color: "bg-red-100 hover:bg-red-200 text-red-700" },
        ],
        COMPLETED: [],
        CANCELLED: [
            { label: "🔄 เปิดงานใหม่", status: "PENDING", color: "bg-gray-600 hover:bg-gray-700 text-white" },
        ],
    }

    const availableActions = actions[currentStatus] || []

    return (
        <div className="flex-1">
            {message && (
                <p className="text-sm mb-3">{message}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
                {availableActions.length === 0 ? (
                    <p className="text-sm text-gray-400">ไม่มี Action สำหรับสถานะนี้</p>
                ) : (
                    availableActions.map((action) => (
                        <button
                            key={action.status}
                            onClick={() => handleStatusChange(action.status)}
                            disabled={isPending}
                            className={`px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50 text-sm ${action.color}`}
                        >
                            {isPending ? "⏳ กำลังอัปเดต..." : action.label}
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}