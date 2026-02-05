-- ============================================
-- TABELA DE ASSOCIAÇÃO: UNIDADE <-> LOCAIS
-- Execute após as tabelas principais
-- ============================================

-- Criar tabela de associação many-to-many
CREATE TABLE IF NOT EXISTS unidade_locais (
    id SERIAL PRIMARY KEY,
    unidade_id TEXT NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
    local_id INTEGER NOT NULL REFERENCES locais(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(unidade_id, local_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_unidade_locais_unidade ON unidade_locais(unidade_id);
CREATE INDEX IF NOT EXISTS idx_unidade_locais_local ON unidade_locais(local_id);

-- RLS
ALTER TABLE unidade_locais ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read" ON unidade_locais FOR SELECT USING (true);
CREATE POLICY "Allow auth insert" ON unidade_locais FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON unidade_locais FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON unidade_locais FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- DADOS INICIAIS: Associar todos os locais ao Hospital Teresa de Lisieux
-- (já que os locais atuais são desse hospital)
-- ============================================

INSERT INTO unidade_locais (unidade_id, local_id)
SELECT 'hteresa', id FROM locais
ON CONFLICT (unidade_id, local_id) DO NOTHING;

-- ============================================
-- FIM
-- Agora você pode associar locais a outras unidades no admin
-- ============================================
