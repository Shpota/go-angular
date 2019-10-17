import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "./student";

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  baseUrl: string = '/students';
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  add(st: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, st, {headers: this.headers});
  }

  update(st: Student): Observable<Student> {
    return this.http.put<Student>(
      `${this.baseUrl}/${st.id}`, st, {headers: this.headers}
    );
  }

  delete(id: string): Observable<Student> {
    return this.http.delete<Student>(`${this.baseUrl}/${id}`);
  }
}
