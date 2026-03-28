import {
  state,
  style,
  animate,
  trigger,
  transition,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import { Input, OnInit, OnDestroy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive, RouterLink } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { PagesComponent } from '../../pages/pages.component';
import { MenuService } from '../menu.service';


@Component({
    selector: '[app-menuitem]',
    templateUrl: './menuitem.component.html',
    host: {
        '[class.active-menuitem]': 'active',
    },
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px',
            })),
            state('hiddenAnimated', style({
                height: '0px',
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            state('visible', style({
                height: '*',
                'z-index': 100,
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
        ]),
    ],
    standalone: true,
    imports: [
    NgClass,
    RouterLinkActive,
    RouterLink
],
})
export class MenuitemComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() index!: number;
  @Input() root!: boolean;
  @Input() parentKey!: string;

  active = false;

  menuResetSubscription: Subscription;
  menuSourceSubscription: Subscription;

  key!: string;

  constructor(
    public router: Router,
    public app: PagesComponent,
    private menuService: MenuService
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(
      (key) => {
        // deactivate current active menu
        if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
          this.active = false;
        }
      }
    );

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((params) => {
        if (this.app.isHorizontal()) {
          this.active = false;
        } else {
          if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
          } else {
            this.active = false;
          }
        }
      });
  }

  ngOnInit() {
    if (!this.app.isHorizontal() && this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }

    this.key = this.parentKey
      ? this.parentKey + '-' + this.index
      : String(this.index);
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(
      this.item.routerLink[0],
      !this.item.items && !this.item.preventExact
    );
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      // hide overlay menus
      if (this.app.isMobile()) {
        this.app.overlayMenuActive = false;
        this.app.staticMenuMobileActive = false;
        this.app.menuHoverActive = !this.app.menuHoverActive;
      }

      // reset horizontal menu
      if (this.app.isHorizontal()) {
        this.menuService.reset();
      }
    }
  }

  onMouseEnter() {
    // activate item on hover
    if (
      this.root &&
      this.app.menuHoverActive &&
      this.app.isHorizontal() &&
      this.app.isDesktop()
    ) {
      this.menuService.onMenuStateChange(this.key);
      this.active = true;
    }
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}
