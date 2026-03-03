import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Reader {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${environment.teacherQueryUrl}/api/v1/examLookup/byAuthorId/${environment.teacherId}`);
  }
}
