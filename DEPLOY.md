# Guía de Despliegue en Producción - RootResume

Esta guía detalla los métodos para desplegar el proyecto RootResume en un entorno de producción.

## Estrategia 1: CI/CD con GitHub Actions y Docker Hub (Recomendado)

Este es el enfoque de mejores prácticas. Automatiza la construcción y el versionado de imágenes Docker, garantizando un despliegue rápido, fiable y consistente.

### Flujo de Trabajo

1.  **Push a `master`**: Cada vez que se hace un push al branch `master`, se dispara un workflow de GitHub Actions.
2.  **Construcción y Push de Imágenes (CI)**:
    *   El workflow construye las imágenes Docker para el backend y el `portfolio-runner`.
    *   Etiqueta las imágenes con `latest` y el hash del commit de Git (ej. `your-username/portfolio-runner:latest`, `your-username/portfolio-runner:a1b2c3d`).
    *   Sube (`docker push`) las imágenes a un registro de contenedores como Docker Hub o AWS ECR.
3.  **Despliegue en el Servidor (CD)**:
    *   Te conectas por SSH a tu instancia de producción.
    *   Ejecutas un script simple (`deploy.sh`) que:
        *   Hace `docker-compose pull` para descargar las últimas imágenes desde el registro.
        *   Hace `docker-compose up -d` para reiniciar los servicios con las nuevas imágenes.

### Pasos de Configuración Inicial

1.  **Configura un Registro de Contenedores**:
    *   Crea una cuenta en [Docker Hub](https://hub.docker.com/) (gratuito para repositorios públicos).
    *   Crea dos repositorios: uno para el `backend` y otro para el `portfolio-runner`.

2.  **Configura GitHub Actions**:
    *   En tu repositorio de GitHub, ve a `Settings -> Secrets and variables -> Actions`.
    *   Añade los siguientes secretos:
        *   `DOCKERHUB_USERNAME`: Tu nombre de usuario de Docker Hub.
        *   `DOCKERHUB_TOKEN`: Un token de acceso personal de Docker Hub.

3.  **Crea el Workflow de CI/CD**:
    *   Crea un archivo `.github/workflows/ci-cd.yml` en tu repositorio con la lógica para construir y pushear las imágenes.

4.  **Configura el Servidor de Producción**:
    *   Aprovisiona un servidor con Docker y Docker Compose (puedes usar `setup.sh` como base).
    *   Crea un archivo `docker-compose.yml` en el servidor que defina tus servicios (backend, frontend, etc.) y apunte a las imágenes en tu registro.

---

## Estrategia 2: Despliegue Manual (Método Simple)

Este método es más rápido de configurar pero menos robusto. Implica construir las imágenes directamente en la máquina de producción.

### Requisitos Previos

1.  **Servidor**: Una instancia de Ubuntu 22.04/24.04 LTS con acceso SSH y privilegios `sudo`.
2.  **Dominio**: Un nombre de dominio apuntando a la IP de tu servidor.
3.  **Cliente Git**: Git instalado en tu máquina local.

### Pasos

1.  **Aprovisionamiento del Servidor**:
    *   Conéctate a tu servidor (`ssh ubuntu@<TU_IP_PUBLICA>`).
    *   Copia y ejecuta el script `infrastructure/setup.sh`.
    *   **Importante**: Cierra la sesión y vuelve a iniciarla para aplicar los permisos de Docker.

2.  **Configuración del Proyecto**:
    *   Clona tu repositorio: `git clone https://github.com/tu-usuario/tu-repositorio.git`.
    *   Navega al directorio del proyecto.

3.  **Construye las Imágenes Docker**:
    *   `cd server && docker build -t portfolio-runner . && cd ..`

4.  **Instala Dependencias y Ejecuta**:
    *   `cd server && npm install && cd ..`
    *   Usa `pm2` para iniciar el backend: `pm2 start infrastructure/ecosystem.config.js`.

5.  **Configura Nginx y SSL**:
    *   Crea un archivo de configuración en `/etc/nginx/sites-available/` para tu dominio, usando `infrastructure/nginx.conf` como plantilla.
    *   Habilita el sitio y usa `certbot` para obtener un certificado SSL.
    *   Recarga Nginx: `sudo systemctl reload nginx`.

6.  **Despliega el Frontend**:
    *   Puedes usar Vercel (recomendado, ver Opción A en el `README.md` original) o servirlo desde el mismo servidor (Opción B).

Este método funciona, pero se recomienda migrar a una estrategia de CI/CD para cualquier proyecto serio.