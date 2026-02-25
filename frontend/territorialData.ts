
import { Organization, OrganizationType, Locality, OrganizationLocality } from './types';

// Hierarchical types for UI
export interface DistrictNode {
  name: string;
  organizations: Organization[];
}

export interface ProvinceNode {
  name: string;
  districts: DistrictNode[];
}

export interface OAUNode {
  oau: string;
  provinces: ProvinceNode[];
}

// Raw data from Apurímac
export const RAW_APURIMAC_DATA = [
  // ABANCAY
  { oau: "ODS-DAP-APURIMAC", type: "EPS" as OrganizationType, name: "EMUSAP ABANCAY S.A", province: "ABANCAY", district: "ABANCAY" },
  { oau: "ODS-DAP-APURIMAC", type: "EPS" as OrganizationType, name: "EMUSAP ABANCAY S.A", province: "ABANCAY", district: "TAMBURCO" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jas Accoran", province: "ABANCAY", district: "CURAHUASI" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Ccoc Hua Centro", province: "ABANCAY", district: "CURAHUASI" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Occoruro", province: "ABANCAY", district: "CURAHUASI" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Trancapata Alta", province: "ABANCAY", district: "CURAHUASI" },
  
  // ANDAHUAYLAS
  { oau: "ODS-DAP-APURIMAC", type: "EPS" as OrganizationType, name: "EMSAP CHANKA DE ANDAHUAYLAS", province: "ANDAHUAYLAS", district: "ANDAHUAYLAS" },
  { oau: "ODS-DAP-APURIMAC", type: "EPS" as OrganizationType, name: "EMSAP CHANKA DE ANDAHUAYLAS", province: "ANDAHUAYLAS", district: "SAN JERONIMO" },
  { oau: "ODS-DAP-APURIMAC", type: "EPS" as OrganizationType, name: "EMSAP CHANKA DE ANDAHUAYLAS", province: "ANDAHUAYLAS", district: "TALAVERA" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Huichucancha", province: "ANDAHUAYLAS", district: "PACUCHA" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Pacucha", province: "ANDAHUAYLAS", district: "PACUCHA" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass San Miguel", province: "ANDAHUAYLAS", district: "PACUCHA" },
  { oau: "ODS-DAP-APURIMAC", type: "PRESTADOR" as OrganizationType, name: "Jass Santa Rosa", province: "ANDAHUAYLAS", district: "PACUCHA" },
];

/**
 * Gets unique provinces from the data.
 */
export function getProvinces(data: typeof RAW_APURIMAC_DATA): string[] {
  return Array.from(new Set(data.map(item => item.province))).sort();
}

/**
 * Gets unique districts for a given province.
 */
export function getDistricts(data: typeof RAW_APURIMAC_DATA, province: string): string[] {
  return Array.from(new Set(data.filter(item => item.province === province).map(item => item.district))).sort();
}

/**
 * Gets organizations for a given province and district.
 */
export function getOrganizationsByLocation(data: typeof RAW_APURIMAC_DATA, province: string, district: string): Organization[] {
  const filtered = data.filter(item => item.province === province && item.district === district);
  const orgs: Organization[] = [];
  const seen = new Set<string>();

  filtered.forEach(item => {
    if (!seen.has(item.name)) {
      seen.add(item.name);
      orgs.push({
        id: `org-${item.name.replace(/\s+/g, '-')}`,
        name: item.name,
        type: item.type,
        location: {
          region: 'APURIMAC',
          province: item.province,
          district: item.district,
          ccpp: item.district
        },
        population: 0,
        connections: 0,
        status: 'ACTIVO',
        sedes: []
      });
    }
  });

  return orgs;
}

/**
 * Gets all districts/localities linked to a specific organization.
 */
export function getDistrictsByOrganization(data: typeof RAW_APURIMAC_DATA, orgName: string): { province: string, district: string }[] {
  return data
    .filter(item => item.name === orgName)
    .map(item => ({ province: item.province, district: item.district }));
}

/**
 * Transforms flat data into a hierarchical structure grouped by OAU, Province, and District.
 */
export function transformToHierarchy(data: typeof RAW_APURIMAC_DATA, filterType?: OrganizationType, searchTerm?: string): OAUNode[] {
  const hierarchy: Record<string, OAUNode> = {};

  data.forEach(item => {
    // Apply filters
    if (filterType && item.type !== filterType) return;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return;

    if (!hierarchy[item.oau]) {
      hierarchy[item.oau] = { oau: item.oau, provinces: [] };
    }

    let provinceNode = hierarchy[item.oau].provinces.find(p => p.name === item.province);
    if (!provinceNode) {
      provinceNode = { name: item.province, districts: [] };
      hierarchy[item.oau].provinces.push(provinceNode);
    }

    let districtNode = provinceNode.districts.find(d => d.name === item.district);
    if (!districtNode) {
      districtNode = { name: item.district, organizations: [] };
      provinceNode.districts.push(districtNode);
    }

    // Avoid duplicates in the same district
    if (!districtNode.organizations.find(o => o.name === item.name)) {
      districtNode.organizations.push({
        id: `${item.name}-${item.province}-${item.district}`, // Simple unique ID for mock
        name: item.name,
        type: item.type,
        location: {
          region: 'APURIMAC',
          province: item.province,
          district: item.district,
          ccpp: item.district
        },
        population: 0,
        connections: 0,
        status: 'ACTIVO',
        sedes: []
      } as Organization);
    }
  });

  return Object.values(hierarchy);
}

/**
 * Normalizes the raw data into the requested relational structure.
 */
export function normalizeData(data: typeof RAW_APURIMAC_DATA) {
  const organizations: Organization[] = [];
  const localities: Locality[] = [];
  const organizationLocalities: OrganizationLocality[] = [];

  const orgMap = new Map<string, string>();
  const locMap = new Map<string, string>();

  data.forEach(item => {
    let orgId = orgMap.get(item.name);
    if (!orgId) {
      orgId = `org-${organizations.length + 1}`;
      orgMap.set(item.name, orgId);
      organizations.push({ 
        id: orgId, 
        name: item.name, 
        type: item.type,
        location: {
          region: 'APURIMAC',
          province: item.province,
          district: item.district,
          ccpp: item.district
        },
        population: 0,
        connections: 0,
        status: 'ACTIVO',
        sedes: []
      } as Organization);
    }

    const locKey = `${item.province}-${item.district}`;
    let locId = locMap.get(locKey);
    if (!locId) {
      locId = `loc-${localities.length + 1}`;
      locMap.set(locKey, locId);
      localities.push({ id: locId, province: item.province, district: item.district });
    }

    organizationLocalities.push({ organizationId: orgId, localityId: locId });
  });

  return { organizations, localities, organizationLocalities };
}
