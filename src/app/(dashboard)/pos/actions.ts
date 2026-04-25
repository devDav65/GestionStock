"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function checkoutAction(customerId: string | null, cart: { productId: string, quantity: number, price: number }[]) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Non autorisé" }

  if (cart.length === 0) return { error: "Panier vide" }
  
  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)

  try {
    // Vérifier les stocks
    for (const item of cart) {
      const product = await prisma.product.findUnique({ where: { id: item.productId }})
      if (!product || product.stock < item.quantity) {
        return { error: `Stock insuffisant pour: ${product?.name || item.productId}` }
      }
    }

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          customerId: customerId || null,
          userId: session.user.id,
          total,
          items: {
            create: cart.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price
            }))
          }
        }
      })

      for (const item of cart) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "OUT",
            quantity: item.quantity,
            reason: `Vente #${sale.id.slice(-6).toUpperCase()}`
          }
        })
      }
    })
    revalidatePath("/", "layout")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de la validation de la vente" }
  }
}
