import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CadastroSucessoPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold text-orange-600">Pizzaria Iedita</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cadastro realizado com sucesso!</CardTitle>
              <CardDescription>Verifique seu email para confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enviamos um email de confirmação para você. Por favor, verifique sua caixa de entrada e clique no link
                para ativar sua conta.
              </p>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/auth/login">Voltar para o login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
