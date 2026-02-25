import React, { useRef } from 'react';
import { Camera, X, UploadCloud, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onPhotosChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onPhotosChange([...photos, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Evidencia Fotográfica</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {photos.length} Fotos subidas
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
            <img src={photo} alt={`Evidencia ${index + 1}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">Subir Foto</span>
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange} 
      />

      <p className="text-[10px] text-slate-400 font-medium italic">
        * Las fotos se guardarán como evidencia técnica del cumplimiento de los estándares regulatorios.
      </p>
    </div>
  );
};
