import prisma from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function StockMovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
    take: 100 // Limite pour la démo
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Mouvements de Stock</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique récent (Entrées / Sorties)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Heure</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead>Raison / Origine</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun mouvement enregistré.</TableCell>
                </TableRow>
              ) : movements.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="text-sm font-medium">{m.createdAt.toLocaleString('fr-FR')}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{m.product.name}</div>
                    <div className="text-xs text-muted-foreground">{m.product.sku}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.type === "IN" ? "default" : m.type === "OUT" ? "destructive" : "outline"}>
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {m.type === "OUT" ? "-" : "+"}{m.quantity}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
