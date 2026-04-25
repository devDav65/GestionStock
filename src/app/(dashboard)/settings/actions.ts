"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateSettingsAction(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return { error: "Non autorisé. Accès Admin requis." }

  const companyName = formData.get("companyName") as string
  const currency = formData.get("currency") as string
  const taxRate = parseFloat(formData.get("taxRate") as string) || 0
  const theme = formData.get("theme") as string

  if (!companyName) return { error: "Le nom est requis" }

  try {
    const settingsCount = await prisma.settings.count()
    if (settingsCount === 0) {
      await prisma.settings.create({
        data: { companyName, currency, taxRate, theme }
      })
    } else {
      const first = await prisma.settings.findFirst()
      if (first) {
        await prisma.settings.update({
           where: { id: first.id },
           data: { companyName, currency, taxRate, theme }
        })
      }
    }
    revalidatePath("/")
    revalidatePath("/settings")
    return { success: true }
  } catch (e) {
    return { error: "Erreur lors de la mise à jour." }
  }
}
