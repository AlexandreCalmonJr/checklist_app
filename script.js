// script.js ajustado com melhorias e painel final
// Removed duplicate declaration of checklistForm

const locaisPorSetor = {
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
      ...Array.from({ length: 17 }, (_, i) => `CONSULTÓRIO ADULTO  ${i + 1}`),
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
      ...Array.from({ length: 8 }, (_, i) => `CONSULTÓRIOS PEDIÁTRICOS  ${i + 1}`),
      "Coleta Ped"
    ],
    "Ortopedia": [
      "PAINEL Traumatologia",
      "CONSULTÓRIOS TRAUMATOLOGIA  1",
      "CONSULTÓRIOS TRAUMATOLOGIA  2",
      "CONSULTÓRIOS TRAUMATOLOGIA  3",
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
      "CONSULTÓRIOS OBSTÉTRICOS  1",
      "CONSULTÓRIOS OBSTÉTRICOS  2",
      "CONSULTÓRIOS OBSTÉTRICOS  3"
    ],
    
  };
  const tecnicos = [
    "Alexandre Calmon",
    "Alexandre Pinho",
    "Anderson Conceição",
    "Adilson Santos",
    "Carlos Alan",
    "Ramon Silva",
    "Rodrigo Costa",
  ];
  
  const nomeTecnico = document.getElementById('nomeTecnico');

  // Preenche o select com os nomes dos técnicos
  tecnicos.forEach(tecnico => {
    const option = document.createElement('option');
    option.value = tecnico;
    option.textContent = tecnico;
    nomeTecnico.appendChild(option);
  });

const tecnico = document.getElementById('nomeTecnico');
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
const feedbackSalvar = document.createElement('span'); // Elemento para feedback de salvar

let salasVisitadas = JSON.parse(localStorage.getItem('salasVisitadas')) || [];
let registrosChecklist = JSON.parse(localStorage.getItem('registrosChecklist')) || [];
let salasDisponiveis = [];

// Inicialização do feedback de salvar
feedbackSalvar.style.marginLeft = '10px';
salvarSalaBtn.parentNode.insertBefore(feedbackSalvar, salvarSalaBtn.nextSibling);

// Esconde o painel final no início
painelFinal.style.display = 'none';

// Preencher setores
for (const setor in locaisPorSetor) {
    const option = document.createElement('option');
    option.value = setor;
    option.textContent = setor;
    setorSelect.appendChild(option);
}

function atualizarSalasDisponiveis(setor) {
    salasDisponiveis = [];
    if (locaisPorSetor[setor]) {
        locaisPorSetor[setor].forEach(local => {
            if (!salasVisitadas.includes(local)) {
                salasDisponiveis.push(local);
            }
        });
    }
}

setorSelect.addEventListener('change', () => {
    const setor = setorSelect.value;
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    atualizarSalasDisponiveis(setor);

    salasDisponiveis.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        option.textContent = local;
        localSelect.appendChild(option);
    });
});

localSelect.addEventListener('change', (event) => {
    const salaSelecionada = event.target.value;
    if (salaSelecionada) {
        marcarSalaVisitada(salaSelecionada);
        atualizarListaSalas();
        atualizarSalasDisponiveis(setorSelect.value); // Recalcula as salas disponíveis ao selecionar manualmente
    }
});

function marcarSalaVisitada(sala) {
    if (!salasVisitadas.includes(sala)) {
        salasVisitadas.push(sala);
        localStorage.setItem('salasVisitadas', JSON.stringify(salasVisitadas));
    }
}

function selecionarProximaSala() {
    if (salasDisponiveis.length > 0) {
        const proximaSala = salasDisponiveis[0]; // Pega a primeira sala disponível
        localSelect.value = proximaSala;
        marcarSalaVisitada(proximaSala);
        atualizarListaSalas();
        atualizarSalasDisponiveis(setorSelect.value); // Recalcula após selecionar
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
    const registro = {
        data: document.getElementById('dataCheck').value,
        tecnico: document.getElementById('nomeTecnico').value,
        chamado: document.getElementById('numeroChamado').value,
        setor: setorSelect.value,
        local: localSelect.value,
        navegador_atualizado: checklistForm.navegador_atualizado.value,
        samweb: checklistForm.samweb.value,
        arya: checklistForm.arya.value,
        impressao: checklistForm.impressao.value,
        ndd: checklistForm.ndd.value,
        leitor_digital: checklistForm.leitor_digital.value,
        telefonia: checklistForm.telefonia.value,
        acesso_remoto: checklistForm.acesso_remoto.value,
        wifi: checklistForm.wifi.value,
        observacoes: document.getElementById('observacoes').value
    };

    // Verifica se o registro já existe para evitar duplicação
    const index = registrosChecklist.findIndex(r =>
        r.setor === registro.setor && r.local === registro.local
    );

    if (index !== -1) {
        registrosChecklist[index] = registro; // Atualiza se já existe
    } else {
        registrosChecklist.push(registro); // Adiciona novo
    }

    localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));

    // Feedback visual
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

// Obter posição correta do evento (mouse ou toque)
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

// Eventos de mouse
assinaturaCanvas.addEventListener('mousedown', (event) => {
    desenhando = true;
    const pos = getEventPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

assinaturaCanvas.addEventListener('mouseup', () => {
    desenhando = false;
    ctx.beginPath(); // evita rabiscos
});

assinaturaCanvas.addEventListener('mousemove', desenhar);

// Eventos de toque
assinaturaCanvas.addEventListener('touchstart', (event) => {
    desenhando = true;
    const pos = getEventPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    event.preventDefault();
});

assinaturaCanvas.addEventListener('touchend', () => {
    desenhando = false;
    ctx.beginPath(); // evita rabiscos
});

assinaturaCanvas.addEventListener('touchmove', (event) => {
    if (!desenhando) return;
    const pos = getEventPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    event.preventDefault(); // evita scroll da tela
});

// Função para desenhar com mouse
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

// Botão limpar assinatura
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
        painelFinal.style.display = 'none'; // Esconde o painel de assinatura ao resetar
        alert('Checklist resetado.');
    }
});

proximaSalaBtn.addEventListener('click', () => {
    selecionarProximaSala();
});

atualizarListaSalas(); // Carrega a lista de salas visitadas na inicialização

gerarPDFBtn.addEventListener('click', () => {
    if (assinaturaEstaVazia()) {
        alert('Por favor, assine antes de gerar o PDF.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" }); // 👈 paisagem

    // Título
    let y = 20;
    doc.setFontSize(16);
    doc.text("Relatório de Checklist - Hospital Teresa de Lisieux", 20, y);
    y += 10;

    // Cabeçalho com técnico, data e chamado
    const tecnico = document.getElementById('nomeTecnico').value;
    const dataAtual = new Date().toLocaleDateString();
    const chamado = document.getElementById('numeroChamado').value;
    doc.setFontSize(12);
    doc.text(`Data: ${dataAtual} | Técnico: ${tecnico} | Chamado: ${chamado}`, 20, y);
    y += 10;

    // Cabeçalhos da tabela
    const colunas = [
        "Setor", "Local",
        "Navegador", "Hospitalar/SAMWEB", "Arya", "Impressão",
        "NDD", "Leitor Digital", "Telefonia", "Acesso Remoto", "Wi-Fi", "Observações"
    ];

    // Linhas de dados
    const linhas = registrosChecklist.map(reg => [
        reg.setor,
        reg.local,
        reg.navegador_atualizado,
        reg.samweb,
        reg.arya,
        reg.impressao,
        reg.ndd,
        reg.leitor_digital,
        reg.telefonia,
        reg.acesso_remoto,
        reg.wifi,
        reg.observacoes || "Nenhuma"
    ]);

    // Tabela
    doc.autoTable({
        startY: y + 5,
        head: [colunas],
        body: linhas,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Assinatura
    const imgData = assinaturaCanvas.toDataURL('image/png');
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Assinatura do Responsável:", 20, finalY);
    doc.addImage(imgData, 'PNG', 20, finalY + 2, 100, 40);

    doc.save('Relatorio_Checklist_Hospital.pdf');
});


