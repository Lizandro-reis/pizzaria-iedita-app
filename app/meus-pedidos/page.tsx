import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, Package } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function MeusPedidosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select(
      `
      *,
      itens_pedido (
        *,
        pizzas (nome)
      )
    `,
    )
    .eq("usuario_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { icon: any; label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
    > = {
      pendente: {
        icon: Clock,
        label: "Pendente",
        variant: "secondary",
        color: "text-yellow-600",
      },
      confirmado: {
        icon: CheckCircle,
        label: "Confirmado",
        variant: "default",
        color: "text-blue-600",
      },
      preparando: {
        icon: Package,
        label: "Preparando",
        variant: "default",
        color: "text-orange-600",
      },
      saiu_entrega: {
        icon: Truck,
        label: "Saiu para Entrega",
        variant: "default",
        color: "text-purple-600",
      },
      entregue: {
        icon: CheckCircle,
        label: "Entregue",
        variant: "outline",
        color: "text-green-600",
      },
      cancelado: {
        icon: XCircle,
        label: "Cancelado",
        variant: "destructive",
        color: "text-red-600",
      },
    }
    return statusMap[status] || statusMap.pendente
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meus Pedidos</h1>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/cardapio">Novo Pedido</Link>
            </Button>
          </div>

          {!pedidos || pedidos.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-bold">Nenhum pedido encontrado</h2>
                <p className="text-muted-foreground">Você ainda não fez nenhum pedido</p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/cardapio">Fazer Pedido</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => {
                const statusInfo = getStatusInfo(pedido.status)
                const StatusIcon = statusInfo.icon

                return (
                  <Card key={pedido.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">Pedido #{pedido.id.slice(0, 8)}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(pedido.created_at), "PPP 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Itens do Pedido */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Itens:</p>
                        {pedido.itens_pedido?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>
                              {item.quantidade}x {item.pizzas?.nome} ({item.tamanho})
                            </span>
                            <span className="text-muted-foreground">R$ {item.preco_unitario.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Detalhes */}
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
                          <p className="font-semibold capitalize">{pedido.tipo_entrega}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pagamento</p>
                          <p className="font-semibold capitalize">{pedido.forma_pagamento?.replace("_", " ")}</p>
                        </div>
                      </div>

                      {pedido.endereco_entrega && (
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                          <p className="text-sm">{pedido.endereco_entrega}</p>
                        </div>
                      )}

                      {pedido.observacoes && (
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground">Observações</p>
                          <p className="text-sm">{pedido.observacoes}</p>
                        </div>
                      )}

                      {/* Total e Ações */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold text-orange-600">R$ {pedido.valor_total.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline">
                            <Link href={`/pedido/${pedido.id}`}>Ver Detalhes</Link>
                          </Button>
                          {pedido.status === "entregue" && (
                            <Button asChild className="bg-orange-600 hover:bg-orange-700">
                              <Link href={`/avaliar/${pedido.id}`}>Avaliar</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
