import {Component, EventEmitter, Output} from '@angular/core';
import {ServiceHealthComponent} from '../service-health-component/service-health-component';

@Component({
  selector: 'app-api-status',
  imports: [
    ServiceHealthComponent
  ],
  template: `@for(ms of microservices; track ms.id) {
    <div class="flex flex-col px-8">
        <app-service-health-component [serviceUrl]="ms.url" [serviceName]="ms.name" (serviceOnlineChange)="handleUpdate(ms.id, $event)"/>
    </div>
  }

  <br/>
  `
})
export class ApiStatus  {
  microservices = [
    {id: 1, name: 'Write Service', url: 'http://localhost:5010/health', online: false },
    {id: 2, name: 'Read Service', url: 'http://localhost:5011/health', online: false},
    {id: 3, name: 'Publish Service', url: 'http://localhost:5012/health', online: false},
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
