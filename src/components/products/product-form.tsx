"use client"

import { useTransition } from "react"
import { createProductAction } from "@/app/(dashboard)/products/new/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Category } from "@prisma/client"

export function ProductForm({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createProductAction(formData)
        toast.success("Produit créé avec succès")
      } catch (error) {
        toast.error("Erreur lors de la création")
      }
    })
  }

  return (
    <form action={handleSubmit}>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informations Produit</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du Produit</Label>
            <Input id="name" name="name" required placeholder="Ex: iPhone 15 Pro" disabled={isPending} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categoryId">Catégorie</Label>
            <Select name="categoryId" required disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sku">SKU / Référence unique</Label>
            <Input id="sku" name="sku" required placeholder="SKU-12345" disabled={isPending} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="barcode">Code-barres / QR Code</Label>
            <Input id="barcode" name="barcode" placeholder="Scanner ou taper le code" disabled={isPending} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="brand">Marque</Label>
            <Input id="brand" name="brand" placeholder="Ex: Apple" disabled={isPending} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">URL de l'image</Label>
            <Input id="image" name="image" type="url" placeholder="https://..." disabled={isPending} />
          </div>

          <div className="col-span-2 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="buyPrice">Prix d'Achat (€)</Label>
              <Input id="buyPrice" name="buyPrice" type="number" step="0.01" required placeholder="0.00" disabled={isPending} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sellPrice">Prix de Vente (€)</Label>
              <Input id="sellPrice" name="sellPrice" type="number" step="0.01" required placeholder="0.00" disabled={isPending} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Initial</Label>
              <Input id="stock" name="stock" type="number" required defaultValue="0" disabled={isPending} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minStock">Seuil d'Alerte</Label>
              <Input id="minStock" name="minStock" type="number" required defaultValue="5" disabled={isPending} />
            </div>
          </div>

          <div className="grid col-span-2 gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Détails du produit..." className="min-h-[100px]" disabled={isPending} />
          </div>

        </CardContent>
        <CardFooter className="justify-end gap-2 border-t p-4 mt-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>Annuler</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Création..." : "Enregistrer le Produit"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
