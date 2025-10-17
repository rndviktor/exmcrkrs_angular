import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-service-status-lights',
  imports: [],
  template: `<div class="flex flex-row items-center bg-gray-500 rounded-xl p-2 space-x-2">
    <div
      id="backend-light"
      class="w-5 h-5 rounded-full"
      [class.bg-red-500]="leftLight === 'red'"
      [class.bg-yellow-400]="leftLight === 'yellow'"
      [class.bg-green-500]="leftLight === 'green'">
    </div>
    <div
      id="publishing-light"
      class="w-5 h-5 rounded-full"
      [class.bg-red-500]="rightLight === 'red'"
      [class.bg-yellow-400]="rightLight === 'yellow'"
      [class.bg-green-500]="rightLight === 'green'">
    </div>
  </div>`,
})
export class ServiceStatusLights implements OnChanges {
  leftLight: 'red' | 'yellow' | 'green' = 'green';
  rightLight: 'red' | 'yellow' | 'green' = 'green';

  @Input() left1Available = true;
  @Input() left2Available = true;
  @Input() rightAvailable = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.left1Available !== this.left2Available) {
      this.leftLight = 'yellow';
    } else {
      this.leftLight = this.left1Available ? 'green' : 'red';
    }

    this.rightLight = this.rightAvailable ? 'green' : 'red';
  }
}
