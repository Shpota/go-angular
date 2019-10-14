FROM node:12.11 AS ANGULAR_BUILD
RUN npm install -g @angular/cli
COPY webapp /webapp
WORKDIR webapp
RUN ng build --prod

FROM golang:1.13.1-alpine AS GO_BUILD
RUN apk --update add git
WORKDIR /go/src/app
RUN go get -u github.com/gorilla/mux && \
    go get -u github.com/satori/go.uuid && \
    go get -u github.com/jinzhu/gorm && \
    go get -u github.com/jinzhu/gorm/dialects/postgres
COPY server.go /go/src/app/
RUN go build -o /go/bin/server

FROM alpine:3.10
WORKDIR app
COPY --from=ANGULAR_BUILD /webapp/dist/webapp/* ./webapp/dist/webapp/
COPY --from=GO_BUILD /go/bin/server ./
RUN ls
CMD ./server
