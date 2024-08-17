import requests
from tranco import Tranco
from datetime import datetime
import datetime as dt
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup

t = Tranco(cache=True, cache_dir=".tranco")
chrome_options = Options()
chrome_options.add_argument("--headless=new")  # Use the new headless mode introduced in Chrome 109
chrome_options.add_argument("--window-size=1920,1080")  # Set a common resolution
chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Prevent detection
chrome_options.add_argument("--disable-gpu")  # Disable GPU hardware acceleration
chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
chrome_options.add_argument("--remote-debugging-port=9222")  # Enable remote debugging

# Make the browser appear more like a real user
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
chrome_options.add_argument(f"user-agent={user_agent}")

service = Service("./chromedriver")

driver = webdriver.Chrome(service=service, options=chrome_options)

def get_domain_age(domain):
    url = f"https://who-dat.as93.net/{domain}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_response = response.json()
        created_date = json_response["domain"]["created_date"]
        # convert to date object
        created_date = datetime.strptime(created_date, "%Y-%m-%dT%H:%M:%SZ")
        current_date = datetime.now(dt.UTC)
        domain_age = current_date.year - created_date.year
        return domain_age
    except requests.exceptions.RequestException as e:
        return None
    
def get_tranco_rank(domain):
    return t.list().rank(domain)

def get_selenium_data(url):
    driver.get(url)
    html = driver.page_source
    screenshot = driver.get_screenshot_as_png()
    soup = BeautifulSoup(html, "html.parser")
    page_text = soup.get_text()
    return page_text, screenshot

if __name__ == "__main__":
    print(get_domain_age("google.com"))
    print(get_tranco_rank("google.com"))
    page_text, screenshot = get_selenium_data("https://www.google.com")
    print(page_text)
    img = Image.open(BytesIO(screenshot))
    img.show()