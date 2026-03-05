import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, pairwise} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionTracker {

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      pairwise()
    ).subscribe(([_, curr]: [any, any]) => {
      if (!this.isExamFinishing) {
        this.isExamFinishing = curr?.urlAfterRedirects?.includes('question');
      }
    });
  }

  private isExamFinishing: boolean = false;

  getQuestionNavigatedFlag = () => {
    const val = this.isExamFinishing;
    if (val) {
      this.isExamFinishing = false;
    }

    return val;
  }
}
