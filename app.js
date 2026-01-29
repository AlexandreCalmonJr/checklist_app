/**
 * APP.JS - Aplicação Principal do Checklist
 * Hospital Teresa de Lisieux
 */

// Importações
import { ThemeManager } from './modules/themeManager.js';
import { notify } from './modules/notificationManager.js';
import { DataManager } from './modules/dataManager.js';
import { UNIDADES, TECNICOS, LOCAIS_POR_TIPO, ITENS_CONFIG, PDF_COLUMNS_CONFIG, STORAGE_KEYS } from './utils/constants.js';
import { formatDateForInput, sanitizeId, isCanvasEmpty } from './utils/helpers.js';
import { StorageManager } from './utils/storage.js';

// Expor PDF_COLUMNS_CONFIG para uso no PDF
window.PDF_COLUMNS_CONFIG = PDF_COLUMNS_CONFIG;

/**
 * Classe principal da aplicação
 */
class ChecklistApp {
    constructor() {
        // Gerenciadores
        this.themeManager = new ThemeManager();
        this.dataManager = new DataManager();

        // Elementos do DOM
        this.elements = {};

        // Estado da aplicação
        this.assinaturasCanvasCtx = {};
        this.autoFillEnabled = StorageManager.load(STORAGE_KEYS.AUTO_FILL_ENABLED, true);

        this.init();
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initializeForm();
        this.themeManager.init();
        this.updateSalasVisitadas();

        // Carrega unidade salva e atualiza header
        const unidadeSalva = StorageManager.load(STORAGE_KEYS.UNIDADE_SELECIONADA, UNIDADES[0].id);
        const unidade = UNIDADES.find(u => u.id === unidadeSalva);
        if (unidade) {
            const headerElement = document.getElementById('unidadeNomeHeader');
            if (headerElement) {
                headerElement.textContent = unidade.nome;
            }
        }

        notify.success('Aplicação carregada com sucesso!', 2000);
    }

    /**
     * Armazena referências aos elementos do DOM
     */
    cacheElements() {
        this.elements = {
            // Form elements
            unidade: document.getElementById('unidade'),
            tipoChecklistSelect: document.getElementById('tipoChecklist'),
            dataCheck: document.getElementById('dataCheck'),
            nomeTecnicoSelect: document.getElementById('nomeTecnico'),
            numeroChamado: document.getElementById('numeroChamado'),
            setorSelect: document.getElementById('setor'),
            localSelect: document.getElementById('local'),
            observacoes: document.getElementById('observacoes'),

            // Containers
            itensChecklistDiv: document.getElementById('itensChecklist'),
            itensChecklistContainer: document.getElementById('itensChecklistContainer'),
            responsavelDiv: document.getElementById('responsavelDiv'),
            responsavelNome: document.getElementById('responsavelNome'),
            salasVisitadasList: document.getElementById('salasVisitadasList'),

            // Buttons
            salvarSalaBtn: document.getElementById('salvarSalaBtn'),
            proximaSalaBtn: document.getElementById('proximaSalaBtn'),
            finalizarChecklistBtn: document.getElementById('finalizarChecklistBtn'),
            resetarChecklistBtn: document.getElementById('resetarChecklist'),
            gerarPDFBtn: document.getElementById('gerarPDF'),

            // Panels
            painelAssinaturas: document.getElementById('painelAssinaturas'),
            assinaturasContainer: document.getElementById('assinaturasContainer'),
            painelGerarPDF: document.getElementById('painelGerarPDF'),

            // Progress
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText')
        };
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Unidade
        this.elements.unidade.addEventListener('change', (e) => {
            this.onUnidadeChange(e.target.value);
        });

        // Tipo de checklist
        this.elements.tipoChecklistSelect.addEventListener('change', (e) => {
            this.onTipoChecklistChange(e.target.value);
        });

        // Setor
        this.elements.setorSelect.addEventListener('change', () => {
            this.onSetorChange();
        });

        // Local
        this.elements.localSelect.addEventListener('change', (e) => {
            this.onLocalChange(e.target.value);
        });

        // Botões
        this.elements.salvarSalaBtn.addEventListener('click', () => this.salvarSala());
        this.elements.proximaSalaBtn.addEventListener('click', () => this.proximaSala());
        this.elements.finalizarChecklistBtn.addEventListener('click', () => this.finalizarChecklist());
        this.elements.resetarChecklistBtn.addEventListener('click', () => this.resetarChecklist());
        this.elements.gerarPDFBtn.addEventListener('click', () => this.gerarPDF());
    }

    /**
     * Inicializa o formulário
     */
    initializeForm() {
        // Preenche unidades
        UNIDADES.forEach(unidade => {
            this.elements.unidade.add(new Option(unidade.nome, unidade.id));
        });

        // Carrega unidade salva ou usa a primeira
        const unidadeSalva = StorageManager.load(STORAGE_KEYS.UNIDADE_SELECIONADA, UNIDADES[0].id);
        this.elements.unidade.value = unidadeSalva;

        // Preenche técnicos
        TECNICOS.forEach(tecnico => {
            this.elements.nomeTecnicoSelect.add(new Option(tecnico, tecnico));
        });

        // Define data atual
        this.elements.dataCheck.value = formatDateForInput();
    }

    /**
     * Handler para mudança de unidade
     */
    onUnidadeChange(unidadeId) {
        StorageManager.save(STORAGE_KEYS.UNIDADE_SELECIONADA, unidadeId);
        const unidade = UNIDADES.find(u => u.id === unidadeId);
        if (unidade) {
            // Atualiza header
            const headerElement = document.getElementById('unidadeNomeHeader');
            if (headerElement) {
                headerElement.textContent = unidade.nome;
            }
            notify.info(`✅ Unidade "${unidade.nome}" selecionada`);
        }
    }

    /**
     * Handler para mudança de tipo de checklist
     */
    onTipoChecklistChange(tipo) {
        this.atualizarItensChecklist(tipo);
        this.preencherSetores(tipo);
        this.updateProgress();
    }

    /**
     * Handler para mudança de setor
     */
    onSetorChange() {
        const tipo = this.elements.tipoChecklistSelect.value;
        const setor = this.elements.setorSelect.value;

        this.elements.localSelect.innerHTML = '<option value="">Selecione o Local</option>';
        this.elements.responsavelDiv.classList.add('hidden');

        if (!tipo || !setor) return;

        const salasDisponiveis = this.dataManager.getSalasDisponiveis(tipo, setor);
        salasDisponiveis.forEach(item => {
            this.elements.localSelect.add(new Option(item.local, item.local));
        });

        if (salasDisponiveis.length === 0) {
            notify.warning('Todas as salas deste setor já foram visitadas!');
        }
    }

    /**
     * Handler para mudança de local
     */
    onLocalChange(local) {
        if (!local) {
            this.elements.responsavelDiv.classList.add('hidden');
            return;
        }

        const tipo = this.elements.tipoChecklistSelect.value;
        const setor = this.elements.setorSelect.value;
        const locaisDoSetor = (LOCAIS_POR_TIPO[tipo] || {})[setor] || [];
        const item = locaisDoSetor.find(i => i.local === local);

        if (item) {
            this.elements.responsavelNome.textContent = item.responsavel;
            this.elements.responsavelDiv.classList.remove('hidden');
        }

        // Carrega dados existentes se houver
        const registroExistente = this.dataManager.getRegistro(local);
        if (registroExistente) {
            this.preencherFormulario(registroExistente);
            notify.info('Dados anteriores carregados para este local');
        } else {
            // Auto-fill com respostas anteriores se habilitado
            if (this.autoFillEnabled) {
                const lastAnswers = this.loadLastChecklistAnswers();
                if (lastAnswers && Object.keys(lastAnswers).length > 0) {
                    this.preencherFormulario({ itens: lastAnswers, observacoes: '' });
                    notify.info('✨ Respostas anteriores aplicadas automaticamente');
                } else {
                    this.limparItensChecklist();
                    this.elements.observacoes.value = '';
                }
            } else {
                this.limparItensChecklist();
                this.elements.observacoes.value = '';
            }
        }
    }

    /**
     * Preenche os setores baseado no tipo
     */
    preencherSetores(tipo) {
        this.elements.setorSelect.innerHTML = '<option value="">Selecione o Setor</option>';
        this.elements.localSelect.innerHTML = '<option value="">Selecione o Local</option>';
        this.elements.responsavelDiv.classList.add('hidden');

        const setores = LOCAIS_POR_TIPO[tipo] || {};
        Object.keys(setores).forEach(setor => {
            this.elements.setorSelect.add(new Option(setor, setor));
        });
    }

    /**
     * Atualiza os itens do checklist baseado no tipo
     */
    atualizarItensChecklist(tipo) {
        this.elements.itensChecklistDiv.innerHTML = '';
        const itens = ITENS_CONFIG[tipo] || [];

        if (itens.length === 0) {
            this.elements.itensChecklistContainer.classList.add('hidden');
            return;
        }

        this.elements.itensChecklistContainer.classList.remove('hidden');

        itens.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label class="form-label" style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                    <span style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%);
                        color: white;
                        border-radius: 50%;
                        font-size: 12px;
                        font-weight: 600;
                    ">${index + 1}</span>
                    ${item.label}
                </label>
                <div class="form-radio-group">
                    ${item.options.map(option => `
                        <label class="form-radio-label" style="
                            display: flex;
                            align-items: center;
                            gap: var(--space-sm);
                            padding: var(--space-sm);
                            background: white;
                            border: 1px solid var(--color-border);
                            border-radius: var(--radius-md);
                            cursor: pointer;
                            transition: all 0.2s ease;
                        ">
                            <input type="radio" name="${item.name}" value="${option}" required 
                                   style="width: 18px; height: 18px; cursor: pointer;"/>
                            <span style="font-weight: 500;">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            this.elements.itensChecklistDiv.appendChild(div);
        });

        // Adicionar interatividade aos radio buttons
        const labels = this.elements.itensChecklistDiv.querySelectorAll('.form-radio-label');
        labels.forEach(label => {
            const radio = label.querySelector('input[type="radio"]');
            label.addEventListener('click', () => {
                const parent = radio.closest('.form-radio-group');
                parent.querySelectorAll('.form-radio-label').forEach(l => {
                    l.style.background = 'white';
                    l.style.borderColor = 'var(--color-border)';
                });
                label.style.background = '#f0f9ff';
                label.style.borderColor = '#3b82f6';
            });
        });
    }

    /**
     * Limpa as seleções dos itens do checklist
     */
    limparItensChecklist() {
        const radios = this.elements.itensChecklistDiv.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
    }

    /**
     * Preenche o formulário com dados existentes
     */
    preencherFormulario(registro) {
        Object.keys(registro.itens).forEach(itemName => {
            const itemValue = registro.itens[itemName];
            const radio = document.querySelector(`input[name="${itemName}"][value="${itemValue}"]`);
            if (radio) radio.checked = true;
        });
        this.elements.observacoes.value = registro.observacoes || '';
    }

    /**
     * Salva a sala atual
     */
    salvarSala() {
        const registro = this.coletarDadosFormulario();

        if (!registro) return;

        const validation = this.dataManager.validateRegistro(registro);
        if (!validation.valid) {
            notify.error(validation.errors[0]);
            return;
        }

        if (this.dataManager.saveRegistro(registro)) {
            this.dataManager.addSalaVisitada(registro.local);
            this.saveLastChecklistAnswers(registro.itens);
            this.updateSalasVisitadas();
            this.updateProgress();
            notify.success(`✅ Sala "${registro.local}" salva com sucesso!`);
        } else {
            notify.error('Erro ao salvar sala. Tente novamente.');
        }
    }

    /**
     * Vai para a próxima sala
     */
    proximaSala() {
        this.salvarSala();

        const tipo = this.elements.tipoChecklistSelect.value;
        const setor = this.elements.setorSelect.value;
        const salasDisponiveis = this.dataManager.getSalasDisponiveis(tipo, setor);

        if (salasDisponiveis.length > 0) {
            this.elements.localSelect.value = salasDisponiveis[0].local;
            this.elements.localSelect.dispatchEvent(new Event('change'));
        } else {
            notify.warning('Todas as salas deste setor foram visitadas!');
        }
    }

    /**
     * Coleta dados do formulário
     */
    coletarDadosFormulario() {
        const tipoChecklist = this.elements.tipoChecklistSelect.value;
        const local = this.elements.localSelect.value;
        const setor = this.elements.setorSelect.value;

        if (!local) {
            notify.error('Por favor, selecione um local antes de salvar.');
            return null;
        }

        let itensDados = {};
        const itens = ITENS_CONFIG[tipoChecklist] || [];
        let formValido = true;

        itens.forEach(item => {
            const input = document.querySelector(`input[name="${item.name}"]:checked`);
            if (input) {
                itensDados[item.name] = input.value;
            } else {
                formValido = false;
            }
        });

        if (!formValido) {
            notify.error('Por favor, preencha todos os itens do checklist.');
            return null;
        }

        const locaisDoSetor = (LOCAIS_POR_TIPO[tipoChecklist] || {})[setor] || [];
        const itemSelecionado = locaisDoSetor.find(item => item.local === local);

        return {
            tipoChecklist,
            data: this.elements.dataCheck.value,
            tecnico: this.elements.nomeTecnicoSelect.value,
            chamado: this.elements.numeroChamado.value,
            setor,
            local,
            responsavel: itemSelecionado ? itemSelecionado.responsavel : 'N/A',
            itens: itensDados,
            observacoes: this.elements.observacoes.value
        };
    }

    /**
     * Atualiza a lista de salas visitadas
     */
    updateSalasVisitadas() {
        this.elements.salasVisitadasList.innerHTML = '';

        if (this.dataManager.salasVisitadas.length === 0) {
            this.elements.salasVisitadasList.innerHTML =
                '<p class="text-muted">Nenhuma sala visitada ainda</p>';
            return;
        }

        this.dataManager.salasVisitadas.forEach(sala => {
            const badge = document.createElement('span');
            badge.className = 'badge badge-primary';
            badge.textContent = sala;
            this.elements.salasVisitadasList.appendChild(badge);
        });
    }

    /**
     * Atualiza a barra de progresso
     */
    updateProgress() {
        const total = this.dataManager.registrosChecklist.length;

        if (total === 0) {
            this.elements.progressContainer.classList.add('hidden');
            return;
        }

        this.elements.progressContainer.classList.remove('hidden');
        const percentage = total * 10; // Aproximação
        this.elements.progressFill.style.width = `${Math.min(percentage, 100)}%`;
        this.elements.progressText.textContent = `${total} sala(s) verificada(s)`;
    }

    /**
     * Finaliza o checklist e mostra painel de assinaturas
     */
    finalizarChecklist() {
        if (this.dataManager.registrosChecklist.length === 0) {
            notify.error('Nenhuma sala foi salva. Complete pelo menos uma sala antes de finalizar.');
            return;
        }

        this.mostrarPainelAssinaturas();

        // Esconde botões de ação
        this.elements.salvarSalaBtn.classList.add('hidden');
        this.elements.proximaSalaBtn.classList.add('hidden');
        this.elements.finalizarChecklistBtn.classList.add('hidden');

        notify.info('Agora assine os formulários para gerar o PDF final');
    }

    /**
     * Mostra o painel de assinaturas
     */
    mostrarPainelAssinaturas() {
        this.elements.assinaturasContainer.innerHTML = '';
        this.assinaturasCanvasCtx = {};

        const responsaveisEnvolvidos = this.dataManager.getResponsaveisEnvolvidos();

        responsaveisEnvolvidos.forEach(responsavel => {
            const idResponsavel = sanitizeId(responsavel);
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <h3 style="color: var(--color-primary); margin-bottom: var(--space-lg);">
                    Setor: ${responsavel}
                </h3>
                <div class="grid grid-2 mb-md">
                    <div class="form-group">
                        <label class="form-label" for="nome-${idResponsavel}">Nome do Responsável</label>
                        <input type="text" id="nome-${idResponsavel}" required 
                               placeholder="Nome completo" class="form-input"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="matricula-${idResponsavel}">Matrícula</label>
                        <input type="text" id="matricula-${idResponsavel}" required 
                               placeholder="Matrícula do responsável" class="form-input"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Assinatura</label>
                    <canvas id="canvas-${idResponsavel}" width="400" height="150" 
                            style="border: 2px solid var(--color-border); border-radius: var(--radius-lg); cursor: crosshair; background: white;">
                    </canvas>
                    <button type="button" id="limpar-${idResponsavel}" class="btn btn-sm mt-sm" 
                            style="background: var(--color-warning);">
                        Limpar Assinatura
                    </button>
                </div>
            `;

            this.elements.assinaturasContainer.appendChild(div);

            const canvas = document.getElementById(`canvas-${idResponsavel}`);
            this.assinaturasCanvasCtx[responsavel] = this.configurarCanvas(canvas);

            document.getElementById(`limpar-${idResponsavel}`).addEventListener('click', () => {
                const ctx = this.assinaturasCanvasCtx[responsavel];
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        });

        this.elements.painelAssinaturas.classList.remove('hidden');
        this.elements.painelGerarPDF.classList.remove('hidden');
    }

    /**
     * Configura um canvas para assinatura
     */
    configurarCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        let desenhando = false;

        const getPos = (event) => {
            const rect = canvas.getBoundingClientRect();
            const touch = event.touches ? event.touches[0] : event;
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
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

        const pararDesenho = () => {
            desenhando = false;
            ctx.beginPath();
        };

        const iniciarDesenho = (event) => {
            desenhando = true;
            desenhar(event);
        };

        canvas.addEventListener('mousedown', iniciarDesenho);
        canvas.addEventListener('mousemove', desenhar);
        canvas.addEventListener('mouseup', pararDesenho);
        canvas.addEventListener('mouseout', pararDesenho);
        canvas.addEventListener('touchstart', iniciarDesenho, { passive: false });
        canvas.addEventListener('touchmove', desenhar, { passive: false });
        canvas.addEventListener('touchend', pararDesenho);

        return ctx;
    }

    /**
     * Gera o PDF final
     */
    gerarPDF() {
        // Validar assinaturas
        const assinaturas = {};
        let todasAssinaturasOk = true;

        Object.keys(this.assinaturasCanvasCtx).forEach(responsavel => {
            const idResponsavel = sanitizeId(responsavel);
            const nome = document.getElementById(`nome-${idResponsavel}`).value.trim();
            const matricula = document.getElementById(`matricula-${idResponsavel}`).value.trim();
            const canvas = this.assinaturasCanvasCtx[responsavel].canvas;
            const vazia = isCanvasEmpty(canvas);

            if (!nome || !matricula || vazia) {
                todasAssinaturasOk = false;
            }

            assinaturas[responsavel] = {
                nome,
                matricula,
                imgData: canvas.toDataURL('image/png'),
                vazia
            };
        });

        if (!todasAssinaturasOk) {
            notify.error('Todos os campos de nome, matrícula e assinatura devem ser preenchidos!');
            return;
        }

        // Gerar PDF
        notify.success('Gerando PDF...');

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: "landscape" });
            let y = 15;

            // Cabeçalho - Obter nome da unidade selecionada
            const unidadeSelecionada = this.elements.unidade.value;
            const unidade = UNIDADES.find(u => u.id === unidadeSelecionada);
            const nomeUnidade = unidade ? unidade.nome : "Hospital Teresa de Lisieux";

            doc.setFontSize(16);
            doc.text(`Relatório de Checklist - ${nomeUnidade}`, 14, y);
            y += 8;

            // Informações gerais
            doc.setFontSize(12);
            const dataValue = this.elements.dataCheck.value;
            const [ano, mes, dia] = dataValue.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            doc.text(`Data: ${dataFormatada} | Técnico: ${this.elements.nomeTecnicoSelect.value} | Chamado: ${this.elements.numeroChamado.value}`, 14, y);
            y += 10;

            // Agrupar registros por responsável
            const registrosPorResponsavel = this.dataManager.registrosChecklist.reduce((acc, r) => {
                (acc[r.responsavel] = acc[r.responsavel] || []).push(r);
                return acc;
            }, {});

            // Gerar tabelas por responsável
            Object.keys(registrosPorResponsavel).forEach(responsavel => {
                if (y > 160) {
                    doc.addPage();
                    y = 15;
                }

                doc.setFontSize(14);
                doc.text(`Itens sob responsabilidade de: ${responsavel}`, 14, y);
                y += 8;

                const registros = registrosPorResponsavel[responsavel];
                const tipo = registros[0].tipoChecklist;

                // Obter configuração de colunas do constants.js
                const config = this.getPDFColumnsConfig(tipo);
                const colunas = config.columns;
                const linhas = registros.map(r => this.buildPDFRow(r, config.fields));

                doc.autoTable({
                    startY: y,
                    head: [colunas],
                    body: linhas,
                    styles: { fontSize: 8, cellPadding: 1.5 },
                    headStyles: { fillColor: [22, 78, 99], textColor: 255, fontSize: 8 },
                    alternateRowStyles: { fillColor: [241, 245, 249] }
                });
                y = doc.lastAutoTable.finalY;

                // Adicionar assinatura
                const dadosAssinatura = assinaturas[responsavel];
                doc.setFontSize(10);
                doc.text(`Assinado por: ${dadosAssinatura.nome} (Matrícula: ${dadosAssinatura.matricula})`, 14, y + 8);
                doc.addImage(dadosAssinatura.imgData, 'PNG', 14, y + 10, 60, 25);
                y += 40;
            });

            // Salvar PDF (trigger download)
            const fileName = `Relatorio_Checklist_${new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);

            notify.success('PDF gerado e baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            notify.error('Erro ao gerar PDF. Verifique o console para detalhes.');
        }
    }

    /**
     * Obtém configuração de colunas para PDF baseado no tipo
     */
    getPDFColumnsConfig(tipo) {
        const { PDF_COLUMNS_CONFIG } = window;
        return PDF_COLUMNS_CONFIG?.[tipo] || {
            columns: ["Setor", "Local", "Observações"],
            fields: ['setor', 'local', 'observacoes']
        };
    }

    /**
     * Constrói uma linha para a tabela do PDF
     */
    buildPDFRow(registro, fields) {
        return fields.map(field => {
            if (field === 'setor' || field === 'local') {
                return registro[field];
            } else if (field === 'observacoes') {
                return registro.observacoes || '';
            } else {
                return registro.itens[field] || '';
            }
        });
    }

    /**
     * Salva as últimas respostas do checklist
     */
    saveLastChecklistAnswers(itens) {
        StorageManager.save(STORAGE_KEYS.LAST_CHECKLIST_ANSWERS, itens);
    }

    /**
     * Carrega as últimas respostas do checklist
     */
    loadLastChecklistAnswers() {
        return StorageManager.load(STORAGE_KEYS.LAST_CHECKLIST_ANSWERS, null);
    }

    /**
     * Alterna o modo de auto-fill
     */
    toggleAutoFill() {
        this.autoFillEnabled = !this.autoFillEnabled;
        StorageManager.save(STORAGE_KEYS.AUTO_FILL_ENABLED, this.autoFillEnabled);

        if (this.autoFillEnabled) {
            notify.success('✨ Auto-preenchimento ativado');
        } else {
            notify.info('Auto-preenchimento desativado');
        }
    }

    /**
     * Reseta o checklist
     */
    resetarChecklist() {
        if (!confirm('Tem certeza que deseja resetar todo o checklist? Todos os dados serão perdidos!')) {
            return;
        }

        this.dataManager.clearAll();
        StorageManager.clear();
        notify.info('Checklist resetado. Recarregando página...');

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.checklistApp = new ChecklistApp();
});
