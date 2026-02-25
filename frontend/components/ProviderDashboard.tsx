
import React from 'react';
import { Organization, SubLocation, VisitRecord } from '../types';
import { 
  ClipboardCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileText,
  Users,
  Calculator,
  ChevronRight,
  Target,
  Activity,
  ArrowRight
} from 'lucide-react';
import { TerritorialMap } from './TerritorialMap';

interface ProviderDashboardProps {
  provider: Organization;
  history: VisitRecord[];
  onSelectSede: (sede: SubLocation, module: string) => void;
  onManageSedes: () => void;
  onViewHistory: (filter?: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ provider, history, onSelectSede, onManageSedes, onViewHistory }) => {
  const getModuleInfo = (moduleId: string) => {
    const lastRecord = history.find(r => r.module === moduleId);
    if (!lastRecord) return { sede: 'N/A', date: 'Pendiente' };
    
    const date = new Date(lastRecord.date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    return { sede: lastRecord.sedeName, date };
  };

  const modules = [
    { id: 'FISCALIZACION', title: 'Fiscalización', icon: <ClipboardCheck className="w-5 h-5" />, color: 'bg-indigo-600' },
    { id: 'CUOTA_FAMILIAR', title: 'Cuota Familiar', icon: <Calculator className="w-5 h-5" />, color: 'bg-emerald-600' },
    { id: 'CARACTERIZACION', title: 'Caracterización', icon: <FileText className="w-5 h-5" />, color: 'bg-amber-600' },
    { id: 'ATENCION_USUARIOS', title: 'Atención Usuarios', icon: <Users className="w-5 h-5" />, color: 'bg-violet-600' }
  ];

  return (
    <div className="p-8 space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* 1. Módulos de Especialidad */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Target className="text-indigo-600 w-6 h-6" /> Módulos de Supervisión
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(mod => {
            const info = getModuleInfo(mod.id);
            return (
              <div key={mod.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer ring-1 ring-slate-900/5">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-2xl ${mod.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 tracking-tight">{mod.title}</h3>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                    <span>Última PC/OC</span>
                    <span className="text-slate-700 truncate max-w-[100px]">{info.sede}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                    <span>Fecha</span>
                    <span className="text-slate-700">{info.date}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                   <button 
                    onClick={() => onViewHistory(mod.id)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl border border-slate-200 transition-colors uppercase tracking-widest"
                   >
                     Historial
                   </button>
                   <button 
                    onClick={() => onViewHistory(mod.id)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                   >
                     <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Mapa Territorial & Resumen */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 h-[500px]">
          <TerritorialMap provider={provider} />
        </div>
        
        <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#1e293b] text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden h-full">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/5"><Activity className="w-6 h-6 text-indigo-400" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado de Gestión</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Estado Regulatorio</h3>
                  <div className="text-4xl font-black mb-6 tracking-tighter">{provider.status}</div>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div></div>
                      <p className="text-sm text-slate-300 font-medium">PC/OC sin programar: {provider.sedes.filter(s => s.status === 'NO_PROGRAMADO').length}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div></div>
                      <p className="text-sm text-slate-300 font-medium">PC/OC en ruta: {provider.sedes.filter(s => s.status === 'PENDIENTE').length}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div></div>
                      <p className="text-sm text-slate-300 font-medium">Cobertura de Supervisión: {Math.round((provider.sedes.filter(s => (s.completedModules?.length || 0) > 0).length / provider.sedes.length) * 100)}%</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onManageSedes}
                  className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  Abrir Gestión Territorial <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -mr-20 -mt-20"></div>
           </div>
        </aside>
      </section>

      {/* 3. Tabla Reciente */}
      <section className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Muestra Territorial Reciente</h3>
            <p className="text-sm text-slate-500">Últimas sedes bajo supervisión activa</p>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            {provider.sedes.length} Sedes Vinculadas
          </div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {provider.sedes.slice(0, 5).map(sede => {
            const isVisited = (sede.completedModules?.length || 0) > 0;
            return (
              <div key={sede.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isVisited ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center gap-3">
                      {sede.name}
                      <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500 uppercase">{sede.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      {isVisited ? `${sede.completedModules?.length} Módulos Completados` : 'Pendiente de Inicio'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">Supervisar:</span>
                  <div className="flex items-center gap-2">
                    {modules.map(mod => (
                      <button 
                        key={mod.id}
                        onClick={() => onSelectSede(sede, mod.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm hover:scale-110 hover:shadow-md ${
                          sede.completedModules?.includes(mod.id) 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white'
                        }`}
                        title={mod.title}
                      >
                        {mod.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {provider.sedes.length > 5 && (
            <button onClick={onManageSedes} className="w-full py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
              Ver todas las sedes en el Explorador
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
