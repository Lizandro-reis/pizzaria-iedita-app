"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Pizza {
  id: string
  nome: string
  descricao: string
  preco_pequena: number
  preco_media: number
  preco_grande: number
  preco_gigante: number
  imagem_url: string
}

interface Ingrediente {
  id: string
  nome: string
  preco_adicional: number
}

interface PizzaCustomizerProps {
  pizza: Pizza
  ingredientes: Ingrediente[]
}

type Tamanho = "pequena" | "media" | "grande" | "gigante"

export function PizzaCustomizer({ pizza, ingredientes }: PizzaCustomizerProps) {
  const router = useRouter()
  const [tamanho, setTamanho] = useState<Tamanho>("media")
  const [quantidade, setQuantidade] = useState(1)
  const [ingredientesAdicionais, setIngredientesAdicionais] = useState<string[]>([])
  const [ingredientesRemover, setIngredientesRemover] = useState<string[]>([])
  const [observacoes, setObservacoes] = useState("")

  const precos = {
    pequena: pizza.preco_pequena,
    media: pizza.preco_media,
    grande: pizza.preco_grande,
    gigante: pizza.preco_gigante,
  }

  const precoBase = precos[tamanho] || 0
  const precoIngredientes = ingredientesAdicionais.reduce((total, ingId) => {
    const ing = ingredientes.find((i) => i.id === ingId)
    return total + (ing?.preco_adicional || 0)
  }, 0)

  const precoTotal = (precoBase + precoIngredientes) * quantidade

  const handleToggleIngredienteAdicional = (ingredienteId: string) => {
    setIngredientesAdicionais((prev) =>
      prev.includes(ingredienteId) ? prev.filter((id) => id !== ingredienteId) : [...prev, ingredienteId],
    )
  }

  const handleToggleIngredienteRemover = (ingredienteId: string) => {
    setIngredientesRemover((prev) =>
      prev.includes(ingredienteId) ? prev.filter((id) => id !== ingredienteId) : [...prev, ingredienteId],
    )
  }

  const handleAddToCart = () => {
    const item = {
      pizzaId: pizza.id,
      nome: pizza.nome,
      tamanho,
      quantidade,
      ingredientesAdicionais,
      ingredientesRemover,
      observacoes,
      precoUnitario: precoBase + precoIngredientes,
      precoTotal,
    }

    // Salvar no localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    cart.push(item)
    localStorage.setItem("cart", JSON.stringify(cart))

    router.push("/carrinho")
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Imagem e Info */}
      <div className="space-y-6">
        <Card>
          <div className="relative h-96 w-full">
            <Image src={pizza.imagem_url || "/placeholder.svg"} alt={pizza.nome} fill className="object-cover" />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl">{pizza.nome}</CardTitle>
            <CardDescription className="text-base">{pizza.descricao}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Customização */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personalize sua pizza</CardTitle>
            <CardDescription>Escolha o tamanho e adicione ingredientes extras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tamanho */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Tamanho</Label>
              <RadioGroup value={tamanho} onValueChange={(value) => setTamanho(value as Tamanho)}>
                {pizza.preco_pequena && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pequena" id="pequena" />
                      <Label htmlFor="pequena" className="cursor-pointer">
                        Pequena
                      </Label>
                    </div>
                    <Badge variant="secondary">R$ {pizza.preco_pequena.toFixed(2)}</Badge>
                  </div>
                )}
                {pizza.preco_media && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="media" />
                      <Label htmlFor="media" className="cursor-pointer">
                        Média
                      </Label>
                    </div>
                    <Badge variant="secondary">R$ {pizza.preco_media.toFixed(2)}</Badge>
                  </div>
                )}
                {pizza.preco_grande && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grande" id="grande" />
                      <Label htmlFor="grande" className="cursor-pointer">
                        Grande
                      </Label>
                    </div>
                    <Badge variant="secondary">R$ {pizza.preco_grande.toFixed(2)}</Badge>
                  </div>
                )}
                {pizza.preco_gigante && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gigante" id="gigante" />
                      <Label htmlFor="gigante" className="cursor-pointer">
                        Gigante
                      </Label>
                    </div>
                    <Badge variant="secondary">R$ {pizza.preco_gigante.toFixed(2)}</Badge>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Ingredientes Adicionais */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Adicionar ingredientes</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ingredientes.map((ingrediente) => (
                  <div key={ingrediente.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`add-${ingrediente.id}`}
                        checked={ingredientesAdicionais.includes(ingrediente.id)}
                        onCheckedChange={() => handleToggleIngredienteAdicional(ingrediente.id)}
                      />
                      <Label htmlFor={`add-${ingrediente.id}`} className="cursor-pointer">
                        {ingrediente.nome}
                      </Label>
                    </div>
                    <Badge variant="outline">+ R$ {ingrediente.preco_adicional.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <Label htmlFor="observacoes" className="text-base font-semibold">
                Observações
              </Label>
              <textarea
                id="observacoes"
                className="w-full min-h-20 p-3 border rounded-lg resize-none"
                placeholder="Alguma observação especial?"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {/* Quantidade */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Quantidade</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={quantidade <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{quantidade}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantidade(quantidade + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total e Adicionar */}
            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="text-orange-600">R$ {precoTotal.toFixed(2)}</span>
              </div>
              <Button onClick={handleAddToCart} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
