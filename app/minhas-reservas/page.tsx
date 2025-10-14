import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function MinhasReservasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: reservas } = await supabase
    .from("reservas")
    .select("*")
    .eq("usuario_id", user.id)
    .order("data_reserva", { ascending: false })
    .order("hora_reserva", { ascending: false })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendente: { variant: "secondary", label: "Pendente" },
      confirmada: { variant: "default", label: "Confirmada" },
      cancelada: { variant: "destructive", label: "Cancelada" },
      concluida: { variant: "outline", label: "Concluída" },
    }
    return variants[status] || variants.pendente
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Minhas Reservas</h1>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/reservas">Nova Reserva</Link>
            </Button>
          </div>

          {!reservas || reservas.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-bold">Nenhuma reserva encontrada</h2>
                <p className="text-muted-foreground">Você ainda não fez nenhuma reserva</p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/reservas">Fazer Reserva</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => {
                const statusInfo = getStatusBadge(reserva.status)
                return (
                  <Card key={reserva.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">Reserva #{reserva.id.slice(0, 8)}</CardTitle>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p className="font-semibold">
                              {format(new Date(reserva.data_reserva), "PPP", { locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Horário</p>
                            <p className="font-semibold">{reserva.hora_reserva}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pessoas</p>
                            <p className="font-semibold">{reserva.numero_pessoas}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Contato</p>
                            <p className="font-semibold">{reserva.nome_contato}</p>
                          </div>
                        </div>
                      </div>

                      {reserva.observacoes && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">Observações:</p>
                          <p className="text-sm">{reserva.observacoes}</p>
                        </div>
                      )}
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
