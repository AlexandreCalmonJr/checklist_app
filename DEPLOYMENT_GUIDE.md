# 🚀 Guia de Deployment - Checklist Hospitalar PWA

## Índice
1. [Deployment Local](#deployment-local)
2. [Deployment com Docker](#deployment-com-docker)
3. [Deployment em Servidor Linux](#deployment-em-servidor-linux)
4. [Deployment em IIS Windows](#deployment-em-iis-windows)
5. [Deployment em Hospedagem Compartilhada](#deployment-em-hospedagem-compartilhada)
6. [HTTPS/SSL](#httpssl)
7. [Troubleshooting](#troubleshooting)

---

## Deployment Local

### Requisitos
- Node.js 14+ (opcional, apenas se quiser servir com servidor)
- Python 3.x ou servidor web qualquer

### Opção 1: Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Acesse: http://localhost:8000

### Opção 2: Node.js (http-server)
```bash
# Instalar
npm install -g http-server

# Servir
http-server -p 8000 -c-1

# -c-1 desativa cache para desenvolvimento
```

Acesse: http://localhost:8000

---

## Deployment com Docker

### Requisitos
- Docker instalado
- Docker Compose (opcional)

### Passo 1: Build da imagem
```bash
docker build -t checklist-app:latest .
```

### Passo 2: Executar container
```bash
docker run -d \
  --name checklist-app \
  -p 80:80 \
  -p 443:443 \
  checklist-app:latest
```

### Passo 3: Com Docker Compose (mais fácil)
```bash
docker-compose up -d
```

### Verificar status
```bash
docker ps
docker logs checklist-app
```

### Parar container
```bash
docker-compose down
# ou
docker stop checklist-app
```

---

## Deployment em Servidor Linux (Ubuntu/Debian)

### Requisitos
- Ubuntu 20.04+ ou Debian 10+
- Acesso root/sudo
- HTTPS (recomendado)

### Passo 1: Preparar servidor
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Passo 2: Clonar/Transferir código
```bash
cd /var/www
sudo git clone <seu-repositorio> checklist-app
sudo chown -R www-data:www-data checklist-app
sudo chmod -R 755 checklist-app
```

### Passo 3: Configurar Nginx
```bash
sudo cp checklist-app/nginx.conf /etc/nginx/sites-available/checklist-app
sudo ln -s /etc/nginx/sites-available/checklist-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Editar configuração com seu domínio
sudo nano /etc/nginx/sites-available/checklist-app
# Altere: seu-dominio.com para seu domínio real
```

### Passo 4: Testar e reiniciar Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 5: HTTPS com Let's Encrypt (recomendado)
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Configurar SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Auto-renovação está configurada automaticamente
```

### Verificar HTTPS
```bash
curl -I https://seu-dominio.com
```

---

## Deployment em IIS Windows

### Requisitos
- Windows Server 2016+
- IIS 10.0+
- URL Rewrite module instalado

### Passo 1: Instalar URL Rewrite
1. Abrir IIS Manager
2. Server → Import Module... (se não estiver instalado)
3. Download em: https://www.iis.net/downloads/microsoft/url-rewrite

### Passo 2: Criar Site IIS
1. IIS Manager → Sites → Add Website
2. Site name: "Checklist App"
3. Physical path: C:\inetpub\checklist-app
4. Binding: seu-dominio.com
5. Port: 80 (ou 443 para HTTPS)

### Passo 3: Copiar arquivos
```powershell
Copy-Item -Path "C:\Users\...\checklist-app\*" `
          -Destination "C:\inetpub\checklist-app" `
          -Recurse -Force
```

### Passo 4: Configurar web.config
O arquivo web.config já está incluído. Verifique se está na raiz do site.

### Passo 5: Ajustar permissões
```powershell
# Dar permissão ao IIS
icacls "C:\inetpub\checklist-app" /grant "IIS_IUSRS:(OI)(CI)M" /T
```

### Passo 6: Teste
Acesse: http://seu-dominio.com

---

## Deployment em Hospedagem Compartilhada

### Requisitos
- FTP/SFTP ou painel de controle (cPanel, Plesk, etc)
- Suporte a arquivos .htaccess (se usando Apache)

### Passo 1: Preparar arquivos
- Certifique-se que .htaccess está incluído
- Verifique permissões: 644 para arquivos, 755 para diretórios

### Passo 2: Upload via FTP
```bash
# Usando SFTP (mais seguro)
sftp seu-usuario@seu-servidor.com
cd public_html
put -r checklist-app/* .
exit
```

### Passo 3: Configurar hospedagem
1. Aceder painel (cPanel, Plesk, etc)
2. File Manager → public_html
3. Verifique .htaccess:
   ```
   <Files ".htaccess">
     Order allow,deny
     Allow from all
   </Files>
   ```
4. Defina permissões (755)

### Passo 4: Ativar HTTPS
Geralmente disponível via Let's Encrypt no painel.

### Passo 5: Teste
Acesse: https://seu-dominio.com

---

## HTTPS/SSL

### Por que HTTPS é obrigatório para PWA?

**Service Workers ONLY funcionam em HTTPS** (ou localhost para desenvolvimento)

### Opções de SSL

#### 1. Let's Encrypt (GRATUITO - Recomendado)
```bash
# Linux
sudo certbot certonly --webroot -w /var/www/checklist-app -d seu-dominio.com

# Windows IIS - Use painel ou Certbot para Windows
```

#### 2. Certificado Pago
- GoDaddy, Namecheap, DigiCert, etc
- Geralmente $10-50/ano
- Mais suporte comercial

#### 3. Self-signed (apenas para teste)
```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365
```

### Renovação automática
```bash
# Linux - cron job automático
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar
sudo systemctl status certbot.timer
```

---

## Performance e SEO

### Checklist de Performance
- [ ] HTTPS ativado
- [ ] Gzip ativado
- [ ] Cache configurado
- [ ] Service Worker registrado
- [ ] Manifest.json acessível
- [ ] Ícones otimizados
- [ ] Core Web Vitals OK

### Testar Performance
```bash
# Lighthouse (Chrome)
1. F12 → Lighthouse
2. Mode: Navigation
3. Run audit

# PageSpeed Insights
https://pagespeed.web.dev/
```

### Testar PWA
```bash
# PWA Builder
https://www.pwabuilder.com/

# Web.dev
https://web.dev/measure/
```

---

## Monitoramento

### Logs em Linux/Docker
```bash
# Nginx
tail -f /var/log/nginx/checklist-access.log
tail -f /var/log/nginx/checklist-error.log

# Docker
docker logs -f checklist-app
```

### Logs em IIS Windows
```powershell
# Event Viewer
eventvwr.msc

# IIS Logs
C:\inetpub\logs\LogFiles\W3SVC1\
```

### Monitorar Service Worker
No navegador:
```javascript
// Console do navegador
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations))
```

---

## Troubleshooting

### Service Worker não registra
❌ **Problema**: HTTPS não configurado ou localhost não reconhecido
✅ **Solução**: 
- Certificado SSL válido
- Ou usar localhost para teste
- Limpar cache do navegador

### Arquivo não encontrado (404)
❌ **Problema**: .htaccess ou web.config não funciona
✅ **Solução**:
- Verificar URL rewrite ativado (IIS)
- Verificar .htaccess permissions (755)
- Testar: curl -I https://seu-dominio.com/seu-arquivo

### Cache demais
❌ **Problema**: Atualizações não aparecem
✅ **Solução**:
- Limpar Cache Storage: DevTools → Application → Clear storage
- Desinstalar PWA e reinstalar
- Hard refresh: Ctrl+Shift+R

### PDF não gera offline
❌ **Problema**: jsPDF não carrega offline
✅ **Solução**: Já está incluído no sw.js

### Notificações não funcionam
❌ **Problema**: Permissão negada
✅ **Solução**:
- Verificar permissão no navegador
- Https configurado
- Recarregar página

---

## Próximos Passos

1. [ ] Domínio configurado
2. [ ] HTTPS ativado
3. [ ] Service Worker registrado
4. [ ] Offline funcional
5. [ ] PWA instalável
6. [ ] Notificações testadas
7. [ ] Performance verificada
8. [ ] Monitoramento ativo

---

## Suporte

Para problemas:
1. Verificar logs (veja seção Monitoramento)
2. Testar em incognito/privado
3. Limpar dados do site
4. Verificar console (F12)
5. Testar em diferentes navegadores

---

**Data**: 29 de janeiro de 2026  
**Versão**: 1.0  
**Mantido por**: Hospital Teresa de Lisieux - TI
