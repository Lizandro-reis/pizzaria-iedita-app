"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CartItem {
  pizzaId: string
  nome: string
  tamanho: string
  quantidade: number
  ingredientesAdicionais: string[]
  ingredientesRemover: string[]
  observacoes: string
  precoUnitario: number
  precoTotal: number
}

export default function CarrinhoPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  const total = cart.reduce((sum, item) => sum + item.precoTotal, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meu Carrinho</h1>
            {cart.length > 0 && (
              <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
                Limpar Carrinho
              </Button>
            )}
          </div>

          {cart.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground">Adicione pizzas deliciosas ao seu carrinho</p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/cardapio">Ver Cardápio</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle>{item.nome}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{item.tamanho}</Badge>
                            <Badge variant="secondary">Qtd: {item.quantidade}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {item.ingredientesAdicionais.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Ingredientes adicionais: {item.ingredientesAdicionais.length}
                        </p>
                      )}
                      {item.observacoes && <p className="text-sm text-muted-foreground">Obs: {item.observacoes}</p>}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          R$ {item.precoUnitario.toFixed(2)} x {item.quantidade}
                        </span>
                        <span className="text-xl font-bold text-orange-600">R$ {item.precoTotal.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-semibold">Total do Pedido:</span>
                    <span className="text-3xl font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-white text-orange-600 hover:bg-orange-50"
                    size="lg"
                  >
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
