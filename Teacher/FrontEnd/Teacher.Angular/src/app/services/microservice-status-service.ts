import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MicroserviceStatusService {
  private statusSubjects: {[url: string]: BehaviorSubject<boolean> } = {};

  constructor(private http: HttpClient) {}

  trackService(url: string, intervalMs: number = 10000) {
    if (!this.statusSubjects[url]) {
      this.statusSubjects[url] = new BehaviorSubject<boolean>(false);
      this.ping(url);
      setInterval(() => this.ping(url), intervalMs);
    }
  }

  private ping(url: string) {
    this.http.get(url, { observe: 'response'}).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err);
      })
    ).subscribe({
      next: resp => {
        if (resp instanceof HttpErrorResponse) {
          this.statusSubjects[url]?.next(false)
        } else {
          this.statusSubjects[url]?.next(true)
        }
      },
      error: () => { this.statusSubjects[url]?.error(false)} ,
    })
  }

  getStatus$(url: string): Observable<boolean> {
    this.trackService(url);
    return this.statusSubjects[url].asObservable();
  }
}
