import { ProductForm } from "@/components/products/product-form"
import prisma from "@/lib/prisma"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Ajouter un produit</h1>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  )
}
