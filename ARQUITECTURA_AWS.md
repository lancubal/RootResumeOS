# Arquitectura de Despliegue en AWS — RootResumeOS

## Stack en producción

| Componente | Tecnología |
|---|---|
| Servidor | AWS EC2 (Ubuntu 22.04 LTS, `t3.small` / `t3.medium`) |
| Contenedores | Docker + Docker Compose instalados en la VM |
| Registro de imágenes | Amazon ECR (privado) |
| CI/CD | GitHub Actions |
| SSL | Let's Encrypt (Certbot), montado como volumen en Nginx |

---

## Servicios Docker Compose (`docker-compose.prod.yml`)

| Servicio | Imagen | Descripción |
|---|---|---|
| `proxy` | `nginx:1.25-alpine` | Reverse proxy, expone puertos `80` y `443` |
| `frontend` | `ECR/rootresume/frontend:latest` | App Next.js, red interna |
| `backend` | `ECR/rootresume/backend:latest` | API Node.js, red interna |

Todos los servicios se comunican a través de la red interna `portfolio-net` (bridge).  
El único punto de entrada externo es Nginx.

---

## Flujo de tráfico

```
Browser
  └─► Nginx (contenedor, :80/:443)
        ├─► frontend (Next.js, red interna)
        └─► backend (Node.js API, red interna)
                └─► Docker containers efímeros (ejecución de código Python/C/Rust)
```

> El backend monta `/var/run/docker.sock` para poder crear contenedores efímeros de ejecución de código.

---

## Flujo CI/CD

```
push a master
  └─► GitHub Actions
        └─► docker build (frontend + backend)
              └─► docker push → Amazon ECR
                    └─► EC2: docker compose pull + up -d
```

### Comando de actualización en EC2

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Variables de entorno requeridas en EC2 (`.env`)

```env
ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
RESEND_API_KEY=<tu-api-key>
```

---

## Notas importantes

- El **frontend corre en EC2** como contenedor Docker, **no en Vercel** (aunque PROJECT_SPEC_AWS.md lo mencionaba como opción original).
- SSL está gestionado con **Certbot/Let's Encrypt**, el certificado se monta como volumen read-only en el contenedor Nginx (`/etc/letsencrypt`).
- El EC2 necesita un **rol IAM** con `AmazonEC2ContainerRegistryReadOnly` para hacer pull de imágenes desde ECR sin credenciales hardcodeadas.
- El **Grupo de Seguridad** de EC2 debe tener abiertos los puertos: `22` (SSH, solo tu IP), `80` (HTTP) y `443` (HTTPS).

---

## Cómo extender la página

1. Hacer los cambios en `client/` (frontend) o `server/` (backend).
2. Push a `master` — GitHub Actions construye y sube las nuevas imágenes a ECR automáticamente.
3. Conectarse al EC2 por SSH y ejecutar:
   ```bash
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d
   ```
4. Si se agrega un nuevo servicio:
   - Declararlo en `docker-compose.prod.yml`.
   - Agregar los bloques `upstream` y `location` en `nginx/nginx.conf` (ver patrón abajo).
   - Crear su repositorio en ECR (`rootresume/<nombre-servicio>`).

---

## Patrón para agregar una sub-app bajo un path (`/nombre/`)

Este es el patrón usado para montar aplicaciones independientes bajo una ruta del dominio principal (ej. `luna-lancuba.dev/almorzar/`).

### 1. `nginx/nginx.conf` — agregar upstreams y locations

```nginx
# Upstreams (dentro del bloque http {})
upstream mi-app-api {
    server mi-app-api:3001;
}

upstream mi-app-web {
    server mi-app-web:80;
}

# Locations (dentro del server 443, ANTES del location / catch-all)
location = /mi-app {
    return 301 /mi-app/;
}

location /mi-app/api/ {
    proxy_pass http://mi-app-api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /mi-app/ {
    proxy_pass http://mi-app-web/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

> **Importante:** los `location` de sub-apps deben ir **antes** del bloque `location /` (catch-all hacia el frontend principal), de lo contrario Nginx nunca los alcanza.

### 2. `docker-compose.prod.yml` — agregar los servicios

```yaml
services:
  mi-app-web:
    image: ${ECR_REGISTRY}/rootresume/mi-app-web:latest
    profiles: ["mi-app"]   # evita que el workflow de rootresume intente pullear esta imagen
    networks:
      - portfolio-net
    restart: unless-stopped

  mi-app-api:
    image: ${ECR_REGISTRY}/rootresume/mi-app-api:latest
    profiles: ["mi-app"]
    networks:
      - portfolio-net
    restart: unless-stopped
```

> Los servicios con `profiles` no son incluidos en `docker compose pull/up` por defecto. Para levantar la sub-app en EC2 se usa:
> ```bash
> ECR_REGISTRY=... docker compose -f docker-compose.prod.yml --profile mi-app up -d almorz-web almorz-api
> ```

### 3. ECR — crear los repositorios

En la consola de AWS ECR, crear:
- `rootresume/mi-app-web`
- `rootresume/mi-app-api`

### Sub-apps actualmente configuradas

| Path | Web service (ECR) | API service (ECR) | Persistencia |
|---|---|---|---|
| `/almorzar/` | `almorz/web:latest` | `almorz/api:latest` | `/srv/almorz/db.json` en host |
