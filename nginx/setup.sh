#!/bin/bash
set -e

DOMAIN="oriamvp.cloud"
EMAIL="talam@stake.capital"
NGINX_CONF="/etc/nginx/sites-available/oriamvp.cloud"
WEBROOT="/var/www/certbot"

echo "==> Installing nginx config (HTTP only first)..."
cat > "$NGINX_CONF" <<'EOF'
server {
    listen 80;
    server_name oriamvp.cloud api.oriamvp.cloud www.oriamvp.cloud;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/oriamvp.cloud
rm -f /etc/nginx/sites-enabled/default
mkdir -p "$WEBROOT"
nginx -t && systemctl enable nginx && systemctl restart nginx

echo "==> Obtaining SSL certificate..."
certbot certonly --webroot -w "$WEBROOT" \
    -d "$DOMAIN" -d "api.$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" --agree-tos --non-interactive

echo "==> Installing HTTPS nginx config..."
cat > "$NGINX_CONF" <<'EOF'
server {
    listen 80;
    server_name oriamvp.cloud api.oriamvp.cloud www.oriamvp.cloud;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.oriamvp.cloud;

    ssl_certificate     /etc/letsencrypt/live/oriamvp.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/oriamvp.cloud/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass         http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name oriamvp.cloud www.oriamvp.cloud;

    ssl_certificate     /etc/letsencrypt/live/oriamvp.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/oriamvp.cloud/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 200 '{"status":"ok","service":"oria"}';
    add_header Content-Type application/json;
}
EOF

nginx -t && systemctl restart nginx

echo ""
echo "✓ Done. Test with:"
echo "  curl https://api.oriamvp.cloud/health"
