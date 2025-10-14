-- Inserir categorias
INSERT INTO public.categorias (nome, descricao, ordem) VALUES
  ('Tradicionais', 'Nossas pizzas clássicas e mais pedidas', 1),
  ('Especiais', 'Combinações exclusivas da casa', 2),
  ('Doces', 'Para finalizar com chave de ouro', 3)
ON CONFLICT DO NOTHING;

-- Inserir pizzas tradicionais
INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Margherita',
  'Molho de tomate, mussarela, tomate fresco e manjericão',
  35.00,
  45.00,
  55.00,
  70.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Tradicionais';

INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Calabresa',
  'Molho de tomate, mussarela, calabresa fatiada e cebola',
  38.00,
  48.00,
  58.00,
  73.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Tradicionais';

INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Portuguesa',
  'Molho de tomate, mussarela, presunto, ovos, cebola, azeitona e ervilha',
  40.00,
  50.00,
  60.00,
  75.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Tradicionais';

INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Quatro Queijos',
  'Molho de tomate, mussarela, provolone, parmesão e catupiry',
  42.00,
  52.00,
  62.00,
  77.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Tradicionais';

-- Inserir pizzas especiais
INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Iedita Especial',
  'Molho de tomate, mussarela, calabresa, bacon, champignon, palmito e azeitona',
  45.00,
  55.00,
  65.00,
  80.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Especiais';

INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Frango com Catupiry',
  'Molho de tomate, mussarela, frango desfiado temperado e catupiry',
  40.00,
  50.00,
  60.00,
  75.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Especiais';

-- Inserir pizzas doces
INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Chocolate',
  'Chocolate ao leite derretido e granulado',
  35.00,
  45.00,
  55.00,
  70.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Doces';

INSERT INTO public.pizzas (nome, descricao, preco_pequena, preco_media, preco_grande, preco_gigante, categoria_id, imagem_url) 
SELECT 
  'Romeu e Julieta',
  'Mussarela e goiabada',
  38.00,
  48.00,
  58.00,
  73.00,
  c.id,
  '/placeholder.svg?height=300&width=300'
FROM public.categorias c WHERE c.nome = 'Doces';

-- Inserir ingredientes
INSERT INTO public.ingredientes (nome, preco_adicional) VALUES
  ('Mussarela Extra', 5.00),
  ('Calabresa', 6.00),
  ('Bacon', 7.00),
  ('Frango', 6.00),
  ('Catupiry', 8.00),
  ('Champignon', 5.00),
  ('Palmito', 6.00),
  ('Azeitona', 3.00),
  ('Cebola', 2.00),
  ('Tomate', 2.00),
  ('Milho', 3.00),
  ('Ervilha', 3.00),
  ('Ovo', 3.00),
  ('Presunto', 5.00),
  ('Pepperoni', 8.00)
ON CONFLICT DO NOTHING;
