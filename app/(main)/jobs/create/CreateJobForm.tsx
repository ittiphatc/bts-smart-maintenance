"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createMaintenanceJob } from "@/app/actions/maintenanceActions"
import Link from "next/link"

// สถานีตัวอย่าง BTS
const BTS_LOCATIONS = [
    "สถานีหมอชิต (N8)",
    "สถานีสะพานควาย (N7)",
    "สถานีอารีย์ (N5)",
    "สถานีอนุสาวรีย์ชัยฯ (N2)",
    "สถานีพญาไท (N2)",
    "สถานีราชเทวี (N1)",
    "สถานีสยาม (CEN)",
    "สถานีชิดลม (E1)",
    "สถานีเพลินจิต (E2)",
    "สถานีนานา (E3)",
    "สถานีอโศก (E4)",
    "สถานีพร้อมพงษ์ (E5)",
    "สถานีทองหล่อ (E6)",
    "สถานีเอกมัย (E7)",
    "สถานีอ่อนนุช (E9)",
    "สถานีแบริ่ง (E14)",
    "สถานีบางหว้า (S12)",
    "Train No. 101",
    "Train No. 102",
    "Train No. 103",
    "Train No. 104",
]

export default function CreateJobForm() {
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
            location: formData.get("location") as string,
            subject: formData.get("subject") as string,
            description: formData.get("description") as string,
            reportedBy: formData.get("reportedBy") as string,
            priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            photoUrl: (formData.get("photoUrl") as string) || "",
        }

        const res = await createMaintenanceJob(data)

        setIsPending(false)

        if (res.error) {
            setError(res.error)
        } else {
            setSuccess(res.success || "สร้างใบแจ้งซ่อมสำเร็จ!")
            setTimeout(() => router.push("/jobs"), 2000)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ✅ {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* สถานที่ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        📍 สถานที่ <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="location"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    >
                        <option value="">-- เลือกสถานที่ --</option>
                        <optgroup label="🚉 สถานี BTS">
                            {BTS_LOCATIONS.filter((l) => l.startsWith("สถานี")).map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </optgroup>
                        <optgroup label="🚆 ขบวนรถ">
                            {BTS_LOCATIONS.filter((l) => l.startsWith("Train")).map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                {/* หัวข้อแจ้งซ่อม */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        🔧 หัวข้อแจ้งซ่อม <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="subject"
                        type="text"
                        required
                        placeholder="เช่น แอร์ไม่เย็น ตู้ 2, ไฟสถานีดับ"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                {/* รายละเอียด */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        📋 รายละเอียด <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="อธิบายรายละเอียดของปัญหาที่พบ..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    />
                </div>

                {/* ผู้แจ้ง + ความเร่งด่วน (Grid 2 columns on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            👤 ผู้แจ้ง (Employee ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="reportedBy"
                            type="text"
                            required
                            placeholder="เช่น EMP-001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            ⚡ ความเร่งด่วน <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="priority"
                            required
                            defaultValue="MEDIUM"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        >
                            <option value="LOW">🟢 ต่ำ (Low)</option>
                            <option value="MEDIUM" selected>🟡 ปานกลาง (Medium)</option>
                            <option value="HIGH">🟠 สูง (High)</option>
                            <option value="CRITICAL">🔴 วิกฤต (Critical)</option>
                        </select>
                    </div>
                </div>

                {/* รูปภาพ URL (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        📷 แนบรูปภาพ (URL)
                    </label>
                    <input
                        name="photoUrl"
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <p className="text-xs text-gray-400 mt-1">* ไม่จำเป็นต้องกรอก (ใส่ URL รูปภาพจากระบบ)</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition text-base shadow-lg shadow-blue-600/25"
                    >
                        {isPending ? "⏳ กำลังบันทึก..." : "💾 บันทึกใบแจ้งซ่อม"}
                    </button>
                    <Link
                        href="/jobs"
                        className="flex-1 text-center border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                    >
                        ← ย้อนกลับ
                    </Link>
                </div>
            </form>
        </div>
    )
}