import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializacija Firebase aplikacije
cred = credentials.Certificate("petconnect-d446b-firebase-adminsdk-s7g9w-4cb52c7590.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# URL spletne strani, ki jo želite scrapati
url = "https://www.dzzz.si/novice/"

# Pošljite zahtevo za pridobitev HTML vsebine strani
response = requests.get(url)
if response.status_code == 200:
    page_content = response.text
else:
    print("Error fetching the page")
    exit()

# Ustvarite BeautifulSoup objekt za razčlenjevanje HTML
soup = BeautifulSoup(page_content, 'html.parser')

# Najdite vse članke (prilagodite glede na strukturo strani)
articles = soup.find_all('div', class_='clanek-content')

# Shranite podatke o člankih v Firestore
for article in articles:
    title_element = article.find('h5')
    desc_element = article.find('p', class_='clanek-opis')
    links = article.find_all('a')
    img_element = article.find('div', class_='clanek-slika').find('img') if article.find('div', class_='clanek-slika') else None
    
    if title_element and desc_element and len(links) > 1:
        title = title_element.text.strip()
        description = desc_element.text.strip()
        link = links[1]['href']  # Uporabite drugi <a> element
        img_url = img_element['src'] if img_element else None

    
        # Dodajte članek v Firestore
        db.collection('clanki').add({
            'title': title,
            'description': description,
            'url': link,
            'img': img_url
        })


print("Scraping and saving completed successfully.")
