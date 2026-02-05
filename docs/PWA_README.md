# 📱 Checklist Hospitalar - PWA (Progressive Web App)

## O que é uma PWA?

Uma Progressive Web App (PWA) é um aplicativo web que usa tecnologias modernas para oferecer uma experiência similar à de aplicativos nativos. Nosso Checklist Hospitalar agora é uma PWA completa!

## ✨ Recursos da PWA

### 1. **Instalável** 📥
- Instale no seu smartphone, tablet ou desktop
- Ícone na tela inicial como um app nativo
- Acesso rápido sem precisar abrir navegador

### 2. **Funciona Offline** 🔌
- Use o aplicativo sem conexão com internet
- Todos os dados são sincronizados quando voltar online
- Nenhum dado será perdido

### 3. **Carregamento Rápido** ⚡
- Carregamento instantâneo após primeira visita
- Cache inteligente de recursos
- Service Worker otimizado

### 4. **Notificações Push** 🔔
- Receba notificações sobre tarefas pendentes
- Lembrete de checklists não finalizados

### 5. **Responsiva** 📱
- Funciona perfeitamente em qualquer dispositivo
- Interface adaptativa para mobile, tablet e desktop

## 🚀 Como Instalar

### Em Android (Chrome, Edge)
1. Abra o aplicativo no navegador
2. Clique no menu (⋮) → "Instalar app"
3. Confirme a instalação
4. O app aparecerá na sua tela inicial

### Em iOS (Safari)
1. Abra o aplicativo no Safari
2. Clique no ícone Compartilhar
3. Selecione "Adicionar à Tela Inicial"
4. O app será adicionado à sua tela inicial

### Em Desktop (Windows/Mac)
1. Abra o aplicativo no Chrome/Edge
2. Clique no ícone "Instalar" na barra de endereço
3. Clique em "Instalar"
4. O app abrirá em sua própria janela

## 🛠️ Arquivos PWA

### manifest.json
Define metadados do aplicativo:
- Nome, descrição e ícones
- Cores de tema e background
- Atalhos do app
- Screenshots

### sw.js (Service Worker)
Gerencia:
- Cache de arquivos estáticos
- Sincronização offline
- Notificações push
- Atualização automática

### .htaccess
Configurações de servidor:
- Cache control otimizado
- Headers de segurança
- Compressão de recursos
- Roteamento para SPA

## 💾 Armazenamento de Dados

Todos os dados são salvos localmente:
- **localStorage**: Configurações e preferências
- **IndexedDB**: Dados de checklists (através do DataManager)
- Sincronização automática entre abas

## 📊 Monitoramento

O Service Worker é registrado e monitorado:
- Log de sucesso/erro na console
- Verificação automática de atualizações
- Detecção de modo standalone

## 🔒 Segurança

Implementações de segurança:
- HTTPS obrigatório em produção
- Headers de segurança configurados
- Validação de requisições
- Proteção contra ataques XSS e CSRF

## 📈 Performance

Otimizações implementadas:
- Compressão GZIP
- Cache com versionamento
- Lazy loading de recursos
- Service Worker em thread separada

## 🔄 Atualizações

O aplicativo verifica atualizações automaticamente:
- A cada 60 segundos
- Ao recarregar
- Sincronização em background

Quando há atualização disponível, o usuário é notificado.

## 📲 Atalhos do App

Atalhos rápidos disponíveis ao pressionar e segurar o ícone:
- **Novo Checklist**: Abre diretamente para novo checklist
- **Visualizar Checklists**: Acessa lista de checklists salvos

## 🌐 Compatibilidade

| Navegador | Desktop | Mobile | Status |
|-----------|---------|--------|--------|
| Chrome    | ✅ Full | ✅ Full | Suportado |
| Edge      | ✅ Full | ✅ Full | Suportado |
| Firefox   | ✅ Parcial | ✅ Parcial | Suportado |
| Safari    | ⚠️ Limitado | ⚠️ Limitado | Suportado (iOS 11.3+) |
| Opera     | ✅ Full | ✅ Full | Suportado |

## 🐛 Troubleshooting

### Aplicativo não instala
- Verifique se está usando HTTPS
- Limpe cache do navegador
- Tente em incognito/privado

### Dados não sincronizam
- Verifique conexão com internet
- Reabra o aplicativo
- Limpe cache do Service Worker

### Ícone não aparece
- Aguarde 30 segundos após abrir
- Atualize a página
- Teste em navegador diferente

## 📚 Recursos Adicionais

- [PWA Checklist](https://www.pwabuilder.com/)
- [Google PWA Documentation](https://developers.google.com/web/progressive-web-apps)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 📞 Suporte

Para problemas:
1. Verifique o console do navegador (F12)
2. Limpe dados do site (Configurações → Privacidade)
3. Reinstale o aplicativo
4. Entre em contato com o suporte técnico

---

**Versão PWA**: 1.0  
**Última atualização**: 29 de janeiro de 2026  
**Desenvolvido por**: Hospital Teresa de Lisieux - TI
