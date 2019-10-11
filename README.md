A simple web application writen with Go and Angular
===================================================

## How to run
1. Create a Docker network:
    ```shell script
    docker network create students-net
    ```
2. Start the DB:
    ```shell script
    docker run -p 5432:5432 \
      -e POSTGRES_USER=go \
      -e POSTGRES_PASSWORD=go \
      -e POSTGRES_DB=go \
      --name students \
      --net=students-net \
      postgres:11.5
    ```
3. Build that application image:
    ```shell script
    docker build -t students .
    ```
4. Start the application container:
    ```shell script
    docker run -p 8080:8080 --net=students-net students
    ```
Access the application via http://localhost:8080
