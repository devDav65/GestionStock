import prisma from "@/lib/prisma"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Catalogue de Produits</h1>
        <Link href="/products/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Link>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom ou code QR..."
              className="pl-8"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Nom / Réf</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé dans le catalogue.
                </TableCell>
              </TableRow>
            ) : products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                    {product.image ? <img src={product.image} alt={product.name} className="object-cover w-full h-full" /> : 'Img'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.sku}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{product.sellPrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Achat: {product.buyPrice.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock <= product.minStock ? "destructive" : "default"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
