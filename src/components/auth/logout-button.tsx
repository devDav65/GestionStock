"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Déconnexion">
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Se déconnecter</span>
    </Button>
  )
}
