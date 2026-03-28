import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ToastModule, RouterOutlet, SharedModule, ButtonModule, ConfirmDialogModule],
})
export class AppComponent {
  lightMenu = false;
  menuMode = 'slim';
  theme = 'teal-yellow';
  ripple: boolean = true;
  inputStyle = 'outlined';

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {}

  ngOnInit() {
    this.config.ripple = true;
    this.ripple = true;

    this.translate('pt');
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe((res) => this.config.setTranslation(res));
  }
}
