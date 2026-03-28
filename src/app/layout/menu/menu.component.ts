import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';
import { PagesComponent } from 'src/app/pages';
import { MenuitemComponent } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [NgClass, MenuitemComponent],
})
export class MenuComponent implements OnInit {
  model: any[] = [];

  constructor(private auth: AuthService, public app: PagesComponent) {}
  //https://www.primefaces.org/showcase-v8/ui/misc/fa.xhtml

  //https://fontawesome.com/v4/icons/

  ngOnInit() {
    this.model = [
      {
        label: 'Dashboard Voucher',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard-voucher'],
      },
      {
        label: 'Dashboard Equipamento',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard-equipment'],
        visible: this.isAllowed([wsPermissions.ROLE_VIEW_DASHBOARD_EQUIPMENT]),
      },

      /* Voucher*/
      {
        label: 'Voucher',
        routerLink: ['/voucher'],
        icon: 'pi pi-fw pi-ticket',
        visible: this.isAllowed([wsPermissions.ROLE_VOUCHERS_CONSULT]),
      },

      /* Cortesia*/
      {
        label: 'Cortesia',
        routerLink: ['/courtesy'],
        icon: 'fa fa-fw fas fa-user',
        visible: this.isAllowed([wsPermissions.ROLE_COURTESY_CONSULT]),
      },

      /* Management */
      {
        label: 'Administração',
        icon: 'fa fa-fw fas fa-adn',
        routerLink: ['/management'],
        visible: this.isAllowed([
          wsPermissions.ROLE_AGENTS_CONSULT,
          wsPermissions.ROLE_PRODUCTS_CONSULT,
          wsPermissions.ROLE_CANCELLATION_REASON_CONSULT,
        ]),
        items: [
          /* Agents */
          {
            label: 'Agentes',
            icon: 'pi pi-fw pi-id-card',
            routerLink: ['/management/agents'],
            visible: this.isAllowed([wsPermissions.ROLE_AGENTS_CONSULT]),
          },
          /* Products */
          {
            label: 'Produtos',
            icon: 'pi pi-fw pi-truck',
            routerLink: ['/management/products'],
            visible: this.isAllowed([wsPermissions.ROLE_PRODUCTS_CONSULT]),
          },
          /* Cancellation Reason */
          {
            label: 'Motivo Cancelamento',
            icon: 'fa fa-fw fas fa-adjust',
            routerLink: ['/management/reasons'],
            visible: this.isAllowed([wsPermissions.ROLE_CANCELLATION_REASON_CONSULT]),
          },
        ],
      },
      /* Patrimony */
      {
        label: 'Patrimônio',
        icon: 'pi pi-fw pi-tags',
        routerLink: ['/patrimony'],
        visible: this.isAllowed([
          wsPermissions.ROLE_LOCATION_CONSULT,
          wsPermissions.ROLE_HISTORIC_CONSULT,
          wsPermissions.ROLE_EQUIPMENT_CONSULT,
          wsPermissions.ROLE_MAINTENANCE_SCHEDULE_CONSULT,
          wsPermissions.ROLE_MAINTENANCE_CARRIED_OUT_CONSULT,
        ]),
        items: [
          {
            label: 'Equipamento',
            icon: 'pi pi-fw pi-inbox',
            routerLink: ['/patrimony/equipment'],
            visible: this.isAllowed([wsPermissions.ROLE_EQUIPMENT_CONSULT]),
          },

          {
            label: 'Locais',
            icon: 'fa fa-fw fas fa-bank',
            routerLink: ['/patrimony/location'],
            visible: this.isAllowed([wsPermissions.ROLE_LOCATION_CONSULT]),
          },
          {
            label: 'Histórico',
            icon: 'pi pi-fw pi-history',
            routerLink: ['/patrimony/historic'],
            visible: this.isAllowed([wsPermissions.ROLE_HISTORIC_CONSULT]),
          },
          {
            label: 'Manutenção',
            icon: 'pi pi-fw pi-wrench',
            routerLink: ['/patrimony/maintenance'],
            visible: this.isAllowed([
              wsPermissions.ROLE_MAINTENANCE_SCHEDULE_CONSULT,
              wsPermissions.ROLE_MAINTENANCE_CARRIED_OUT_CONSULT,
            ]),
            items: [
              {
                label: 'Realizadas',
                icon: 'fa fa-fw fas fa-check-square-o',
                routerLink: ['/patrimony/maintenance/carried-out'],
                visible: this.isAllowed([wsPermissions.ROLE_MAINTENANCE_CARRIED_OUT_CONSULT]),
              },
              {
                label: 'Agenda',
                icon: 'fa fa-fw fas fa-list-ul',
                routerLink: ['/patrimony/maintenance/schedule'],
                visible: this.isAllowed([wsPermissions.ROLE_MAINTENANCE_SCHEDULE_CONSULT]),
              },
            ],
          },
        ],
      },

      /* Pool Parameters */
      {
        label: 'Operacional',
        icon: 'fa fa-fw fas fa-stack-exchange',
        routerLink: ['/operational'],
        visible: this.isAllowed([
          wsPermissions.ROLE_FLEETS_CONSULT,
          wsPermissions.ROLE_POOL_PARAMETERS_CONSULT,
          wsPermissions.ROLE_CHLORINE_PARAMETERS_CONSULT,
        ]),
        items: [
          /* Fleets */
          {
            label: 'Frotas',
            icon: 'fa fa-fw fas fa-car',
            routerLink: ['/operational/fleets'],
            visible: this.isAllowed([wsPermissions.ROLE_FLEETS_CONSULT]),
          },
          /* Piscinas */
          {
            label: 'Piscinas',
            icon: 'fa fa-fw fas fa-sun-o',
            routerLink: ['/operational/pool-parameters'],
            visible: this.isAllowed([wsPermissions.ROLE_POOL_PARAMETERS_CONSULT]),
          },
          /* Cloro */
          {
            label: 'Maquina Cloro',
            icon: 'fa fa-fw fas fa-soundcloud',
            routerLink: ['/operational/chlorine-parameters'],
            visible: this.isAllowed([wsPermissions.ROLE_CHLORINE_PARAMETERS_CONSULT]),
          },
        ],
      },

      /* Security */
      {
        label: 'Segurança',
        icon: 'pi pi-fw pi-lock',
        routerLink: ['/security'],
        visible: this.isAllowed([wsPermissions.ROLE_USERS_CONSULT]),
        items: [
          /* Users */
          {
            label: 'Usuários',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/security/users'],
            visible: this.isAllowed([wsPermissions.ROLE_USERS_CONSULT]),
          },
          /* Groups */
          {
            label: 'Grupos',
            icon: 'pi pi-fw pi-shield',
            routerLink: ['/security/groups'],
            visible: this.isAllowed([wsPermissions.ROLE_GROUPS_CONSULT]),
          },
        ],
      },
      /* Config*/
      {
        label: 'Configurações',
        icon: 'pi pi-fw pi-cog',
        routerLink: ['/config'],
        visible: this.isAllowed([wsPermissions.ROLE_CONFIG_CONSULT]),
      },
    ];
  }

  onMenuClick(event: any) {
    this.app.onMenuClick(event);
  }

  isAllowed(permissions: string[]) {
    if (this.auth.hasAnyPermission(permissions)) {
      return true;
    }
    return false;
  }
}
