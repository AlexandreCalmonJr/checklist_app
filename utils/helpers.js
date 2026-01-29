/**
 * HELPERS - Funções utilitárias gerais
 * Hospital Teresa de Lisieux - Checklist App
 */

/**
 * Formata uma data para o padrão brasileiro (dd/mm/yyyy)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDate(date) {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Formata uma data no formato yyyy-mm-dd para input date
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDateForInput(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Debounce - Atrasa a execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - Limita a frequência de execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} Função com throttle
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Gera um ID único
 * @returns {string} ID único
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitiza uma string para uso como ID HTML
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export function sanitizeId(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

/**
 * Verifica se um canvas está vazio
 * @param {HTMLCanvasElement} canvas - Canvas a ser verificado
 * @returns {boolean} True se vazio
 */
export function isCanvasEmpty(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data.every(pixel => pixel === 0);
}

/**
 * Limpa um canvas
 * @param {HTMLCanvasElement} canvas - Canvas a ser limpo
 */
export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Calcula a porcentagem de progresso
 * @param {number} current - Valor atual
 * @param {number} total - Valor total
 * @returns {number} Porcentagem (0-100)
 */
export function calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
}

/**
 * Agrupa um array por uma propriedade
 * @param {Array} array - Array a ser agrupado
 * @param {string} key - Chave para agrupar
 * @returns {Object} Objeto agrupado
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Remove duplicatas de um array
 * @param {Array} array - Array com possíveis duplicatas
 * @returns {Array} Array sem duplicatas
 */
export function removeDuplicates(array) {
    return [...new Set(array)];
}

/**
 * Ordena um array de objetos por uma propriedade
 * @param {Array} array - Array a ser ordenado
 * @param {string} key - Chave para ordenar
 * @param {string} order - 'asc' ou 'desc'
 * @returns {Array} Array ordenado
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Filtra um array de objetos por múltiplos critérios
 * @param {Array} array - Array a ser filtrado
 * @param {Object} filters - Objeto com filtros {key: value}
 * @returns {Array} Array filtrado
 */
export function filterBy(array, filters) {
    return array.filter(item => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            if (!filterValue) return true;

            const itemValue = item[key];
            if (typeof itemValue === 'string') {
                return itemValue.toLowerCase().includes(filterValue.toLowerCase());
            }
            return itemValue === filterValue;
        });
    });
}

/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Erro ao copiar:', error);
        return false;
    }
}

/**
 * Download de arquivo
 * @param {string} content - Conteúdo do arquivo
 * @param {string} filename - Nome do arquivo
 * @param {string} mimeType - Tipo MIME
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Valida um email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Trunca um texto
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncate(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Capitaliza a primeira letra
 * @param {string} str - String a ser capitalizada
 * @returns {string} String capitalizada
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Espera um tempo determinado
 * @param {number} ms - Milissegundos para esperar
 * @returns {Promise} Promise que resolve após o tempo
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
