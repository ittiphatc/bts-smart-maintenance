// prisma/seed.ts
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"
import bcrypt from "bcryptjs"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  // สร้าง Admin User
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "admin",
    },
  })

  // สร้าง Normal User
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Normal User",
      email: "user@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    },
  })


  // prisma/seed.ts (เพิ่มหลัง seed Users)
const maintenanceJobs = [
  {
    jobNo: "JOB-202602-001",
    location: "สถานีสยาม (CEN)",
    subject: "แอร์ไม่เย็น ตู้ 2",
    description: "เครื่องปรับอากาศตู้ที่ 2 ไม่ทำงาน ผู้โดยสารร้องเรียน",
    reportedBy: "EMP-001",
    status: "PENDING" as const,
    priority: "HIGH" as const,
  },
  {
    jobNo: "JOB-202602-002",
    location: "สถานีหมอชิต (N8)",
    subject: "ไฟสถานีดับบางจุด",
    description: "ไฟส่องสว่างชานชาลาฝั่งทิศเหนือไม่ทำงาน 3 ดวง",
    reportedBy: "EMP-003",
    status: "IN_PROGRESS" as const,
    priority: "MEDIUM" as const,
  },
  {
    jobNo: "JOB-202602-003",
    location: "Train No. 104",
    subject: "ประตูรถไม่ปิดสนิท",
    description: "ประตูตู้โดยสาร 3 ปิดไม่สนิท มีเสียงดังผิดปกติ",
    reportedBy: "EMP-005",
    status: "COMPLETED" as const,
    priority: "CRITICAL" as const,
    completedAt: new Date("2026-02-18T14:30:00"),
  },
]

for (const job of maintenanceJobs) {
  await prisma.maintenanceLog.upsert({
    where: { jobNo: job.jobNo },
    update: {},
    create: job,
  })
}

  console.log("✅ Seed completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })