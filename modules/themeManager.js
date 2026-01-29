/**
 * THEME MANAGER - Gerenciamento de tema claro/escuro
 * Hospital Teresa de Lisieux - Checklist App
 */

import { StorageManager } from '../utils/storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export class ThemeManager {
    constructor() {
        this.currentTheme = StorageManager.load(STORAGE_KEYS.THEME, 'light');
        this.toggleButton = null;
    }

    /**
     * Inicializa o gerenciador de tema
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.setupEventListeners();
    }

    /**
     * Aplica um tema
     * @param {string} theme - 'light' ou 'dark'
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        StorageManager.save(STORAGE_KEYS.THEME, theme);

        // Atualiza o ícone do botão
        if (this.toggleButton) {
            this.updateToggleIcon();
        }
    }

    /**
     * Alterna entre temas
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    /**
     * Cria o botão de alternância de tema
     */
    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'theme-toggle';
        this.toggleButton.setAttribute('aria-label', 'Alternar tema');
        this.toggleButton.setAttribute('title', 'Alternar tema claro/escuro');

        this.updateToggleIcon();

        document.body.appendChild(this.toggleButton);
    }

    /**
     * Atualiza o ícone do botão de tema
     */
    updateToggleIcon() {
        const icon = this.currentTheme === 'light'
            ? this.getSunIcon()
            : this.getMoonIcon();

        this.toggleButton.innerHTML = icon;
    }

    /**
     * Retorna o ícone do sol (tema claro)
     */
    getSunIcon() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
    }

    /**
     * Retorna o ícone da lua (tema escuro)
     */
    getMoonIcon() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }

        // Detecta preferência do sistema
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Se não houver tema salvo, usa a preferência do sistema
            if (!StorageManager.load(STORAGE_KEYS.THEME)) {
                this.applyTheme(darkModeQuery.matches ? 'dark' : 'light');
            }

            // Escuta mudanças na preferência do sistema
            darkModeQuery.addEventListener('change', (e) => {
                if (!StorageManager.load(STORAGE_KEYS.THEME)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Obtém o tema atual
     * @returns {string} Tema atual
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
}
