FROM node:12.11 AS ANGULAR_BUILD
RUN npm install -g @angular/cli
COPY webapp /webapp
WORKDIR webapp
RUN ng build --prod

FROM golang:1.13.1-stretch AS GO_BUILD
WORKDIR /go/src/app
RUN go get -d -v github.com/gorilla/mux
COPY server.go /go/src/app/
RUN CGO_ENABLED=0 go build -o /go/bin/server

FROM alpine:3.10
WORKDIR app
COPY --from=ANGULAR_BUILD /webapp/dist/webapp/* ./webapp/dist/webapp/
COPY --from=GO_BUILD /go/bin/server ./
RUN ls
CMD ./server
