"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCustomerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string

  if (!name) return { error: "Nom requis" }

  try {
    await prisma.customer.create({
      data: { name, email, phone }
    })
    revalidatePath("/customers")
    return { success: true }
  } catch(e) {
    return { error: "Erreur serveur" }
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    await prisma.customer.delete({ where: { id } })
    revalidatePath("/customers")
  } catch(e) {
    console.error(e)
  }
}
