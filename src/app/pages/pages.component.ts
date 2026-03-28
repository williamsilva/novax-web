import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../auth';
import { AppComponent } from '../app.component';
import { MenuService, TopBarComponent } from '../layout';
import { MenuComponent } from '../layout/menu/menu.component';
import { ConfigComponent } from '../layout/config/config.component';
import { RightpanelComponent } from '../layout/rightpanel/rightpanel.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  standalone: true,
  imports: [NgClass, RouterOutlet, MenuComponent, TopBarComponent, ConfigComponent, RightpanelComponent],
})
export class PagesComponent {
  activeTopBarItem: any;
  slimMenuAnchor = false;
  menuClick: boolean = false;
  resetMenu: boolean = false;
  configClick: boolean = false;
  configActive: boolean = false;
  slimMenuActive: boolean = false;
  topBarItemClick: boolean = false;
  rightPanelClick: boolean = false;
  menuHoverActive: boolean = false;
  topBarMenuActive: boolean = false;
  toggleMenuActive: boolean = false;
  rightPanelActive: boolean = false;
  overlayMenuActive: boolean = false;
  staticMenuMobileActive: boolean = false;
  staticMenuDesktopInactive: boolean = false;

  constructor(
    private menuService: MenuService,
    public app: AppComponent,
    private auth: AuthService,
  ) {}

  onLayoutClick() {
    if (!this.topBarItemClick) {
      this.activeTopBarItem = null;
      this.topBarMenuActive = false;
    }

    if (!this.rightPanelClick) {
      this.rightPanelActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal()) {
        this.menuService.reset();
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      if (this.slimMenuActive) {
        this.hideSlimMenu();
      }

      if (this.toggleMenuActive) {
        this.hideToggleMenu();
      }

      this.menuHoverActive = false;
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }

    this.configClick = false;
    this.topBarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
  }

  onMenuButtonClick(event: { preventDefault: () => void }) {
    this.menuClick = true;
    this.topBarMenuActive = false;

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isToggle()) {
      this.toggleMenuActive = !this.toggleMenuActive;
    }
    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
  }

  onMenuClick($event: any) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onAnchorClick(event: { preventDefault: () => void }) {
    if (this.isSlim()) {
      this.slimMenuAnchor = !this.slimMenuAnchor;
    }
    event.preventDefault();
  }

  onMenuMouseEnter(event: any) {
    if (this.isSlim()) {
      this.slimMenuActive = true;
    }
  }

  onMenuMouseLeave(event: any) {
    if (this.isSlim()) {
      this.slimMenuActive = false;
    }
  }

  onTopBarMenuButtonClick(event: { preventDefault: () => void }) {
    this.topBarItemClick = true;
    this.topBarMenuActive = !this.topBarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopBarItemClick(event: { preventDefault: () => void }, item: any) {
    this.topBarItemClick = true;

    if (this.activeTopBarItem === item) {
      this.activeTopBarItem = null;
    } else {
      this.activeTopBarItem = item;
    }

    event.preventDefault();
  }

  onTopBarSubItemClick(event: { preventDefault: () => void }) {
    event.preventDefault();
  }

  onRightPanelButtonClick(event: { preventDefault: () => void }) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
  }

  onRippleChange(event: { checked: boolean }) {
    this.app.ripple = event.checked;
  }

  onConfigClick(event: any) {
    this.configClick = true;
  }

  isHorizontal() {
    return this.app.menuMode === 'horizontal';
  }

  isSlim() {
    return this.app.menuMode === 'slim';
  }

  isOverlay() {
    return this.app.menuMode === 'overlay';
  }

  isToggle() {
    return this.app.menuMode === 'toggle';
  }

  isStatic() {
    return this.app.menuMode === 'static';
  }

  isMobile() {
    return window.innerWidth < 1281;
  }

  isDesktop() {
    return window.innerWidth > 1280;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1280 && width > 640;
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  hideSlimMenu() {
    this.slimMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  hideToggleMenu() {
    this.toggleMenuActive = false;
    this.staticMenuMobileActive = false;
  }
}
