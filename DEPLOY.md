# Guía de Despliegue en Producción - RootResume

Esta guía detalla los pasos para desplegar el proyecto RootResume en un servidor de producción, como una instancia de AWS EC2 o un Droplet de DigitalOcean, utilizando Ubuntu 22.04/24.04 LTS.

## Requisitos Previos

1.  **Servidor**: Una instancia de Ubuntu 22.04/24.04 LTS con acceso SSH y privilegios `sudo`.
2.  **Dominio**: Un nombre de dominio (o un subdominio) apuntando a la IP pública de tu servidor. Para este ejemplo, usaremos `yourdomain.com` y `api.yourdomain.com`.
3.  **Cliente Git**: Git instalado en tu máquina local.

---

## Paso 1: Aprovisionamiento del Servidor

Este paso prepara el servidor con todas las dependencias necesarias: Docker, Node.js, Nginx y PM2.

1.  **Conéctate a tu servidor**:
    ```bash
    ssh ubuntu@<TU_IP_PUBLICA>
    ```

2.  **Copia y ejecuta el script `setup.sh`**:
    El script `setup.sh` se encuentra en la carpeta `infrastructure` del repositorio. Puedes copiar su contenido y pegarlo en un nuevo archivo en tu servidor.

    ```bash
    # En el servidor
    nano setup.sh
    # Pega el contenido del script infrastructure/setup.sh y guarda (Ctrl+X, Y, Enter)
    
    chmod +x setup.sh
    ./setup.sh
    ```

3.  **Vuelve a iniciar sesión**: **Este es un paso crucial**. Para que el usuario actual pueda ejecutar comandos de Docker sin `sudo`, debes cerrar la sesión SSH y volver a conectarte.
    ```bash
    exit
    ssh ubuntu@<TU_IP_PUBLICA>
    ```

4.  **Verifica la instalación de Docker**:
    ```bash
    docker --version
    # Deberías ver la versión de Docker sin errores de permisos.
    ```

---

## Paso 2: Configuración del Proyecto

Ahora clonaremos el código fuente y construiremos los artefactos necesarios.

1.  **Clona tu repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Construye la imagen Docker personalizada**:
    El backend utiliza una imagen Docker llamada `portfolio-runner` para ejecutar código de forma segura.
    ```bash
    cd server
    docker build -t portfolio-runner .
    cd .. 
    # Vuelve a la raíz del proyecto
    ```

3.  **Instala las dependencias del backend**:
    ```bash
    cd server
    npm install
    cd ..
    ```

---

## Paso 3: Configuración de Nginx y SSL

Nginx actuará como un proxy inverso para dirigir el tráfico a tu aplicación Node.js y gestionar las conexiones HTTPS.

1.  **Crea un archivo de configuración de Nginx**:
    Basándote en `infrastructure/nginx.conf`, crea una configuración para tu dominio.

    ```bash
    # Reemplaza 'api.yourdomain.com' con tu dominio/subdominio real
    sudo nano /etc/nginx/sites-available/yourdomain.com
    ```

    Pega la siguiente configuración, **asegurándote de cambiar `server_name`**:
    ```nginx
    server {
        listen 80;
        server_name api.yourdomain.com; # <--- CAMBIA ESTO

        location / {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    *Nota: Si vas a servir el frontend desde el mismo servidor, necesitarás añadir otro bloque `server` o un `location` para los archivos estáticos del cliente.*

2.  **Habilita la configuración**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
    ```

3.  **Configura SSL con Certbot**:
    Certbot obtendrá un certificado SSL gratuito de Let's Encrypt y configurará Nginx automáticamente para usarlo.
    ```bash
    # Reemplaza con tu dominio y un correo electrónico válido
    sudo certbot --nginx -d api.yourdomain.com --non-interactive --agree-tos -m tu-correo@ejemplo.com
    ```
    Certbot modificará tu archivo de configuración para redirigir HTTP a HTTPS.

4.  **Verifica y recarga Nginx**:
    ```bash
    sudo nginx -t
    # Si dice 'test is successful', recarga el servicio.
    sudo systemctl reload nginx
    ```

---

## Paso 4: Despliegue del Backend con PM2

PM2 es un gestor de procesos que mantendrá nuestra aplicación backend funcionando de forma continua.

1.  **Navega a la raíz del proyecto**:
    ```bash
    cd /ruta/a/tu-repositorio
    ```

2.  **Inicia la aplicación con PM2**:
    Usaremos el archivo de configuración `ecosystem.config.js`.
    ```bash
    pm2 start infrastructure/ecosystem.config.js
    ```

3.  **Verifica que la aplicación esté corriendo**:
    ```bash
    pm2 list
    # Deberías ver 'portfolio-backend' con el estado 'online'.
    ```

4.  **Guarda la configuración de PM2**:
    Este comando asegura que PM2 reinicie automáticamente tu aplicación si el servidor se reinicia.
    ```bash
    pm2 save
    ```

---

## Paso 5: Despliegue del Frontend

Tienes dos opciones principales para el frontend de Next.js:

### Opción A: Despliegue en Vercel (Recomendado)

1.  **Sube tu proyecto a GitHub/GitLab/Bitbucket**.
2.  **Crea una cuenta en [Vercel](https://vercel.com/)** y conecta tu repositorio.
3.  **Configura el proyecto en Vercel**:
    *   Vercel detectará que es una aplicación Next.js.
    *   **Importante**: Debes configurar las variables de entorno para que el cliente sepa dónde está tu API. Ve a `Settings -> Environment Variables` y añade:
      *   `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com`

4.  **Configura CORS en el backend**:
    Asegúrate de que la configuración de CORS en `server/index.js` permita el dominio de tu frontend en Vercel.
    ```javascript
    // server/index.js
    app.use(cors({
        origin: 'https://tu-proyecto.vercel.app' // <--- Cambia esto
    }));
    ```
    Reinicia PM2 después de cambiar el código: `pm2 restart portfolio-backend`.

### Opción B: Servir en el mismo EC2

Si prefieres servir todo desde un solo lugar:

1.  **Construye el frontend**:
    ```bash
    cd client
    npm run build
    cd ..
    ```

2.  **Modifica Nginx para servir los archivos estáticos**:
    Edita tu archivo de configuración de Nginx y añade un `location` para el frontend.
    ```bash
    sudo nano /etc/nginx/sites-available/yourdomain.com
    ```
    
    Añade un nuevo bloque `server` para el dominio principal:
    ```nginx
    # Redirección de www a no-www (opcional)
    server {
        listen 80;
        server_name www.yourdomain.com;
        return 301 http://yourdomain.com$request_uri;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        root /ruta/a/tu-repositorio/client/.next/server/pages; # Ajusta la ruta si es necesario
        
        location / {
            try_files $uri $uri.html =404;
        }

        location /_next {
            alias /ruta/a/tu-repositorio/client/.next;
            expires 1y;
            access_log off;
        }
    }
    ```
    *Nota: La configuración para Next.js puede ser compleja. Esta es una configuración básica.*

3.  **Ejecuta Certbot para ambos dominios** (`yourdomain.com` y `api.yourdomain.com`).

4.  **Reinicia Nginx**: `sudo systemctl reload nginx`.

---

¡Tu aplicación debería estar ahora desplegada y funcionando en tu dominio!
