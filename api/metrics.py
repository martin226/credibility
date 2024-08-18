import requests
from tranco import Tranco
from datetime import datetime
import datetime as dt
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from openai import OpenAI
from urllib.parse import urlparse
import json
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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

def get_domain(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

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
    screenshot = driver.get_screenshot_as_base64()
    return html, screenshot

def get_gpt_data(html, screenshot, domain):
    soup = BeautifulSoup(html, "html.parser")
    page_text = soup.get_text()
    messages = [
        {
            "role": "system",
            "content": """You are a content quality expert.
            You will be provided with a webpage's text content and a screenshot of the webpage, along with the domain of the webpage. Your task is to analyze the text content and domain to provide a structured JSON response including the following metrics:
            1. screenshot_notes (string): Provide any notes based on the screenshot of the webpage.
            2. additional_notes (string): Provide any additional notes based on the text content and domain.
            3. bias_justification (string): Indicate if the text is biased or unbiased. Provide a brief justification for your bias assessment. Bias can be political, religious, or any other form of bias.
            4. bias (bool): Provide a single rating for the overall bias of the text (true, false) based on the justification provided.
            5. sentiment_justification (string): Indicate the sentiment of the text (positive [1], negative [-1], neutral [0]). Provide a brief justification for your sentiment assessment. Sentiment can be positive, negative, or neutral. Information that is factual and unbiased should be rated as neutral.
            6. sentiment (int): Provide a single rating for the overall sentiment of the text (-1, 0, 1) based on the justification provided.
            7. content_credibility_justification (string): Assess the overall credibility of the content. Provide a brief justification for your content credibility assessment. Highly credible (2) means the content is well-written, informative, and engaging. Credible (1) means the content is somewhat informative but lacks depth or clarity. Not credible (0) means the content is poorly written, inaccurate, misleading, factually incorrect, or satirical. Any website that should not be included in research or a school paper should be rated as low quality (0).
            8. content_credibility (int): Provide a single rating for the overall credibility of the content (not credible, credible, highly credible) based on the justification provided.
            9. publisher_reputation_justification (string): Indicate whether the domain is associated with a well-known and reputable publisher. Provide a brief justification for your publisher reputation assessment. A reputable publisher is one that is well-known, respected, and has a history of producing accurate and reliable content.
            10. publisher_reputation (bool): Provide a single rating for the publisher reputation (true, false) based on the justification provided.
            Lean towards providing a conservative estimate for the metrics. It is better to underestimate than overestimate the quality of the content. Anything that is factually incorrect, misleading, or poorly written should be rated as low quality.
            Provide the response strictly in JSON format. Do not include formatting such as markdown code blocks or any additional text. The response should be able to be directly parsed as JSON.
            """
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"""Text:
                    {page_text}

                    Domain:
                    {domain}
                    """
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{screenshot}"
                    }
                },
            ]
        }
    ]
    response = client.chat.completions.create(model="gpt-4o-mini",
    messages=messages,
    max_tokens=500,
    temperature=0.2)
    return json.loads(response.choices[0].message.content)

def get_metadata(html):
    soup = BeautifulSoup(html, "html.parser")
    # author
    # find any meta tag containing author in the name attribute (it can be author, article:author, etc.)
    author = soup.find("meta", attrs={"name": lambda x: x and "author" in x.lower()})
    if author:
        author = author["content"]
    else:
        author = None
    # date
    # find any meta tag containing date in the name attribute (it can be date, article:date, etc.)
    date = soup.find("meta", attrs={"name": lambda x: x and "date" in x.lower()})
    if date:
        date = date["content"]
    else:
        date = None
    return {
        "author": author,
        "date": date
    }

def calculate_credibility_score(domain_age, tranco_rank, gpt_data, metadata):
    credibility_score = 0
    if not domain_age:
        return None

    if domain_age >= 10:
        credibility_score += 10
    elif domain_age >= 5:
        credibility_score += 5
    
    if tranco_rank <= 1000:
        credibility_score += 20
    elif tranco_rank <= 5000:
        credibility_score += 15
    elif tranco_rank <= 10000:
        credibility_score += 10
    elif tranco_rank <= 50000:
        credibility_score += 5
    
    if gpt_data["content_credibility"] == 2:
        credibility_score += 30
    elif gpt_data["content_credibility"] == 1:
        credibility_score += 15
    
    if not gpt_data["bias"]:
        credibility_score += 10
    
    if gpt_data["publisher_reputation"]:
        credibility_score += 20
    
    if metadata["author"]:
        credibility_score += 5
    
    if metadata["date"]:
        credibility_score += 5

    return credibility_score

if __name__ == "__main__":
    url = "https://www.dhmo.org/facts.html"
    domain = get_domain(url)
    domain_age = get_domain_age(domain)
    print(domain_age)
    tranco_rank = get_tranco_rank(domain)
    print(tranco_rank)
    html, screenshot = get_selenium_data(url)
    gpt_data = get_gpt_data(html, screenshot, domain)
    print(gpt_data)
    metadata = get_metadata(html)
    print(metadata)
    credibility_score = calculate_credibility_score(domain_age, tranco_rank, gpt_data, metadata)
    print(credibility_score)