import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthService } from 'src/app/auth';
import { PagesComponent } from 'src/app/pages';
import { ChangePasswordComponent } from 'src/app/shared/components/change-password/change-password.component';

@Component({
    selector: 'app-topBar',
    providers: [DialogService],
    templateUrl: './topBar.component.html',
    standalone: true,
    imports: [NgClass],
})
export class TopBarComponent {
  imageUrl: string;
  refChangePassword!: DynamicDialogRef;

  constructor(
    public auth: AuthService,
    public app: PagesComponent,
    protected dialogServiceChangePassword: DialogService
  ) {
    this.imageUrl = 'assets/layout/images/avatar.png';
  }

  public onTopBarChangePasswordClick(event: { preventDefault: () => void }) {
    event.preventDefault();

    this.openDialogChangePassword();
  }

  public onTopBarLogoutClick(event: { preventDefault: () => void }) {
    event.preventDefault();

    this.auth.logout();
  }

  protected openDialogChangePassword(user?: any) {
    this.refChangePassword = this.dialogServiceChangePassword.open(ChangePasswordComponent, {
      data: user,
      width: '35%',
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Alterar Senha',
    });
  }
}
