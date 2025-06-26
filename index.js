const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // ✅ Libera requisições de outros domínios

app.get('/news', (req, res) => {
  res.json([
    {
      title: "Exemplo de notícia",
      summary: "Resumo da notícia...",
      link: "https://example.com/news",
      source: "messari",
      cryptos: ["ETH", "SOL"],
      date: new Date().toISOString(),
      sentiment: "neutral"
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
