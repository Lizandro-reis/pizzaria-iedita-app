"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ReservasPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [hora, setHora] = useState("")
  const [numeroPessoas, setNumeroPessoas] = useState("")
  const [nomeContato, setNomeContato] = useState("")
  const [telefoneContato, setTelefoneContato] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const horariosDisponiveis = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"]

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

      if (!date) {
        setError("Por favor, selecione uma data")
        setIsLoading(false)
        return
      }

      const { data, error: reservaError } = await supabase
        .from("reservas")
        .insert({
          usuario_id: user.id,
          data_reserva: format(date, "yyyy-MM-dd"),
          hora_reserva: hora,
          numero_pessoas: Number.parseInt(numeroPessoas),
          nome_contato: nomeContato,
          telefone_contato: telefoneContato,
          observacoes,
          status: "pendente",
        })
        .select()
        .single()

      if (reservaError) throw reservaError

      router.push("/reservas/confirmada")
    } catch (err: any) {
      setError(err.message || "Erro ao criar reserva")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Reserve sua Mesa</h1>
            <p className="text-muted-foreground">Garanta seu lugar e aproveite nossa experiência completa</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Reserva</CardTitle>
              <CardDescription>Preencha os dados para confirmar sua reserva</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data */}
                <div className="space-y-2">
                  <Label>Data da Reserva</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="hora">Horário</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {horariosDisponiveis.map((horario) => (
                      <Button
                        key={horario}
                        type="button"
                        variant={hora === horario ? "default" : "outline"}
                        className={cn(hora === horario && "bg-orange-600 hover:bg-orange-700")}
                        onClick={() => setHora(horario)}
                      >
                        {horario}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Número de Pessoas */}
                <div className="space-y-2">
                  <Label htmlFor="pessoas">Número de Pessoas</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pessoas"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="Quantas pessoas?"
                      className="pl-10"
                      value={numeroPessoas}
                      onChange={(e) => setNumeroPessoas(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Nome de Contato */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome de Contato</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nomeContato}
                    onChange={(e) => setNomeContato(e.target.value)}
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefoneContato}
                    onChange={(e) => setTelefoneContato(e.target.value)}
                    required
                  />
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    className="w-full min-h-20 p-3 border rounded-lg resize-none"
                    placeholder="Alguma preferência especial? (Ex: mesa perto da janela, aniversário, etc.)"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={isLoading || !date || !hora}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  {isLoading ? "Processando..." : "Confirmar Reserva"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Clock className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p>Horário de funcionamento: Terça a Domingo, das 18h às 23h</p>
              </div>
              <div className="flex gap-2">
                <CalendarIcon className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p>Reservas podem ser feitas com até 30 dias de antecedência</p>
              </div>
              <div className="flex gap-2">
                <Users className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p>Para grupos acima de 10 pessoas, entre em contato pelo telefone</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
