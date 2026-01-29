# 🏥 Checklist Hospitalar - Hospital Teresa de Lisieux

Sistema moderno e completo para gerenciamento de checklists de manutenção e verificação hospitalar.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Funcionalidades

### Core
- ✅ **Múltiplos tipos de checklist**: Centro Cirúrgico, Racks, Emergência, Totens e Painéis
- ✅ **Gestão de salas**: Rastreamento de salas visitadas e pendentes
- ✅ **Assinaturas digitais**: Coleta de assinaturas dos responsáveis por setor
- ✅ **Geração de PDF**: Relatórios completos com todas as verificações e assinaturas
- ✅ **Persistência local**: Dados salvos automaticamente no navegador

### Melhorias v2.0
- 🎨 **Design System moderno**: Interface premium com gradientes e animações
- 🌓 **Tema claro/escuro**: Alternância automática com preferência do sistema
- 📊 **Barra de progresso**: Visualização do andamento do checklist
- 🔔 **Notificações toast**: Feedback visual elegante para ações
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🧩 **Arquitetura modular**: Código organizado em módulos ES6
- 💾 **Backup/Restore**: Exportação e importação de dados
- 📈 **Estatísticas**: Dashboard com métricas e análises

## 🚀 Como Usar

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge)
3. Pronto! Não requer instalação ou servidor

### Fluxo de Trabalho

1. **Selecione o tipo de checklist** (Centro Cirúrgico, Racks, Emergência, ou Totens)
2. **Preencha os dados básicos**: Data, técnico responsável, número do chamado
3. **Escolha setor e local** a ser verificado
4. **Complete os itens do checklist** marcando cada verificação
5. **Adicione observações** se necessário
6. **Salve a sala** e continue para a próxima
7. **Finalize o checklist** quando terminar todas as salas
8. **Colete assinaturas** dos responsáveis por cada setor
9. **Gere o PDF** com o relatório completo

## 📁 Estrutura do Projeto

```
checklist_app/
├── index.html              # Página principal
├── app.js                  # Aplicação principal (entry point)
├── styles.css              # Design system completo
├── logo.png                # Logo do hospital
├── modules/                # Módulos da aplicação
│   ├── themeManager.js     # Gerenciamento de temas
│   ├── notificationManager.js  # Sistema de notificações
│   └── dataManager.js      # Gerenciamento de dados
├── utils/                  # Utilitários
│   ├── constants.js        # Constantes e configurações
│   ├── storage.js          # Gerenciamento de localStorage
│   └── helpers.js          # Funções auxiliares
├── assets/                 # Recursos
│   └── icons/              # Ícones SVG
└── docs/                   # Documentação
    └── README.md           # Este arquivo
```

## 🎨 Design System

### Cores
- **Primary**: Azul (#1e40af) - Ações principais
- **Secondary**: Roxo (#7c3aed) - Ações secundárias
- **Success**: Verde (#10b981) - Confirmações
- **Danger**: Vermelho (#ef4444) - Ações destrutivas
- **Warning**: Amarelo (#f59e0b) - Avisos

### Componentes
- Botões com animações e efeitos hover
- Formulários com validação visual
- Cards com sombras e elevação
- Badges para tags e status
- Toast notifications
- Progress bars
- Theme toggle

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design system com variáveis CSS
- **JavaScript ES6+**: Módulos, classes, async/await
- **jsPDF**: Geração de PDFs
- **localStorage**: Persistência de dados

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando `localStorage`:

- `salasVisitadas`: Lista de salas já verificadas
- `registrosChecklist`: Todos os registros de checklist
- `theme`: Preferência de tema (claro/escuro)
- `checklistBackup`: Backup automático dos dados

### Backup Manual

Para fazer backup dos dados:
1. Abra o console do navegador (F12)
2. Execute: `StorageManager.exportBackup()`
3. Um arquivo JSON será baixado

Para restaurar:
1. Use a função de importação (em desenvolvimento)

## 🌐 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

## 📝 Tipos de Checklist

### Centro Cirúrgico
- Sistema Hospitalar/SIGA
- Sistema Arya
- Impressão
- Leitor de Digital
- Acesso Remoto
- Wi-Fi

### Racks
- Nobreak
- Limpeza
- Organização de Cabos
- Material em Sala
- Forros
- Pintura
- Iluminação
- Ar Condicionado

### Emergência
- Navegador Atualizado
- Sistema SAMWEB
- Sistema Arya
- Impressão
- NDD
- Leitor de Digital
- Telefonia
- Acesso Remoto
- Wi-Fi

### Totens e Painéis
- Versão Java
- Captura BIO V9
- Navegador Configurado
- Tela Cheia
- Autômatos
- Leitor Biométrico
- Touchscreen
- Estrutura do Móvel
- Internet
- Impressora Laser
- Impressora Térmica
- Cabeamento
- Teclado de Senha

## 🎯 Roadmap

### Versão 2.1 (Próxima)
- [ ] Dashboard com estatísticas e gráficos
- [ ] Sistema de busca e filtros
- [ ] Exportação para Excel/CSV
- [ ] Histórico de checklists anteriores

### Versão 2.2
- [ ] Modo offline completo com Service Worker
- [ ] Sincronização com Google Drive
- [ ] Comparação entre períodos
- [ ] Relatórios customizáveis

### Versão 3.0
- [ ] Backend com Node.js
- [ ] Banco de dados PostgreSQL
- [ ] API REST
- [ ] Autenticação de usuários
- [ ] Multi-tenancy

## 👥 Equipe de TI

- Alexandre Calmon
- Alexandre Pinho
- Anderson Conceição
- Adilson Santos
- Carlos Alan
- Flavio Torres
- Ramon Silva
- Rodrigo Costa
- Vitor Everton
- Elicledson Pereira

## 📄 Licença

Este projeto é de propriedade do Hospital Teresa de Lisieux.

## 🤝 Contribuindo

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de TI do hospital.

---

**Desenvolvido com ❤️ pela equipe de TI do Hospital Teresa de Lisieux**
