export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Por enquanto, retorna um erro informando que as APIs precisam ser configuradas
  res.status(503).json({ 
    message: "API em configuração. Por favor, configure as rotas do servidor corretamente no Vercel." 
  });
}