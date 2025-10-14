import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PizzaIcon } from "lucide-react"

interface Pizza {
  id: string
  nome: string
  descricao: string
  preco_pequena: number
  preco_media: number
  preco_grande: number
  preco_gigante: number
  imagem_url: string
  categoria_id: string
}

interface Categoria {
  id: string
  nome: string
  descricao: string
  pizzas: Pizza[]
}

export default async function CardapioPage() {
  const supabase = await createClient()

  // Buscar categorias com suas pizzas
  const { data: categorias } = await supabase.from("categorias").select("*").order("ordem")

  const categoriasComPizzas: Categoria[] = []

  if (categorias) {
    for (const categoria of categorias) {
      const { data: pizzas } = await supabase
        .from("pizzas")
        .select("*")
        .eq("categoria_id", categoria.id)
        .eq("disponivel", true)

      if (pizzas) {
        categoriasComPizzas.push({
          ...categoria,
          pizzas,
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <PizzaIcon className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-orange-600">Pizzaria Iedita</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cardapio" className="text-sm font-medium text-orange-600">
                Cardápio
              </Link>
              <Link href="/reservas" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Reservas
              </Link>
              <Link href="/meus-pedidos" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Meus Pedidos
              </Link>
            </nav>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/carrinho">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Nosso Cardápio</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Escolha entre nossas deliciosas opções de pizzas artesanais
          </p>
        </div>
      </section>

      {/* Menu */}
      <section className="container mx-auto px-4 pb-16">
        <div className="space-y-12">
          {categoriasComPizzas.map((categoria) => (
            <div key={categoria.id} className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">{categoria.nome}</h3>
                {categoria.descricao && <p className="text-muted-foreground">{categoria.descricao}</p>}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoria.pizzas.map((pizza) => (
                  <Card key={pizza.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image
                        src={pizza.imagem_url || "/placeholder.svg"}
                        alt={pizza.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{pizza.nome}</CardTitle>
                      <CardDescription className="line-clamp-2">{pizza.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {pizza.preco_pequena && (
                          <Badge variant="secondary" className="text-xs">
                            P: R$ {pizza.preco_pequena.toFixed(2)}
                          </Badge>
                        )}
                        {pizza.preco_media && (
                          <Badge variant="secondary" className="text-xs">
                            M: R$ {pizza.preco_media.toFixed(2)}
                          </Badge>
                        )}
                        {pizza.preco_grande && (
                          <Badge variant="secondary" className="text-xs">
                            G: R$ {pizza.preco_grande.toFixed(2)}
                          </Badge>
                        )}
                        {pizza.preco_gigante && (
                          <Badge variant="secondary" className="text-xs">
                            GG: R$ {pizza.preco_gigante.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href={`/cardapio/${pizza.id}`}>Pedir Agora</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
