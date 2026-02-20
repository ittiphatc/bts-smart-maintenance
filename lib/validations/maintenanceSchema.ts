import { z } from "zod"

export const createMaintenanceSchema = z.object({
  location: z.string().min(1, "กรุณาระบุสถานที่"),
  subject: z.string().min(1, "กรุณาระบุหัวข้อแจ้งซ่อม"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  reportedBy: z.string().min(1, "กรุณาระบุชื่อผู้แจ้ง"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  photoUrl: z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
})

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>

export const updateStatusSchema = z.object({
  id: z.number(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>