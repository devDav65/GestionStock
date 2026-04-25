import prisma from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSupplierAction, deleteSupplierAction } from "./actions"
import { Trash2 } from "lucide-react"

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold md:text-2xl">Fournisseurs</h1>
    
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un fournisseur</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={async (fd) => { "use server"; await createSupplierAction(fd); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom / Entreprise</Label>
                  <Input id="name" name="name" required placeholder="Sony Corp." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="contact@sony.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" placeholder="+33 1 23 45 67 89" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse locale</Label>
                  <Textarea id="address" name="address" placeholder="123 Rue de l'innovation..." />
                </div>
                <Button type="submit" className="w-full">Enregistrer le Fournisseur</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Liste des fournisseurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact (Email / Tél)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Aucun fournisseur enregistré.</TableCell>
                    </TableRow>
                  ) : suppliers.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">{s.email || '—'}</div>
                        <div className="text-xs text-muted-foreground">{s.phone || '—'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={async () => {
                          "use server";
                          await deleteSupplierAction(s.id);
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
