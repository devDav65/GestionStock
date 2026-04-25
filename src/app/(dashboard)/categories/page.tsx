import prisma from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCategoryAction, deleteCategoryAction } from "./actions"
import { Trash2 } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold md:text-2xl">Catégories de Produits</h1>
    
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle catégorie</CardTitle>
              <CardDescription>Organisez votre catalogue facilement.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={async (fd) => { "use server"; await createCategoryAction(fd); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" name="name" required placeholder="Ex: Informatique" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Courte description (optionnel)" />
                </div>
                <Button type="submit" className="w-full">Créer la Catégorie</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Liste des catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Produits associés</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Aucune catégorie trouvée.</TableCell>
                    </TableRow>
                  ) : categories.map((cat: any) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground">{cat._count.products} produits</TableCell>
                      <TableCell className="text-right">
                        <form action={async () => {
                          "use server";
                          await deleteCategoryAction(cat.id);
                        }}>
                          <Button variant="ghost" size="icon" type="submit" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
