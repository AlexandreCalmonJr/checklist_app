// Dados de setores e locais organizados por tipo de checklist
const locaisPorTipoChecklist = {
    centroCirurgico: {
        "Centro Cirúrgico": [
            "SALA 01", "SALA 02", "SALA 03", "SALA 04", "SALA 05",
            "SALA 06", "SALA 07", "SALA 08", "SALA 09", "SALA 10",
            "SALA 11", "SALA 12", "BANCA MÉDICA", "ESTAR MÉDICO", "CRPA 01"
        ]
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
        ]
    },
    emergencia: {
        "Emergência Adulta": [
            "PAINEL Adulto",
            "TOTEM EMG ADT 01",
            "TOTEM EMG ADT 02",
            "TOTEM EMG ADT 03",
            "TOTEM EMG ADT 04",
            "TOTEM EMG ADT 05",
            "RECEPÇÃO ADULTO Computador 1",
            "RECEPÇÃO ADULTO Computador 2",
            "RECEPÇÃO ADULTO Computador 1 Supervisão",
            "RECEPÇÃO ADULTO Computador 2 Supervisão",
            "AUTORIZAÇÃO Computador 1",
            "AUTORIZAÇÃO Computador 2",
            "AUTORIZAÇÃO Computador 3",
            ...Array.from({ length: 17 }, (_, i) => `CONSULTÓRIO ADULTO ${i + 1}`),
            "Coleta ADT 01",
            "Coleta ADT 02",
            "ALA VERDE - ALA B Computador 1 Médico",
            "ALA VERDE - ALA B Computador 2 Médico",
            "ALA VERDE - ALA B Computador 3 Médico",
            "ALA VERDE - ALA B Computador 4 Posto",
            "ALA VERDE - ALA B Computador 5 Posto",
            "Estabilização PC 1",
            "Estabilização PC 2",
            "ECG",
            "Farmácia ADT 01",
            "Farmácia ADT 02",
            "ALA AMARELA - ALA C Computador 1",
            "ALA AMARELA - ALA C Computador 2"
        ],
        "Emergência Pediátrica": [
            "PAINEL Pediatria",
            "TOTEM EMG PED 01",
            "RECEPÇÃO PEDIÁTRICA Computador 1",
            "RECEPÇÃO PEDIÁTRICA Computador 2",
            "POSTO PEDIATRIA Computador 1",
            "POSTO PEDIATRIA Computador 2",
            "MÉDICO PEDIÁTRICO 1",
            "MÉDICO PEDIÁTRICO 2",
            "POSTO PEDIÁTRICO OBS3 - Computador 1",
            "POSTO PEDIÁTRICO OBS3 - Computador 2",
            ...Array.from({ length: 8 }, (_, i) => `CONSULTÓRIOS PEDIÁTRICOS ${i + 1}`),
            "Coleta Ped"
        ],
        "Ortopedia": [
            "PAINEL Traumatologia",
            "CONSULTÓRIOS TRAUMATOLOGIA 1",
            "CONSULTÓRIOS TRAUMATOLOGIA 2",
            "CONSULTÓRIOS TRAUMATOLOGIA 3",
            "POSTO TRAUMA (SALA DE GESSO) Computador 1",
            "RAIO X Computador 1"
        ],
        "Obstetrícia": [
            "PAINEL Obstetrícia",
            "RECEPÇÃO OBSTÉTRICA / TRAUMA Computador 1",
            "POSTO OBSTÉTRICO Computador 1",
            "POSTO OBSTÉTRICO Computador 2",
            "ADM Painel Sinais Vitais",
            "Farmácia Obst / Ped",
            "CONSULTÓRIOS OBSTÉTRICOS 1",
            "CONSULTÓRIOS OBSTÉTRICOS 2",
            "CONSULTÓRIOS OBSTÉTRICOS 3"
        ]
    }
};

const tecnicos = [
    "Alexandre Calmon",
    "Alexandre Pinho",
    "Anderson Conceição",
    "Adilson Santos",
    "Carlos Alan",
    "Flavio Torres",
    "Ramon Silva",
    "Rodrigo Costa",
];

// Elementos do DOM
const tipoChecklistSelect = document.getElementById('tipoChecklist');
const itensChecklistDiv = document.getElementById('itensChecklist');
const nomeTecnicoSelect = document.getElementById('nomeTecnico');
const setorSelect = document.getElementById('setor');
const localSelect = document.getElementById('local');
const checklistForm = document.getElementById('checklistForm');
const assinaturaCanvas = document.getElementById('assinatura');
const limparAssinaturaBtn = document.getElementById('limparAssinatura');
const gerarPDFBtn = document.getElementById('gerarPDF');
const salvarSalaBtn = document.getElementById('salvarSalaBtn');
const finalizarChecklistBtn = document.getElementById('finalizarChecklistBtn');
const proximaSalaBtn = document.getElementById('proximaSalaBtn');
const resetarChecklistBtn = document.getElementById('resetarChecklist');
const listaSalasVisitadas = document.getElementById('listaSalasVisitadas');
const painelFinal = document.getElementById('painelFinal');
const feedbackSalvar = document.createElement('span');

// Dados do checklist
let salasVisitadas = JSON.parse(localStorage.getItem('salasVisitadas')) || [];
let registrosChecklist = JSON.parse(localStorage.getItem('registrosChecklist')) || [];
let salasDisponiveis = [];

// Configuração inicial
feedbackSalvar.style.marginLeft = '10px';
salvarSalaBtn.parentNode.insertBefore(feedbackSalvar, salvarSalaBtn.nextSibling);
painelFinal.style.display = 'none';

// Preencher técnicos
tecnicos.forEach(tecnico => {
    const option = document.createElement('option');
    option.value = tecnico;
    option.textContent = tecnico;
    nomeTecnicoSelect.appendChild(option);
});

// Função para preencher setores com base no tipo de checklist
function preencherSetores(tipoChecklist) {
    setorSelect.innerHTML = '<option value="">Selecione o Setor</option>';
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    const setores = locaisPorTipoChecklist[tipoChecklist] || {};
    for (const setor in setores) {
        const option = document.createElement('option');
        option.value = setor;
        option.textContent = setor;
        setorSelect.appendChild(option);
    }
}

// Configuração dos itens do checklist por tipo
const itensCentroCirurgico = [
    { label: "Hospitalar/SIGA", name: "sistema_hospitalar_pep", options: ["Sim", "Não"] },
    { label: "Sistema Arya", name: "sistema_arya", options: ["Sim", "Não"] },
    { label: "Imprimir a partir do sistema", name: "imprimir_sistema", options: ["Sim", "Não"] },
    { label: "Leitor de Digital", name: "leitor_digital", options: ["Sim", "Não"] },
    { label: "Acesso Remoto funcionando?", name: "conexao_vnc", options: ["Sim", "Não"] },
    { label: "Sinal Wi-Fi", name: "sinal_wifi", options: ["Sim", "Não"] },
];

const itensRacks = [
    { label: "Nobreak", name: "nobreak", options: ["Sim", "Não"] },
    { label: "Limpeza", name: "limpeza", options: ["Sim", "Não"] },
    { label: "Org. Cabos", name: "org_cabos", options: ["Sim", "Não"] },
    { label: "Material em sala", name: "material_sala", options: ["Sim", "Não"] },
    { label: "Forros", name: "forros", options: ["Sim", "Não"] },
    { label: "Pintura", name: "pintura", options: ["Sim", "Não"] },
    { label: "Iluminação", name: "iluminacao", options: ["Sim", "Não"] },
    { label: "Ar condicionado", name: "ar_condicionado", options: ["Sim", "Não"] },
];

const itensEmergencia = [
    { label: "Navegador Atualizado?", name: "navegador_atualizado", options: ["Sim", "Não"] },
    { label: "Sistema Hospitalar/SAMWEB funcionando?", name: "samweb", options: ["Sim", "Não"] },
    { label: "Sistema Arya funcionando?", name: "arya", options: ["Sim", "Não"] },
    { label: "Impressão funcionando?", name: "impressao", options: ["Sim", "Não"] },
    { label: "NDD funcionando?", name: "ndd", options: ["Rede", "USB"] },
    { label: "Leitor de Digital funcionando?", name: "leitor_digital", options: ["Sim", "Não"] },
    { label: "Telefonia funcionando?", name: "telefonia", options: ["Sim", "Não"] },
    { label: "Acesso Remoto funcionando?", name: "acesso_remoto", options: ["Sim", "Não"] },
    { label: "Wi-Fi funcionando?", name: "wifi", options: ["Sim", "Não"] }
];

// Função para atualizar os itens do checklist com base no tipo
function atualizarItensChecklist(tipo) {
    itensChecklistDiv.innerHTML = '';

    let itens;
    if (tipo === "centroCirurgico") {
        itens = itensCentroCirurgico;
    } else if (tipo === "racks") {
        itens = itensRacks;
    } else if (tipo === "emergencia") {
        itens = itensEmergencia;
    } else {
        return;
    }

    itens.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label class="block font-semibold">${item.label}</label>
            <div class="space-x-4">
                ${item.options.map(option => `
                    <label class="mr-4">
                        <input type="radio" name="${item.name}" value="${option}" required /> ${option}
                    </label>
                `).join('')}
            </div>
        `;
        itensChecklistDiv.appendChild(div);
    });
}

// Atualizar itens do checklist e setores ao selecionar o tipo
tipoChecklistSelect.addEventListener('change', (event) => {
    const tipoChecklist = event.target.value;
    atualizarItensChecklist(tipoChecklist);
    preencherSetores(tipoChecklist);
    salasDisponiveis = [];
});

// Atualizar salas disponíveis
function atualizarSalasDisponiveis(tipoChecklist, setor) {
    salasDisponiveis = [];
    const setoresDoTipo = locaisPorTipoChecklist[tipoChecklist] || {};
    if (setoresDoTipo[setor]) {
        setoresDoTipo[setor].forEach(local => {
            if (!salasVisitadas.includes(local)) {
                salasDisponiveis.push(local);
            }
        });
    }
}

setorSelect.addEventListener('change', () => {
    const tipoChecklist = tipoChecklistSelect.value;
    const setor = setorSelect.value;
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    atualizarSalasDisponiveis(tipoChecklist, setor);

    salasDisponiveis.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        option.textContent = local;
        localSelect.appendChild(option);
    });
});

localSelect.addEventListener('change', (event) => {
    const tipoChecklist = tipoChecklistSelect.value;
    const setor = setorSelect.value;
    const salaSelecionada = event.target.value;
    if (salaSelecionada) {
        marcarSalaVisitada(salaSelecionada);
        atualizarListaSalas();
        atualizarSalasDisponiveis(tipoChecklist, setor);
    }
});

function marcarSalaVisitada(sala) {
    if (!salasVisitadas.includes(sala)) {
        salasVisitadas.push(sala);
        localStorage.setItem('salasVisitadas', JSON.stringify(salasVisitadas));
    }
}

function selecionarProximaSala() {
    const tipoChecklist = tipoChecklistSelect.value;
    const setor = setorSelect.value;
    if (salasDisponiveis.length > 0) {
        const proximaSala = salasDisponiveis[0];
        localSelect.value = proximaSala;
        marcarSalaVisitada(proximaSala);
        atualizarListaSalas();
        atualizarSalasDisponiveis(tipoChecklist, setor);
    } else {
        alert("Todas as salas deste setor foram visitadas.");
    }
}

function atualizarListaSalas() {
    listaSalasVisitadas.innerHTML = "<h3>Salas Visitadas:</h3>";
    salasVisitadas.forEach((sala) => {
        const li = document.createElement('li');
        li.textContent = sala;
        listaSalasVisitadas.appendChild(li);
    });
}

salvarSalaBtn.addEventListener('click', () => {
    const tipoChecklist = tipoChecklistSelect.value;
    let itensDados = {};

    if (tipoChecklist === "centroCirurgico") {
        itensCentroCirurgico.forEach(item => {
            itensDados[item.name] = checklistForm[item.name].value;
        });
    } else if (tipoChecklist === "racks") {
        itensRacks.forEach(item => {
            itensDados[item.name] = checklistForm[item.name].value;
        });
    } else if (tipoChecklist === "emergencia") {
        itensEmergencia.forEach(item => {
            itensDados[item.name] = checklistForm[item.name].value;
        });
    }

    const registro = {
        tipoChecklist: tipoChecklist,
        data: document.getElementById('dataCheck').value,
        tecnico: document.getElementById('nomeTecnico').value,
        chamado: document.getElementById('numeroChamado').value,
        setor: setorSelect.value,
        local: localSelect.value,
        itens: itensDados,
        observacoes: document.getElementById('observacoes').value
    };

    const index = registrosChecklist.findIndex(r =>
        r.setor === registro.setor && r.local === registro.local
    );

    if (index !== -1) {
        registrosChecklist[index] = registro;
    } else {
        registrosChecklist.push(registro);
    }

    localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));

    salvarSalaBtn.disabled = true;
    feedbackSalvar.textContent = '✅ Sala salva!';
    setTimeout(() => {
        salvarSalaBtn.disabled = false;
        feedbackSalvar.textContent = '';
    }, 1500);
});

finalizarChecklistBtn.addEventListener('click', () => {
    alert('Checklist finalizado! Assine para poder gerar o PDF.');
    painelFinal.style.display = 'block';
});

const ctx = assinaturaCanvas.getContext('2d');
let desenhando = false;

function getEventPosition(event) {
    const rect = assinaturaCanvas.getBoundingClientRect();
    if (event.touches && event.touches[0]) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    } else if (event.changedTouches && event.changedTouches[0]) {
        return {
            x: event.changedTouches[0].clientX - rect.left,
            y: event.changedTouches[0].clientY - rect.top
        };
    } else {
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}

assinaturaCanvas.addEventListener('mousedown', (event) => {
    desenhando = true;
    const pos = getEventPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

assinaturaCanvas.addEventListener('mouseup', () => {
    desenhando = false;
    ctx.beginPath();
});

assinaturaCanvas.addEventListener('mousemove', desenhar);

assinaturaCanvas.addEventListener('touchstart', (event) => {
    desenhando = true;
    const pos = getEventPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    event.preventDefault();
});

assinaturaCanvas.addEventListener('touchend', () => {
    desenhando = false;
    ctx.beginPath();
});

assinaturaCanvas.addEventListener('touchmove', (event) => {
    if (!desenhando) return;
    const pos = getEventPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    event.preventDefault();
});

function desenhar(event) {
    if (!desenhando) return;
    const pos = getEventPosition(event);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

limparAssinaturaBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, assinaturaCanvas.width, assinaturaCanvas.height);
    ctx.beginPath();
});

function assinaturaEstaVazia() {
    const imgData = ctx.getImageData(0, 0, assinaturaCanvas.width, assinaturaCanvas.height);
    return imgData.data.every(value => value === 0);
}

resetarChecklistBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja resetar o checklist?')) {
        localStorage.removeItem('salasVisitadas');
        localStorage.removeItem('registrosChecklist');
        salasVisitadas = [];
        registrosChecklist = [];
        atualizarListaSalas();
        painelFinal.style.display = 'none';
        alert('Checklist resetado.');
    }
});

proximaSalaBtn.addEventListener('click', () => {
    selecionarProximaSala();
});

atualizarListaSalas();

gerarPDFBtn.addEventListener('click', () => {
    if (assinaturaEstaVazia()) {
        alert('Por favor, assine antes de gerar o PDF.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });

    let y = 20;
    doc.setFontSize(16);
    doc.text("Relatório de Checklist - Hospital Teresa de Lisieux", 20, y);
    y += 10;

    const tecnico = document.getElementById('nomeTecnico').value;
    const dataAtual = new Date().toLocaleDateString();
    const chamado = document.getElementById('numeroChamado').value;
    doc.setFontSize(12);
    doc.text(`Data: ${dataAtual} | Técnico: ${tecnico} | Chamado: ${chamado}`, 20, y);
    y += 15;

    // Agrupar registros por tipo de checklist
    const registrosPorTipo = {
        centroCirurgico: registrosChecklist.filter(r => r.tipoChecklist === "centroCirurgico"),
        racks: registrosChecklist.filter(r => r.tipoChecklist === "racks"),
        emergencia: registrosChecklist.filter(r => r.tipoChecklist === "emergencia")
    };

    // Função para adicionar tabela para um tipo específico
    const adicionarTabelaPorTipo = (tipo, registros, titulo) => {
        if (registros.length === 0) return;

        doc.setFontSize(14);
        doc.text(titulo, 20, y);
        y += 10;

        let colunas, linhas = [];
        if (tipo === "centroCirurgico") {
            colunas = ["Setor", "Local", "Hospitalar/SIGA", " Arya", "Impressão", "Leitor Digital", "Acesso Remoto", "Sinal Wi-Fi", "Observações"];
            linhas = registros.map(registro => [
                registro.setor,
                registro.local,
                registro.itens.sistema_hospitalar_pep,
                registro.itens.sistema_arya,
                registro.itens.imprimir_sistema,
                registro.itens.leitor_digital,
                registro.itens.conexao_vnc,
                registro.itens.sinal_wifi,
                registro.observacoes || "Nenhuma"
            ]);
        } else if (tipo === "racks") {
            colunas = ["Setor", "Local", "Nobreak", "Limpeza", "Org. Cabos", "Material em Sala", "Forros", "Pintura", "Iluminação", "Ar Condicionado","Observações"];
            linhas = registros.map(registro => [
                registro.setor,
                registro.local,
                registro.itens.nobreak,
                registro.itens.limpeza,
                registro.itens.org_cabos,
                registro.itens.material_sala,
                registro.itens.forros,
                registro.itens.pintura,
                registro.itens.iluminacao,
                registro.itens.ar_condicionado,
                registro.observacoes || "Nenhuma"
            ]);
        } else if (tipo === "emergencia") {
            colunas = ["Setor", "Local", "Navegador", "Hospitalar/SAMWEB", "Arya", "Impressão", "NDD", "Leitor Digital", "Telefonia", "Acesso Remoto", "Wi-Fi", "Observações"];
            linhas = registros.map(registro => [
                registro.setor,
                registro.local,
                registro.itens.navegador_atualizado,
                registro.itens.samweb,
                registro.itens.arya,
                registro.itens.impressao,
                registro.itens.ndd,
                registro.itens.leitor_digital,
                registro.itens.telefonia,
                registro.itens.acesso_remoto,
                registro.itens.wifi,
                registro.observacoes || "Nenhuma"
            ]);
        }

        doc.autoTable({
            startY: y,
            head: [colunas],
            body: linhas,
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [52, 73, 94], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        y = doc.lastAutoTable.finalY + 15;
    };

    // Adicionar tabelas para cada tipo de checklist
    adicionarTabelaPorTipo("centroCirurgico", registrosPorTipo.centroCirurgico, "Checklist - Centro Cirúrgico");
    adicionarTabelaPorTipo("racks", registrosPorTipo.racks, "Checklist - Racks");
    adicionarTabelaPorTipo("emergencia", registrosPorTipo.emergencia, "Checklist - Emergência");

    // Adicionar a assinatura
    const imgData = assinaturaCanvas.toDataURL('image/png');
    doc.text("Assinatura do Responsável:", 20, y);
    doc.addImage(imgData, 'PNG', 20, y + 2, 100, 40);

    doc.save('Relatorio_Checklist_Hospital.pdf');
});