import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ========== Navbar ========== */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold">
            BTS Smart<span className="text-blue-400"> Maintenance</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-lg shadow-blue-600/25"
            >
              เข้าสู่ Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition font-medium text-sm">
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-lg shadow-blue-600/25"
              >
                สมัครใช้งาน
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ========== Hero Section ========== */}
      <section className="relative px-6 lg:px-16 pt-20 pb-28">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            ระบบจัดการงานซ่อมบำรุงอัจฉริยะ
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            จัดการงานซ่อมบำรุง
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              อัจฉริยะ ครบวงจร
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            แจ้งซ่อม ติดตามสถานะ ปิดงาน และออกรายงาน PDF ได้ในที่เดียว
            <br className="hidden sm:block" />
            ออกแบบสำหรับช่างเทคนิคและผู้จัดการงานซ่อมบำรุง BTS
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-base shadow-2xl shadow-blue-600/25"
            >
              เริ่มใช้งานฟรี →
            </Link>
            <Link
              href={session ? "/jobs" : "/login"}
              className="w-full sm:w-auto border border-gray-700 text-gray-300 px-8 py-4 rounded-2xl hover:bg-gray-800 hover:border-gray-600 transition font-medium text-base"
            >
              {session ? "🔧 ดูงานซ่อมทั้งหมด" : "เข้าสู่ระบบ"}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Features ========== */}
      <section className="relative px-6 lg:px-16 py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider text-center mb-3">
            Features
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
            ทุกอย่างที่คุณต้องการ
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            ระบบครบวงจรสำหรับการจัดการงานซ่อมบำรุง ตั้งแต่แจ้งซ่อมจนถึงปิดงาน
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">แจ้งซ่อมง่าย</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mobile-first form สำหรับช่างเทคนิค พร้อมเลือกสถานที่ BTS และระดับความเร่งด่วน
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-amber-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dashboard สถิติ</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                ภาพรวมงานซ่อมแบบ Real-time พร้อม Filter และ Search พร้อมอัตราความสำเร็จ
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Workflow อัตโนมัติ</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                เปลี่ยนสถานะงานตาม Workflow — Pending → In Progress → Completed
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition">
                <span className="text-2xl">🖨️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">PDF รายงาน</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                ออกใบปิดงานซ่อม PDF อัตโนมัติ พร้อมช่องลายเซ็น รองรับภาษาไทย (Sarabun)
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-red-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                NextAuth.js v4 พร้อม Credentials Login, Session Management และ Role-Based Access
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-7 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-800/80 transition group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Server Actions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Next.js 16 Server Actions + Zod Validation — ไม่ต้องสร้าง API Route แยก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== How it works ========== */}
      <section className="px-6 lg:px-16 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider text-center mb-3">
            How it works
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            ขั้นตอนการทำงาน
          </h2>

          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "📝", title: "แจ้งซ่อม", desc: "กรอกฟอร์มแจ้งปัญหาพร้อมแนบรูป" },
              { step: "02", icon: "⏳", title: "รอตรวจสอบ", desc: "ระบบสร้างเลขใบงานอัตโนมัติ" },
              { step: "03", icon: "🔧", title: "เริ่มซ่อม", desc: "ช่างรับงานและอัปเดตสถานะ" },
              { step: "04", icon: "✅", title: "ปิดงาน", desc: "ซ่อมเสร็จ ออก PDF ใบปิดงาน" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{item.step}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Tech Stack ========== */}
      <section className="px-6 lg:px-16 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-8">
            Powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-gray-600">
            {["Next.js 16", "NextAuth.js", "Prisma ORM", "PostgreSQL", "Tailwind CSS", "React PDF"].map((tech) => (
              <span key={tech} className="text-lg font-bold hover:text-white transition cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="px-6 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </h2>
          <p className="text-gray-500 mb-8">
            เข้าสู่ระบบหรือสมัครใช้งานเพื่อเริ่มจัดการงานซ่อมบำรุงของคุณ
          </p>
          <Link
            href={session ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-base shadow-2xl shadow-blue-600/25"
          >
            {session ? "เข้าสู่ Dashboard →" : "เริ่มใช้งานฟรี →"}
          </Link>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="px-6 lg:px-16 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <span>© 2026 BTS Smart Maintenance. Training Workshop.</span>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </footer>
    </div>
  )
}