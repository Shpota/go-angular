import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Student} from "./student";

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  baseUrl: string = '/students';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  add(st: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, st, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  update(st: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${st.id}`,
      st, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }

  delete(id: string): Observable<Student> {
    return this.http.delete<Student>(`${this.baseUrl}/${id}`);
  }
}
