import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styles: [],
    standalone: true,
    imports: [ButtonModule, RouterLink]
})
export class AccessDeniedComponent {

}
