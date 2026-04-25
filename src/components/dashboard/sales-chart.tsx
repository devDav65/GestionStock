"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SalesChart({ data }: { data: { name: string; total: number }[] }) {
  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
        <CardDescription>
          Vos ventes sur la période récente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
               <XAxis 
                 dataKey="name" 
                 stroke="#888888" 
                 fontSize={12} 
                 tickLine={false} 
                 axisLine={false} 
               />
               <YAxis 
                 stroke="#888888" 
                 fontSize={12} 
                 tickLine={false} 
                 axisLine={false} 
                 tickFormatter={(value) => `${value}€`} 
               />
               <Tooltip 
                 cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(val: any) => [`${Number(val).toFixed(2)} €`, "Total"]}
               />
               <Bar 
                 dataKey="total" 
                 fill="currentColor" 
                 radius={[4, 4, 0, 0]} 
                 className="fill-primary" 
               />
             </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
