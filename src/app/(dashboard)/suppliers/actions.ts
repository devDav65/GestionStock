"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSupplierAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name) return { error: "Nom requis" }

  try {
    await prisma.supplier.create({
      data: { name, email, phone, address }
    })
    revalidatePath("/suppliers")
    return { success: true }
  } catch(e) {
    return { error: "Erreur serveur" }
  }
}

export async function deleteSupplierAction(id: string) {
  try {
    await prisma.supplier.delete({ where: { id } })
    revalidatePath("/suppliers")
  } catch(e) {
    console.error(e)
  }
}
