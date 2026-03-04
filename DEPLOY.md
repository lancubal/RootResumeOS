# Guía de Despliegue en Producción (AWS) - RootResume

Esta guía detalla el despliegue de la aplicación en AWS utilizando un flujo de trabajo de CI/CD con GitHub Actions, Amazon ECR (Elastic Container Registry) y una instancia EC2. Este es el método recomendado para un entorno de producción robusto y escalable.

## Arquitectura de Despliegue

El flujo de trabajo es el siguiente:

1.  **Código Fuente (GitHub)**: Actúa como la única fuente de verdad.
2.  **Integración Continua (GitHub Actions)**: Un `push` al branch `master` dispara un workflow que automáticamente construye, etiqueta y sube las imágenes Docker de nuestros servicios (`frontend`, `backend`, `portfolio-runner`) a Amazon ECR.
3.  **Registro de Contenedores (Amazon ECR)**: Almacena de forma segura y privada nuestras imágenes Docker versionadas.
4.  **Servidor de Producción (AWS EC2)**: Una instancia EC2 ejecuta la aplicación. Para desplegar o actualizar, simplemente descarga las últimas imágenes desde ECR y reinicia los servicios usando Docker Compose.
5.  **Proxy Inverso (Nginx)**: Se ejecuta en la instancia EC2 para gestionar el tráfico entrante, dirigir las peticiones al contenedor correcto y manejar el cifrado SSL.

---

## Paso 1: Configurar AWS ECR (Elastic Container Registry)

ECR es nuestro almacén privado de imágenes Docker.

1.  **Navega a ECR**: En la consola de AWS, busca y selecciona `Elastic Container Registry`.
2.  **Crea los Repositorios**: Necesitamos tres repositorios. Haz clic en "Create repository" y créalos:
    *   **Visibilidad**: `Private`.
    *   **Nombre del Repositorio**:
        *   `rootresume/frontend`
        *   `rootresume/backend`
        *   `rootresume/portfolio-runner`
3.  **Toma nota de los URIs**: Una vez creados, cada repositorio tendrá un URI único. Lo necesitarás para el siguiente paso. Se verá algo así: `123456789012.dkr.ecr.us-east-1.amazonaws.com/rootresume/frontend`.

---

## Paso 2: Configurar GitHub Actions para CI/CD

Esto automatizará la construcción y publicación de nuestras imágenes.

1.  **Crear un Rol IAM para GitHub Actions**:
    *   En la consola de AWS, ve a `IAM -> Roles -> Create role`.
    *   **Trusted entity type**: `Web identity`.
    *   **Identity provider**: Elige `GitHub`.
    *   **Audience**: `sts.amazonaws.com`.
    *   **GitHub organization**: Tu nombre de usuario de GitHub (ej. `lancubal`).
    *   **GitHub repository**: `RootResumeOS`.
    *   **Permissions**: Asigna la política `AmazonEC2ContainerRegistryFullAccess`. Esto le da a GitHub Actions los permisos justos y necesarios para subir imágenes a ECR.
    *   Nombra el rol (ej. `GitHubActions_ECR_Access`) y créalo. Anota el **ARN** del rol.

2.  **Configurar Secretos en GitHub**:
    *   En tu repositorio de GitHub, ve a `Settings -> Secrets and variables -> Actions`.
    *   Crea los siguientes secretos:
        *   `AWS_REGION`: La región de AWS donde creaste tus repositorios ECR (ej. `us-east-1`).
        *   `AWS_ROLE_TO_ASSUME`: El ARN del rol IAM que creaste en el paso anterior.
        *   `ECR_REGISTRY`: El URI de tu registro de ECR (la parte sin el nombre del repositorio, ej. `123456789012.dkr.ecr.us-east-1.amazonaws.com`).

3.  **Crear el Workflow de GitHub Actions**:
    *   Crea el archivo `.github/workflows/deploy.yml` en tu repositorio. Este workflow se encargará de construir y subir las tres imágenes Docker a sus respectivos repositorios en ECR cada vez que hagas un `push` a `master`. (El contenido exacto del YAML se puede generar según las plantillas estándar de GitHub para build/push a ECR).

---

## Paso 3: Aprovisionar y Configurar la Instancia EC2

Este será nuestro servidor de producción.

1.  **Lanzar Instancia EC2**:
    *   **AMI**: Elige una AMI reciente de **Ubuntu** (ej. 22.04 LTS).
    *   **Tipo de Instancia**: `t3.small` o `t3.medium` es un buen punto de partida.
    *   **Key Pair**: Asigna o crea un key pair para poder acceder por SSH.
    *   **Grupo de Seguridad**: Crea un nuevo grupo de seguridad que permita tráfico entrante en:
        *   **Puerto 22 (SSH)**: Desde tu IP para poder administrarla.
        *   **Puerto 80 (HTTP)**: Desde cualquier lugar (`0.0.0.0/0`).
        *   **Puerto 443 (HTTPS)**: Desde cualquier lugar (`0.0.0.0/0`).
    *   **Rol IAM**: **Importante**: Asigna un rol IAM a la instancia que le dé permisos para descargar imágenes de ECR (`AmazonEC2ContainerRegistryReadOnly`). Esto es más seguro que guardar credenciales en la instancia.

2.  **Configurar la Instancia**:
    *   Conéctate por SSH: `ssh ubuntu@<tu-ip-publica> -i tu-llave.pem`.
    *   **Instalar dependencias**: Ejecuta los siguientes comandos:
        ```bash
        sudo apt-get update && sudo apt-get upgrade -y
        # Instalar Docker, Docker Compose y Nginx
        sudo apt-get install -y docker.io docker-compose nginx
        # Añadir usuario al grupo de docker y aplicar cambios
        sudo usermod -aG docker $USER
        newgrp docker
        ```

---

## Paso 4: Desplegar la Aplicación en EC2

El paso final es ejecutar la aplicación usando las imágenes de ECR.

1.  **Crear `docker-compose.yml` en EC2**:
    *   En la instancia, crea un archivo `docker-compose.yml`. **Este no es el mismo que usamos para desarrollo local**. Es una versión simplificada para producción.

    ```yaml
    version: '3.8'

    services:
      proxy:
        image: nginx:1.25-alpine
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf:ro
        ports:
          - "80:80"
        networks:
          - portfolio-net
        depends_on:
          - frontend
          - backend

      frontend:
        image: ${ECR_REGISTRY}/rootresume/frontend:latest
        networks:
          - portfolio-net

      backend:
        image: ${ECR_REGISTRY}/rootresume/backend:latest
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
        networks:
          - portfolio-net

    networks:
      portfolio-net:
        driver: bridge
    ```
    *Nota: Este archivo asume que la variable de entorno `ECR_REGISTRY` está definida en la sesión del shell o en un archivo `.env`.*

2.  **Crear `nginx.conf` en EC2**:
    *   Crea el archivo `nginx.conf` en el mismo directorio.
    *   **Importante**: En la sección `server`, cambia `server_name` a tu dominio real (ej. `rootresume.io`).

3.  **Obtener credenciales de ECR**:
    ```bash
    aws ecr get-login-password --region <tu-region> | docker login --username AWS --password-stdin <tu-uri-de-ecr>
    ```

4.  **Lanzar la aplicación**:
    ```bash
    # Descarga las últimas imágenes de ECR
    docker-compose pull
    # Inicia los contenedores en segundo plano
    docker-compose up -d
    ```

5.  **Configurar SSL con Certbot**:
    *   Instala Certbot: `sudo apt-get install -y certbot python3-certbot-nginx`.
    *   Ejecuta Certbot para obtener el certificado e instalarlo en tu configuración de Nginx (que se está ejecutando fuera de Docker):
        ```bash
        # Primero, detén temporalmente docker-compose para liberar el puerto 80
        docker-compose down
        # Ejecuta certbot
        sudo certbot --nginx -d tu-dominio.com
        # Vuelve a levantar la aplicación
        docker-compose up -d
        ```

¡Tu aplicación ahora está desplegada en producción, con un flujo de CI/CD completamente funcional!

---

## Paso 5: Agregar una Sub-App bajo un Path (`/nombre/`)

Este es el proceso para montar una aplicación independiente bajo una ruta del dominio principal (ej. `luna-lancuba.dev/almorzar/`). La sub-app tiene su propio repositorio, su propio pipeline de CI/CD y sus propias imágenes en ECR, pero comparte el nginx proxy y la red Docker de rootresume.

### 5.1 — Crear los repositorios en ECR

En la consola de AWS ECR, crear dos repositorios privados para la nueva app:
- `mi-app/web`
- `mi-app/api` (si la app tiene backend propio)

### 5.2 — Configurar el IAM Trust Policy para el nuevo repo

El rol IAM `GitHubActions_ECR_Access` necesita autorizar el repo de la nueva app. En la consola de AWS:

**IAM → Roles → `GitHubActions_ECR_Access` → Trust relationships → Edit trust policy**

Agregar el repo al array `sub`:
```json
"token.actions.githubusercontent.com:sub": [
    "repo:lancubal/RootResumeOS:ref:refs/heads/master",
    "repo:lancubal/mi-app:ref:refs/heads/main"
]
```

> **Ojo con mayúsculas/minúsculas**: el nombre del repo debe coincidir exactamente con el de GitHub (ej. `RootResumeOS`, no `rootresume`).

### 5.3 — Agregar los servicios en `docker-compose.prod.yml`

Agregar los servicios con `profiles` para que el workflow de rootresume no intente pullear estas imágenes:

```yaml
services:
  mi-app-web:
    image: ${ECR_REGISTRY}/mi-app/web:latest
    profiles: ["mi-app"]
    restart: unless-stopped
    networks:
      - portfolio-net

  mi-app-api:
    image: ${ECR_REGISTRY}/mi-app/api:latest
    profiles: ["mi-app"]
    restart: unless-stopped
    volumes:
      - /srv/mi-app/db.json:/app/db.json   # persistencia en el host (si aplica)
    networks:
      - portfolio-net
```

> Los servicios con `profiles` son ignorados por el `docker compose pull/up` estándar del workflow de rootresume.

### 5.4 — Agregar las rutas en `nginx/nginx.conf`

En el bloque `http {}`, agregar los upstreams:
```nginx
upstream mi-app-api {
    server mi-app-api:3001;
}
upstream mi-app-web {
    server mi-app-web:80;
}
```

En el bloque `server { listen 443 }`, agregar los location blocks **antes** del `location /` catch-all:
```nginx
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

### 5.5 — Configurar la URL de la API en el frontend de la sub-app

El frontend de la sub-app **no debe hardcodear** `http://localhost:3001`. Debe usar rutas relativas que pasen por nginx:

```js
// ❌ Nunca hacer esto — localhost apunta al browser del visitante
fetch('http://localhost:3001/api/users')

// ✅ Correcto — va por nginx → mi-app-api
fetch('/mi-app/api/users')

// ✅ O con variable de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/mi-app/api'
fetch(`${API_URL}/users`)
```

### 5.6 — Commitear y pushear a rootresume

```bash
git add docker-compose.prod.yml nginx/nginx.conf
git commit -m "feat: add mi-app sub-app (nginx routing + docker-compose services)"
git push origin master
```

El workflow de rootresume se encarga de copiar el `nginx.conf` actualizado a EC2 y recrear el proxy automáticamente.

### 5.7 — Preparar el host EC2 (primera vez)

Antes del primer deploy de la sub-app, crear el directorio de persistencia si aplica:

```bash
sudo mkdir -p /srv/mi-app
sudo touch /srv/mi-app/db.json
```

### 5.8 — Levantar los contenedores de la sub-app en EC2

Una vez que las imágenes estén en ECR (pusheadas por el pipeline de la sub-app), levantar los contenedores manualmente o desde el pipeline de la sub-app:

```bash
cd ~/rootresume

ECR_REGISTRY=<tu-registry> \
docker compose -f docker-compose.prod.yml --profile mi-app up -d mi-app-web mi-app-api
```

> Los contenedores se unen automáticamente a la red `rootresume_portfolio-net` y nginx los puede resolver por nombre de servicio.

### Sub-apps actualmente en producción

| Path | Perfil | Web image | API image | Persistencia |
|---|---|---|---|---|
| `/almorzar/` | `almorz` | `almorz/web:latest` | `almorz/api:latest` | `/srv/almorz/db.json` |
