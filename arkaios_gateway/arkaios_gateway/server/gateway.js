case 'read': {
  const url = body?.params?.target;
  if (!url) return bad(400, 'missing target');

  try {
    const resp = await fetch(url, { timeout: 15000 });
    if (!resp.ok) return bad(resp.status, 'fetch_failed');
    const text = await resp.text();

    // si detectas JSON, intenta parsear
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (_) {}

    return ok({ target: url, size: text.length, json: parsed, sample: text.slice(0, 1000) });
  } catch (e) {
    return bad(500, 'read_exception', { message: String(e) });
  }
}
