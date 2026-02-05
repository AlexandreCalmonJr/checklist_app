/**
 * CONFIG MANAGER - Gerenciamento de configurações via API
 * Hospital Teresa de Lisieux - Checklist App
 */

import { authManager } from './authManager.js';

class ConfigManager {
    constructor() {
        this.cache = {};
    }

    /**
     * Generic GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `/config/${endpoint}${queryString ? '?' + queryString : ''}`;

        const response = await authManager.apiRequest(url);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao carregar dados');
        }
        return response.json();
    }

    /**
     * Generic POST request
     */
    async create(endpoint, data) {
        const response = await authManager.apiRequest(`/config/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar');
        }
        return response.json();
    }

    /**
     * Generic PUT request
     */
    async update(endpoint, id, data) {
        const response = await authManager.apiRequest(`/config/${endpoint}?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar');
        }
        return response.json();
    }

    /**
     * Generic DELETE request
     */
    async delete(endpoint, id) {
        const response = await authManager.apiRequest(`/config/${endpoint}?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar');
        }
        return response.json();
    }

    // === UNIDADES ===
    async getUnidades() {
        return this.get('unidades');
    }

    async createUnidade(data) {
        return this.create('unidades', data);
    }

    async updateUnidade(id, data) {
        return this.update('unidades', id, data);
    }

    async deleteUnidade(id) {
        return this.delete('unidades', id);
    }

    // === TÉCNICOS ===
    async getTecnicos() {
        return this.get('tecnicos');
    }

    async createTecnico(data) {
        return this.create('tecnicos', data);
    }

    async updateTecnico(id, data) {
        return this.update('tecnicos', id, data);
    }

    async deleteTecnico(id) {
        return this.delete('tecnicos', id);
    }

    // === RESPONSÁVEIS ===
    async getResponsaveis() {
        return this.get('responsaveis');
    }

    async createResponsavel(data) {
        return this.create('responsaveis', data);
    }

    async updateResponsavel(id, data) {
        return this.update('responsaveis', id, data);
    }

    async deleteResponsavel(id) {
        return this.delete('responsaveis', id);
    }

    // === TIPOS DE CHECKLIST ===
    async getTipos() {
        return this.get('tipos');
    }

    async createTipo(data) {
        return this.create('tipos', data);
    }

    async updateTipo(id, data) {
        return this.update('tipos', id, data);
    }

    async deleteTipo(id) {
        return this.delete('tipos', id);
    }

    // === LOCAIS ===
    async getLocais(tipoChecklist = null) {
        const params = tipoChecklist ? { tipo: tipoChecklist } : {};
        return this.get('locais', params);
    }

    async createLocal(data) {
        return this.create('locais', data);
    }

    async updateLocal(id, data) {
        return this.update('locais', id, data);
    }

    async deleteLocal(id) {
        return this.delete('locais', id);
    }

    // === ITENS DE CONFIGURAÇÃO ===
    async getItens(tipoChecklist = null) {
        const params = tipoChecklist ? { tipo: tipoChecklist } : {};
        return this.get('itens', params);
    }

    async createItem(data) {
        return this.create('itens', data);
    }

    async updateItem(id, data) {
        return this.update('itens', id, data);
    }

    async deleteItem(id) {
        return this.delete('itens', id);
    }
}

// Export singleton instance
export const configManager = new ConfigManager();
export { ConfigManager };
