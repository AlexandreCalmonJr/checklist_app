/**
 * CONSTANTS - Configurações e dados estáticos da aplicação
 * Hospital Teresa de Lisieux - Checklist App
 */

// Lista de unidades (hospitais/filiais)
export const UNIDADES = [
    { id: "hteresa", nome: "Hospital Teresa de Lisieux", sigla: "HTL" },
    { id: "hfrancisca", nome: "Hospital Francisca de Sande", sigla: "HFS" },
    { id: "hsemed", nome: "Hospital SEMED", sigla: "HS" },
    { id: "hlauro", nome: "Hospital Lauro de Freitas", sigla: "HLF" },
    { id: "hcentro", nome: "Hospital Cetro" , sigla: "HC"},
    { id: "hgabriel", nome: "Hospital Gabriel Soares" , sigla: "HGS"}

];

// Mapeamento dos responsáveis
export const RESPONSAVEIS = {
    ATENDIMENTO: "Supervisão de Atendimento",
    IMAGEM: "Vida e Imagem",
    ENFERMAGEM: "Enfermagem",
    FARMACIA: "Farmacia",
    TI: "TI",
    ONCOLOGIA: "Oncologia"
};

// Lista de técnicos
export const TECNICOS = [
    "Alexandre Calmon",
    "Anderson Conceição",
    "Carlos Alan",
    "Flavio Torres",
    "Ramon Silva",
    "Rodrigo Costa",
    "Rafael Barbosa",
    "Vitor Everton",
    "Elicledson Pereira",
    "Bruno Sacramento",
    "Uanderson Davi",
    "Djair Oliveira",
    "João Paulo",
    "Felipe Rosa",
    "Matheus Bomfim"
];

// Função auxiliar para criar um item de local com seu responsável
const criarLocal = (local, responsavel) => ({ local, responsavel });

// Dados de setores e locais organizados por tipo de checklist e com responsáveis
export const LOCAIS_POR_TIPO = {
    totensepaineis: {
        "TOTEM": [
            "TOTEM ADT 01",
            "TOTEM ADT 02",
            "TOTEM ADT 03",
            "TOTEM ADT 04",
            "TOTEM ADT EXAME",
            "TOTEM EMG PED 01"
        ].map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
        "PAINÉIS": [
            criarLocal("PAINEL ADULTO", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("PAINEL PEDIÁTRICO", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("PAINEL OBSTÉTRICO", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("PAINEL ORTOPÉDICO", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("PAINEL VIDA E IMAGEM", RESPONSAVEIS.IMAGEM)
        ],
        "ONCOLOGIA": [criarLocal("TOTEM ONCOLOGIA 4º Andar", RESPONSAVEIS.ONCOLOGIA)]
    },
    centroCirurgico: {
        "Centro Cirúrgico": [
            "SALA 01", "SALA 02", "SALA 03", "SALA 04", "SALA 05",
            "SALA 06", "SALA 07", "SALA 08", "SALA 09", "SALA 10",
            "SALA 11", "SALA 12", "BANCA MÉDICA", "ESTAR MÉDICO", "CRPA 01"
        ].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM))
    },
    racks: {
        "Racks": [
            "Rack Principal Terreo",
            "Antessala Rack Principal Terreo",
            "Rack Pediatria Terreo",
            "Rack Ressonancia Terreo",
            "Rack 1º Andar",
            "Rack 2º Andar",
            "Rack 3º Andar",
            "Rack 4º Andar",
            "Rack 5º Andar",
            "Rack 6º Andar",
            "Rack 7º Andar",
            "Rack 8º Andar",
            "Rack 9º Andar",
            "Rack 10º Andar",
            "Rack 11º Andar",
            "Rack 12º Andar"
        ].map(l => criarLocal(l, RESPONSAVEIS.TI))
    },
    emergencia: {
        "Emergência Adulta": [
            criarLocal("PAINEL Adulto", RESPONSAVEIS.ATENDIMENTO),
            ...["TOTEM ADT 01", "TOTEM ADT 02", "TOTEM ADT 03", "TOTEM ADT 04", "TOTEM ADT 05"]
                .map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
            ...Array.from({ length: 17 }, (_, i) =>
                criarLocal(`CONSULTÓRIO ADULTO ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Coleta ADT 01", RESPONSAVEIS.IMAGEM),
            criarLocal("Coleta ADT 02", RESPONSAVEIS.IMAGEM),
            ...[
                "RECEPÇÃO ADULTO Computador 1",
                "RECEPÇÃO ADULTO Computador 2",
                "RECEPÇÃO ADULTO Computador 1 Supervisão",
                "RECEPÇÃO ADULTO Computador 2 Supervisão",
                "AUTORIZAÇÃO Computador 1",
                "AUTORIZAÇÃO Computador 2",
                "AUTORIZAÇÃO Computador 3"
            ].map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Farmácia ADT 01", RESPONSAVEIS.FARMACIA),
            criarLocal("Farmácia ADT 02", RESPONSAVEIS.FARMACIA),
            ...[
                "ALA VERDE - ALA B Computador 1 Médico",
                "ALA VERDE - ALA B Computador 2 Médico",
                "ALA VERDE - ALA B Computador 3 Médico",
                "ALA VERDE - ALA B Computador 4 Posto",
                "ALA VERDE - ALA B Computador 5 Posto",
                "Estabilização PC 1",
                "Estabilização PC 2",
                "ECG",
                "ALA AMARELA - ALA C Computador 1",
                "ALA AMARELA - ALA C Computador 2"
            ].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM))
        ],
        "Emergência Pediátrica": [
            criarLocal("PAINEL Pediatria", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("TOTEM EMG PED 01", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 8 }, (_, i) =>
                criarLocal(`CONSULTÓRIOS PEDIÁTRICOS ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Coleta Ped", RESPONSAVEIS.IMAGEM),
            criarLocal("RECEPÇÃO PEDIÁTRICA Computador 1", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("RECEPÇÃO PEDIÁTRICA Computador 2", RESPONSAVEIS.ATENDIMENTO),
            ...[
                "POSTO PEDIATRIA Computador 1",
                "POSTO PEDIATRIA Computador 2",
                "MÉDICO PEDIÁTRICO 1",
                "MÉDICO PEDIÁTRICO 2",
                "POSTO PEDIÁTRICO OBS3 - Computador 1",
                "POSTO PEDIÁTRICO OBS3 - Computador 2"
            ].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM))
        ],
        "Ortopedia": [
            criarLocal("PAINEL Traumatologia", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 3 }, (_, i) =>
                criarLocal(`CONSULTÓRIOS TRAUMATOLOGIA ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("RAIO X Computador 1", RESPONSAVEIS.IMAGEM),
            criarLocal("ULTRASSOM Computador 1", RESPONSAVEIS.IMAGEM),
            criarLocal("POSTO TRAUMA (SALA DE GESSO) Computador 1", RESPONSAVEIS.ENFERMAGEM)
        ],
        "Obstetrícia": [
            criarLocal("PAINEL Obstetrícia", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("RECEPÇÃO OBSTÉTRICA / TRAUMA Computador 1", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 3 }, (_, i) =>
                criarLocal(`CONSULTÓRIOS OBSTÉTRICOS ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Farmácia Obst / Ped", RESPONSAVEIS.FARMACIA),
            ...[
                "POSTO OBSTÉTRICO Computador 1",
                "POSTO OBSTÉTRICO Computador 2",
                "ADM Painel Sinais Vitais"
            ].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM))
        ]
    }
};

// Configuração dos itens do checklist por tipo
export const ITENS_CONFIG = {
    centroCirurgico: [
        { label: "Hospitalar/SIGA", name: "sistema_hospitalar_pep", options: ["Sim", "Não"] },
        { label: "Sistema Arya", name: "sistema_arya", options: ["Sim", "Não"] },
        { label: "Imprimir a partir do sistema", name: "imprimir_sistema", options: ["Sim", "Não"] },
        { label: "Leitor de Digital", name: "leitor_digital", options: ["Sim", "Não"] },
        { label: "Acesso Remoto funcionando?", name: "conexao_vnc", options: ["Sim", "Não"] },
        { label: "Sinal Wi-Fi", name: "sinal_wifi", options: ["Sim", "Não"] }
    ],
    racks: [
        { label: "Nobreak", name: "nobreak", options: ["Sim", "Não"] },
        { label: "Limpeza", name: "limpeza", options: ["Sim", "Não"] },
        { label: "Org. Cabos", name: "org_cabos", options: ["Sim", "Não"] },
        { label: "Material em sala", name: "material_sala", options: ["Sim", "Não"] },
        { label: "Forros", name: "forros", options: ["Sim", "Não"] },
        { label: "Pintura", name: "pintura", options: ["Sim", "Não"] },
        { label: "Iluminação", name: "iluminacao", options: ["Sim", "Não"] },
        { label: "Ar condicionado", name: "ar_condicionado", options: ["Sim", "Não"] }
    ],
    emergencia: [
        { label: "Navegador Atualizado?", name: "navegador_atualizado", options: ["Sim", "Não"] },
        { label: "Sistema Hospitalar/SAMWEB funcionando?", name: "samweb", options: ["Sim", "Não"] },
        { label: "Sistema Arya funcionando?", name: "arya", options: ["Sim", "Não"] },
        { label: "Impressão funcionando?", name: "impressao", options: ["Sim", "Não"] },
        { label: "NDD funcionando?", name: "ndd", options: ["Rede", "USB"] },
        { label: "Leitor de Digital funcionando?", name: "leitor_digital", options: ["Sim", "Não"] },
        { label: "Telefonia funcionando?", name: "telefonia", options: ["Sim", "Não"] },
        { label: "Acesso Remoto funcionando?", name: "acesso_remoto", options: ["Sim", "Não"] },
        { label: "Wi-Fi funcionando?", name: "wifi", options: ["Sim", "Não"] }
    ],
    totensepaineis: [
        { label: "Versão Java (7.80 + 8.231) instalada?", name: "versao_java", options: ["Sim", "Não"] },
        { label: "Captura BIO V9 funcionando?", name: "captura_bio_v9", options: ["Sim", "Não"] },
        { label: "Navegador (Firefox 52/Edge/IE) configurado?", name: "navegador_configurado", options: ["Sim", "Não"] },
        { label: "Abertura em Tela Cheia funcionando?", name: "abertura_tela_cheia", options: ["Sim", "Não"] },
        { label: "Automatos funcionando?", name: "automatos", options: ["Sim", "Não"] },
        { label: "Leitor Biométrico funcionando?", name: "leitor_biometrico", options: ["Sim", "Não"] },
        { label: "Touchscreen funcionando?", name: "touchscreen", options: ["Sim", "Não"] },
        { label: "Estrutura do móvel está OK?", name: "estrutura_movel", options: ["Sim", "Não"] },
        { label: "Conexão com a Internet funcionando?", name: "conexao_internet", options: ["Sim", "Não"] },
        { label: "Impressora Laser funcionando?", name: "impressora_laser", options: ["Sim", "Não"] },
        { label: "Impressora Térmica funcionando?", name: "impressora_termica", options: ["Sim", "Não"] },
        { label: "Cabeamento Estruturado/Conexão via splitter OK?", name: "cabeamento", options: ["Sim", "Não"] },
        { label: "Teclado de Senha funcionando?", name: "teclado_senha", options: ["Sim", "Não"] }
    ]
};

// Configuração de colunas para PDF por tipo de checklist
export const PDF_COLUMNS_CONFIG = {
    centroCirurgico: {
        columns: ["Setor", "Local", "Hosp./SIGA", "Arya", "Impressão", "Leitor", "Remoto", "Wi-Fi", "Observações"],
        fields: ['setor', 'local', 'sistema_hospitalar_pep', 'sistema_arya', 'imprimir_sistema',
            'leitor_digital', 'conexao_vnc', 'sinal_wifi', 'observacoes']
    },
    racks: {
        columns: ["Setor", "Local", "Nobreak", "Limpeza", "Cabos", "Material", "Forros", "Pintura", "Ilum.", "Ar Cond.", "Observações"],
        fields: ['setor', 'local', 'nobreak', 'limpeza', 'org_cabos', 'material_sala',
            'forros', 'pintura', 'iluminacao', 'ar_condicionado', 'observacoes']
    },
    totensepaineis: {
        columns: ["Setor", "Local", "Java", "BIO V9", "Navegador", "Tela Cheia", "Automatos",
            "Leitor Bio.", "Touch", "Móvel", "Internet", "Laser", "Térmica", "Cabos", "Teclado", "Observações"],
        fields: ['setor', 'local', 'versao_java', 'captura_bio_v9', 'navegador_configurado',
            'abertura_tela_cheia', 'automatos', 'leitor_biometrico', 'touchscreen',
            'estrutura_movel', 'conexao_internet', 'impressora_laser', 'impressora_termica',
            'cabeamento', 'teclado_senha', 'observacoes']
    },
    emergencia: {
        columns: ["Setor", "Local", "Nav.", "SAMWEB", "Arya", "Impr.", "NDD", "Leitor", "Tel.", "Remoto", "Wi-Fi", "Observações"],
        fields: ['setor', 'local', 'navegador_atualizado', 'samweb', 'arya', 'impressao',
            'ndd', 'leitor_digital', 'telefonia', 'acesso_remoto', 'wifi', 'observacoes']
    }
};

// Tipos de checklist disponíveis
export const TIPOS_CHECKLIST = {
    centroCirurgico: "Centro Cirúrgico",
    racks: "Racks",
    emergencia: "Emergência",
    totensepaineis: "Totens e Paineis"
};

// Chaves do localStorage
export const STORAGE_KEYS = {
    SALAS_VISITADAS: 'salasVisitadas',
    REGISTROS_CHECKLIST: 'registrosChecklist',
    THEME: 'theme',
    BACKUP: 'checklistBackup',
    LAST_CHECKLIST_ANSWERS: 'lastChecklistAnswers',
    AUTO_FILL_ENABLED: 'autoFillEnabled',
    UNIDADE_SELECIONADA: 'unidadeSelecionada'
};
