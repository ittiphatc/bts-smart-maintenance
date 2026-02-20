// auth.ts
import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/validations/authSchema"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),  // ← เพิ่ม Adapter
  session: { strategy: "jwt" },     // ← ใช้ JWT เพราะ Credentials ต้องการ
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate Input ด้วย Zod
        const result = loginSchema.safeParse(credentials)
        if (!result.success) return null

        const { email, password } = result.data

        // 2. ค้นหา User จาก Database จริง
        const user = await prisma.user.findUnique({
          where: { email },
        })
        if (!user || !user.password) return null

        // 3. ตรวจสอบ Password
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        // 4. Return User Object (ห้ามส่ง Password กลับ)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // เพิ่ม role ลงใน JWT Token
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      // เพิ่ม role ลงใน Session
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",  // หน้า Login แบบ Custom
  },
  secret: process.env.AUTH_SECRET,
}