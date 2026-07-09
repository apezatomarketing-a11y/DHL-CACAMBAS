-- SCRIPT SQL PARA SUPABASE - DHL CAÇAMBAS

-- 1. Criar a tabela de contatos
CREATE TABLE IF NOT EXISTS public.contatos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    assunto TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

-- 3. Criar política para permitir que qualquer pessoa insira dados (formulário público)
CREATE POLICY "Permitir inserção pública" 
ON public.contatos 
FOR INSERT 
WITH CHECK (true);

-- 4. Criar política para que apenas usuários autenticados (você no painel) vejam os dados
CREATE POLICY "Permitir leitura para autenticados" 
ON public.contatos 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- COMENTÁRIO: 
-- Copie e cole este script no "SQL Editor" do seu painel do Supabase e clique em "Run".
-- Isso criará a tabela 'contatos' e configurará as permissões de segurança necessárias.
