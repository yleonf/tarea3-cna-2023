# Tarea 3

Haz un fork de este repo

## Actividad 1: Mi primer docker-compose

Revisa el archivo `docker-compose.yml`.

Revisa el archivo `.env-sample`

El archivo `.env-sample` define las variables de entorno usadas en el archivo `docker-compose.yml`.

Copia el archivo `.env-sample` a `.env`, en linux esto se hace así:

        cp .env-sample .env

Edita el archivo `.env`. Cambia los valores de las variables que quieras, excepto la variable `POSTGRES_PORT`.
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

