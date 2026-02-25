
import React, { useState, useMemo, useEffect } from 'react';
import { VisitRecord, Organization } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle2, 
  MapPin,
  Clock,
  ArrowLeft,
  BookOpen,
  Users,
  Calculator,
  Printer,
  ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HistoryViewProps {
  records: VisitRecord[];
  provider: Organization;
  onBack: () => void;
  onDownloadReport: (record: VisitRecord, provider: Organization) => void;
  initialFilter?: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ records, provider, onBack, onDownloadReport, initialFilter = 'ALL' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState(initialFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setModuleFilter(initialFilter);
  }, [initialFilter]);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.sedeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = moduleFilter === 'ALL' || record.module === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [records, searchTerm, moduleFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModuleStyles = (module: string) => {
    switch (module) {
      case 'FISCALIZACION': return { icon: <ClipboardCheck className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-700', label: 'Fiscalización' };
      case 'CUOTA_FAMILIAR': return { icon: <Calculator className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700', label: 'Cuota Familiar' };
      case 'CARACTERIZACION': return { icon: <FileText className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700', label: 'Caracterización' };
      case 'ATENCION_USUARIOS': return { icon: <Users className="w-4 h-4" />, color: 'bg-violet-100 text-violet-700', label: 'Atención Usuarios' };
      default: return { icon: <BookOpen className="w-4 h-4" />, color: 'bg-slate-100 text-slate-700', label: module };
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 uppercase tracking-widest mb-2">
            <ArrowLeft className="w-3 h-3" /> Regresar al Dashboard
          </button>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <History className="text-indigo-600 w-8 h-8" /> 
            Historial de Supervisiones
          </h2>
          <p className="text-slate-500 font-medium text-sm">Cronología detallada de todas las intervenciones y reportes técnicos realizados.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-right px-4 border-r border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Registros</p>
             <p className="text-xl font-black text-slate-900">{records.length}</p>
          </div>
          <div className="px-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Actividad</p>
             <p className="text-xs font-bold text-indigo-600">{records.length > 0 ? formatDate(records[0].date).split(' de ')[0] : 'Sin datos'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por nombre de sede..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="ALL">Todos los módulos</option>
            <option value="FISCALIZACION">Fiscalización</option>
            <option value="CUOTA_FAMILIAR">Cuota Familiar</option>
            <option value="CARACTERIZACION">Caracterización</option>
            <option value="ATENCION_USUARIOS">Atención Usuarios</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="date" 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const styles = getModuleStyles(record.module);
            const isExpanded = expandedId === record.id;
            // Explicitly typed the accumulator as { si: number; no: number } to fix inference issues
            const resultsCount = Object.values(record.results).reduce((acc: { si: number; no: number }, val) => {
              if (val === 'SI') acc.si++;
              if (val === 'NO') acc.no++;
              return acc;
            }, { si: 0, no: 0 });

            return (
              <div 
                key={record.id} 
                className={`bg-white border transition-all duration-300 overflow-hidden ${isExpanded ? 'rounded-[32px] border-indigo-200 shadow-xl ring-1 ring-indigo-500/10' : 'rounded-[24px] border-slate-100 hover:border-slate-300 shadow-sm'}`}
              >
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${styles.color}`}>
                      {styles.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-slate-900">{record.sedeName}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${styles.color}`}>
                          {styles.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(record.date)}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> ID: {record.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden sm:flex items-center gap-4">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumple</p>
                          <p className="text-sm font-black text-emerald-600">{resultsCount.si}</p>
                       </div>
                       <div className="w-px h-6 bg-slate-100"></div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incumple</p>
                          <p className="text-sm font-black text-rose-600">{resultsCount.no}</p>
                       </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-8 pb-8 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Resumen de Hallazgos
                          </h5>
                          <div className="space-y-2">
                             {Object.entries(record.results).map(([qid, value]) => (
                               <div key={qid} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/50 last:border-0">
                                 <span className="font-bold text-slate-600">{qid}</span>
                                 <span className={`px-2 py-0.5 rounded font-black ${value === 'SI' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                   {value}
                                 </span>
                               </div>
                             ))}
                          </div>
                        </div>

                        {record.evidence && record.evidence.length > 0 && (
                          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Evidencia Fotográfica
                            </h5>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                               {record.evidence.map((photo, idx) => (
                                 <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:scale-105 transition-transform cursor-zoom-in">
                                   <img src={photo} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                                 </div>
                               ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle className="w-3.5 h-3.5 text-indigo-500" /> Informe del Especialista IA
                            </h5>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDownloadReport(record, provider);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
                              >
                                <Printer className="w-3 h-3" /> Imprimir PDF
                              </button>
                              <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">GEMINI 3 FLASH</span>
                            </div>
                         </div>
                         <div className="bg-white border border-indigo-100 rounded-2xl p-6 prose prose-slate prose-sm max-w-none shadow-sm">
                            {record.reportSummary ? (
                              <ReactMarkdown components={{
                                p: ({...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
                                strong: ({...props}) => <strong className="text-indigo-900 font-bold" {...props} />,
                                h1: ({...props}) => <h1 className="text-lg font-black text-slate-900 mb-4 uppercase" {...props} />,
                                h2: ({...props}) => <h2 className="text-md font-black text-indigo-800 mb-2 uppercase border-b border-indigo-50 pb-1" {...props} />,
                                ul: ({...props}) => <ul className="list-disc pl-4 space-y-1 mb-4" {...props} />,
                                li: ({...props}) => <li className="text-slate-600" {...props} />
                              }}>
                                {record.reportSummary}
                              </ReactMarkdown>
                            ) : (
                              <p className="text-slate-400 italic">No se generó informe IA para este registro.</p>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white border-2 border-dashed border-slate-200 rounded-[40px] text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-bold">No se encontraron registros que coincidan con los filtros.</p>
             <button onClick={() => {setSearchTerm(''); setModuleFilter('ALL');}} className="mt-2 text-indigo-600 text-sm font-bold hover:underline">Limpiar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};
