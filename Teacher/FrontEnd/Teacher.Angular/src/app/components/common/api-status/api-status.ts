import {Component, EventEmitter, Output} from '@angular/core';
import {ServiceHealthComponent} from '../service-health-component/service-health-component';

@Component({
  selector: 'app-api-status',
  imports: [
    ServiceHealthComponent,
  ],
  template: `
    <div class="flex flex-row px-8">
<!--      <app-service-status-lights [left1Available]="this.microservices[0].online"-->
<!--                                 [left2Available]="this.microservices[1].online"-->
<!--                                 [rightAvailable]="this.microservices[2].online"/>-->
      @for (ms of microservices; track ms.id) {
        <div class="flex flex-column justify-between px-4">
          <app-service-health-component [serviceUrl]="ms.url" [serviceName]="ms.name"
                                        (serviceOnlineChange)="handleUpdate(ms.id, $event)"/>
        </div>
      }
    </div>
  `
})
export class ApiStatus {
  microservices = [
    {id: 1, name: 'Write ', url: 'http://localhost:5010/health', online: false},
    {id: 2, name: 'Read ', url: 'http://localhost:5011/health', online: false},
    {id: 3, name: 'Publish ', url: 'http://localhost:5012/health', online: false},
  ];

  @Output() backendAvailable: EventEmitter<boolean> = new EventEmitter();
  @Output() publishAvailable: EventEmitter<boolean> = new EventEmitter();

  handleUpdate(id: number, isOnline: boolean) {
    const ms = this.microservices.find(m => m.id === id);
    if (ms != null) {
      ms.online = isOnline;
      if (id < 3) {
        this.backendAvailable.emit(this.microservices[0].online && this.microservices[1].online);
      } else {
        this.publishAvailable.emit(this.microservices[2].online);
      }
    }
  }
}
