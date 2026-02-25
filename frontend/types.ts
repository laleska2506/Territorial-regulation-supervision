
export enum AreaType {
  SMALL_CITY = 'Pequeña Ciudad (2k-15k)',
  RURAL = 'Rural (<2k)'
}

export enum SubLocationType {
  PC = 'Pequeña Ciudad',
  OC = 'Organización Comunal',
  CP = 'Centro Poblado'
}

export interface Location {
  region: string;
  province: string;
  district: string;
  ccpp: string;
  lat?: number;
  lng?: number;
}

export interface SubLocation {
  id: string;
  name: string;
  type: SubLocationType;
  lastVisit?: string;
  status: 'VISITADO' | 'PENDIENTE' | 'NO_PROGRAMADO';
  completedModules?: string[];
  lat: number;
  lng: number;
}

export interface Question {
  id: string;
  text: string;
  section: string;
  referenceArt?: string;
}

export interface ChecklistState {
  [questionId: string]: 'SI' | 'NO' | null;
}

export type OrganizationType = "EPS" | "PRESTADOR";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  ruc?: string;
  location: Location;
  population: number;
  connections: number;
  status: 'ACTIVO' | 'INACTIVO' | 'OBSERVADO';
  lastAudit?: string;
  sedes: SubLocation[];
}

export interface Locality {
  id: string;
  province: string;
  district: string;
}

export interface OrganizationLocality {
  organizationId: string;
  localityId: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  organizationId: string;
  localityId: string;
  sedeId: string;
  sedeName: string;
  module: string;
  results: ChecklistState;
  reportSummary?: string;
  evidence?: string[];
}
