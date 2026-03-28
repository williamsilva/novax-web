import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-authorized',
    template: ``,
    standalone: true,
})
export class AuthorizedComponent implements OnInit {
  constructor(private route: Router, private auth: AuthService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.auth
          .getNewAccessTokenWithCode(params.code, params.state)
          .then(() => {
            this.route.navigate(['/']);
          })
          .catch((e: any) => {
            console.error('Error no callback', e);
            this.route.navigate(['/']);
          });
      } else {
        this.route.navigate(['/']);
      }
    });
  }
}
