import qrcode
import requests

res = requests.get('https://qr-backend.onrender.com/api/new-token')
url = res.json()['url']

img = qrcode.make(url)
img.save('qr_code.png')
print(f'QR Code saved for: {url}')
