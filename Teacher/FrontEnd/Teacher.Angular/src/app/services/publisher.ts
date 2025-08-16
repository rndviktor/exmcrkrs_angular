import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Publisher {
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';
  private baseUrl: string = 'http://localhost:5012';
  private apiEndpoint: string = 'api/v1';

  constructor(private http: HttpClient) {}
  async publishExam(examId: string) {
    const target = `${this.baseUrl}/${this.apiEndpoint}/publish/${examId}`;
    return await this.http.post<any>(target, { authorId: this.teacherId}).toPromise();
  }

  observePublishingMessages(examId: string): Observable<string> {
    const url = `${this.baseUrl}/${this.apiEndpoint}/publish/${examId}/stream`

    return new Observable<string>(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = event => observer.next(event.data);
      eventSource.onerror = error => observer.error(error);
      return () => eventSource.close();
    });
  }
}
