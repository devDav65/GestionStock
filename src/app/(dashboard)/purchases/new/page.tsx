import { PurchaseForm } from "@/components/purchases/purchase-form"
import prisma from "@/lib/prisma"

export default async function NewPurchasePage() {
  const [suppliers, products] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ orderBy: { name: 'asc' } })
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Enregistrer un Achat Entrant</h1>
      </div>
      
      <PurchaseForm suppliers={suppliers} products={products} />
    </div>
  )
}
