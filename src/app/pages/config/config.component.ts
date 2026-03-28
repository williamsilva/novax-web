import { Component } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

import { VoucherComponent } from './voucher/voucher.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styles: [],
  standalone: true,
  imports: [TabViewModule, VoucherComponent],
})
export class ConfigComponent {
  activeIndex: number = 0;

  //constructor() {}

  // public ngOnInit(): void {}
}
