# Dockerfile para Checklist Hospitalar PWA
# Build: docker build -t checklist-app:latest .
# Run: docker run -p 80:80 checklist-app:latest

FROM nginx:alpine

# Informações do container
LABEL maintainer="Hospital Teresa de Lisieux - TI"
LABEL description="Checklist Hospitalar - Progressive Web App"
LABEL version="1.0"

# Instalar ferramentas úteis
RUN apk add --no-cache curl wget

# Remover configuração default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar código da aplicação
COPY . /usr/share/nginx/html/

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar diretórios de log
RUN mkdir -p /var/log/nginx

# Definir permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Portas
EXPOSE 80 443

# Comando default
CMD ["nginx", "-g", "daemon off;"]

# Notas:
# - Baseado em nginx:alpine (muito leve)
# - HTTPS pode ser configurado montando certificados SSL
# - Health check verifica disponibilidade do servidor
# - Service Worker funciona sem modificações adicionais
