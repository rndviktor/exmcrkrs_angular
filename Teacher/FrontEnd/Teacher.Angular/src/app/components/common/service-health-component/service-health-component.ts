import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'app-service-health-component',
  imports: [],
  template: `
    <div>
      {{serviceName}} Status: <span [style.color]="isOnline ? 'green' : 'red'">{{ isOnline ? 'Online' : 'Offline' }}</span>
    </div>
    @if(!isOnline && timer > 0){
      <div>Timer: {{timer}} seconds</div>
    }
    @if(alarmMessage) {
      <strong> {{alarmMessage}} </strong>
    }
  `
})
export class ServiceHealthComponent implements OnInit, OnDestroy {
  isOnline: boolean|null = null;
  timer = 0;
  readonly timerDefault: number = 10;
  readonly pingDefault: number = 25000;
  readonly shortPingDefault: number = 3000;
  @Input() serviceUrl: string | null = null;
  @Input() serviceName: string | null = null;
  @Output() serviceOnlineChange = new EventEmitter<boolean>();

  alarmMessage: string | null = null;
  private countdownInterval: any;
  private pingInterval: any;

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
    clearInterval(this.pingInterval)
  }

  ngOnInit(): void {
    this.ping()
    this.pingInterval = setInterval(() => this.ping(), this.pingDefault);
  }

  private ping() {
    this.http.get(this.serviceUrl!, { observe: 'response'}).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err);
      })
    ).subscribe({
      next: resp => {
        if (resp instanceof HttpErrorResponse) {
          this.handleOffline();
        } else {
          this.handleOnline();
        }
      },
      error: () => {
        this.handleOffline();
      }
    })
  }

  handleOnline = () => {
    if (!this.isOnline) {
      this.isOnline = true;
      this.serviceOnlineChange.emit(this.isOnline);
      clearInterval(this.pingInterval)
      this.pingInterval = setInterval(() => this.ping(), this.pingDefault);
      console.log('online', this.serviceUrl, this.pingDefault);

      if (this.timer > 0) {
        clearInterval(this.countdownInterval);
        this.timer = 0
        this.alarmMessage = `Connection restored`;
        setTimeout(() => this.alarmMessage = null, 5000)
      }
    }
  }

  handleOffline = () => {
    if (this.isOnline) {
      this.isOnline = false;
      this.serviceOnlineChange.emit(this.isOnline);
      clearInterval(this.pingInterval)
      this.pingInterval = setInterval(() => this.ping(), this.shortPingDefault);
      this.startTimer()
    }
  }

  startTimer(): void {
    this.timer = this.timerDefault
    this.alarmMessage = null;
    clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.countdownInterval);
        this.alarmMessage = `Alarm! Stopped being online for ${this.timerDefault} seconds.`;
      }
    }, 1000)
  }
}
