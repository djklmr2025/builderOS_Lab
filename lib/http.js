(function (global) {
  function safeParseResponse(res) {
    return res.text().then(function (raw) {
      var ct = (res.headers && res.headers.get) ? (res.headers.get('content-type') || '') : '';
      var trimmed = (raw || '').trim();
      var data = null;
      if (ct.indexOf('application/json') !== -1 && trimmed.length > 0) {
        try { data = JSON.parse(trimmed); } catch (e) { data = { raw: trimmed }; }
      } else if (trimmed.length === 0) {
        data = {};
      } else {
        try { data = JSON.parse(trimmed); } catch (e) { data = { raw: trimmed }; }
      }
      return { ok: res.ok, status: res.status, data: data, raw: raw, contentType: ct };
    });
  }

  function request(url, init) {
    return fetch(url, init).then(function (res) {
      return safeParseResponse(res).then(function (parsed) {
        if (!parsed.ok) {
          var msg = (parsed.data && parsed.data.error) || parsed.raw || ('HTTP ' + parsed.status);
          throw new Error(msg);
        }
        return parsed.data;
      });
    });
  }

  function jsonPost(body) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    };
  }

  function getQueryParam(name) {
    try { return new URLSearchParams(global.location.search).get(name); } catch (e) { return null; }
  }

  var GW_URL = getQueryParam('gw') || 'https://arkaios-gateway-open.onrender.com/aida/gateway';
  var GW_TOKEN = getQueryParam('token') || null;

  function callGateway(action, params, agentId) {
    var body = {
      agent_id: agentId || 'puter',
      action: action,
      params: params || {}
    };
    var init = jsonPost(body);
    init.headers = init.headers || {};
    if (GW_TOKEN) init.headers['Authorization'] = 'Bearer ' + GW_TOKEN;
    return request(GW_URL, init);
  }

  // Exponer utilidades en window para uso en puter.html
  global.AkHttp = {
    safeParseResponse: safeParseResponse,
    request: request,
    jsonPost: jsonPost,
    callGateway: callGateway,
    GW_URL: GW_URL
  };
})(window);