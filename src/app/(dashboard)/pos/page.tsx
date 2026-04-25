import prisma from "@/lib/prisma"
import { PosInterface } from "@/components/pos/pos-interface"

export default async function POSPage() {
  const [products, customers] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: 'asc' } }),
    prisma.customer.findMany({ orderBy: { name: 'asc' } })
  ])

  return (
    <div className="flex flex-col h-full -m-4 md:-m-6 p-4 md:p-6 pb-0">
      <h1 className="text-xl font-semibold mb-4 hidden md:block">Système de Caisse (POS)</h1>
      <PosInterface products={products} customers={customers} />
    </div>
  )
}
