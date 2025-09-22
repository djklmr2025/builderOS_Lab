# app.py (fragmentos)
from flask import Flask, request, jsonify
from db import get_conn, now_ts
from routes_admin import admin_bp
from routes_pay import pay_bp
app.register_blueprint(pay_bp)

# ... (tu código actual) ...

app = Flask(__name__)
app.config["ADMIN_TOKEN"] = os.getenv("ADMIN_TOKEN","")  # opcional
app.register_blueprint(admin_bp)

# === helpers de persistencia de cuentas ===
def db_account_put(acc_dict):
    conn = get_conn(); cur = conn.cursor()
    cur.execute("""
      INSERT INTO accounts(account_id,payload_json,updated_at)
      VALUES(?,?,?)
      ON CONFLICT(account_id) DO UPDATE SET
        payload_json=excluded.payload_json,
        updated_at=excluded.updated_at
    """, (acc_dict["account_id"], json.dumps(acc_dict, ensure_ascii=False), now_ts()))
    conn.commit(); conn.close()

def db_account_get(account_id):
    conn = get_conn(); cur = conn.cursor()
    cur.execute("SELECT payload_json FROM accounts WHERE account_id=?", (account_id,))
    row = cur.fetchone(); conn.close()
    return json.loads(row[0]) if row else None

# === crea/lee cuenta (rutas de negocio) ===
@app.post("/api/account/create")
def create_account():
    data = request.json or {}
    # ... aquí tu lógica para firmar (sig) ...
    acc = {
      "version": 1,
      "account_id": data.get("account_id") or f"ARK-{str(uuid.uuid4())[:6].upper()}",
      "owner": {"name": data.get("name","Usuario ARK"), "user": data.get("user","anon")},
      "balances": {"AEIO-MR": int(data.get("initial",0))},
      "meta": {"created": now_ts(), "last_modified": now_ts()},
      "nonce": str(uuid.uuid4()),
      "sig": "…firma…"
    }
    db_account_put(acc)
    return jsonify(acc)

@app.post("/api/account/get")
def account_get():
    acc_id = (request.json or {}).get("account_id")
    acc = db_account_get(acc_id)
    return (jsonify(acc),200) if acc else (jsonify({"error":"not_found"}),404)

@app.post("/api/redeem")
def redeem():
    body = request.json or {}
    acc_id = body.get("account_id","")
    code = (body.get("code","") or "").upper()
    acc = db_account_get(acc_id)
    if not acc: return jsonify({"error":"account_not_found"}), 404

    conn = get_conn(); cur = conn.cursor()
    cur.execute("SELECT code, amount, expires, used FROM codes WHERE code=?", (code,))
    row = cur.fetchone()
    if not row: 
        conn.close(); return jsonify({"error":"invalid_code"}), 400
    code_used = (row["used"] == 1)
    if code_used:
        conn.close(); return jsonify({"error":"already_used"}), 400

    # (Opcional: validar expiración)
    # crédito
    new_bal = int(acc["balances"].get("AEIO-MR",0)) + int(row["amount"])
    acc["balances"]["AEIO-MR"] = new_bal
    acc["meta"]["last_modified"] = now_ts()
    acc["nonce"] = str(uuid.uuid4())
    # TODO: recalcular firma acc["sig"]=...

    # marca código usado + ledger
    cur.execute("UPDATE codes SET used=1, used_at=? WHERE code=?", (now_ts(), code))
    cur.execute("INSERT INTO ledger(ts,account_id,type,amount,meta_json) VALUES(?,?,?,?,?)",
                (now_ts(), acc_id, "redeem", row["amount"], json.dumps({"code":code})))
    conn.commit(); conn.close()

    db_account_put(acc)
    return jsonify({"ok":True, "account": acc})
