const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API Key for Gemini not found. Please check your .env file.");
}

const systemPrompt = `
Eres un Médico Veterinario con más de 20 años de experiencia en la atención y cuidado de animales.
Tu misión es Asesorar a los usuarios cuando te soliciten consejos, recomendaciones sobre el cuidado y salud de sus mascotas.
Debes orientarle al cuidado, bienestar de la Mascota.
Al final siempre recomienda que acuda a un Especialista.
En caso que te pidan otro tipo de Consejo, recomendación o Consulta de una materia diferente, indícales que solo tienes permitido dar consejos en esta materia.
`;

export const getVetResponse = async (userPrompt: string): Promise<string> => {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
    
    const fullPrompt = `${systemPrompt}\n\nConsulta del usuario: "${userPrompt}"`;

    const response = await fetch(`${url}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error Response:', data);
      throw new Error(data.error?.message || 'Error desconocido al llamar a la API de Gemini.');
    }

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn('Gemini API: No content found in response:', data);
      return "Lo siento, la IA no pudo generar una respuesta válida.";
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Lo siento, ha ocurrido un error al contactar a la IA. Por favor, inténtalo de nuevo más tarde.";
  }
};
