"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("entrega")
  const [endereco, setEndereco] = useState("")
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "cartao_credito" | "cartao_debito" | "pix">("pix")
  const [observacoes, setObservacoes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + item.precoTotal, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Criar pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          usuario_id: user.id,
          tipo_entrega: tipoEntrega,
          endereco_entrega: tipoEntrega === "entrega" ? endereco : null,
          valor_total: total,
          forma_pagamento: formaPagamento,
          observacoes,
          status: "pendente",
        })
        .select()
        .single()

      if (pedidoError) throw pedidoError

      // Criar itens do pedido
      for (const item of cart) {
        const { error: itemError } = await supabase.from("itens_pedido").insert({
          pedido_id: pedido.id,
          pizza_id: item.pizzaId,
          tamanho: item.tamanho,
          quantidade: item.quantidade,
          preco_unitario: item.precoUnitario,
          observacoes: item.observacoes,
        })

        if (itemError) throw itemError
      }

      // Limpar carrinho
      localStorage.removeItem("cart")

      // Redirecionar para página de sucesso
      router.push(`/pedido-confirmado/${pedido.id}`)
    } catch (err: any) {
      setError(err.message || "Erro ao finalizar pedido")
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-xl">Seu carrinho está vazio</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={tipoEntrega} onValueChange={(value: any) => setTipoEntrega(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="entrega" id="entrega" />
                    <Label htmlFor="entrega" className="cursor-pointer flex-1">
                      Entrega em domicílio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="retirada" id="retirada" />
                    <Label htmlFor="retirada" className="cursor-pointer flex-1">
                      Retirar no local
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Endereço */}
            {tipoEntrega === "entrega" && (
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço completo</Label>
                    <Input
                      id="endereco"
                      placeholder="Rua, número, bairro, cidade"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formaPagamento} onValueChange={(value: any) => setFormaPagamento(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="cursor-pointer flex-1">
                      PIX
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="dinheiro" id="dinheiro" />
                    <Label htmlFor="dinheiro" className="cursor-pointer flex-1">
                      Dinheiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cartao_credito" id="cartao_credito" />
                    <Label htmlFor="cartao_credito" className="cursor-pointer flex-1">
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cartao_debito" id="cartao_debito" />
                    <Label htmlFor="cartao_debito" className="cursor-pointer flex-1">
                      Cartão de Débito
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
                <CardDescription>Alguma informação adicional sobre seu pedido?</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder="Ex: sem cebola, ponto de referência, etc."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Total e Confirmar */}
            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
              <CardContent className="py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-3xl font-bold">R$ {total.toFixed(2)}</span>
                </div>
                {error && <p className="text-sm text-red-200">{error}</p>}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-orange-600 hover:bg-orange-50"
                  size="lg"
                >
                  {isLoading ? "Processando..." : "Confirmar Pedido"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
