package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	uuid "github.com/satori/go.uuid"
	"log"
	"net/http"
)

type student struct {
	ID   string `gorm:"primary_key" json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type App struct {
	DB *gorm.DB
}

func (a *App) start() {
	db, err := gorm.Open(
		"postgres",
		"host=students user=go password=go dbname=go sslmode=disable")
	if err != nil {
		panic(err.Error())
	}
	a.DB = db
	db.AutoMigrate(&student{})
	r := mux.NewRouter()
	r.HandleFunc("/students", a.getAllStudents).Methods("GET")
	r.HandleFunc("/students", a.addStudent).Methods("POST")
	r.HandleFunc("/students/{id}", a.updateStudent).Methods("PUT")
	r.HandleFunc("/students/{id}", a.deleteStudent).Methods("DELETE")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./webapp/dist/webapp/")))
	log.Fatal(http.ListenAndServe(":8080", r))
}

func (a *App) getAllStudents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var all []student
	err := a.DB.Find(&all).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	} else {
		json.NewEncoder(w).Encode(all)
	}
}

func (a *App) addStudent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	s := student{}
	err := json.NewDecoder(r.Body).Decode(&s)
	s.ID = uuid.Must(uuid.NewV4()).String()
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
	} else {
		err = a.DB.Save(&s).Error
		if err != nil {
			sendErr(w, http.StatusInternalServerError, err.Error())
		} else {
			w.WriteHeader(http.StatusCreated)
		}
	}
}

func (a *App) updateStudent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	s := student{}
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		sendErr(w, http.StatusBadRequest, err.Error())
	} else {
		s.ID = mux.Vars(r)["id"]
		err = a.DB.Save(&s).Error
		if err != nil {
			sendErr(w, http.StatusInternalServerError, err.Error())
		}
	}
}

func (a *App) deleteStudent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := a.DB.Unscoped().Delete(student{ID: mux.Vars(r)["id"]}).Error
	if err != nil {
		sendErr(w, http.StatusInternalServerError, err.Error())
	}
}

func sendErr(w http.ResponseWriter, code int, message string) {
	resp, _ := json.Marshal(map[string]string{"error": message})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(resp)
}

func main() {
	app := App{}
	app.start()
}
