#!/usr/bin/env node
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const sessions = {};
const messages = {};

app.post('/bridge/handshake', (req, res) => {
  const { entity, client_pub } = req.body;
  if (!entity || !client_pub) return res.status(400).json({ ok: false, error: "Missing fields" });

  const session = crypto.randomUUID();
  const server_pub = crypto.randomBytes(32).toString('base64');
  const ttl_ms = 900000;

  sessions[session] = { entity, client_pub, server_pub, created: Date.now(), ttl_ms };
  messages[session] = [];

  res.json({ ok: true, session, server_pub, ttl_ms });
});

app.post('/bridge/enqueue', (req, res) => {
  const session = req.query.session;
  const { from, to, payload } = req.body;
  if (!session || !from || !to || !payload) return res.status(400).json({ ok: false, error: "Missing fields" });

  if (!messages[session]) return res.status(404).json({ ok: false, error: "Session not found" });

  messages[session].push({ from, to, payload, timestamp: Date.now() });
  res.json({ ok: true });
});

app.get('/bridge/pull', (req, res) => {
  const session = req.query.session;
  const since = parseInt(req.query.since || "0");

  if (!messages[session]) return res.status(404).json({ ok: false, error: "Session not found" });

  const newMessages = messages[session].filter(msg => msg.timestamp > since);
  res.json({ ok: true, messages: newMessages });
});

app.listen(3000, () => {
  console.log("ARKAIOS Gateway listening on port 3000");
});
