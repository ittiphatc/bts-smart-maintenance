import { getMaintenanceJobById } from "@/app/actions/maintenanceActions"
import { notFound } from "next/navigation"
import Link from "next/link"
import StatusUpdater from "./StatusUpdater"
import PdfDownloadButton from "./PdfDownloadButton"

// Badge สี ตาม Priority
function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
        CRITICAL: "bg-red-100 text-red-700 border-red-200",
        HIGH: "bg-orange-100 text-orange-700 border-orange-200",
        MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
        LOW: "bg-green-100 text-green-700 border-green-200",
    }
    const labels: Record<string, string> = {
        CRITICAL: "🔴 วิกฤต",
        HIGH: "🟠 สูง",
        MEDIUM: "🟡 ปานกลาง",
        LOW: "🟢 ต่ำ",
    }
    return (
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colors[priority]}`}>
            {labels[priority]}
        </span>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: "bg-gray-100 text-gray-700 border-gray-200",
        IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
        COMPLETED: "bg-green-100 text-green-700 border-green-200",
        CANCELLED: "bg-red-100 text-red-500 border-red-200",
    }
    const labels: Record<string, string> = {
        PENDING: "⏳ รอตรวจสอบ",
        IN_PROGRESS: "🔧 กำลังซ่อม",
        COMPLETED: "✅ เสร็จแล้ว",
        CANCELLED: "❌ ยกเลิก",
    }
    return (
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colors[status]}`}>
            {labels[status]}
        </span>
    )
}

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const job = await getMaintenanceJobById(Number(id))

    if (!job) {
        notFound()
    }

    // Serialize dates for client components
    const jobData = {
        ...job,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        completedAt: job.completedAt?.toISOString() || null,
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/jobs"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปรายการงาน
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">เลขที่ใบงาน</p>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-mono">{job.jobNo}</h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <StatusBadge status={job.status} />
                            <PriorityBadge priority={job.priority} />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">📍 สถานที่</p>
                            <p className="font-medium text-gray-900">{job.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">👤 ผู้แจ้ง</p>
                            <p className="font-medium text-gray-900">{job.reportedBy}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">📅 วันที่แจ้ง</p>
                            <p className="font-medium text-gray-900">
                                {new Date(job.createdAt).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        {job.completedAt && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">✅ วันที่เสร็จ</p>
                                <p className="font-medium text-green-700">
                                    {new Date(job.completedAt).toLocaleDateString("th-TH", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* หัวข้อ + รายละเอียด */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">🔧 {job.subject}</h2>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* รูปภาพ */}
                    {job.photoUrl && (
                        <div className="mt-6">
                            <p className="text-sm text-gray-500 mb-2">📷 รูปภาพประกอบ</p>
                            <img
                                src={job.photoUrl}
                                alt="รูปภาพหน้างาน"
                                className="rounded-xl border border-gray-200 max-w-full h-auto max-h-80 object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ จัดการงานซ่อม</h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Status Updater */}
                        <StatusUpdater jobId={job.id} currentStatus={job.status} />

                        {/* PDF Export Button - แสดงเมื่อ COMPLETED */}
                        {job.status === "COMPLETED" && (
                            <PdfDownloadButton job={jobData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}