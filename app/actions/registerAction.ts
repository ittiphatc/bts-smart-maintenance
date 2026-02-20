// app/actions/registerAction.ts
"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/authSchema"

export async function registerUser(formData: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) {
  // 1. Validate ข้อมูล
  const result = registerSchema.safeParse(formData)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { name, email, password } = result.data

  // 2. เช็คอีเมลซ้ำ
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "อีเมลนี้ถูกใช้งานแล้ว" }
  }

  // 3. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 4. สร้าง User
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
    },
  })

  return { success: "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ" }
}