export interface StatisticsFilter {
  firstPeriod?: Date;
  finalPeriod?: Date;
}

export interface EventFilters {
  rows: number;
  first: number;
  sortOrder: number;
  sortField: string;
  globalFilter: string;
  filters: [First][];
  multiSortMeta: SortMeta[];
}

export interface SortMeta {
  field: string;
  order: number;
}

export interface First {
  matchMode: string;
  operator: string;
  value: string;
}

export interface PostalCodeModel {
  uf: string;
  cep: string;
  bairro: string;
  logradouro: string;
  localidade: string;
  complemento: string;
}

export interface StateModel {
  uf: string;
  value: number;
  label: string;
}

export interface TopEquipmentsDTO {
  totalValue: number;
  description: string;
  patrimonyNumber: number;
  numberOfMaintenances: number;
}

export interface EquipmentsTotalDTO {
  equipmentTotal: number;
  totalValue: number;
}

export interface MaintenancesTotalDTO {
  maintenanceTotal: number;
  totalMaintenance: number;
  totalEquipmentsInMaintenance: number;
}

export interface VouchersTotalDTO {
  client: number;
  quantity: number;
  totalPrice: number;
  totalPriceFoods: number;
  totalPriceTickets: number;
}

export interface VouchersTopClientsDTO {
  name: string;
  client: number;
  totalPrice: number;
  numberOfVisit: number;
}

export interface ByStatusDTO {
  total: number;
  status: number;
}
