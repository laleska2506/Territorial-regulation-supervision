
import { Organization, OrganizationType, AreaType, Question, SubLocationType } from './types';

export const MOCK_PROVIDERS: Organization[] = [
  {
    id: '8898180',
    name: 'EPS GRAU S.A.',
    ruc: '20145236981',
    type: 'EPS' as OrganizationType,
    location: {
      region: 'Piura',
      province: 'Piura',
      district: 'Piura',
      ccpp: 'Sede Central',
      lat: -5.1945,
      lng: -80.6328
    },
    population: 150000,
    connections: 45000,
    status: 'ACTIVO',
    lastAudit: '12/05/2024',
    sedes: [
      { id: 'S1', name: 'Sullana Centro', type: SubLocationType.PC, status: 'VISITADO', lastVisit: '2025-01-15', lat: -4.9039, lng: -80.6853, completedModules: ['FISCALIZACION'] },
      { id: 'S2', name: 'Talara Alta', type: SubLocationType.PC, status: 'NO_PROGRAMADO', lat: -4.5772, lng: -81.2719, completedModules: [] },
      { id: 'S3', name: 'Paita Puerto', type: SubLocationType.PC, status: 'VISITADO', lastVisit: '2025-02-10', lat: -5.0892, lng: -81.1144, completedModules: ['CUOTA_FAMILIAR'] },
      { id: 'S4', name: 'Chulucanas Sur', type: SubLocationType.PC, status: 'NO_PROGRAMADO', lat: -5.0931, lng: -80.1625, completedModules: [] },
      { id: 'S5', name: 'Sechura Oeste', type: SubLocationType.PC, status: 'NO_PROGRAMADO', lat: -5.5569, lng: -80.8222, completedModules: [] }
    ]
  },
  {
    id: '8898181',
    name: 'JASS SAN ISIDRO',
    ruc: '20451234567',
    type: 'PRESTADOR' as OrganizationType,
    location: {
      region: 'Amazonas',
      province: 'Chachapoyas',
      district: 'Maino',
      ccpp: 'San Isidro',
      lat: -6.2289,
      lng: -77.8714
    },
    population: 450,
    connections: 112,
    status: 'ACTIVO',
    sedes: [
      { id: 'S6', name: 'Sector El Olivo', type: SubLocationType.OC, status: 'VISITADO', lastVisit: '2024-12-20', lat: -6.2300, lng: -77.8650, completedModules: ['FISCALIZACION'] },
      { id: 'S7', name: 'Sector La Pampa', type: SubLocationType.OC, status: 'NO_PROGRAMADO', lat: -6.2250, lng: -77.8800, completedModules: [] }
    ]
  },
  {
    id: '8898182',
    name: 'EPS SEDACUSCO S.A.',
    ruc: '20154879632',
    type: 'EPS' as OrganizationType,
    location: {
      region: 'Cusco',
      province: 'Cusco',
      district: 'Cusco',
      ccpp: 'Sede Central',
      lat: -13.5319,
      lng: -71.9675
    },
    population: 450000,
    connections: 120000,
    status: 'ACTIVO',
    sedes: [
      { id: 'S8', name: 'San Sebastian', type: SubLocationType.PC, status: 'PENDIENTE', lat: -13.5200, lng: -71.9300, completedModules: [] }
    ]
  },
  {
    id: '8898183',
    name: 'JASS HUANCARANI',
    ruc: '20601234567',
    type: 'PRESTADOR' as OrganizationType,
    location: {
      region: 'Cusco',
      province: 'Paucartambo',
      district: 'Huancarani',
      ccpp: 'Huancarani',
      lat: -13.5500,
      lng: -71.5500
    },
    population: 1200,
    connections: 300,
    status: 'OBSERVADO',
    sedes: [
      { id: 'S9', name: 'Sector Alto', type: SubLocationType.OC, status: 'PENDIENTE', lat: -13.5550, lng: -71.5550, completedModules: [] }
    ]
  }
];

export const FISCALIZACION_QUESTIONS: Question[] = [
  { id: 'F1', section: '1. Operatividad', text: '¿El sistema de cloración se encuentra operativo y en buen estado?', referenceArt: 'Art. 42 RCPSSPC' },
  { id: 'F2', section: '1. Operatividad', text: '¿Se realiza el mantenimiento preventivo de las infraestructuras?', referenceArt: 'Art. 45 RCPSSPC' },
  { id: 'F3', section: '2. Calidad', text: '¿Los niveles de cloro residual están dentro del rango permitido (0.5 - 1.0 mg/L)?', referenceArt: 'Art. 48 RCPSSPC' },
  { id: 'F4', section: '2. Calidad', text: '¿Se cuenta con registros actualizados de control de cloro?', referenceArt: 'Art. 50 RCPSSPC' },
];

export const USUARIOS_QUESTIONS: Question[] = [
  { id: 'U1', section: '1. Atención', text: '¿Cuenta con un libro de reclamaciones físico o virtual?', referenceArt: 'Art. 12 Reglamento Usuarios' },
  { id: 'U2', section: '1. Atención', text: '¿El horario de atención al público es visible y se cumple?', referenceArt: 'Art. 15 Reglamento Usuarios' },
  { id: 'U3', section: '2. Facturación', text: '¿Se entregan los recibos de pago con la anticipación debida?', referenceArt: 'Art. 22 Reglamento Usuarios' },
];

export const CARACTERIZACION_QUESTIONS: Question[] = [
  { id: 'C1', section: '1. Infraestructura', text: '¿Se tiene identificado el tipo de fuente de agua?', referenceArt: 'Guía Caracterización' },
  { id: 'C2', section: '1. Infraestructura', text: '¿Se cuenta con planos actualizados del sistema de agua?', referenceArt: 'Guía Caracterización' },
  { id: 'C3', section: '2. Población', text: '¿Se tiene el padrón de usuarios actualizado al presente año?', referenceArt: 'Guía Caracterización' },
];

export const CUOTA_FAMILIAR_QUESTIONS: Question[] = [
  { id: 'CF1', section: '1. Cálculo', text: '¿La cuota familiar fue aprobada en Asamblea General?', referenceArt: 'Metodología Sunass' },
  { id: 'CF2', section: '1. Cálculo', text: '¿Se aplicó la metodología de Sunass para el cálculo de la cuota?', referenceArt: 'Metodología Sunass' },
  { id: 'CF3', section: '2. Recaudación', text: '¿El nivel de morosidad es inferior al 20%?', referenceArt: 'Metodología Sunass' },
];

export const ALL_QUESTIONS = {
  FISCALIZACION: FISCALIZACION_QUESTIONS,
  ATENCION_USUARIOS: USUARIOS_QUESTIONS,
  CARACTERIZACION: CARACTERIZACION_QUESTIONS,
  CUOTA_FAMILIAR: CUOTA_FAMILIAR_QUESTIONS
};
