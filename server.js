// 🧬 Builder OS :: Puter Gateway Server v0.1
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/status', (req, res) => {
  res.json({
    status: "active",
    entity: "puter-gateway",
    signature: "🪐 VALIDATED_BY_PUTER"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Puter Gateway listening on port ${PORT}`);
});