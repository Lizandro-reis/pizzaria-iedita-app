import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function PedidoConfirmadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: pedido } = await supabase.from("pedidos").select("*").eq("id", id).eq("usuario_id", user.id).single()

  if (!pedido) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center space-y-6">
              <CheckCircle className="h-20 w-20 mx-auto text-green-600" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Pedido Confirmado!</h1>
                <p className="text-muted-foreground">Seu pedido foi recebido com sucesso</p>
              </div>

              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle>Detalhes do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número do pedido:</span>
                    <span className="font-mono font-semibold">{pedido.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-semibold capitalize">{pedido.tipo_entrega}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor total:</span>
                    <span className="font-semibold text-orange-600">R$ {pedido.valor_total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagamento:</span>
                    <span className="font-semibold capitalize">{pedido.forma_pagamento.replace("_", " ")}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {pedido.tipo_entrega === "entrega"
                    ? "Sua pizza chegará quentinha em até 40 minutos"
                    : "Você pode retirar seu pedido em até 30 minutos"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/meus-pedidos">Ver Meus Pedidos</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cardapio">Fazer Novo Pedido</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
