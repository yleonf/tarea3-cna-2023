# Tarea 3

Haz un fork de este repo

## Actividad 1: Mi primer docker-compose

Revisa el archivo `docker-compose.yml`.

Revisa el archivo `.env-sample`

El archivo `.env-sample` define las variables de entorno usadas en el archivo `docker-compose.yml`.

Copia el archivo `.env-sample` a `.env`, en linux esto se hace así:

        cp .env-sample .env

Edita el archivo `.env`. Cambia los valores de las variables que quieras.
Graba el archiv `.env`. (En linux puedes usar el editor `nano` o `vim`).

Ejecuta docker-compose de este modo:

        docker-compose --env-file .env-sample up -d

Ahora revisa cuantos contenedores están corriendo de este modo:

        docker ps

Ingresa a la base de datos con este comando (reemplaza los valores que corresponde a tu configuración en el archivo `.env`):

        docker-compose exec -it postgres psql -U POSTGRES_USER POSTGRES_DB

Por ejemplo, usando los valores que están en el archiv `.env-sample`, debes hacer:


        docker-compose exec -it postgres psql -U postgres usuarios


Con esto puedes ejecutar comandos en psql para revisar la base de datos:

        psql (15.4)
        Type "help" for help.

        usuarios=# select * from users;


Para salir escribe `\q`.


Deten tus contenedores con este comando:

        docker-compose down

## Actividad 2: la aplicación chatroom

Edita el archivo `docker-compose.yml` y agrega los servicios de frontend y backend:

```
  frontend:
    build: chat-frontend
    restart: always
    environment:
      - FRONT_PORT
    expose: 
      - 80
    ports:
      - ${FRONT_PORT}:80
    volumes:
      - ./nginx-conf/default.conf:/etc/nginx/conf.d/default.conf
 
  users-svc:
    build: users-svc
    command: "node app.js" 
    restart: always
    expose:
      - 3000
    environment:
      - JWT_SECRET
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
      - POSTGRES_PORT=5432
      - POSTGRES_SERVER=postgres
      - PORT=3000
      - CONNECTION_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      - postgres
  
  ws-server:
    build: ws-server
    command: "node index.js"
    restart: always
    expose:
      - 3001
    environment:
      - PORT=3001
```

Asegurate de colocar un valor adecuado a la variable `FRONT_PORT`` en tu archivo `.env`

Levanta los contenedores con el comando:

        docker-compose up -d

Navega con browser a la dirección `localhost:FRONT_PORT`, deberias ver la pagina de login.

Registra un usuario, la aplicación debería estar corriendo correctamente.

## Preguntas

1. Revisa el archivo `Dockerfile` en la carpeta `users-svc` y compáralo con el mismo archivo en la carpeta `ws-server`. ¿Qué te llama la atención? Ahora revisa la sentencia `command` para los respectivos servicios en el archivo `docker-compose.yml`. ¿Qué concluyes?

# Respuesta 
Los archivos de Dockerfile tienen las mismas instrucciones

en el servicio users-svc: el command ejecuta el archivo app.js que es el archivo de inicio de la aplicación
en el servicio ws-server : el command ejecuta el archivo index.js que es el archivo de inicio de la aplicación

# Conclusión
si bien en ambos casos las instrucciones para generar la imagen son las mismas, los servicios se ejecutan de forma distinta.


2. Revisa el archivo `Dockerfile` en la carpeta `frontend`. ¿Qué te llama la atención? ¿En qué es diferente de los otros archivos `Dockerfile`?
# Respuesta
El Dockerfile tiene dos etapas build-stage y build-release-stage

# build-stage
 utiliza la imagen de node:20.5-alpine3.17
 instala las librerias
 realiza el build de la aplicación

 # build-release-stage
  utiliza la imagen de nginx:stable-alpine 
  se copia el contenido de la carpeta correspondiente al build realizada en la etapa anterior (build-stage) a la 
  carpeta de nginx 

4. ¿Para qué sirve el servicio flyway? ¿Qué pasa al hacer `docker ps` con respecto a este servicio?

# Respuesta
  Flyway : permite automatizar los cambios de una Base de datos

  - al hacer docker ps: el servicio  Flyway no aparece, ya que se ejecuta, aplica las instrucciones sql en la base 
 de datos postgres y termina su ejecución

6. ¿Cuantas imágenes se crean? ¿Cuántos contenedores están activos?
# Respuesta

se crean 3 imagenes:
 Front-End
 uses-svc
 ws-server

 hay 4 contenedores activos asociados a :
 users-svc
 frontend
 postgres
 ws-server

8. Deten los contenedores con `docker-compose down`, luego reinicia con `docker-compose up -d`. Ingresa a la base de datos. ¿Qué pasa con los datos?

# Respuesta
Los datos se borran al hacer el docker-compose down ya que no se creo un volumen
   

10. Baja los contenedres. Crea un volumen para postgres agregando estas sentencias en el servicio `postgres`: 

```
 volumes:
   - ./data:/var/lib/postgresql/data
```

Reinicia los contenedores. Explica qué pasa con la base de datos después de hacer esto.

¿Qué pasa con la carpeta `data`, qué crees que contiene?

# Respuesta
Al crear el volumen, se guardan los datos de la base de datos en la carpeta data del host, la carpeta data conserva los datos generados por la base de datos

