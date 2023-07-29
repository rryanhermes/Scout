import requests
from bs4 import BeautifulSoup

url = 'https://www.marketwatch.com/'

def get_headers(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    headers = []
    for h2_tag in soup.find_all('h2'):
        h2_info = {
            'text': h2_tag.text.strip(),
            'id': h2_tag.get('id'),
            'class': h2_tag.get('class')
        }
        headers.append(h2_info)
        
    return headers

headers = get_headers(url)

for h2_info in headers:
    print("Text:", h2_info['text'])
    print("ID:", h2_info['id'])
    print("Class:", h2_info['class'])
    print()