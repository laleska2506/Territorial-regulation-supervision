
import React, { useState, useMemo } from 'react';
import { SubLocation, SubLocationType } from '../types';
import { 
  Search, 
  Plus, 
  MapPin, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ClipboardCheck,
  Calculator,
  FileText,
  Users,
  LayoutGrid,
  Filter,
  Package,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

interface TerritorialExplorerProps {
  sedes: SubLocation[];
  onSelectSede: (sede: SubLocation, module: string) => void;
  onAddSedeToRoute: (sede: SubLocation) => void;
  onBack: () => void;
}

export const TerritorialExplorer: React.FC<TerritorialExplorerProps> = ({ 
  sedes, 
  onSelectSede, 
  onAddSedeToRoute,
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFaltantes, setShowFaltantes] = useState(false);

  // Sedes que ya están en el control de visitas activo (Auditadas o Pendientes seleccionadas)
  const auditSedes = useMemo(() => sedes.filter(s => s.status === 'VISITADO' || s.status === 'PENDIENTE'), [sedes]);
  
  // Sedes "Maestras" que aún no se han tocado (Cargadas de BD pero no en ruta)
  const faltantesSedes = useMemo(() => sedes.filter(s => s.status === 'NO_PROGRAMADO'), [sedes]);

  const filteredAudit = auditSedes.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFaltantes = faltantesSedes.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'FISCALIZACION': return <ClipboardCheck className="w-3 h-3" />;
      case 'CUOTA_FAMILIAR': return <Calculator className="w-3 h-3" />;
      case 'CARACTERIZACION': return <FileText className="w-3 h-3" />;
      case 'ATENCION_USUARIOS': return <Users className="w-3 h-3" />;
      default: return null;
    }
  };

  const modules = [
    { id: 'FISCALIZACION', title: 'Fiscalización', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'CUOTA_FAMILIAR', title: 'Cuota Familiar', icon: <Calculator className="w-4 h-4" /> },
    { id: 'CARACTERIZACION', title: 'Caracterización', icon: <FileText className="w-4 h-4" /> },
    { id: 'ATENCION_USUARIOS', title: 'Atención Usuarios', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto pb-32">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
           <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 uppercase tracking-widest mb-2">
             <ChevronLeft className="w-3 h-3" /> Volver al Dashboard
           </button>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <MapPin className="text-indigo-600 w-8 h-8" /> 
             Gestión del Territorio
           </h2>
           <p className="text-slate-500 font-medium text-sm">Controle las inspecciones realizadas y programe nuevas visitas desde el repositorio.</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start md:self-center">
            <button 
                onClick={() => setShowFaltantes(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!showFaltantes ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Lugares en Ruta ({auditSedes.length})
            </button>
            <button 
                onClick={() => setShowFaltantes(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showFaltantes ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Lugares Faltantes ({faltantesSedes.length})
            </button>
        </div>
      </div>

      {/* Search Bar - Unified */}
      <div className="relative group max-w-2xl">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
         <input 
            type="text" 
            placeholder={showFaltantes ? "Buscar en repositorio de sedes..." : "Buscar en lugares visitados/en ruta..."}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[24px] outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {!showFaltantes ? (
        /* VISTA 1: LUGARES VISITADOS / EN RUTA */
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Supervisión Territorial Activa
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudit.map(sede => (
              <div key={sede.id} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all group ring-1 ring-slate-900/5">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${sede.completedModules && sede.completedModules.length > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${sede.status === 'VISITADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {sede.status}
                    </span>
                    <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{sede.type}</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-black text-slate-900 truncate mb-4">{sede.name}</h4>

                {/* Tarjetita pequeña de módulos respondidos */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Módulos Respondidos</p>
                   <div className="flex flex-wrap gap-2">
                      {sede.completedModules && sede.completedModules.length > 0 ? (
                        sede.completedModules.map(mod => (
                          <div key={mod} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                            <span className="text-emerald-500">{getModuleIcon(mod)}</span>
                            {mod.split('_')[0]}
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase italic">
                           <AlertCircle className="w-3 h-3" /> 0 módulos completados
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Iniciar Supervisión:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {modules.map(mod => (
                      <button 
                        key={mod.id}
                        onClick={() => onSelectSede(sede, mod.id)}
                        className={`aspect-square flex items-center justify-center rounded-xl transition-all shadow-sm hover:scale-110 hover:shadow-md ${
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
            ))}
            
            {filteredAudit.length === 0 && (
              <div className="col-span-full py-20 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[40px] text-center">
                 <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <p className="text-slate-500 font-bold">No hay PC/OC en la ruta de supervisión activa.</p>
                 <button onClick={() => setShowFaltantes(true)} className="mt-3 text-indigo-600 font-black text-sm hover:underline">Ir a lugares faltantes</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VISTA 2: LUGARES FALTANTES (REPOSITORIO MAESTRO) */
        <div className="space-y-6 animate-fade-in">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Repositorio de PC/OC Maestras
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">Haga clic en el checklist para añadir a la ruta de visita</p>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 max-h-[600px] overflow-y-auto custom-scroll">
                {filteredFaltantes.map(sede => (
                  <div key={sede.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-[20px] transition-all group border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => {
                          onAddSedeToRoute(sede);
                          // Optional: Add some local feedback if needed, but the state update will move it to the other tab
                        }}
                        className="w-8 h-8 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all group-hover:scale-110 shadow-sm"
                        title="Añadir a la ruta de supervisión"
                       >
                         <Plus className="w-5 h-5" />
                       </button>
                       <div>
                          <h5 className="font-bold text-slate-800 text-sm">{sede.name}</h5>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{sede.type}</span>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => onAddSedeToRoute(sede)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                    >
                      Añadir a Ruta <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {filteredFaltantes.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">
                     No se encontraron sedes pendientes en el repositorio.
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <button onClick={() => setShowFaltantes(false)} className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">
                   Finalizar Selección y Volver a la Ruta
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
