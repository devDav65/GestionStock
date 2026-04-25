"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Package2 } from "lucide-react"
import { loginAction } from "./actions"
import { useTransition } from "react"
import { toast } from "sonner"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await loginAction(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Connexion réussie")
      }
    })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Package2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au gestionnaire de stock
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required disabled={isPending} />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <Input id="password" name="password" type="password" required disabled={isPending} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
