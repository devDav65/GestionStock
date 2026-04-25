import prisma from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createCustomerAction, deleteCustomerAction } from "./actions"
import { Trash2 } from "lucide-react"

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold md:text-2xl">Clients</h1>
    
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau client</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={async (fd) => { "use server"; await createCustomerAction(fd); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" name="name" required placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="jean@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" placeholder="06 12 34 56 78" />
                </div>
                <Button type="submit" className="w-full">Enregistrer le Client</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="xl:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Annuaire clients</CardTitle>
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
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Aucun client enregistré.</TableCell>
                    </TableRow>
                  ) : customers.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">{c.email || '—'}</div>
                        <div className="text-xs text-muted-foreground">{c.phone || '—'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={async () => {
                          "use server";
                          await deleteCustomerAction(c.id);
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
