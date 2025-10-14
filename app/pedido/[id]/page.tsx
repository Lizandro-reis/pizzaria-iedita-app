import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      `
      *,
      itens_pedido (
        *,
        pizzas (nome, descricao)
      )
    `,
    )
    .eq("id", id)
    .eq("usuario_id", user.id)
    .single()

  if (!pedido) {
    notFound()
  }

  const statusTimeline = [
    { status: "pendente", label: "Pedido Recebido", icon: Clock, completed: true },
    {
      status: "confirmado",
      label: "Confirmado",
      icon: CheckCircle,
      completed: ["confirmado", "preparando", "saiu_entrega", "entregue"].includes(pedido.status),
    },
    {
      status: "preparando",
      label: "Preparando",
      icon: Package,
      completed: ["preparando", "saiu_entrega", "entregue"].includes(pedido.status),
    },
    {
      status: "saiu_entrega",
      label: pedido.tipo_entrega === "entrega" ? "Saiu para Entrega" : "Pronto para Retirada",
      icon: Truck,
      completed: ["saiu_entrega", "entregue"].includes(pedido.status),
    },
    {
      status: "entregue",
      label: pedido.tipo_entrega === "entrega" ? "Entregue" : "Retirado",
      icon: CheckCircle,
      completed: pedido.status === "entregue",
    },
  ]

  const isCanceled = pedido.status === "cancelado"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Pedido #{pedido.id.slice(0, 8)}</h1>
              <p className="text-muted-foreground">
                {format(new Date(pedido.created_at), "PPP 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/meus-pedidos">Voltar</Link>
            </Button>
          </div>

          {/* Status Timeline */}
          {!isCanceled ? (
            <Card>
              <CardHeader>
                <CardTitle>Status do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusTimeline.map((step, index) => {
                    const StepIcon = step.icon
                    const isLast = index === statusTimeline.length - 1

                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              step.completed ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-12 ${step.completed ? "bg-orange-600" : "bg-gray-200"}`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p
                            className={`font-semibold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-6 flex items-center gap-4">
                <XCircle className="h-12 w-12 text-red-600" />
                <div>
                  <p className="font-bold text-lg">Pedido Cancelado</p>
                  <p className="text-sm text-muted-foreground">Este pedido foi cancelado</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pedido.itens_pedido?.map((item: any, index: number) => (
                <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {item.quantidade}x {item.pizzas?.nome}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.pizzas?.descricao}</p>
                    <Badge variant="secondary" className="text-xs">
                      {item.tamanho}
                    </Badge>
                    {item.observacoes && <p className="text-sm text-muted-foreground">Obs: {item.observacoes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">R$ {item.preco_unitario.toFixed(2)} cada</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detalhes da Entrega */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-semibold capitalize">{pedido.tipo_entrega}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamento</p>
                  <p className="font-semibold capitalize">{pedido.forma_pagamento?.replace("_", " ")}</p>
                </div>
              </div>

              {pedido.endereco_entrega && (
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-semibold">{pedido.endereco_entrega}</p>
                </div>
              )}

              {pedido.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p>{pedido.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total */}
          <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">Total do Pedido:</span>
                <span className="text-3xl font-bold">R$ {pedido.valor_total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          {pedido.status === "entregue" && (
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href={`/avaliar/${pedido.id}`}>Avaliar este Pedido</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
