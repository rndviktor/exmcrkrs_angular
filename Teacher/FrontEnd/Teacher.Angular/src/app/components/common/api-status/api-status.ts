import {Component, OnInit} from '@angular/core';
import {MicroserviceStatusService} from '../../../services/microservice-status-service';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-api-status',
  imports: [
    NgStyle
  ],
  template: `@for(ms of microservices; track ms) {
    <div>
        <span>{{ ms.name }}:
          <b [ngStyle]="{color: status[ms.name] ? 'green' : 'red'}">
            {{ status[ms.name] ? 'ONLINE' : 'OFFLINE' }}
          </b>
        </span>
    </div>
  }`
})
export class ApiStatus implements OnInit {
  microservices = [
    {name: 'write', url: 'http://localhost:5010/health'},
    {name: 'read', url: 'http://localhost:5011/health'},
  ];

  status: { [url: string]: boolean } = {};

  constructor(private statusService: MicroserviceStatusService) {}
  ngOnInit(): void {
    this.microservices.forEach(service => {
      this.statusService.getStatus$(service.url).subscribe(status => {
        this.status[service.name] = status;
      })
    })
  }
}
