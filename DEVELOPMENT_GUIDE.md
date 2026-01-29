# 🛠️ Guia de Desenvolvimento - Checklist Hospitalar PWA

## Setup Inicial

### 1. Clonar repositório
```bash
git clone https://github.com/AlexandreCalmonJr/checklist_app.git
cd checklist_app
```

### 2. Iniciar servidor local
```bash
# Opção 1: Python (mais simples)
python -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000 -c-1

# Opção 3: Docker
docker-compose up -d
```

### 3. Acessar aplicação
Abra: http://localhost:8000

---

## Estrutura do Projeto

```
checklist_app/
├── index.html                 # Página principal
├── exibir_checklists.html    # Página de visualização
├── app.js                     # Aplicação principal (ES6 modules)
├── script.js                  # Scripts adicionais
│
├── styles.css                 # Estilos
├── manifest.json              # PWA Manifest
├── sw.js                      # Service Worker
│
├── modules/                   # Módulos JS
│   ├── dataManager.js        # Gerenciamento de dados
│   ├── notificationManager.js # Notificações
│   └── themeManager.js       # Tema (claro/escuro)
│
├── utils/                     # Utilitários
│   ├── constants.js          # Constantes e configurações
│   ├── helpers.js            # Funções auxiliares
│   └── storage.js            # Gerenciamento de storage
│
├── assets/                    # Arquivos estáticos
│   └── icons/               # Ícones
│
├── docs/                      # Documentação
│
└── .htaccess                 # Configuração Apache
├── web.config                # Configuração IIS
├── nginx.conf                # Configuração Nginx
├── Dockerfile                # Container Docker
├── docker-compose.yml        # Docker Compose
├── .gitignore               # Git ignore
└── README.md                # Documentação principal
```

---

## Desenvolvimento

### Tecnologias Usadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6 modules)
- **Storage**: localStorage, IndexedDB
- **APIs**: Service Workers, Notification API
- **Ferramentas**: PWA Builder, Chrome DevTools

### Adicionar Novo Módulo

#### 1. Criar arquivo em `modules/meuModulo.js`
```javascript
/**
 * Meu Módulo - Descrição
 */

export class MeuModulo {
    constructor() {
        this.propriedade = 'valor';
    }

    metodo() {
        console.log('Metodo chamado');
    }
}
```

#### 2. Importar em `app.js`
```javascript
import { MeuModulo } from './modules/meuModulo.js';

// Na classe ChecklistApp constructor
this.meuModulo = new MeuModulo();
```

### Adicionar Nova Constante

Editar `utils/constants.js`:
```javascript
export const MINHA_CONSTANTE = [
    // dados aqui
];
```

### Adicionar Nova Unidade/Hospital

Em `utils/constants.js`:
```javascript
export const UNIDADES = [
    { id: "hteresa", nome: "Hospital Teresa de Lisieux", sigla: "HTL" },
    { id: "novo", nome: "Novo Hospital", sigla: "NH" }  // NOVO
];
```

### Adicionar Novo Tipo de Checklist

Em `utils/constants.js`:
```javascript
// 1. Adicionar locais/setores
export const LOCAIS_POR_TIPO = {
    // ...existentes...
    novoTipo: {
        "Setor 1": [
            criarLocal("Local 1", RESPONSAVEIS.ATENDIMENTO),
            criarLocal("Local 2", RESPONSAVEIS.ENFERMAGEM)
        ]
    }
};

// 2. Adicionar itens/checklist
export const ITENS_CONFIG = {
    // ...existentes...
    novoTipo: [
        { label: "Item 1", name: "item_1", options: ["Sim", "Não"] },
        { label: "Item 2", name: "item_2", options: ["Ok", "Problema"] }
    ]
};

// 3. Adicionar configuração PDF (se necessário)
export const PDF_COLUMNS_CONFIG = {
    // ...existentes...
    novoTipo: {
        columns: ["Setor", "Local", "Item 1", "Item 2", "Observações"],
        fields: ['setor', 'local', 'item_1', 'item_2', 'observacoes']
    }
};

// 4. Adicionar ao TIPOS_CHECKLIST
export const TIPOS_CHECKLIST = {
    // ...existentes...
    novoTipo: "Novo Tipo"
};
```

---

## Depuração

### Console do Navegador
```javascript
// F12 → Console

// Verificar Service Worker
navigator.serviceWorker.getRegistrations()
    .then(regs => console.log(regs))

// Verificar localStorage
localStorage.getItem('salasVisitadas')
localStorage.getItem('registrosChecklist')

// Limpar tudo
localStorage.clear()
sessionStorage.clear()
```

### DevTools - Abas Úteis
- **Application** → Service Workers
- **Application** → Manifest
- **Application** → Cache Storage
- **Network** → Offline (simular)
- **Console** → Erros e logs

### Simular Offline
1. DevTools (F12)
2. Network tab
3. "Offline" checkbox (ou dropdown "Throttling")

### Limpar PWA
```javascript
// No console
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(reg => reg.unregister());
        });
}
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});
localStorage.clear();
```

---

## Testes

### Teste Manual de PWA
- [ ] Abrir em navegador
- [ ] Deve exibir opção "Instalar app"
- [ ] Instalar e verificar ícone
- [ ] Abrir aplicativo
- [ ] Desativar Wi-Fi/internet
- [ ] Funciona offline?
- [ ] Formulários funcionam?
- [ ] Dados persistem?
- [ ] Reconecta ao online?

### Teste de Performance
```bash
# Lighthouse (Chrome)
1. DevTools (F12)
2. Lighthouse tab
3. Generate report

# Critérios PWA
- ✅ HTTPS
- ✅ Responsive
- ✅ Manifest
- ✅ Service Worker
- ✅ Icons
```

### Teste em Diferentes Navegadores
- ✅ Chrome/Edge (melhor suporte)
- ✅ Firefox (bom suporte)
- ⚠️ Safari iOS (suporte limitado)
- ⚠️ Opera (bom suporte)

---

## Builds e Deployment

### Build para Produção
```bash
# Verificar se todos arquivos estão otimizados
# 1. Minificar CSS (opcional)
# 2. Minificar JS (opcional)
# 3. Otimizar imagens
# 4. Verificar Service Worker
```

### Versionamento do Service Worker
```javascript
// Em sw.js, alterar quando há mudança
const CACHE_NAME = 'checklist-app-v2';  // Incrementar versão
```

### Deploy com Git
```bash
git add .
git commit -m "feat: adicionar novo recurso"
git push origin main
```

### Deploy com Docker
```bash
# Build
docker build -t checklist-app:latest .

# Push (se usando registry)
docker tag checklist-app:latest seu-registry/checklist-app:latest
docker push seu-registry/checklist-app:latest

# Pull e run
docker pull seu-registry/checklist-app:latest
docker run -d -p 80:80 seu-registry/checklist-app:latest
```

---

## Otimizações

### Performance
- Service Worker cacheia arquivos estáticos
- Lazy loading de recursos externos
- Compressão Gzip ativada
- Minimizar requisições HTTP

### SEO
- Meta tags descritivas
- Title e descrição
- Estrutura HTML semântica
- Open Graph tags (opcional)

### Acessibilidade
- Labels em inputs
- ARIA labels onde necessário
- Contraste de cores adequado
- Navegação por teclado

### Segurança
- HTTPS obrigatório em produção
- Headers de segurança configurados
- Validação de entrada de dados
- Proteção contra XSS

---

## Problemas Comuns

### Service Worker não atualiza
**Solução**: Incrementar versão do CACHE_NAME em sw.js

### Dados não persistem
**Solução**: Verificar se localStorage está habilitado

### CORS error
**Solução**: Verificar domínio origem, usar HTTPS

### PWA não instala
**Solução**: Certificar HTTPS, manifest.json acessível, ícones válidos

---

## Recursos Úteis

### Documentação
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google PWA](https://developers.google.com/web/progressive-web-apps)
- [Web.dev](https://web.dev/)

### Ferramentas
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Comunidade
- Stack Overflow `pwa` tag
- GitHub discussions
- Dev.to artigos

---

## Checklist de Desenvolvimento

- [ ] Feature implementada
- [ ] Testado offline
- [ ] Testado em mobile
- [ ] Cache configurado
- [ ] Sem erros no console
- [ ] Performance OK
- [ ] Acessibilidade checada
- [ ] Documentação atualizada
- [ ] Commit com mensagem clara
- [ ] Push para main

---

**Atualizado**: 29 de janeiro de 2026  
**Versão**: 1.0  
**Desenvolvedor**: [Seu Nome]
