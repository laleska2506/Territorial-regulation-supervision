
import React, { useEffect, useRef } from 'react';
import { Organization, SubLocation } from '../types';
import { Navigation, MapPin } from 'lucide-react';

interface TerritorialMapProps {
  provider: Organization;
}

// Declaration for Leaflet globally available via CDN
declare const L: any;

export const TerritorialMap: React.FC<TerritorialMapProps> = ({ provider }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const centerLat = provider.location.lat || -9.19; // Default Peru center if not found
      const centerLng = provider.location.lng || -75.01;

      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([centerLat, centerLng], 12);

      // Using a stylized light map from CartoDB or OSM
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

      // Main Provider Marker (Sede Central)
      const providerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #1e293b; color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([centerLat, centerLng], { icon: providerIcon })
        .addTo(mapInstance.current)
        .bindPopup(`<div style="padding: 4px;"><b style="font-size: 14px; color: #1e293b;">${provider.name}</b><br/><span style="color: #64748b; font-size: 12px;">Sede Central Regional</span></div>`);

      // Add Sublocations
      provider.sedes.forEach((sede) => {
        const isVisited = (sede.completedModules?.length || 0) > 0 || sede.status === 'VISITADO';
        const isPending = sede.status === 'PENDIENTE';
        const isNotProgrammed = sede.status === 'NO_PROGRAMADO';
        
        let color = '#94a3b8'; // Default slate-400 for NO_PROGRAMADO
        if (isVisited) color = '#10b981'; // Emerald
        if (isPending) color = '#f59e0b'; // Amber
        
        const sedeIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 2px solid white; box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([sede.lat, sede.lng], { icon: sedeIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="padding: 4px; min-width: 120px;">
              <b style="font-size: 13px; display: block; margin-bottom: 4px; color: #1e293b;">${sede.name}</b>
              <span style="font-size: 10px; background-color: ${isVisited ? '#ecfdf5' : isPending ? '#fff7ed' : '#f1f5f9'}; color: ${isVisited ? '#065f46' : isPending ? '#9a3412' : '#475569'}; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">
                ${isVisited ? 'Supervisado' : isPending ? 'En Ruta' : 'Sin Programar'}
              </span>
              <p style="margin-top: 6px; font-size: 11px; color: #64748b;">${sede.type}</p>
            </div>
          `);
      });

      // Fit bounds to show all markers
      const group = new L.featureGroup([
        L.marker([centerLat, centerLng]),
        ...provider.sedes.map(s => L.marker([s.lat, s.lng]))
      ]);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [provider]);

  return (
    <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden ring-1 ring-slate-900/5 h-full flex flex-col">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-600" />
            Visor Geográfico de Control
          </h3>
          <p className="text-sm text-slate-500">Ubicaciones reales capturadas por el sistema de monitoreo territorial</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supervisado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">En Ruta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sin Programar</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-100">
        <div id="map" ref={mapRef}></div>
      </div>
      
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex gap-6 overflow-x-auto custom-scroll shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
               {provider.sedes.filter(s => (s.completedModules?.length || 0) > 0).length} PC/OC Supervisadas
             </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">|</div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/10"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
               {provider.sedes.filter(s => s.status === 'PENDIENTE').length} En Ruta
             </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">|</div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-slate-400 ring-4 ring-slate-400/10"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
               {provider.sedes.filter(s => s.status === 'NO_PROGRAMADO').length} Sin Programar
             </span>
          </div>
      </div>
    </div>
  );
};
