// script.js ajustado para rastrear salas visitadas por setor

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

let salasVisitadasPorSetor = JSON.parse(localStorage.getItem('salasVisitadasPorSetor')) || {};
let registrosChecklist = JSON.parse(localStorage.getItem('registrosChecklist')) || [];
let salasDisponiveis = [];
let setorAtual = "";

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
    setorAtual = setor;
    localSelect.innerHTML = '<option value="">Selecione o Local</option>';
    salasDisponiveis = [];

    if (locaisPorSetor[setor]) {
        const visitadasNoSetor = salasVisitadasPorSetor[setor] || [];
        locaisPorSetor[setor].forEach(local => {
            if (!visitadasNoSetor.includes(local)) {
                salasDisponiveis.push(local);
                const option = document.createElement('option');
                option.value = local;
                option.textContent = local;
                localSelect.appendChild(option);
            }
        });
    }
    atualizarListaSalas();
}

setorSelect.addEventListener('change', () => {
    const setor = setorSelect.value;
    atualizarSalasDisponiveis(setor);
});

localSelect.addEventListener('change', (event) => {
    const salaSelecionada = event.target.value;
    if (salaSelecionada && setorAtual) {
        marcarSalaVisitada(setorAtual, salaSelecionada);
        atualizarSalasDisponiveis(setorAtual); // Recalcula e atualiza a lista de locais
    }
});

function marcarSalaVisitada(setor, sala) {
    if (!salasVisitadasPorSetor[setor]) {
        salasVisitadasPorSetor[setor] = [];
    }
    if (!salasVisitadasPorSetor[setor].includes(sala)) {
        salasVisitadasPorSetor[setor].push(sala);
        localStorage.setItem('salasVisitadasPorSetor', JSON.stringify(salasVisitadasPorSetor));
    }
}

function selecionarProximaSala() {
    if (setorAtual && salasDisponiveis.length > 0) {
        const proximaSala = salasDisponiveis[0];
        localSelect.value = proximaSala;
        marcarSalaVisitada(setorAtual, proximaSala);
        atualizarSalasDisponiveis(setorAtual);
    } else if (setorAtual) {
        alert(`Todas as salas do setor ${setorAtual} foram visitadas.`);
    } else {
        alert("Por favor, selecione um setor.");
    }
}

function atualizarListaSalas() {
    listaSalasVisitadas.innerHTML = "<h3>Salas Visitadas:</h3>";
    if (setorAtual && salasVisitadasPorSetor[setorAtual]) {
        salasVisitadasPorSetor[setorAtual].forEach((sala) => {
            const li = document.createElement('li');
            li.textContent = sala;
            listaSalasVisitadas.appendChild(li);
        });
    }
}

salvarSalaBtn.addEventListener('click', () => {
    if (!setorAtual || !localSelect.value) {
        alert("Por favor, selecione o setor e o local.");
        return;
    }
    const registro = {
        data: document.getElementById('dataCheck').value,
        tecnico: document.getElementById('nomeTecnico').value,
        chamado: document.getElementById('numeroChamado').value,
        setor: setorAtual,
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
    if (!setorAtual || !localSelect.value) {
        alert("Por favor, selecione o setor e o local.");
        return;
    }
    // Salvar o registro atual antes de finalizar
    const registroFinal = {
        data: document.getElementById('dataCheck').value,
        tecnico: document.getElementById('nomeTecnico').value,
        chamado: document.getElementById('numeroChamado').value,
        setor: setorAtual,
        local: localSelect.value,
        computador: checklistForm.computador.value,
        sistema: checklistForm.sistema.value,
        impressora: checklistForm.impressora.value,
        internet: checklistForm.internet.value,
        observacoes: document.getElementById('observacoes').value
    };

    const indexRegistroExistente = registrosChecklist.findIndex(reg => reg.local === localSelect.value && reg.setor === setorAtual);

    if (indexRegistroExistente === -1) {
        registrosChecklist.push(registroFinal);
        localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));
    } else {
        registrosChecklist[indexRegistroExistente] = registroFinal;
        localStorage.setItem('registrosChecklist', JSON.stringify(registrosChecklist));
    }

    alert('Checklist finalizado para este local! Assine para poder gerar o PDF.');
    painelFinal.style.display = 'block';
});

const ctx = assinaturaCanvas.getContext('2d');
let desenhando = false;

assinaturaCanvas.addEventListener('mousedown', () => desenhando = true);
assinaturaCanvas.addEventListener('mouseup', () => desenhando = false);
assinaturaCanvas.addEventListener('mousemove', desenhar);

function desenhar(event) {
    if (!desenhando) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
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
        localStorage.removeItem('salasVisitadasPorSetor');
        localStorage.removeItem('registrosChecklist');
        salasVisitadasPorSetor = {};
        registrosChecklist = [];
        atualizarSalasDisponiveis(setorAtual);
        painelFinal.style.display = 'none'; // Esconde o painel de assinatura ao resetar
        alert('Checklist resetado.');
    }
});

proximaSalaBtn.addEventListener('click', () => {
    selecionarProximaSala();
});

// Inicializa a lista de salas visitadas se um setor já estiver selecionado
if (setorSelect.value) {
    atualizarSalasDisponiveis(setorSelect.value);
}

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