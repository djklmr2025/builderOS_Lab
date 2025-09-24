#!/usr/bin/env python3
import json, time, urllib.request

GW = "https://arkaios-gateway-open.onrender.com"
INDEX = "https://djklmr2025.github.io/builderOS_Lab/index.json"

def http_json(url, data=None, headers=None):
    h = {"Content-Type":"application/json", **(headers or {})}
    req = urllib.request.Request(url, headers=h, method="POST" if data else "GET")
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        req.data = body
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())

def main():
    print("== /aida/health ==")
    print(http_json(f"{GW}/aida/health"))

    print("== plan ==")
    print(http_json(f"{GW}/aida/gateway", {
        "agent_id":"symbiosis","action":"plan",
        "params":{"objective":"mapear BuilderOS","index":INDEX}
    }))

    print("== read index ==")
    print(http_json(f"{GW}/aida/gateway", {
        "agent_id":"symbiosis","action":"read",
        "params":{"target":INDEX}
    }))

    print("OK symbiosis_test")
if __name__=="__main__":
    main()
