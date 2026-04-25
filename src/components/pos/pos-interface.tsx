"use client"

import { useState, useTransition } from "react"
import { Product, Customer } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { checkoutAction } from "@/app/(dashboard)/pos/actions"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"

export function PosInterface({ products, customers }: { products: Product[], customers: Customer[] }) {
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([])
  const [customerId, setCustomerId] = useState<string>("")
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Rupture de stock pour ce produit.")
      return
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
           toast.error("Stock maximum atteint")
           return prev
        }
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.product.id === productId) {
          const newQ = i.quantity + delta
          if (newQ > i.product.stock) {
             toast.error("Stock insuffisant")
             return i
          }
          if (newQ <= 0) return { ...i, quantity: 0 }
          return { ...i, quantity: newQ }
        }
        return i
      }).filter(i => i.quantity > 0)
    })
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    startTransition(async () => {
      const payload = cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.sellPrice }))
      const res = await checkoutAction(customerId, payload)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Vente validée avec succès !")
        setCart([])
        setCustomerId("")
      }
    })
  }

  const total = cart.reduce((acc, i) => acc + (i.product.sellPrice * i.quantity), 0)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Catalogue de Produits (Côté gauche) */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <Input 
          placeholder="Rechercher un produit (Nom, Code-barres)..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-background text-lg py-6"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-6 content-start pr-2">
          {filteredProducts.map(p => (
            <Card key={p.id} className="cursor-pointer hover:border-primary transition-all flex flex-col" onClick={() => addToCart(p)}>
               <div className="aspect-square bg-muted flex items-center justify-center p-2 rounded-t-xl overflow-hidden">
                 {p.image ? <img src={p.image} alt={p.name} className="object-cover h-full w-full" /> : <div className="text-muted-foreground">Aucune image</div>}
               </div>
               <CardContent className="p-4 flex-1 flex flex-col">
                 <div className="font-semibold text-sm line-clamp-2 mb-1">{p.name}</div>
                 <div className="text-xs text-muted-foreground mt-auto">{p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}</div>
                 <div className="font-bold text-primary mt-1">{p.sellPrice.toFixed(2)} €</div>
               </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Panier (Ticket) (Côté droit) */}
      <Card className="w-full lg:w-[400px] flex flex-col h-full bg-muted/20">
        <CardHeader className="border-b bg-card">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Panier en cours
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm uppercase font-semibold">
              Panier vide
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center bg-background p-3 rounded shadow-sm border">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.product.name}</div>
                  <div className="text-primary text-xs font-bold">{item.product.sellPrice.toFixed(2)} €</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, -1)}>
                    {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3" />}
                  </Button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <div className="p-4 border-t bg-card space-y-4">
          <Select value={customerId} onValueChange={(v) => setCustomerId(v || "")}>
             <SelectTrigger>
               <SelectValue placeholder="Client (Optionnel)" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="none">Client de passage</SelectItem>
               {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
             </SelectContent>
          </Select>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg text-muted-foreground font-semibold">Net à Payer</span>
            <span className="text-3xl font-black">{total.toFixed(2)} €</span>
          </div>
          <Button size="lg" className="w-full text-lg h-14" disabled={cart.length === 0 || isPending} onClick={handleCheckout}>
            {isPending ? "Encaissement..." : "Encaisser & Facturer"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
