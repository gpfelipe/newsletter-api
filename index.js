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
        const headers = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
            }
        };

        const [messariData, coindeskData] = await Promise.all([
            axios.get('https://messari.io/news', headers),
            axios.get('https://www.coindesk.com', headers)
        ]);

        const $messari = cheerio.load(messariData.data);
        const $coindesk = cheerio.load(coindeskData.data);

        const articles = [];

        // Messari
        $messari('a[href^="/article/"]').each((i, el) => {
            const title = $messari(el).find('h5').text().trim();
            const summary = $messari(el).find('p').text().trim();
            const link = 'https://messari.io' + $messari(el).attr('href');
            if (title) {
                articles.push({
                    title,
                    summary,
                    link,
                    source: "messari",
                    cryptos: extractCryptoTags(title + ' ' + summary),
                    date: new Date().toISOString(),
                    sentiment: "neutral"
                });
            }
        });

        // CoinDesk
        $coindesk('a.card-article').each((i, el) => {
            const title = $coindesk(el).find('h4').text().trim();
            const summary = $coindesk(el).find('p').text().trim();
            const href = $coindesk(el).attr('href');
            const link = href?.startsWith('http') ? href : `https://www.coindesk.com${href}`;
            if (title) {
                articles.push({
                    title,
                    summary,
                    link,
                    source: "coindesk",
                    cryptos: extractCryptoTags(title + ' ' + summary),
                    date: new Date().toISOString(),
                    sentiment: "neutral"
                });
            }
        });

        res.json(articles.slice(0, 30));
    } catch (err) {
        console.error("ERRO AO BUSCAR NOTÍCIAS:", err.message || err);
        res.status(500).json({ error: "Erro ao buscar notícias" });
    }
});

app.listen(PORT, () => {
    console.log(`API real rodando na porta ${PORT}`);
});
