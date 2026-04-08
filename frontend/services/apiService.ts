const API_BASE_URL = "http://localhost:8080/api";

// ── Types from Backend ──────────────────────────────────────

export interface DepartmentAPI {
    id: string;
    name: string;
}

export interface ProvinceAPI {
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
}

export interface DistrictAPI {
    id: string;
    name: string;
    provinceId: string;
}

export interface LocalityAPI {
    id: string;
    ubigeo: string;
    name: string;
    provinceId: string;
    provinceName: string;
    districtId: string;
    districtName: string;
    lat: number | null;
    lng: number | null;
    population: number | null;
}

export interface PrestadorAPI {
    id: string;
    prestadorType: 'JASS' | 'EP' | 'OC' | 'PM' | 'UGM' | 'OTRO';
    name: string;
    code: string | null;
    ruc: string | null;
    isActive: boolean;
    localities: LocalityAPI[];
}

// ── API Client ──────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ── Territory Endpoints ─────────────────────────────────────

export async function getDepartments(): Promise<DepartmentAPI[]> {
    return apiFetch<DepartmentAPI[]>('/territory/departments');
}

export async function getProvincesByDepartment(departmentId: string): Promise<ProvinceAPI[]> {
    return apiFetch<ProvinceAPI[]>(`/territory/departments/${departmentId}/provinces`);
}

export async function getDistrictsByProvince(provinceId: string): Promise<DistrictAPI[]> {
    return apiFetch<DistrictAPI[]>(`/territory/provinces/${provinceId}/districts`);
}

export async function getLocalitiesByDistrict(districtId: string): Promise<LocalityAPI[]> {
    return apiFetch<LocalityAPI[]>(`/territory/districts/${districtId}/localities`);
}

// ── Prestador Endpoints ─────────────────────────────────────

export async function getPrestadores(params?: {
    localityId?: string;
    districtId?: string;
    type?: string;
    search?: string;
}): Promise<PrestadorAPI[]> {
    const searchParams = new URLSearchParams();
    if (params?.localityId) searchParams.set('localityId', params.localityId);
    if (params?.districtId) searchParams.set('districtId', params.districtId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.search) searchParams.set('search', params.search);

    const qs = searchParams.toString();
    return apiFetch<PrestadorAPI[]>(`/prestadores${qs ? '?' + qs : ''}`);
}

export async function getPrestadorById(id: string): Promise<PrestadorAPI> {
    return apiFetch<PrestadorAPI>(`/prestadores/${id}`);
}
