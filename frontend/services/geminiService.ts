
import { GoogleGenAI } from "@google/genai";
import { ChecklistState, Organization, Question } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSupervisionReport = async (
  provider: Organization,
  checklist: ChecklistState,
  questions: Question[],
  photoCount: number = 0
): Promise<string> => {
  
  // Prepare the findings narrative
  let findings = "";
  questions.forEach(q => {
    const status = checklist[q.id];
    if (status === 'NO') {
      findings += `- INCUMPLIMIENTO: ${q.text} (Referencia: ${q.referenceArt || 'Normativa General'}).\n`;
    } else if (status === 'SI') {
      findings += `- CUMPLE: ${q.text}.\n`;
    }
  });

  if (!findings) findings = "No se han registrado hallazgos aún.";

  const prompt = `
    Actúa como un experto especialista en regulación de saneamiento de la Sunass (Superintendencia Nacional de Servicios de Saneamiento del Perú).
    Estás redactando un "Informe de Supervisión Regulatoria" para un Prestador de Servicios de Saneamiento.

    DATOS DEL PRESTADOR:
    Nombre: ${provider.name}
    Tipo: ${provider.type}
    Ubicación: ${provider.location.ccpp}, ${provider.location.district}, ${provider.location.region}.

    HALLAZGOS DE LA SUPERVISIÓN:
    ${findings}

    EVIDENCIA ADJUNTA:
    Se han adjuntado ${photoCount} fotografías como evidencia técnica del estado de la infraestructura y cumplimiento de protocolos.

    INSTRUCCIONES:
    Genera un informe técnico con las siguientes secciones:
    1. **Resumen Ejecutivo**: Resumen breve de la situación encontrada.
    2. **Hallazgos Críticos**: Lista los problemas sistémicos o incumplimientos detectados. Menciona los artículos del Reglamento de Calidad de la Prestación de Servicios de Saneamiento en Pequeñas Ciudades (RCPSSPC) si aplica.
    3. **Recomendaciones Técnicas**: 3 a 5 recomendaciones técnicas inmediatas y obligatorias para subsanar las observaciones.
    
    Tono: Formal, técnico y regulatorio.
    Formato: Markdown limpio.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No se pudo generar el informe.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error al conectar con el motor de análisis IA. Verifique su conexión o credenciales.";
  }
};
