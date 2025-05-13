import requests
from bs4 import BeautifulSoup
import openai

# Twitter API Setu
# Reddit API Scraper
def fetch_reddit(query):
    headers = {'User-Agent': 'Mozilla/5.0'}
    url = f'https://www.reddit.com/search.json?q={query}'
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()["data"]["children"]
        return [{"title": post["data"]["title"], "url": post["data"]["url"], "comments": fetch_reddit_comments(post["data"]["url"])} for post in data]
    return []

def fetch_reddit_comments(url):
    response = requests.get(f"{url}.json", headers={'User-Agent': 'Mozilla/5.0'})
    return [comment["data"]["body"] for comment in response.json()[1]["data"]["children"] if "body" in comment["data"]][:5] if response.status_code == 200 else []

# Quora Scraper (Basic Web Scraping)
def fetch_quora(query):
    url = f'https://www.quora.com/search?q={query}'
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    return [{"title": item.get_text(), "url": f'https://www.quora.com{item.find("a")["href"]}', "comments": fetch_quora_answers(item.find("a")["href"])} for item in soup.find_all('div', class_='q-box')[:5]]

def fetch_quora_answers(url):
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    return [answer.get_text() for answer in soup.find_all('span', class_='ui_qtext_rendered_qtext')][:5]
