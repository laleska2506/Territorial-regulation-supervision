import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Users,
  ChevronRight,
  Filter,
  Building,
  Loader2
} from 'lucide-react';
import {
  getDepartments,
  getProvincesByDepartment,
  getDistrictsByProvince,
  getLocalitiesByDistrict,
  getPrestadores,
  DepartmentAPI,
  ProvinceAPI,
  DistrictAPI,
  LocalityAPI,
  PrestadorAPI
} from '../services/apiService';
import { Organization } from '../types';

interface TerritorialSelectorProps {
  onSelect: (org: Organization, locality: { province: string, district: string }) => void;
}

export const TerritorialSelector: React.FC<TerritorialSelectorProps> = ({ onSelect }) => {
  // Data
  const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
  const [provinces, setProvinces] = useState<ProvinceAPI[]>([]);
  const [districts, setDistricts] = useState<DistrictAPI[]>([]);
  const [localities, setLocalities] = useState<LocalityAPI[]>([]);
  const [organizations, setOrganizations] = useState<PrestadorAPI[]>([]);

  // Selections
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load departments on mount
  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(err => console.error('Error loading departments:', err));
  }, []);

  // Load provinces when department changes
  useEffect(() => {
    if (!selectedDepartment) { setProvinces([]); return; }
    setLoading(true);
    getProvincesByDepartment(selectedDepartment)
      .then(setProvinces)
      .catch(err => console.error('Error loading provinces:', err))
      .finally(() => setLoading(false));
  }, [selectedDepartment]);

  // Load districts when province changes
  useEffect(() => {
    if (!selectedProvince) { setDistricts([]); return; }
    setLoading(true);
    getDistrictsByProvince(selectedProvince)
      .then(setDistricts)
      .catch(err => console.error('Error loading districts:', err))
      .finally(() => setLoading(false));
  }, [selectedProvince]);

  // Load localities when district changes
  useEffect(() => {
    if (!selectedDistrict) { setLocalities([]); return; }
    setLoading(true);
    getLocalitiesByDistrict(selectedDistrict)
      .then(setLocalities)
      .catch(err => console.error('Error loading localities:', err))
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  // Load prestadores when locality changes
  useEffect(() => {
    if (!selectedLocality) { setOrganizations([]); return; }
    setLoading(true);
    getPrestadores({ localityId: selectedLocality })
      .then(setOrganizations)
      .catch(err => console.error('Error loading prestadores:', err))
      .finally(() => setLoading(false));
  }, [selectedLocality]);

  // Filter organizations by search term
  const filteredOrgs = useMemo(() => {
    if (!searchTerm) return organizations;
    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [organizations, searchTerm]);

  // Get selected names for display
  const selectedDeptName = departments.find(d => d.id === selectedDepartment)?.name || '';
  const selectedProvName = provinces.find(p => p.id === selectedProvince)?.name || '';
  const selectedDistName = districts.find(d => d.id === selectedDistrict)?.name || '';
  const selectedLocName = localities.find(l => l.id === selectedLocality)?.name || '';

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedLocality('');
    setOrganizations([]);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
    setSelectedLocality('');
    setOrganizations([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedLocality('');
    setOrganizations([]);
  };

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocality(e.target.value);
    setOrganizations([]);
  };

  const handleOrgClick = (org: PrestadorAPI) => {
    const organization: Organization = {
      id: org.id,
      name: org.name,
      type: org.prestadorType === 'EP' ? 'EPS' : 'PRESTADOR',
      ruc: org.ruc || undefined,
      location: {
        region: selectedDeptName,
        province: selectedProvName,
        district: selectedDistName,
        ccpp: selectedLocName
      },
      population: 0,
      connections: 0,
      status: 'ACTIVO',
      sedes: []
    };
    onSelect(organization, { province: selectedProvName, district: selectedDistName });
  };

  return (
    <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selección Territorial</h2>
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
            <Filter className="w-5 h-5" />
          </div>
        </div>

        {/* Row 1: Departamento + Provincia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departamento</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all"
              >
                <option value="">Seleccione Departamento</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provincia</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                disabled={!selectedDepartment}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-slate-50"
              >
                <option value="">Seleccione Provincia</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Distrito + Localidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Distrito</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-slate-50"
              >
                <option value="">Seleccione Distrito</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localidad / Centro Poblado</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedLocality}
                onChange={handleLocalityChange}
                disabled={!selectedDistrict}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-slate-50"
              >
                <option value="">Seleccione Localidad</option>
                {localities.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {selectedLocality && (
          <div className="relative animate-fade-in">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por nombre de EP o JASS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scroll min-h-[300px]">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-500 font-bold">Cargando datos...</p>
          </div>
        ) : !selectedLocality ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="bg-slate-100 p-6 rounded-full">
              <Building className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold max-w-[220px]">Seleccione departamento, provincia, distrito y localidad para ver los prestadores</p>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-slate-100 p-6 rounded-full">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold">No se encontraron prestadores en esta localidad</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              {filteredOrgs.length} Prestador{filteredOrgs.length !== 1 ? 'es' : ''} en {selectedLocName}
            </p>
            {filteredOrgs.map(org => (
              <button
                key={org.id}
                onClick={() => handleOrgClick(org)}
                className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-500 hover:shadow-xl transition-all group text-left ring-1 ring-slate-900/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${org.prestadorType === 'EP' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {org.prestadorType === 'EP' ? <Building2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{org.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${org.prestadorType === 'EP' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {org.prestadorType === 'EP' ? 'EPS' : 'PRESTADOR / JASS'}
                      </span>
                      {org.ruc && (
                        <span className="text-[9px] font-semibold text-slate-400">RUC: {org.ruc}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
