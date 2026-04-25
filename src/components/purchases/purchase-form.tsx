"use client"

import { useState, useTransition } from "react"
import { createPurchaseAction } from "@/app/(dashboard)/purchases/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Supplier, Product } from "@prisma/client"
import { Trash2, Plus } from "lucide-react"

export function PurchaseForm({ suppliers, products }: { suppliers: Supplier[], products: Product[] }) {
  const [isPending, startTransition] = useTransition()
  const [supplierId, setSupplierId] = useState<string>("")
  const [items, setItems] = useState<{ productId: string, quantity: number, price: number }[]>([
    { productId: "", quantity: 1, price: 0 }
  ])

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }])
  }

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
       setItems(prev => {
         const newItems = [...prev]
         newItems[index] = { ...newItems[index], productId, price: product.buyPrice }
         return newItems
       })
    }
  }

  const totalAmount = items.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || items.some(i => !i.productId || i.quantity <= 0)) {
       toast.error("Veuillez remplir tous les champs correctement.")
       return
    }

    startTransition(async () => {
      const res = await createPurchaseAction(supplierId, items)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Achat enregistré et stock mis à jour !")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Détails de l'achat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Fournisseur</Label>
            <Select value={supplierId} onValueChange={(val) => setSupplierId(val || "")} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un fournisseur..." />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Produits achetés</Label>
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <Select value={item.productId} onValueChange={(val) => handleProductSelect(index, val || "")} disabled={isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Produit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-1">
                  <Label className="md:hidden">Quantité</Label>
                  <Input type="number" min="1" value={item.quantity} onChange={e => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)} disabled={isPending} />
                </div>
                <div className="w-32 space-y-1">
                  <Label className="md:hidden">Prix d'Achat</Label>
                  <Input type="number" step="0.01" value={item.price} onChange={e => handleUpdateItem(index, 'price', parseFloat(e.target.value) || 0)} disabled={isPending} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveItem(index)} disabled={isPending || items.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem} disabled={isPending}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
            </Button>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <div className="text-xl font-bold">Total: {totalAmount.toFixed(2)} €</div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 bg-muted/20 mt-4 py-4 rounded-b-xl border-t">
          <Button type="button" variant="ghost" onClick={() => window.history.back()} disabled={isPending}>Annuler</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Traitement..." : "Valider l'Achat"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
