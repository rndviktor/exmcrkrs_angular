import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private baseUrl: string = 'http://localhost:5011';
  private apiPrefix: string = 'api/v1/Sse/stream';
  private teacherId: string = '330125ae-bdc8-44a1-a90c-aa293445be3e';

  observeMessagesToAuthor(): Observable<string> {
    const url = `${this.baseUrl}/${this.apiPrefix}/${this.teacherId}`;

    return new Observable<string>(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = event => observer.next(event.data);
      eventSource.onerror = error => observer.error(error);
      return () => eventSource.close();
    });
  }

  observeMessagesToObject(objectId: string): Observable<string> {
    const url = `${this.baseUrl}/${this.apiPrefix}/${objectId}`

    return new Observable<string>(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = event => observer.next(event.data);
      eventSource.onerror = error => observer.error(error);
      return () => eventSource.close();
    });
  }
}
