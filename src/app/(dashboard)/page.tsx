import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react"
import prisma from "@/lib/prisma"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const [productsCount, emptyStockProducts, salesTotal, customersCount, recentSales] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lte: 0 } }, take: 5 }),
    prisma.sale.aggregate({ _sum: { total: true } }),
    prisma.customer.count(),
    prisma.sale.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } })
  ])

  const totalRevenue = salesTotal._sum.total || 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true, total: true }
  });

  const daysStr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const chartDataMap = new Map<string, number>();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = daysStr[d.getDay()];
    // On garde l'ordre chronologique des 7 derniers jours
    if (!chartDataMap.has(dayName)) {
      chartDataMap.set(dayName, 0);
    }
  }

  sales.forEach((sale: any) => {
    const dayName = daysStr[sale.createdAt.getDay()];
    if (chartDataMap.has(dayName)) {
      chartDataMap.set(dayName, chartDataMap.get(dayName)! + sale.total);
    }
  });

  const actualChartData = Array.from(chartDataMap.entries()).map(([name, total]) => ({ name, total }));

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Aperçu en temps réel</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
            <p className="text-xs opacity-75">Généré depuis l'ouverture</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits en Base</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">Références au catalogue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures de Stock</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${emptyStockProducts.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emptyStockProducts.length > 0 ? emptyStockProducts.length : 'Aucune'}</div>
            <p className="text-xs text-muted-foreground">Action requise immédiatement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersCount}</div>
            <p className="text-xs text-muted-foreground">Enregistrés dans le CRM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-5 xl:grid-cols-6 mt-2">
        <SalesChart data={actualChartData} />
        
        <Card className="lg:col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle>Ventes Récentes</CardTitle>
            <CardDescription>Vos 5 dernières transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {recentSales.length === 0 ? (
               <div className="text-sm text-muted-foreground text-center py-4">Aucune vente ce jour.</div>
             ) : recentSales.map((sale: any) => (
               <div key={sale.id} className="flex justify-between items-center text-sm">
                 <div>
                   <div className="font-semibold">{sale.customer?.name || "Client Anonyme"}</div>
                   <div className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                 </div>
                 <Badge variant="secondary" className="font-bold">{sale.total.toFixed(2)} €</Badge>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
