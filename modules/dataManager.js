/**
 * DATA MANAGER - Gerenciamento de dados do checklist
 * Hospital Teresa de Lisieux - Checklist App
 */

import { StorageManager } from '../utils/storage.js';
import { STORAGE_KEYS, LOCAIS_POR_TIPO } from '../utils/constants.js';
import { groupBy } from '../utils/helpers.js';

export class DataManager {
    constructor() {
        this.salasVisitadas = [];
        this.registrosChecklist = [];
        this.salasDisponiveis = [];
        this.loadData();
    }

    /**
     * Carrega dados do localStorage
     */
    loadData() {
        this.salasVisitadas = StorageManager.load(STORAGE_KEYS.SALAS_VISITADAS, []);
        this.registrosChecklist = StorageManager.load(STORAGE_KEYS.REGISTROS_CHECKLIST, []);
    }

    /**
     * Salva dados no localStorage
     */
    saveData() {
        StorageManager.save(STORAGE_KEYS.SALAS_VISITADAS, this.salasVisitadas);
        StorageManager.save(STORAGE_KEYS.REGISTROS_CHECKLIST, this.registrosChecklist);
    }

    /**
     * Adiciona uma sala visitada
     * @param {string} local - Nome do local
     */
    addSalaVisitada(local) {
        if (!this.salasVisitadas.includes(local)) {
            this.salasVisitadas.push(local);
            this.saveData();
        }
    }

    /**
     * Remove uma sala visitada
     * @param {string} local - Nome do local
     */
    removeSalaVisitada(local) {
        this.salasVisitadas = this.salasVisitadas.filter(s => s !== local);
        this.saveData();
    }

    /**
     * Verifica se uma sala foi visitada
     * @param {string} local - Nome do local
     * @returns {boolean}
     */
    isSalaVisitada(local) {
        return this.salasVisitadas.includes(local);
    }

    /**
     * Obtém salas disponíveis (não visitadas) para um tipo e setor
     * @param {string} tipo - Tipo de checklist
     * @param {string} setor - Setor
     * @returns {Array} Array de salas disponíveis
     */
    getSalasDisponiveis(tipo, setor) {
        const locaisDoSetor = (LOCAIS_POR_TIPO[tipo] || {})[setor] || [];
        return locaisDoSetor.filter(item => !this.salasVisitadas.includes(item.local));
    }

    /**
     * Adiciona ou atualiza um registro de checklist
     * @param {Object} registro - Dados do registro
     * @returns {boolean} Sucesso da operação
     */
    saveRegistro(registro) {
        try {
            const index = this.registrosChecklist.findIndex(r => r.local === registro.local);

            if (index !== -1) {
                this.registrosChecklist[index] = registro;
            } else {
                this.registrosChecklist.push(registro);
            }

            this.saveData();
            return true;
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            return false;
        }
    }

    /**
     * Obtém um registro por local
     * @param {string} local - Nome do local
     * @returns {Object|null} Registro encontrado ou null
     */
    getRegistro(local) {
        return this.registrosChecklist.find(r => r.local === local) || null;
    }

    /**
     * Remove um registro
     * @param {string} local - Nome do local
     * @returns {boolean} Sucesso da operação
     */
    removeRegistro(local) {
        this.registrosChecklist = this.registrosChecklist.filter(r => r.local !== local);
        this.saveData();
        return true;
    }

    /**
     * Obtém todos os registros
     * @returns {Array} Array de registros
     */
    getAllRegistros() {
        return this.registrosChecklist;
    }

    /**
     * Obtém registros agrupados por responsável
     * @returns {Object} Registros agrupados
     */
    getRegistrosPorResponsavel() {
        return groupBy(this.registrosChecklist, 'responsavel');
    }

    /**
     * Obtém registros filtrados
     * @param {Object} filters - Filtros {tecnico, setor, data, etc}
     * @returns {Array} Registros filtrados
     */
    getRegistrosFiltrados(filters = {}) {
        return this.registrosChecklist.filter(registro => {
            for (let key in filters) {
                if (filters[key] && registro[key] !== filters[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Obtém estatísticas dos checklists
     * @returns {Object} Objeto com estatísticas
     */
    getEstatisticas() {
        const total = this.registrosChecklist.length;
        const salasVisitadasCount = this.salasVisitadas.length;

        // Agrupa por técnico
        const porTecnico = groupBy(this.registrosChecklist, 'tecnico');

        // Agrupa por setor
        const porSetor = groupBy(this.registrosChecklist, 'setor');

        // Agrupa por tipo
        const porTipo = groupBy(this.registrosChecklist, 'tipoChecklist');

        // Conta problemas (itens com "Não")
        let totalProblemas = 0;
        this.registrosChecklist.forEach(registro => {
            Object.values(registro.itens || {}).forEach(valor => {
                if (valor === 'Não') totalProblemas++;
            });
        });

        return {
            total,
            salasVisitadas: salasVisitadasCount,
            porTecnico,
            porSetor,
            porTipo,
            totalProblemas,
            taxaConformidade: total > 0 ?
                ((total * Object.keys(this.registrosChecklist[0]?.itens || {}).length - totalProblemas) /
                    (total * Object.keys(this.registrosChecklist[0]?.itens || {}).length) * 100).toFixed(2) : 0
        };
    }

    /**
     * Obtém responsáveis únicos envolvidos
     * @returns {Array} Array de responsáveis
     */
    getResponsaveisEnvolvidos() {
        return [...new Set(this.registrosChecklist.map(r => r.responsavel))];
    }

    /**
     * Limpa todos os dados
     */
    clearAll() {
        this.salasVisitadas = [];
        this.registrosChecklist = [];
        this.saveData();
    }

    /**
     * Exporta dados como JSON
     * @returns {Object} Dados exportados
     */
    exportData() {
        return {
            salasVisitadas: this.salasVisitadas,
            registrosChecklist: this.registrosChecklist,
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Importa dados de um objeto
     * @param {Object} data - Dados a importar
     * @returns {boolean} Sucesso da operação
     */
    importData(data) {
        try {
            if (data.salasVisitadas) {
                this.salasVisitadas = data.salasVisitadas;
            }
            if (data.registrosChecklist) {
                this.registrosChecklist = data.registrosChecklist;
            }
            this.saveData();
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }

    /**
     * Valida um registro antes de salvar
     * @param {Object} registro - Registro a validar
     * @returns {Object} {valid: boolean, errors: Array}
     */
    validateRegistro(registro) {
        const errors = [];

        if (!registro.tipoChecklist) {
            errors.push('Tipo de checklist é obrigatório');
        }

        if (!registro.data) {
            errors.push('Data é obrigatória');
        }

        if (!registro.tecnico) {
            errors.push('Técnico é obrigatório');
        }

        if (!registro.setor) {
            errors.push('Setor é obrigatório');
        }

        if (!registro.local) {
            errors.push('Local é obrigatório');
        }

        if (!registro.itens || Object.keys(registro.itens).length === 0) {
            errors.push('Itens do checklist são obrigatórios');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
