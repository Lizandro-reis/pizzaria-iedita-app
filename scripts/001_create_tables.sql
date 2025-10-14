-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Tabela de categorias de pizzas
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver categorias"
  ON public.categorias FOR SELECT
  TO PUBLIC
  USING (true);

-- Tabela de pizzas
CREATE TABLE IF NOT EXISTS public.pizzas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_pequena DECIMAL(10,2),
  preco_media DECIMAL(10,2),
  preco_grande DECIMAL(10,2),
  preco_gigante DECIMAL(10,2),
  imagem_url TEXT,
  categoria_id UUID REFERENCES public.categorias(id),
  disponivel BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pizzas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver pizzas disponíveis"
  ON public.pizzas FOR SELECT
  TO PUBLIC
  USING (disponivel = true);

-- Tabela de ingredientes
CREATE TABLE IF NOT EXISTS public.ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  preco_adicional DECIMAL(10,2) DEFAULT 0,
  disponivel BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ingredientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver ingredientes disponíveis"
  ON public.ingredientes FOR SELECT
  TO PUBLIC
  USING (disponivel = true);

-- Tabela de reservas de mesa
CREATE TABLE IF NOT EXISTS public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_reserva DATE NOT NULL,
  hora_reserva TIME NOT NULL,
  numero_pessoas INTEGER NOT NULL,
  nome_contato TEXT NOT NULL,
  telefone_contato TEXT NOT NULL,
  observacoes TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'concluida')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias reservas"
  ON public.reservas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar suas próprias reservas"
  ON public.reservas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias reservas"
  ON public.reservas FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'preparando', 'saiu_entrega', 'entregue', 'cancelado')),
  tipo_entrega TEXT NOT NULL CHECK (tipo_entrega IN ('entrega', 'retirada')),
  endereco_entrega TEXT,
  valor_total DECIMAL(10,2) NOT NULL,
  forma_pagamento TEXT CHECK (forma_pagamento IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON public.pedidos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar seus próprios pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.itens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  pizza_id UUID REFERENCES public.pizzas(id),
  tamanho TEXT NOT NULL CHECK (tamanho IN ('pequena', 'media', 'grande', 'gigante')),
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver itens de seus próprios pedidos"
  ON public.itens_pedido FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = itens_pedido.pedido_id
      AND pedidos.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar itens em seus próprios pedidos"
  ON public.itens_pedido FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = itens_pedido.pedido_id
      AND pedidos.usuario_id = auth.uid()
    )
  );

-- Tabela de ingredientes personalizados por item
CREATE TABLE IF NOT EXISTS public.itens_ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_pedido_id UUID REFERENCES public.itens_pedido(id) ON DELETE CASCADE,
  ingrediente_id UUID REFERENCES public.ingredientes(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('adicionar', 'remover')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.itens_ingredientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver ingredientes de itens de seus pedidos"
  ON public.itens_ingredientes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.itens_pedido
      JOIN public.pedidos ON pedidos.id = itens_pedido.pedido_id
      WHERE itens_pedido.id = itens_ingredientes.item_pedido_id
      AND pedidos.usuario_id = auth.uid()
    )
  );

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver avaliações"
  ON public.avaliacoes FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Usuários podem criar suas próprias avaliações"
  ON public.avaliacoes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias avaliações"
  ON public.avaliacoes FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Trigger para atualizar updated_at em pedidos
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
