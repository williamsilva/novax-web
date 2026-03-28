import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { PagesComponent } from 'src/app/pages';

@Component({
    selector: 'app-rightpanel',
    templateUrl: './rightpanel.component.html',
    styles: [],
    standalone: true,
    imports: [NgClass],
})
export class RightpanelComponent {
  constructor(public app: PagesComponent) {}
}
