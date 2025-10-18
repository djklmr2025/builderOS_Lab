(function () {
  if (typeof Response === 'undefined') return;
  var origJson = Response.prototype.json;
  if ((Response.prototype).__safeJsonPatched) return;
  Object.defineProperty(Response.prototype, '__safeJsonPatched', { value: true, configurable: false });

  Response.prototype.json = function () {
    return Promise.resolve()
      .then(origJson.bind(this))
      .catch(function () {
        try {
          var ct = (this.headers && this.headers.get) ? (this.headers.get('content-type') || '') : '';
          return this.clone().text().then(function (text) {
            var trimmed = (text || '').trim();
            if (ct.indexOf('application/json') !== -1 && trimmed.length > 0) {
              try { return JSON.parse(trimmed); } catch (e) { return { raw: trimmed }; }
            }
            if (trimmed.length === 0) return {};
            try { return JSON.parse(trimmed); } catch (e) { return { raw: trimmed }; }
          }.bind(this));
        } catch (e) {
          return Promise.resolve({});
        }
      }.bind(this));
  };
})();