import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"
import { updateSettingsAction } from "./actions"

export default async function SettingsPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"
  
  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = {
      id: "demo",
      companyName: "StockPro Inc.",
      logo: null,
      currency: "EUR",
      taxRate: 20,
      theme: "system",
      updatedAt: new Date()
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Paramètres Généraux</h1>
      </div>

      {!isAdmin && (
        <div className="bg-amber-100 text-amber-900 flex items-center gap-2 p-4 rounded-md text-sm font-medium">
          <AlertTriangle className="h-5 w-5" />
          Seul un administrateur peut modifier ces paramètres. Les champs sont désactivés.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'Entreprise</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur vos factures et dans l'interface globale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (fd) => { "use server"; await updateSettingsAction(fd) }} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="companyName">Nom de l'Entreprise</Label>
              <Input id="companyName" name="companyName" defaultValue={settings.companyName} disabled={!isAdmin} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise principale</Label>
              <Select name="currency" defaultValue={settings.currency} disabled={!isAdmin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar ($)</SelectItem>
                  <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                  <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Taux de TVA (%)</Label>
              <Input id="taxRate" name="taxRate" type="number" step="0.1" defaultValue={settings.taxRate} disabled={!isAdmin} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="theme">Thème par défaut</Label>
               <Select name="theme" defaultValue={settings.theme} disabled={!isAdmin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Préférence du Système</SelectItem>
                  <SelectItem value="light">Mode Clair</SelectItem>
                  <SelectItem value="dark">Mode Sombre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit" disabled={!isAdmin}>Sauvegarder les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
