-- ============================================
-- SCHEMA SQL PARA SUPABASE
-- Hospital Teresa de Lisieux - Checklist App
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Habilitar RLS (Row Level Security)
-- Por padrão o Supabase usa RLS, então precisamos criar policies

-- ============================================
-- TABELA: unidades
-- ============================================
CREATE TABLE IF NOT EXISTS unidades (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    sigla TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais
INSERT INTO unidades (id, nome, sigla) VALUES
    ('hteresa', 'Hospital Teresa de Lisieux', 'HTL'),
    ('hfrancisca', 'Hospital Francisca de Sande', 'HFS'),
    ('hsemed', 'Hospital SEMED', 'HS'),
    ('hlauro', 'Hospital Lauro de Freitas', 'HLF'),
    ('hcentro', 'Hospital Centro', 'HC'),
    ('hgabriel', 'Hospital Gabriel Soares', 'HGS')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: responsaveis
-- ============================================
CREATE TABLE IF NOT EXISTS responsaveis (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);

-- Dados iniciais
INSERT INTO responsaveis (id, nome) VALUES
    ('ATENDIMENTO', 'Supervisão de Atendimento'),
    ('IMAGEM', 'Vida e Imagem'),
    ('ENFERMAGEM', 'Enfermagem'),
    ('FARMACIA', 'Farmácia'),
    ('TI', 'TI'),
    ('ONCOLOGIA', 'Oncologia')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: tecnicos
-- ============================================
CREATE TABLE IF NOT EXISTS tecnicos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais
INSERT INTO tecnicos (nome, ativo) VALUES
    ('Alexandre Calmon', TRUE),
    ('Anderson Conceição', TRUE),
    ('Carlos Alan', TRUE),
    ('Flavio Torres', TRUE),
    ('Ramon Silva', TRUE),
    ('Rodrigo Costa', TRUE),
    ('Rafael Barbosa', TRUE),
    ('Vitor Everton', TRUE),
    ('Elicledson Pereira', TRUE),
    ('Bruno Sacramento', TRUE),
    ('Uanderson Davi', TRUE),
    ('Djair Oliveira', TRUE),
    ('João Paulo', TRUE),
    ('Felipe Rosa', TRUE),
    ('Matheus Bomfim', TRUE);

-- ============================================
-- TABELA: tipos_checklist
-- ============================================
CREATE TABLE IF NOT EXISTS tipos_checklist (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);

-- Dados iniciais
INSERT INTO tipos_checklist (id, nome) VALUES
    ('centroCirurgico', 'Centro Cirúrgico'),
    ('racks', 'Racks'),
    ('emergencia', 'Emergência'),
    ('totensepaineis', 'Totens e Painéis')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: locais
-- ============================================
CREATE TABLE IF NOT EXISTS locais (
    id SERIAL PRIMARY KEY,
    tipo_checklist_id TEXT NOT NULL REFERENCES tipos_checklist(id) ON DELETE CASCADE,
    setor TEXT NOT NULL,
    local TEXT NOT NULL,
    responsavel_id TEXT REFERENCES responsaveis(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_locais_tipo ON locais(tipo_checklist_id);
CREATE INDEX IF NOT EXISTS idx_locais_setor ON locais(setor);

-- ============================================
-- TABELA: itens_config
-- ============================================
CREATE TABLE IF NOT EXISTS itens_config (
    id SERIAL PRIMARY KEY,
    tipo_checklist_id TEXT NOT NULL REFERENCES tipos_checklist(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    name TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '["Sim", "Não"]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_itens_tipo ON itens_config(tipo_checklist_id);

-- Dados iniciais - Itens do Centro Cirúrgico
INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES
    ('centroCirurgico', 'Hospitalar/SIGA', 'sistema_hospitalar_pep', '["Sim", "Não"]'),
    ('centroCirurgico', 'Sistema Arya', 'sistema_arya', '["Sim", "Não"]'),
    ('centroCirurgico', 'Imprimir a partir do sistema', 'imprimir_sistema', '["Sim", "Não"]'),
    ('centroCirurgico', 'Leitor de Digital', 'leitor_digital', '["Sim", "Não"]'),
    ('centroCirurgico', 'Acesso Remoto funcionando?', 'conexao_vnc', '["Sim", "Não"]'),
    ('centroCirurgico', 'Sinal Wi-Fi', 'sinal_wifi', '["Sim", "Não"]');

-- Dados iniciais - Itens de Racks
INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES
    ('racks', 'Nobreak', 'nobreak', '["Sim", "Não"]'),
    ('racks', 'Limpeza', 'limpeza', '["Sim", "Não"]'),
    ('racks', 'Org. Cabos', 'org_cabos', '["Sim", "Não"]'),
    ('racks', 'Material em sala', 'material_sala', '["Sim", "Não"]'),
    ('racks', 'Forros', 'forros', '["Sim", "Não"]'),
    ('racks', 'Pintura', 'pintura', '["Sim", "Não"]'),
    ('racks', 'Iluminação', 'iluminacao', '["Sim", "Não"]'),
    ('racks', 'Ar condicionado', 'ar_condicionado', '["Sim", "Não"]');

-- Dados iniciais - Itens de Emergência
INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES
    ('emergencia', 'Navegador Atualizado?', 'navegador_atualizado', '["Sim", "Não"]'),
    ('emergencia', 'Sistema Hospitalar/SAMWEB funcionando?', 'samweb', '["Sim", "Não"]'),
    ('emergencia', 'Sistema Arya funcionando?', 'arya', '["Sim", "Não"]'),
    ('emergencia', 'Impressão funcionando?', 'impressao', '["Sim", "Não"]'),
    ('emergencia', 'NDD funcionando?', 'ndd', '["Rede", "USB"]'),
    ('emergencia', 'Leitor de Digital funcionando?', 'leitor_digital', '["Sim", "Não"]'),
    ('emergencia', 'Telefonia funcionando?', 'telefonia', '["Sim", "Não"]'),
    ('emergencia', 'Acesso Remoto funcionando?', 'acesso_remoto', '["Sim", "Não"]'),
    ('emergencia', 'Wi-Fi funcionando?', 'wifi', '["Sim", "Não"]');

-- Dados iniciais - Itens de Totens e Painéis
INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES
    ('totensepaineis', 'Versão Java (7.80 + 8.231) instalada?', 'versao_java', '["Sim", "Não"]'),
    ('totensepaineis', 'Captura BIO V9 funcionando?', 'captura_bio_v9', '["Sim", "Não"]'),
    ('totensepaineis', 'Navegador (Firefox 52/Edge/IE) configurado?', 'navegador_configurado', '["Sim", "Não"]'),
    ('totensepaineis', 'Abertura em Tela Cheia funcionando?', 'abertura_tela_cheia', '["Sim", "Não"]'),
    ('totensepaineis', 'Automatos funcionando?', 'automatos', '["Sim", "Não"]'),
    ('totensepaineis', 'Leitor Biométrico funcionando?', 'leitor_biometrico', '["Sim", "Não"]'),
    ('totensepaineis', 'Touchscreen funcionando?', 'touchscreen', '["Sim", "Não"]'),
    ('totensepaineis', 'Estrutura do móvel está OK?', 'estrutura_movel', '["Sim", "Não"]'),
    ('totensepaineis', 'Conexão com a Internet funcionando?', 'conexao_internet', '["Sim", "Não"]'),
    ('totensepaineis', 'Impressora Laser funcionando?', 'impressora_laser', '["Sim", "Não"]'),
    ('totensepaineis', 'Impressora Térmica funcionando?', 'impressora_termica', '["Sim", "Não"]'),
    ('totensepaineis', 'Cabeamento Estruturado/Conexão via splitter OK?', 'cabeamento', '["Sim", "Não"]'),
    ('totensepaineis', 'Teclado de Senha funcionando?', 'teclado_senha', '["Sim", "Não"]');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Permitir acesso apenas para usuários autenticados
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE locais ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_config ENABLE ROW LEVEL SECURITY;

-- Policies: SELECT para todos (anon e authenticated)
CREATE POLICY "Allow public read" ON unidades FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON responsaveis FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON tecnicos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON tipos_checklist FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON locais FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON itens_config FOR SELECT USING (true);

-- Policies: INSERT/UPDATE/DELETE apenas para authenticated
CREATE POLICY "Allow auth insert" ON unidades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON unidades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON unidades FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON responsaveis FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON responsaveis FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON responsaveis FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON tecnicos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON tecnicos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON tecnicos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON tipos_checklist FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON tipos_checklist FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON tipos_checklist FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON locais FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON locais FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON locais FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert" ON itens_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON itens_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON itens_config FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- FIM DO SCRIPT
-- Após executar, crie um usuário admin em:
-- Authentication > Users > Invite
-- ============================================
