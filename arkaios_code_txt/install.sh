npm install express
npm install puppeteer
npm install fs-extra
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install flask
$env:PORT = "5000"
python .\server_arkaios.py
