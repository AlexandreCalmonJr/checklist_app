/**
 * STORAGE - Gerenciamento de localStorage com compressão e backup
 * Hospital Teresa de Lisieux - Checklist App
 */

import { STORAGE_KEYS } from './constants.js';

/**
 * Classe para gerenciar o armazenamento local
 */
export class StorageManager {
    /**
     * Salva dados no localStorage
     * @param {string} key - Chave do armazenamento
     * @param {*} data - Dados a serem salvos
     */
    static save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar ${key}:`, error);
            return false;
        }
    }

    /**
     * Carrega dados do localStorage
     * @param {string} key - Chave do armazenamento
     * @param {*} defaultValue - Valor padrão se não existir
     * @returns {*} Dados carregados ou valor padrão
     */
    static load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Erro ao carregar ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Remove dados do localStorage
     * @param {string} key - Chave do armazenamento
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erro ao remover ${key}:`, error);
            return false;
        }
    }

    /**
     * Limpa todo o localStorage
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    /**
     * Cria um backup completo dos dados
     * @returns {Object} Objeto com todos os dados
     */
    static createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                salasVisitadas: this.load(STORAGE_KEYS.SALAS_VISITADAS, []),
                registrosChecklist: this.load(STORAGE_KEYS.REGISTROS_CHECKLIST, []),
                theme: this.load(STORAGE_KEYS.THEME, 'light')
            }
        };

        // Salva o backup também no localStorage
        this.save(STORAGE_KEYS.BACKUP, backup);

        return backup;
    }

    /**
     * Restaura dados de um backup
     * @param {Object} backup - Objeto de backup
     * @returns {boolean} Sucesso da operação
     */
    static restoreBackup(backup) {
        try {
            if (!backup || !backup.data) {
                throw new Error('Backup inválido');
            }

            this.save(STORAGE_KEYS.SALAS_VISITADAS, backup.data.salasVisitadas || []);
            this.save(STORAGE_KEYS.REGISTROS_CHECKLIST, backup.data.registrosChecklist || []);
            this.save(STORAGE_KEYS.THEME, backup.data.theme || 'light');

            return true;
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return false;
        }
    }

    /**
     * Exporta backup como arquivo JSON
     */
    static exportBackup() {
        const backup = this.createBackup();
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `checklist-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Importa backup de um arquivo
     * @param {File} file - Arquivo de backup
     * @returns {Promise<boolean>} Sucesso da operação
     */
    static async importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    const success = this.restoreBackup(backup);
                    resolve(success);
                } catch (error) {
                    console.error('Erro ao importar backup:', error);
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Verifica o tamanho do armazenamento usado
     * @returns {Object} Informações sobre o uso de armazenamento
     */
    static getStorageInfo() {
        let totalSize = 0;
        const items = {};

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = localStorage[key].length * 2; // Aproximação em bytes
                items[key] = size;
                totalSize += size;
            }
        }

        return {
            totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            items,
            itemCount: Object.keys(items).length
        };
    }
}
