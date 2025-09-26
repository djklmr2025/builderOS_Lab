// 🧬 Builder OS :: Gateway Status Endpoint v0.1
const express = require('express');
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