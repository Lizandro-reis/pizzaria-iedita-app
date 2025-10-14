import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PizzaCustomizer } from "@/components/pizza-customizer"
import { Header } from "@/components/header"

export default async function PizzaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pizza } = await supabase.from("pizzas").select("*").eq("id", id).single()

  if (!pizza) {
    notFound()
  }

  const { data: ingredientes } = await supabase.from("ingredientes").select("*").eq("disponivel", true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <PizzaCustomizer pizza={pizza} ingredientes={ingredientes || []} />
      </div>
    </div>
  )
}
