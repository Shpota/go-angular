package main

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetAllStudents(t *testing.T) {
	app := initApp()
	st := student{ID: "id-1", Age: 20, Name: "John Doe"}
	app.db.Save(st)
	req, _ := http.NewRequest("GET", "/students", nil)
	r := httptest.NewRecorder()
	handler := http.HandlerFunc(app.getAllStudents)

	handler.ServeHTTP(r, req)

	checkStatusCode(r.Code, http.StatusOK, t)
	checkContentType(r, t)
	checkBody(r.Body, st, t)
}

func TestAddStudent(t *testing.T) {
	app := initApp()
	var rqBody = toReader(`{"name":"John Doe", "age":20}`)
	req, _ := http.NewRequest("POST", "/students", rqBody)
	r := httptest.NewRecorder()
	handler := http.HandlerFunc(app.addStudent)

	handler.ServeHTTP(r, req)

	checkStatusCode(r.Code, http.StatusCreated, t)
	checkContentType(r, t)
	checkProperties(firstStudent(app), t)
}

func TestUpdateStudent(t *testing.T) {
	app := initApp()
	app.db.Save(student{ID: "id-1", Age: 25, Name: "Peter Doe"})
	var rqBody = toReader(`{"name":"John Doe", "age":20}`)
	req, _ := http.NewRequest("PUT", "/students/id", rqBody)
	req = mux.SetURLVars(req, map[string]string{"id": "id-1"})
	r := httptest.NewRecorder()
	handler := http.HandlerFunc(app.updateStudent)

	handler.ServeHTTP(r, req)

	checkStatusCode(r.Code, http.StatusOK, t)
	checkContentType(r, t)
	checkProperties(firstStudent(app), t)
}

func TestDeleteStudent(t *testing.T) {
	app := initApp()
	app.db.Save(student{ID: "id-1", Age: 20, Name: "John Doe"})
	req, _ := http.NewRequest("DELETE", "/students/id", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "id-1"})
	r := httptest.NewRecorder()
	handler := http.HandlerFunc(app.deleteStudent)

	handler.ServeHTTP(r, req)

	checkStatusCode(r.Code, http.StatusOK, t)
	checkContentType(r, t)
	checkDbIsEmpty(app.db, t)
}

func initApp() App {
	db, _ := gorm.Open("sqlite3", ":memory:")
	db.AutoMigrate(&student{})
	return App{db: db}
}

func firstStudent(app App) student {
	var all []student
	app.db.Find(&all)
	return all[0]
}

func toReader(content string) io.Reader {
	return bytes.NewBuffer([]byte(content))
}

func checkStatusCode(code int, want int, t *testing.T) {
	if code != want {
		t.Errorf("Wrong status code: got %v want %v", code, want)
	}
}

func checkContentType(r *httptest.ResponseRecorder, t *testing.T) {
	ct := r.Header().Get("Content-Type")
	if ct != "application/json" {
		t.Errorf("Wrong Content Type: got %v want application/json", ct)
	}
}

func checkProperties(st student, t *testing.T) {
	if st.Name != "John Doe" {
		t.Errorf("Name should match: got %v want %v", st.Name, "Peter Doe")
	}
	if st.Age != 20 {
		t.Errorf("Age should match: got %v want %v", st.Age, 20)
	}
}

func checkBody(body *bytes.Buffer, st student, t *testing.T) {
	var students []student
	_ = json.Unmarshal(body.Bytes(), &students)
	if len(students) != 1 {
		t.Errorf("Wrong lenght: got %v want 1", len(students))
	}
	if students[0] != st {
		t.Errorf("Wrong body: got %v want %v", students[0], st)
	}
}

func checkDbIsEmpty(db *gorm.DB, t *testing.T) {
	var students []student
	db.Find(&students)
	if len(students) != 0 {
		t.Errorf("Student has not been deleted")
	}
}
