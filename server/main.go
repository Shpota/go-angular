package main

import (
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

func main() {
	db, err := gorm.Open(
		"postgres",
		"host=students-db user=go password=go dbname=go sslmode=disable")
	if err != nil {
		panic(err.Error())
	}
	app := App{
		db: db,
		r:  mux.NewRouter(),
	}
	app.start()
}
