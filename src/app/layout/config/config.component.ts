import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppComponent } from 'src/app/app.component';
import { PagesComponent } from 'src/app/pages';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styles: [],
  standalone: true,
  imports: [NgClass, RadioButtonModule, FormsModule, InputSwitchModule, NgStyle],
})
export class ConfigComponent implements OnInit {
  themes: { name: string; color: string }[] = [];

  constructor(public appMain: PagesComponent, public app: AppComponent) {}

  ngOnInit(): void {
    this.themes = [
      { name: 'blue-grey', color: '#3D72B4' },
      { name: 'blue-orange', color: '#147df0' },
      { name: 'cyan-deeporange', color: '#00B4DB' },
      { name: 'darkpink-cyan', color: '#C06C84' },
      { name: 'deeppurple-teal', color: '#5F2C82' },
      { name: 'green-orange', color: '#96C93D' },
      { name: 'green-pink', color: '#57CA85' },
      { name: 'green-purple', color: '#56AB2F' },
      { name: 'indigo-purple', color: '#4B79A1' },
      { name: 'indigo-yellow', color: '#4E54C8' },
      { name: 'orange-cyan', color: '#e96443' },
      { name: 'orange-indigo', color: '#F3904F' },
      { name: 'pink-cyan', color: '#E94057' },
      { name: 'pink-teal', color: '#d9427c' },
      { name: 'teal-yellow', color: '#136A8A' },
    ];
  }

  changeTheme(theme: string) {
    this.app.theme = theme;
    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
    const layoutHref = 'assets/layout/css/layout-' + theme + '.css';

    this.replaceLink(layoutLink, layoutHref);

    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
    const themeHref = 'assets/theme/theme-' + theme + '.css';

    this.replaceLink(themeLink, themeHref);
  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement: any, href: string): void {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

  onConfigButtonClick(event: { preventDefault: () => void }) {
    this.appMain.configActive = !this.appMain.configActive;
    this.appMain.configClick = true;
    event.preventDefault();
  }
}
