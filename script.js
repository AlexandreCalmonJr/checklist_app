// Mapeamento dos responsáveis
const RESPONSAVEIS = {
    ATENDIMENTO: "Supervisão de Atendimento",
    IMAGEM: "Vida e Imagem",
    ENFERMAGEM: "Enfermagem",
    FARMACIA: "Farmacia",
    TI: "TI",
    ONCOLOGIA: "Oncologia"
};

// Função auxiliar para criar um item de local com seu responsável
const criarLocal = (local, responsavel) => ({ local, responsavel });

// Dados de setores e locais organizados por tipo de checklist e com responsáveis
const locaisPorTipoChecklist = {
    totensepaineis:{
        "TOTEM": ["TOTEM ADT 01", "TOTEM ADT 02", "TOTEM ADT 03", "TOTEM ADT 04", "TOTEM ADT EXAME","TOTEM EMG PED 01",].map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
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
            "Rack Principal Terreo", "Antessala Rack Principal Terreo", "Rack Pediatria Terreo",
            "Rack Ressonancia Terreo", "Rack 1º Andar", "Rack 2º Andar", "Rack 3º Andar",
            "Rack 4º Andar", "Rack 5º Andar", "Rack 6º Andar", "Rack 7º Andar", "Rack 8º Andar",
            "Rack 9º Andar", "Rack 10º Andar", "Rack 11º Andar", "Rack 12º Andar"
        ].map(l => criarLocal(l, RESPONSAVEIS.TI))
    },
    emergencia: {
        "Emergência Adulta": [
            criarLocal("PAINEL Adulto", RESPONSAVEIS.ATENDIMENTO),
            ...["TOTEM ADT 01", "TOTEM ADT 02", "TOTEM ADT 03", "TOTEM ADT 04", "TOTEM ADT 05"].map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
            ...Array.from({ length: 17 }, (_, i) => criarLocal(`CONSULTÓRIO ADULTO ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Coleta ADT 01", RESPONSAVEIS.IMAGEM),
            criarLocal("Coleta ADT 02", RESPONSAVEIS.IMAGEM),
            ...["RECEPÇÃO ADULTO Computador 1", "RECEPÇÃO ADULTO Computador 2", "RECEPÇÃO ADULTO Computador 1 Supervisão", "RECEPÇÃO ADULTO Computador 2 Supervisão", "AUTORIZAÇÃO Computador 1", "AUTORIZAÇÃO Computador 2", "AUTORIZAÇÃO Computador 3"].map(l => criarLocal(l, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Farmácia ADT 01", RESPONSAVEIS.FARMACIA),
            criarLocal("Farmácia ADT 02", RESPONSAVEIS.FARMACIA),
            ...["ALA VERDE - ALA B Computador 1 Médico", "ALA VERDE - ALA B Computador 2 Médico", "ALA VERDE - ALA B Computador 3 Médico", "ALA VERDE - ALA B Computador 4 Posto", "ALA VERDE - ALA B Computador 5 Posto", "Estabilização PC 1", "Estabilização PC 2", "ECG", "ALA AMARELA - ALA C Computador 1", "ALA AMARELA - ALA C Computador 2"].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM)),
        ],
        "Emergência Pediátrica": [
            criarLocal("PAINEL Pediatria", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("TOTEM EMG PED 01", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 8 }, (_, i) => criarLocal(`CONSULTÓRIOS PEDIÁTRICOS ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Coleta Ped", RESPONSAVEIS.IMAGEM),
            criarLocal("RECEPÇÃO PEDIÁTRICA Computador 1", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("RECEPÇÃO PEDIÁTRICA Computador 2", RESPONSAVEIS.ATENDIMENTO),
            ...["POSTO PEDIATRIA Computador 1", "POSTO PEDIATRIA Computador 2", "MÉDICO PEDIÁTRICO 1", "MÉDICO PEDIÁTRICO 2", "POSTO PEDIÁTRICO OBS3 - Computador 1", "POSTO PEDIÁTRICO OBS3 - Computador 2"].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM)),
        ],
        "Ortopedia": [
            criarLocal("PAINEL Traumatologia", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 3 }, (_, i) => criarLocal(`CONSULTÓRIOS TRAUMATOLOGIA ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("RAIO X Computador 1", RESPONSAVEIS.IMAGEM),
            criarLocal("ULTRASSOM Computador 1", RESPONSAVEIS.IMAGEM),
            criarLocal("POSTO TRAUMA (SALA DE GESSO) Computador 1", RESPONSAVEIS.ENFERMAGEM),
        ],
        "Obstetrícia": [
            criarLocal("PAINEL Obstetrícia", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("RECEPÇÃO OBSTÉTRICA / TRAUMA Computador 1", RESPONSAVEIS.ATENDIMENTO),
            ...Array.from({ length: 3 }, (_, i) => criarLocal(`CONSULTÓRIOS OBSTÉTRICOS ${i + 1}`, RESPONSAVEIS.ATENDIMENTO)),
            criarLocal("Farmácia Obst / Ped", RESPONSAVEIS.FARMACIA), // Correção de bug
            ...["POSTO OBSTÉTRICO Computador 1", "POSTO OBSTÉTRICO Computador 2", "ADM Painel Sinais Vitais"].map(l => criarLocal(l, RESPONSAVEIS.ENFERMAGEM)),
        ]
    }
};


const tecnicos = [
    "Alexandre Calmon", "Alexandre Pinho", "Anderson Conceição", "Adilson Santos",
    "Carlos Alan", "Flavio Torres", "Ramon Silva", "Rodrigo Costa", "Vitor Everton", "Elicledson Pereira"
];

// Elementos do DOM
const tipoChecklistSelect = document.getElementById('tipoChecklist');
const itensChecklistDiv = document.getElementById('itensChecklist');
const nomeTecnicoSelect = document.getElementById('nomeTecnico');
const setorSelect = document.getElementById('setor');
const localSelect = document.getElementById('local');
const checklistForm = document.getElementById('checklistForm');
const salvarSalaBtn = document.getElementById('salvarSalaBtn');
const finalizarChecklistBtn = document.getElementById('finalizarChecklistBtn');
const proximaSalaBtn = document.getElementById('proximaSalaBtn');
const resetarChecklistBtn = document.getElementById('resetarChecklist');
const listaSalasVisitadas = document.getElementById('listaSalasVisitadas');
const responsavelDiv = document.getElementById('responsavelDiv');
const responsavelNomeSpan = document.getElementById('responsavelNome');
const painelAssinaturas = document.getElementById('painelAssinaturas');
const painelGerarPDF = document.getElementById('painelGerarPDF');
const gerarPDFBtn = document.getElementById('gerarPDF');
const feedbackSalvar = document.createElement('span');

// Dados do checklist
let salasVisitadas = JSON.parse(localStorage.getItem('salasVisitadas')) || [];
let registrosChecklist = JSON.parse(localStorage.getItem('registrosChecklist')) || [];
let salasDisponiveis = [];
let assinaturasCanvasCtx = {};

// Configuração inicial
feedbackSalvar.style.marginLeft = '10px';
salvarSalaBtn.parentNode.insertBefore(feedbackSalvar, salvarSalaBtn.nextSibling);

tecnicos.forEach(tecnico => {
    nomeTecnicoSelect.add(new Option(tecnico, tecnico));
});

// Configuração dos itens do checklist por tipo
const itensConfig = {
    centroCirurgico: [
        { label: "Hospitalar/SIGA", name: "sistema_hospitalar_pep", options: ["Sim", "Não"] },
        { label: "Sistema Arya", name: "sistema_arya", options: ["Sim", "Não"] },
        { label: "Imprimir a partir do sistema", name: "imprimir_sistema", options: ["Sim", "Não"] },
        { label: "Leitor de Digital", name: "leitor_digital", options: ["Sim", "Não"] },
        { label: "Acesso Remoto funcionando?", name: "conexao_vnc", options: ["Sim", "Não"] },
        { label: "Sinal Wi-Fi", name: "sinal_wifi", options: ["Sim", "Não"] },
    ],
    racks: [
        { label: "Nobreak", name: "nobreak", options: ["Sim", "Não"] },
        { label: "Limpeza", name: "limpeza", options: ["Sim", "Não"] },
        { label: "Org. Cabos", name: "org_cabos", options: ["Sim", "Não"] },
        { label: "Material em sala", name: "material_sala", options: ["Sim", "Não"] },
        { label: "Forros", name: "forros", options: ["Sim", "Não"] },
        { label: "Pintura", name: "pintura", options: ["Sim", "Não"] },
        { label: "Iluminação", name: "iluminacao", options: ["Sim", "Não"] },
        { label: "Ar condicionado", name: "ar_condicionado", options: ["Sim", "Não"] },
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
    totensepaineis:[
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

function preencherSetores(tipo) {
    setorSelect.innerHTML = '<option value="">Selecione o Setor</option>';
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    responsavelDiv.classList.add('hidden');
    const setores = locaisPorTipoChecklist[tipo] || {};
    Object.keys(setores).forEach(setor => setorSelect.add(new Option(setor, setor)));
}

function atualizarItensChecklist(tipo) {
    itensChecklistDiv.innerHTML = '';
    const itens = itensConfig[tipo] || [];
    itens.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label class="block font-semibold">${item.label}</label>
            <div class="space-x-4">
                ${item.options.map(option => `<label class="mr-4"><input type="radio" name="${item.name}" value="${option}" required /> ${option}</label>`).join('')}
            </div>`;
        itensChecklistDiv.appendChild(div);
    });
}

function atualizarSalasDisponiveis(tipo, setor) {
    const locaisDoSetor = (locaisPorTipoChecklist[tipo] || {})[setor] || [];
    salasDisponiveis = locaisDoSetor.filter(item => !salasVisitadas.includes(item.local));
}

function atualizarListaSalas() {
    listaSalasVisitadas.innerHTML = "<h3>Salas Visitadas:</h3>";
    salasVisitadas.forEach(sala => {
        const li = document.createElement('li');
        li.textContent = sala;
        listaSalasVisitadas.appendChild(li);
    });
}

function salvarRegistroAtual() {
    const tipoChecklist = tipoChecklistSelect.value;
    const local = localSelect.value;
    if (!local) {
        alert("Por favor, selecione um local antes de salvar.");
        return false;
    }
    
    if (!salasVisitadas.includes(local)) {
        salasVisitadas.push(local);
        localStorage.setItem('salasVisitadas', JSON.stringify(salasVisitadas));
        atualizarListaSalas();
    }

    let itensDados = {};
    const itens = itensConfig[tipoChecklist] || [];
    let formValido = true;
    itens.forEach(item => {
        const input = checklistForm.querySelector(`input[name="${item.name}"]:checked`);
        if (input) {
            itensDados[item.name] = input.value;
        } else {
            formValido = false;
        }
    });

    if (!formValido) {
        alert('Por favor, preencha todos os itens do checklist.');
        return false;
    }

    const locaisDoSetor = (locaisPorTipoChecklist[tipoChecklist] || {})[setorSelect.value] || [];
    const itemSelecionado = locaisDoSetor.find(item => item.local === local);

    const registro = {
        tipoChecklist: tipoChecklist,
        data: document.getElementById('dataCheck').value,
        tecnico: nomeTecnicoSelect.value,
        chamado: document.getElementById('numeroChamado').value,
        setor: setorSelect.value,
        local: local,
        responsavel: itemSelecionado ? itemSelecionado.responsavel : 'N/A',
        itens: itensDados,
        observacoes: document.getElementById('observacoes').value
    };

    const index = registrosChecklist.findIndex(r => r.local === registro.local);
    if (index !== -1) {
        registrosChecklist[index] = registro;
    } else {
        registrosChecklist.push(registro);
    }
    localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));
    return true;
}

function configurarCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let desenhando = false;

    const getPos = (event) => {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches ? event.touches[0] : event;
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };
    
    const desenhar = (event) => {
        if (!desenhando) return;
        const pos = getPos(event);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        event.preventDefault();
    };

    const pararDesenho = () => { desenhando = false; ctx.beginPath(); };
    const iniciarDesenho = (event) => { desenhando = true; desenhar(event); };

    canvas.addEventListener('mousedown', iniciarDesenho);
    canvas.addEventListener('mousemove', desenhar);
    canvas.addEventListener('mouseup', pararDesenho);
    canvas.addEventListener('mouseout', pararDesenho);
    canvas.addEventListener('touchstart', iniciarDesenho, { passive: false });
    canvas.addEventListener('touchmove', desenhar, { passive: false });
    canvas.addEventListener('touchend', pararDesenho);

    return ctx;
}

// Event Listeners
tipoChecklistSelect.addEventListener('change', (e) => {
    atualizarItensChecklist(e.target.value);
    preencherSetores(e.target.value);
});

setorSelect.addEventListener('change', () => {
    const tipo = tipoChecklistSelect.value;
    const setor = setorSelect.value;
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    responsavelDiv.classList.add('hidden');
    atualizarSalasDisponiveis(tipo, setor);
    salasDisponiveis.forEach(item => localSelect.add(new Option(item.local, item.local)));
});

localSelect.addEventListener('change', (e) => {
    const sala = e.target.value;
    feedbackSalvar.textContent = ''; 

    if (!sala) {
        responsavelDiv.classList.add('hidden');
        return;
    }
    const tipo = tipoChecklistSelect.value;
    const setor = setorSelect.value;
    const locaisDoSetor = (locaisPorTipoChecklist[tipo] || {})[setor] || [];
    const item = locaisDoSetor.find(i => i.local === sala);
    if (item) {
        responsavelNomeSpan.textContent = item.responsavel;
        responsavelDiv.classList.remove('hidden');
    }

    const registroExistente = registrosChecklist.find(r => r.local === sala);
    if (registroExistente) {
        Object.keys(registroExistente.itens).forEach(itemName => {
            const itemValue = registroExistente.itens[itemName];
            const radio = document.querySelector(`input[name="${itemName}"][value="${itemValue}"]`);
            if (radio) radio.checked = true;
        });
        document.getElementById('observacoes').value = registroExistente.observacoes || '';
    } else {
        document.getElementById('observacoes').value = '';
    }
});

salvarSalaBtn.addEventListener('click', () => {
    if (salvarRegistroAtual()) {
        feedbackSalvar.textContent = '✅ Sala salva!';
        setTimeout(() => { feedbackSalvar.textContent = ''; }, 1500);
    }
});

proximaSalaBtn.addEventListener('click', () => {
    if (!salvarRegistroAtual()) return;
    atualizarSalasDisponiveis(tipoChecklistSelect.value, setorSelect.value);
    if (salasDisponiveis.length > 0) {
        localSelect.value = salasDisponiveis[0].local;
        localSelect.dispatchEvent(new Event('change'));
    } else {
        alert("Todas as salas deste setor foram visitadas.");
    }
});

finalizarChecklistBtn.addEventListener('click', () => {
    if (registrosChecklist.length === 0) {
        alert("Nenhuma sala foi salva. Por favor, complete o checklist de pelo menos uma sala.");
        return;
    }

    painelAssinaturas.innerHTML = '<h2 class="text-xl font-bold text-center text-gray-800">Assinaturas dos Responsáveis</h2>';
    assinaturasCanvasCtx = {};

    const responsaveisEnvolvidos = [...new Set(registrosChecklist.map(r => r.responsavel))];

    responsaveisEnvolvidos.forEach(responsavel => {
        const idResponsavel = responsavel.replace(/\s+/g, '-');
        const div = document.createElement('div');
        div.className = 'border border-gray-300 rounded-xl p-4';
        div.innerHTML = `
            <h3 class="text-lg font-semibold text-blue-700 mb-4">Setor Responsável: ${responsavel}</h3>
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block font-semibold mb-1" for="nome-${idResponsavel}">Nome do Responsável:</label>
                    <input type="text" id="nome-${idResponsavel}" required placeholder="Nome completo" class="w-full border rounded-lg px-3 py-2"/>
                </div>
                <div>
                    <label class="block font-semibold mb-1" for="matricula-${idResponsavel}">Matrícula:</label>
                    <input type="text" id="matricula-${idResponsavel}" required placeholder="Matrícula do responsável" class="w-full border rounded-lg px-3 py-2"/>
                </div>
            </div>
            <p class="mb-2 font-semibold">Assinatura:</p>
            <canvas id="canvas-${idResponsavel}" width="400" height="150" class="border border-gray-400 rounded-lg"></canvas>
            <button type="button" id="limpar-${idResponsavel}" class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm">Limpar Assinatura</button>
        `;
        painelAssinaturas.appendChild(div);

        const canvas = document.getElementById(`canvas-${idResponsavel}`);
        assinaturasCanvasCtx[responsavel] = configurarCanvas(canvas);
        
        document.getElementById(`limpar-${idResponsavel}`).addEventListener('click', () => {
            assinaturasCanvasCtx[responsavel].clearRect(0, 0, canvas.width, canvas.height);
        });
    });

    painelAssinaturas.classList.remove('hidden');
    painelGerarPDF.classList.remove('hidden');
    finalizarChecklistBtn.classList.add('hidden');
    proximaSalaBtn.classList.add('hidden');
    salvarSalaBtn.classList.add('hidden');
});

resetarChecklistBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja resetar todo o checklist?')) {
        localStorage.clear();
        window.location.reload();
    }
});

gerarPDFBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });
    let y = 15;

    const assinaturas = {};
    let todasAssinaturasOk = true;

    Object.keys(assinaturasCanvasCtx).forEach(responsavel => {
        const idResponsavel = responsavel.replace(/\s+/g, '-');
        const nome = document.getElementById(`nome-${idResponsavel}`).value.trim();
        const matricula = document.getElementById(`matricula-${idResponsavel}`).value.trim();
        const canvas = assinaturasCanvasCtx[responsavel].canvas;
        const isVazia = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.every(p => p === 0);

        if (!nome || !matricula || isVazia) {
            todasAssinaturasOk = false;
        }
        assinaturas[responsavel] = { nome, matricula, imgData: canvas.toDataURL('image/png'), isVazia };
    });

    if (!todasAssinaturasOk) {
        alert('Todos os campos de nome, matrícula e assinatura para cada setor responsável devem ser preenchidos.');
        return;
    }

    doc.setFontSize(16);
    doc.text("Relatório de Checklist - Hospital Teresa de Lisieux", 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Data: ${document.getElementById('dataCheck').valueAsDate.toLocaleDateString()} | Técnico: ${nomeTecnicoSelect.value} | Chamado: ${document.getElementById('numeroChamado').value}`, 14, y);
    y += 10;

    const registrosPorResponsavel = registrosChecklist.reduce((acc, r) => {
        (acc[r.responsavel] = acc[r.responsavel] || []).push(r);
        return acc;
    }, {});

    Object.keys(registrosPorResponsavel).forEach(responsavel => {
        if (y > 160) { doc.addPage(); y = 15; }
        
        doc.setFontSize(14);
        doc.text(`Itens sob responsabilidade de: ${responsavel}`, 14, y);
        y += 8;

        const registros = registrosPorResponsavel[responsavel];
        const tipo = registros[0].tipoChecklist;
        let colunas, linhas;
        const colunasBase = ["Setor", "Local"];
        const observacoesColuna = ["Observações"];

        if (tipo === "centroCirurgico") {
            colunas = [...colunasBase, "Hosp./SIGA", "Arya", "Impressão", "Leitor", "Remoto", "Wi-Fi", ...observacoesColuna];
            linhas = registros.map(r => [r.setor, r.local, r.itens.sistema_hospitalar_pep, r.itens.sistema_arya, r.itens.imprimir_sistema, r.itens.leitor_digital, r.itens.conexao_vnc, r.itens.sinal_wifi, r.observacoes || ""]);
        } else if (tipo === "racks") {
            colunas = [...colunasBase, "Nobreak", "Limpeza", "Cabos", "Material", "Forros", "Pintura", "Ilum.", "Ar Cond.", ...observacoesColuna];
            linhas = registros.map(r => [r.setor, r.local, r.itens.nobreak, r.itens.limpeza, r.itens.org_cabos, r.itens.material_sala, r.itens.forros, r.itens.pintura, r.itens.iluminacao, r.itens.ar_condicionado, r.observacoes || ""]);
        } else if (tipo === "totensepaineis") {
            colunas = [...colunasBase, "Java", "BIO V9", "Navegador", "Tela Cheia", "Automatos", "Leitor Bio.", "Touch", "Móvel", "Internet", "Laser", "Térmica", "Cabos", "Teclado", ...observacoesColuna];
            linhas = registros.map(r => [r.setor, r.local, r.itens.versao_java, r.itens.captura_bio_v9, r.itens.navegador_configurado, r.itens.abertura_tela_cheia, r.itens.automatos, r.itens.leitor_biometrico, r.itens.touchscreen, r.itens.estrutura_movel, r.itens.conexao_internet, r.itens.impressora_laser, r.itens.impressora_termica, r.itens.cabeamento, r.itens.teclado_senha, r.observacoes || ""]);
        } else { // emergencia
            colunas = [...colunasBase, "Nav.", "SAMWEB", "Arya", "Impr.", "NDD", "Leitor", "Tel.", "Remoto", "Wi-Fi", ...observacoesColuna];
            linhas = registros.map(r => [r.setor, r.local, r.itens.navegador_atualizado, r.itens.samweb, r.itens.arya, r.itens.impressao, r.itens.ndd, r.itens.leitor_digital, r.itens.telefonia, r.itens.acesso_remoto, r.itens.wifi, r.observacoes || ""]);
        }

        doc.autoTable({
            startY: y,
            head: [colunas],
            body: linhas,
            styles: { fontSize: 8, cellPadding: 1.5 },
            headStyles: { fillColor: [22, 78, 99], textColor: 255, fontSize: 8 },
            alternateRowStyles: { fillColor: [241, 245, 249] }
        });
        y = doc.lastAutoTable.finalY;

        const dadosAssinatura = assinaturas[responsavel];
        doc.setFontSize(10);
        doc.text(`Assinado por: ${dadosAssinatura.nome} (Matrícula: ${dadosAssinatura.matricula})`, 14, y + 8);
        doc.addImage(dadosAssinatura.imgData, 'PNG', 14, y + 10, 60, 25);
        y += 40;
    });

    doc.save(`Relatorio_Checklist_${new Date().toISOString().slice(0,10)}.pdf`);
});

// Inicialização
atualizarListaSalas();
if(document.getElementById('dataCheck')) {
    document.getElementById('dataCheck').valueAsDate = new Date();
}
