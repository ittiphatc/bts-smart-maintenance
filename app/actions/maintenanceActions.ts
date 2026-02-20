"use server"

import { prisma } from "@/lib/prisma"
import {
  createMaintenanceSchema,
  updateStatusSchema,
  type CreateMaintenanceInput,
} from "@/lib/validations/maintenanceSchema"
import { revalidatePath } from "next/cache"

// สร้างเลขที่ใบงานอัตโนมัติ (Auto Job Number)
async function generateJobNo(): Promise<string> {
  const now = new Date()
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`
  const count = await prisma.maintenanceLog.count({
    where: { jobNo: { startsWith: `JOB-${yearMonth}` } },
  })
  const sequence = String(count + 1).padStart(3, "0")
  return `JOB-${yearMonth}-${sequence}`
}

// สร้างใบแจ้งซ่อมใหม่
export async function createMaintenanceJob(formData: CreateMaintenanceInput) {
  const result = createMaintenanceSchema.safeParse(formData)
  if (!result.success) return { error: result.error.issues[0].message }

  const { location, subject, description, reportedBy, priority, photoUrl } = result.data
  const jobNo = await generateJobNo()

  await prisma.maintenanceLog.create({
    data: { jobNo, location, subject, description, reportedBy, priority, photoUrl: photoUrl || null },
  })

  revalidatePath("/jobs")
  return { success: `สร้างใบแจ้งซ่อม ${jobNo} สำเร็จ!` }
}

// อัปเดตสถานะงานซ่อม
export async function updateJobStatus(id: number, status: string) {
  const result = updateStatusSchema.safeParse({ id, status })
  if (!result.success) return { error: result.error.issues[0].message }

  const updateData: Record<string, unknown> = { status: result.data.status }
  if (result.data.status === "COMPLETED") updateData.completedAt = new Date()

  await prisma.maintenanceLog.update({ where: { id: result.data.id }, data: updateData })
  revalidatePath("/jobs")
  revalidatePath(`/jobs/${id}`)
  return { success: "อัปเดตสถานะสำเร็จ!" }
}

// ดึงรายการงานซ่อมพร้อม Filter
export async function getMaintenanceJobs(filter?: {
  status?: string; priority?: string; search?: string
}) {
  const where: Record<string, unknown> = {}
  if (filter?.status && filter.status !== "ALL") where.status = filter.status
  if (filter?.priority && filter.priority !== "ALL") where.priority = filter.priority
  if (filter?.search) {
    where.OR = [
      { jobNo: { contains: filter.search, mode: "insensitive" } },
      { location: { contains: filter.search, mode: "insensitive" } },
      { subject: { contains: filter.search, mode: "insensitive" } },
    ]
  }
  return prisma.maintenanceLog.findMany({ where, orderBy: { createdAt: "desc" } })
}

// ดึงรายละเอียดงานซ่อม
export async function getMaintenanceJobById(id: number) {
  return prisma.maintenanceLog.findUnique({ where: { id } })
}

// สถิติงานซ่อม
export async function getJobStats() {
  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.maintenanceLog.count(),
    prisma.maintenanceLog.count({ where: { status: "PENDING" } }),
    prisma.maintenanceLog.count({ where: { status: "IN_PROGRESS" } }),
    prisma.maintenanceLog.count({ where: { status: "COMPLETED" } }),
  ])
  return { total, pending, inProgress, completed }
}