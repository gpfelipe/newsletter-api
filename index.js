const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

function extractCryptoTags(text) {
    const tags = [
        "AI16Z", "ANON", "BEAM", "BNB", "BTC", "COOKIE", "DEEP", "DOG", "ENA",
        "ETH", "GRIFFAIN", "KAMINO", "LDO", "NEAR", "NYAN", "ONDO", "PYTH",
        "PRIME", "PROMPT", "RON", "SEI", "SUI", "SOL", "TAO", "VIRTUAL", "VVV"
    ];
    return tags.filter(tag => text.toUpperCase().includes(tag));
}

app.get('/news', async (req, res) => {
    try {
        const articles = [
            {
                title: "Bitcoin rompe US$ 70 mil novamente",
                summary: "Movimento pode sinalizar nova alta no mercado.",
                link: "https://www.coindesk.com/bitcoin-price",
                source: "mock",
                cryptos: ["BTC"],
                date: new Date().toISOString(),
                sentiment: "positive"
            },
            {
                title: "Solana ganha destaque com novos projetos",
                summary: "Atividade de desenvolvedores cresce na rede SOL.",
                link: "https://www.coindesk.com/solana-update",
                source: "mock",
                cryptos: ["SOL"],
                date: new Date().toISOString(),
                sentiment: "neutral"
            }
        ];

        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar notícias" });
    }
});


app.listen(PORT, () => {
    console.log(`API real rodando na porta ${PORT}`);
});
