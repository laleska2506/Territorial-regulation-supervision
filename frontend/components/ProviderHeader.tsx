
import React from 'react';
import { Organization } from '../types';
import { Building2, MapPin, Activity, FileText, ChevronLeft, Calendar, Database } from 'lucide-react';

interface ProviderHeaderProps {
  provider: Organization;
  onBack: () => void;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ provider, onBack }) => {
  return (
    <div className="bg-white border-b border-slate-200 z-10 transition-all">
      {/* Main Info Block */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
             <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{provider.name}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                provider.status === 'ACTIVO' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {provider.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-slate-400" />
                RUC: <span className="text-slate-700 font-mono">{provider.ruc}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {provider.location.district}, {provider.location.region}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Últ. Supervisión: <span className="text-slate-700">{provider.lastAudit || 'Pendiente'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl">
           <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Población</p>
              <p className="text-lg font-bold text-slate-900">{provider.population.toLocaleString()}</p>
           </div>
           <div className="w-px h-8 bg-slate-200"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conexiones</p>
              <p className="text-lg font-bold text-slate-900">{provider.connections.toLocaleString()}</p>
           </div>
           <div className="w-px h-8 bg-slate-200"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo EP</p>
              <p className="text-lg font-bold text-indigo-600">{provider.type}</p>
           </div>
        </div>
      </div>

      {/* Vital Signs Bar - Heurística #1 Visibility of system status */}
      <div className="bg-slate-50/50 px-8 py-2 border-t border-slate-100 flex gap-6 text-xs font-bold overflow-x-auto custom-scroll">
        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-tighter">
           <Activity className="w-3.5 h-3.5 text-indigo-500" />
           Indicadores Clave:
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
              Cloro Residual: <span className="text-rose-600">0.2 mg/L</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
              Continuidad: <span className="text-amber-600">12 hrs</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
              Presión: <span className="text-emerald-600">15 m.c.a.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
