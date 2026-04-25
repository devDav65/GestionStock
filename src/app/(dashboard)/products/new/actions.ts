"use server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createProductAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  
  await prisma.product.create({
    data: {
      name: data.name as string,
      sku: data.sku as string,
      barcode: data.barcode as string || null,
      description: data.description as string || null,
      brand: data.brand as string || null,
      buyPrice: parseFloat(data.buyPrice as string),
      sellPrice: parseFloat(data.sellPrice as string),
      stock: parseInt(data.stock as string) || 0,
      minStock: parseInt(data.minStock as string) || 5,
      categoryId: data.categoryId as string,
      image: data.image as string || null
    }
  })
  
  redirect("/products")
}
