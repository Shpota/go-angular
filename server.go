package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	router := mux.NewRouter()
	fileServer := http.FileServer(http.Dir("./webapp/dist/webapp/"))
	router.PathPrefix("/").Handler(fileServer)
	err := http.ListenAndServe(":8080", router)
	log.Fatal(err)
}
