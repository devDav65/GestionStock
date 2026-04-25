"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPurchaseAction(supplierId: string, items: { productId: string, quantity: number, price: number }[]) {
  if (!supplierId || items.length === 0) {
    return { error: "Données invalides" }
  }

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  try {
    await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierId,
          total,
          items: {
            create: items.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price
            }))
          }
        }
      })

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "IN",
            quantity: item.quantity,
            reason: `Achat entrant #${purchase.id.slice(-6).toUpperCase()}`
          }
        })
      }
    })
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de l'enregistrement de l'achat" }
  }

  revalidatePath("/", "layout")
  // redirect will throw to navigate, so do outside catch
  redirect("/purchases")
}
