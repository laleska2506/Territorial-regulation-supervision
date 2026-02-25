import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  Users, 
  ChevronRight,
  Filter,
  Building
} from 'lucide-react';
import { 
  RAW_APURIMAC_DATA, 
  getProvinces, 
  getDistricts, 
  getOrganizationsByLocation 
} from '../territorialData';
import { Organization } from '../types';

interface TerritorialSelectorProps {
  onSelect: (org: Organization, locality: { province: string, district: string }) => void;
}

export const TerritorialSelector: React.FC<TerritorialSelectorProps> = ({ onSelect }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const provinces = useMemo(() => getProvinces(RAW_APURIMAC_DATA), []);
  
  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    return getDistricts(RAW_APURIMAC_DATA, selectedProvince);
  }, [selectedProvince]);

  const organizations = useMemo(() => {
    if (!selectedProvince || !selectedDistrict) return [];
    return getOrganizationsByLocation(RAW_APURIMAC_DATA, selectedProvince, selectedDistrict)
      .filter(org => org.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [selectedProvince, selectedDistrict, searchTerm]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provincia</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all"
              >
                <option value="">Seleccione Provincia</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Distrito</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedProvince}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-slate-50"
              >
                <option value="">Seleccione Distrito</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {selectedDistrict && (
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
        {!selectedProvince || !selectedDistrict ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="bg-slate-100 p-6 rounded-full">
              <Building className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold max-w-[200px]">Seleccione una ubicación para ver los prestadores disponibles</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-slate-100 p-6 rounded-full">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold">No se encontraron prestadores en esta ubicación</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Prestadores en {selectedDistrict}
            </p>
            {organizations.map(org => (
              <button
                key={org.id}
                onClick={() => onSelect(org, { province: selectedProvince, district: selectedDistrict })}
                className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-500 hover:shadow-xl transition-all group text-left ring-1 ring-slate-900/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${org.type === 'EPS' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {org.type === 'EPS' ? <Building2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{org.name}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest mt-1 inline-block ${org.type === 'EPS' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {org.type === 'EPS' ? 'EPS' : 'PRESTADOR / JASS'}
                    </span>
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
