
import { ChecklistState, Organization, Question } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

export const generateSupervisionReport = async (
  provider: Organization,
  checklist: ChecklistState,
  questions: Question[],
  photoCount: number = 0
): Promise<string> => {

  // Build answers map: questionText -> SI/NO
  const answers: Record<string, string> = {};
  questions.forEach(q => {
    const status = checklist[q.id];
    if (status === 'SI' || status === 'NO') {
      answers[q.text] = status;
    }
  });

  const location = provider.location
    ? `${provider.location.ccpp}, ${provider.location.district}, ${provider.location.region}`
    : undefined;

  const requestBody = {
    providerName: provider.name,
    providerType: provider.type,
    location,
    answers,
    photoCount
  };

  try {
    const response = await fetch(`${API_BASE_URL}/reports/generate-direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reportMarkdown || "No se pudo generar el informe.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error al conectar con el motor de análisis IA. Verifique que el backend esté ejecutándose en localhost:8080.";
  }
};
