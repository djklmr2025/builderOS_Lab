from flask import Flask, render_template, request
import json, os, toml

app = Flask(__name__)

# Ruta absoluta base al proyecto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
STARTER_DIR = os.path.join(BASE_DIR, "ARKAIOS_SYMBIOTIC_STARTER_v1")

@app.route("/", methods=["GET", "POST"])
def index():
    result = ""
    if request.method == "POST":
        command = request.form.get("command", "").lower()

        if command == "manifest":
            file_path = os.path.join(STARTER_DIR, "symbiotic_manifest.json")
            with open(file_path, encoding="utf-8") as f:
                result = json.dumps(json.load(f), indent=2)

        elif command == "env":
            file_path = os.path.join(STARTER_DIR, "config.env")
            with open(file_path, encoding="utf-8") as f:
                result = f.read()

        elif command == "estructura":
            file_path = os.path.join(STARTER_DIR, "estructura.toml")
            with open(file_path, encoding="utf-8") as f:
                result = toml.dumps(toml.load(f))

        else:
            result = "⚠️ Comando no reconocido."

    return render_template("index.html", output=result)

if __name__ == "__main__":
    app.run(debug=True)
