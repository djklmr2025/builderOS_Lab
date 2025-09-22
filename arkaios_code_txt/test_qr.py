import qrcode
from PIL import Image

img = qrcode.make('Hello, QR!')
img.save('test_qr.png')
print("✅ QR de prueba generado: test_qr.png")