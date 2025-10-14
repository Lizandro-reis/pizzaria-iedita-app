import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ReservaConfirmadaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center space-y-6">
              <CheckCircle className="h-20 w-20 mx-auto text-green-600" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Reserva Confirmada!</h1>
                <p className="text-muted-foreground">Sua mesa foi reservada com sucesso</p>
              </div>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="py-6 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enviamos uma confirmação para seu email com todos os detalhes da reserva.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em caso de imprevistos, entre em contato conosco pelo telefone (00) 0000-0000
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/minhas-reservas">Ver Minhas Reservas</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cardapio">Ver Cardápio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
