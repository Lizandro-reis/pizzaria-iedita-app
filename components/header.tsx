import { Pizza, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Pizza className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-orange-600">Pizzaria Iedita</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/cardapio" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Cardápio
            </Link>
            <Link href="/reservas" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Reservas
            </Link>
            {user && (
              <Link href="/meus-pedidos" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Meus Pedidos
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/carrinho">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/perfil">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/auth/cadastro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
