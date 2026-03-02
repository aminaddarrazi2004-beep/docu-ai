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
        messages: [{ role: "user", content: prompt }],
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
