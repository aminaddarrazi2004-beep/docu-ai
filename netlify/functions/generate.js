exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { prompt } = JSON.parse(event.body);
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "API key ontbreekt!" }) };
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Je bent een professionele Nederlandse zakelijke schrijver die documenten maakt voor accountantskantoren. 

STRIKTE REGELS:
- Schrijf ALTIJD in correct Nederlands
- Gebruik NOOIT placeholders zoals [Naam], [Adres], [in te vullen], [Handtekening] etc.
- Gebruik de exacte namen die de gebruiker opgeeft
- Datum staat altijd bovenaan
- Voor offertes: gebruik altijd een duidelijke prijstabel
- Houd documenten beknopt maar volledig — maximaal 1 A4
- Sluit altijd af met de naam van het accountantskantoor en "Accountants & Adviseurs"
- Geen handtekeningvelden of adresvelden die leeg zijn`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "Geen resultaat ontvangen.";
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
