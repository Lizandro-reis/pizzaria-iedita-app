import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pizza, Clock, Star, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pizza className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-orange-600">Pizzaria Iedita</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cardapio" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Cardápio
              </Link>
              <Link href="/reservas" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Reservas
              </Link>
              <Link href="/meus-pedidos" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Meus Pedidos
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/auth/cadastro">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">As melhores pizzas da região</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Massa artesanal, ingredientes frescos e muito sabor. Peça agora e receba quentinha em casa ou reserve sua
              mesa para uma experiência completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/cardapio">Ver Cardápio</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/reservas">Reservar Mesa</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src="/delicious-melted-cheese-pizza.png"
              alt="Pizza deliciosa"
              fill
              className="object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Entrega Rápida</h3>
              <p className="text-muted-foreground">Sua pizza quentinha em até 40 minutos</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Qualidade Garantida</h3>
              <p className="text-muted-foreground">Ingredientes frescos e selecionados</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Ambiente Aconchegante</h3>
              <p className="text-muted-foreground">Reserve sua mesa e aproveite</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0 text-white">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Pronto para saborear?</h2>
            <p className="text-lg text-orange-50 max-w-2xl mx-auto text-pretty">
              Faça seu pedido agora e aproveite nossas promoções especiais
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/cardapio">Pedir Agora</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pizza className="h-6 w-6 text-orange-600" />
                <span className="font-bold text-orange-600">Pizzaria Iedita</span>
              </div>
              <p className="text-sm text-muted-foreground">As melhores pizzas da região desde 2020</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <p className="text-sm text-muted-foreground">Telefone: (00) 0000-0000</p>
              <p className="text-sm text-muted-foreground">Email: contato@pizzariaiedita.com.br</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Horário</h3>
              <p className="text-sm text-muted-foreground">Terça a Domingo</p>
              <p className="text-sm text-muted-foreground">18h às 23h</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Pizzaria Iedita. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
