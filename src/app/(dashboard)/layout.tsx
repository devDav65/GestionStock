import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Home,
  LineChart,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Settings,
  Archive,
  Truck
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { auth } from "@/auth"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>StockPro Int.</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 pb-4 gap-1">
              <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/pos" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <ShoppingCart className="h-4 w-4" />
                Caisse (POS)
              </Link>
              <Link href="/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Package className="h-4 w-4" />
                Stock & Produits
              </Link>
              <Link href="/categories" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Archive className="h-4 w-4" />
                Catégories
              </Link>
              <Link href="/purchases" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Truck className="h-4 w-4" />
                Achats & Stocks
              </Link>
              <Link href="/suppliers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Truck className="h-4 w-4" />
                Fournisseurs
              </Link>
              <Link href="/customers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Users className="h-4 w-4" />
                Clients
              </Link>
              <Link href="/stock-movements" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <LineChart className="h-4 w-4" />
                Traçabilité
              </Link>
              <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <div className="flex flex-row items-center gap-4">
            <span className="text-sm font-semibold">{session?.user?.name || "Administrateur"}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
