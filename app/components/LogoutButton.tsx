// app/components/LogoutButton.tsx
"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block"
      >
        🚪 ออกจากระบบ
      </button>
    </div>
  )
}