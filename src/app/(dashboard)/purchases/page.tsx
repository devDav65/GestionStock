import prisma from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    include: { supplier: true, _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Historique des Achats</h1>
        <Link href="/purchases/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvel Achat
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réapprovisionnements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Articles distincts</TableHead>
                <TableHead>Total Payé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun achat enregistré.</TableCell>
                </TableRow>
              ) : purchases.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{p.supplier.name}</TableCell>
                  <TableCell><Badge variant="secondary">{p._count.items}</Badge></TableCell>
                  <TableCell className="font-bold">{p.total.toFixed(2)} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
