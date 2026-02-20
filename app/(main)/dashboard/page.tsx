import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getJobStats, getMaintenanceJobs } from "@/app/actions/maintenanceActions"
import Link from "next/link"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const stats = await getJobStats()
    const recentJobs = await getMaintenanceJobs()

    // นับงานตามความเร่งด่วน
    const criticalCount = recentJobs.filter((j) => j.priority === "CRITICAL").length
    const highCount = recentJobs.filter((j) => j.priority === "HIGH").length

    // รายการงานล่าสุด 5 รายการ
    const latestJobs = recentJobs.slice(0, 5)

    // คำนวณ % งานที่เสร็จแล้ว
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    return (
        <div className="max-w-7xl mx-auto min-h-screen bg-gray-50 p-4 lg:p-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    สวัสดี, {session?.user?.name || "ผู้ใช้งาน"} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    ยินดีต้อนรับสู่ระบบ BTS Smart Maintenance — ภาพรวมงานซ่อมบำรุงวันนี้
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* งานทั้งหมด */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-[3rem] -mr-2 -mt-2" />
                    <p className="text-sm text-gray-500 relative z-10">งานทั้งหมด</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 relative z-10">{stats.total}</p>
                    <p className="text-xs text-gray-400 mt-1 relative z-10">รายการ</p>
                </div>

                {/* รอตรวจสอบ */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/50 rounded-bl-[3rem] -mr-2 -mt-2" />
                    <p className="text-sm text-amber-700 relative z-10">⏳ รอตรวจสอบ</p>
                    <p className="text-3xl font-bold text-amber-700 mt-2 relative z-10">{stats.pending}</p>
                    <p className="text-xs text-amber-500 mt-1 relative z-10">ต้องดำเนินการ</p>
                </div>

                {/* กำลังซ่อม */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-bl-[3rem] -mr-2 -mt-2" />
                    <p className="text-sm text-blue-700 relative z-10">🔧 กำลังซ่อม</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2 relative z-10">{stats.inProgress}</p>
                    <p className="text-xs text-blue-500 mt-1 relative z-10">อยู่ระหว่างดำเนินการ</p>
                </div>

                {/* เสร็จแล้ว */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-sm border border-green-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/50 rounded-bl-[3rem] -mr-2 -mt-2" />
                    <p className="text-sm text-green-700 relative z-10">✅ เสร็จแล้ว</p>
                    <p className="text-3xl font-bold text-green-700 mt-2 relative z-10">{stats.completed}</p>
                    <p className="text-xs text-green-500 mt-1 relative z-10">ซ่อมเสร็จเรียบร้อย</p>
                </div>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Recent Jobs (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">📋 งานแจ้งซ่อมล่าสุด</h2>
                        <Link
                            href="/jobs"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            ดูทั้งหมด →
                        </Link>
                    </div>

                    {latestJobs.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <div className="text-4xl mb-2">🔧</div>
                            <p>ยังไม่มีรายการแจ้งซ่อม</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {latestJobs.map((job) => {
                                const statusColors: Record<string, string> = {
                                    PENDING: "bg-amber-100 text-amber-700",
                                    IN_PROGRESS: "bg-blue-100 text-blue-700",
                                    COMPLETED: "bg-green-100 text-green-700",
                                    CANCELLED: "bg-red-100 text-red-500",
                                }
                                const statusLabels: Record<string, string> = {
                                    PENDING: "รอตรวจสอบ",
                                    IN_PROGRESS: "กำลังซ่อม",
                                    COMPLETED: "เสร็จแล้ว",
                                    CANCELLED: "ยกเลิก",
                                }
                                const priorityIcons: Record<string, string> = {
                                    CRITICAL: "🔴",
                                    HIGH: "🟠",
                                    MEDIUM: "🟡",
                                    LOW: "🟢",
                                }

                                return (
                                    <Link
                                        key={job.id}
                                        href={`/jobs/${job.id}`}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition"
                                    >
                                        {/* Priority Icon */}
                                        <div className="text-lg flex-shrink-0">
                                            {priorityIcons[job.priority]}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-blue-600 font-semibold">
                                                    {job.jobNo}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[job.status]}`}>
                                                    {statusLabels[job.status]}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">
                                                {job.subject}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {job.location}
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                                            {new Date(job.createdAt).toLocaleDateString("th-TH", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </div>

                                        {/* Arrow */}
                                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Summary Panel (1 col) */}
                <div className="space-y-6">
                    {/* Completion Rate */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">📊 อัตราการซ่อมเสร็จ</h3>
                        <div className="flex items-center justify-center">
                            <div className="relative w-32 h-32">
                                {/* Background Circle */}
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                    <circle
                                        cx="60" cy="60" r="52" fill="none"
                                        stroke={completionRate >= 70 ? "#10b981" : completionRate >= 40 ? "#f59e0b" : "#ef4444"}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(completionRate / 100) * 327} 327`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
                                    <span className="text-[10px] text-gray-400">สำเร็จ</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-400">
                            {stats.completed} จาก {stats.total} งานทั้งหมด
                        </div>
                    </div>

                    {/* Alert: Critical Jobs */}
                    {(criticalCount > 0 || highCount > 0) && (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm border border-red-100 p-6">
                            <h3 className="text-sm font-semibold text-red-700 mb-3">⚠️ งานเร่งด่วน</h3>
                            <div className="space-y-2">
                                {criticalCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-red-600">🔴 วิกฤต (Critical)</span>
                                        <span className="text-lg font-bold text-red-700">{criticalCount}</span>
                                    </div>
                                )}
                                {highCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-orange-600">🟠 สูง (High)</span>
                                        <span className="text-lg font-bold text-orange-700">{highCount}</span>
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/jobs?priority=CRITICAL"
                                className="mt-4 block text-center text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
                            >
                                ดูงานเร่งด่วน →
                            </Link>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">⚡ ทางลัด</h3>
                        <div className="space-y-2">
                            <Link
                                href="/jobs/create"
                                className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-sm font-medium text-blue-700"
                            >
                                <span className="text-lg">📝</span>
                                แจ้งซ่อมใหม่
                            </Link>
                            <Link
                                href="/jobs?status=PENDING"
                                className="flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition text-sm font-medium text-amber-700"
                            >
                                <span className="text-lg">⏳</span>
                                งานรอตรวจสอบ
                            </Link>
                            <Link
                                href="/jobs?status=IN_PROGRESS"
                                className="flex items-center gap-3 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition text-sm font-medium text-indigo-700"
                            >
                                <span className="text-lg">🔧</span>
                                งานกำลังซ่อม
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}