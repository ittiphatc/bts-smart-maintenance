import { getMaintenanceJobs, getJobStats } from "@/app/actions/maintenanceActions"
import Link from "next/link"
import JobFilters from "./JobFilters"

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
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
            {labels[priority]}
        </span>
    )
}

// Badge สี ตาม Status
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
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
            {labels[status]}
        </span>
    )
}

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; priority?: string; search?: string }>
}) {
    const params = await searchParams
    const [jobs, stats] = await Promise.all([
        getMaintenanceJobs({
            status: params.status,
            priority: params.priority,
            search: params.search,
        }),
        getJobStats(),
    ])

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🔧 ระบบใบสั่งงานซ่อมบำรุง</h1>
                    <p className="text-gray-500 mt-1">BTS Smart Maintenance Job Order</p>
                </div>
                <Link
                    href="/jobs/create"
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/25"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    แจ้งซ่อมใหม่
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">งานทั้งหมด</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600">⏳ รอตรวจสอบ</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
                    <p className="text-sm text-blue-600">🔧 กำลังซ่อม</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                    <p className="text-sm text-green-600">✅ เสร็จแล้ว</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
                </div>
            </div>

            {/* Filters */}
            <JobFilters />

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">เลขที่ใบงาน</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">หัวข้อ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">สถานที่</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ความเร่งด่วน</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">วันที่แจ้ง</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-400">
                                        <div className="text-4xl mb-2">📋</div>
                                        <p>ยังไม่มีรายการแจ้งซ่อม</p>
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-blue-600">{job.jobNo}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 text-sm">{job.subject}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">โดย {job.reportedBy}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-600">{job.location}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PriorityBadge priority={job.priority} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={job.status} />
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString("th-TH", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/jobs/${job.id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                            >
                                                ดูรายละเอียด →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}