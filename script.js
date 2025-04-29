// script.js ajustado com melhorias e painel final

const locaisPorSetor = {
    "Emergência Adulta": ["Consultório 1", "Consultório 2", "Consultório 3", "Consultório 4", "Consultório 5"],
    "Emergência Pediátrica": ["Consultório 1", "Consultório 2", "Consultório 3"],
    "Ortopedia": ["Consultório 1", "Consultório 2"],
    "Obstetrícia": ["Consultório 1", "Consultório 2"],
    "Posto de Enfermagem": ["Adulto", "Pediatria", "Obstetrícia"],
    "Recepção": ["Recepção Adulto", "Recepção Pediatria", "Recepção Obstetrícia"]
};

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
        computador: checklistForm.computador.value,
        sistema: checklistForm.sistema.value,
        impressora: checklistForm.impressora.value,
        internet: checklistForm.internet.value,
        observacoes: document.getElementById('observacoes').value
    };

    registrosChecklist.push(registro);
    localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));

    // Feedback visual
    salvarSalaBtn.disabled = true;
    feedbackSalvar.textContent = 'Sala salva!';
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
    const doc = new jsPDF();

    let y = 20;
    doc.setFontSize(16);
    doc.text("Relatório de Checklist - Hospital", 20, y);
    y += 10;

    registrosChecklist.forEach((registro, index) => {
        doc.setFontSize(12);
        doc.text(`Sala ${index + 1}: ${registro.setor} - ${registro.local}`, 20, y);
        y += 7;
        doc.text(`Data: ${registro.data} | Técnico: ${registro.tecnico} | Chamado: ${registro.chamado}`, 20, y);
        y += 7;
        doc.text(`Computador: ${registro.computador} | Sistema: ${registro.sistema}`, 20, y);
        y += 7;
        doc.text(`Impressora: ${registro.impressora} | Internet: ${registro.internet}`, 20, y);
        y += 7;
        doc.text(`Observações: ${registro.observacoes || 'Nenhuma'}`, 20, y);
        y += 15;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    // Assinatura no final
    const imgData = assinaturaCanvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, y + 10, 100, 50);

    doc.save('Relatorio_Checklist_Hospital.pdf');
});