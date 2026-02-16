import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {ExamService} from './exam-service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Publisher {
  private apiEndpoint: string = 'api/v1';

  constructor(private http: HttpClient, private examService: ExamService) {}
  async publishExam(examId: string) {
    const target = `${environment.publisherUrl}/${this.apiEndpoint}/publish/${examId}`;
    await firstValueFrom(this.http.post<any>(target, { authorId: environment.teacherId}));
    this.examService.resetAccessCode(examId)
  }

  observePublishingMessages(examId: string): Observable<string> {
    const url = `${environment.publisherUrl}/${this.apiEndpoint}/publish/${examId}/stream`

    return new Observable<string>(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = event => observer.next(event.data);
      eventSource.onerror = error => observer.error(error);
      return () => eventSource.close();
    });
  }
}
