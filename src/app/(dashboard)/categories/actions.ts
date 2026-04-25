"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) return { error: "Nom requis" }

  try {
    await prisma.category.create({
      data: { name, description }
    })
    revalidatePath("/categories")
    return { success: true }
  } catch(e) {
    return { error: "Erreur serveur ou catégorie existante" }
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath("/categories")
  } catch(e) {
    console.error("Cannot delete category", e)
  }
}
