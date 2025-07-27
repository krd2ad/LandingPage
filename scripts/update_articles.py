# scripts/update_articles.py

import feedparser
import json

# RSS feed to scrape (you can add more)
RSS_FEED = "https://export.arxiv.org/rss/cs.AI"
MAX_ARTICLES = 3
OUTPUT_FILE = "articles.json"

def get_articles():
    feed = feedparser.parse(RSS_FEED)
    articles = []
    for entry in feed.entries[:MAX_ARTICLES]:
        articles.append({
            "title": entry.title,
            "desc": entry.summary[:120] + "...",
            "url": entry.link
        })
    return articles

def save_articles(articles):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2)

if __name__ == "__main__":
    articles = get_articles()
    save_articles(articles)
    print(f"Updated {OUTPUT_FILE} with {len(articles)} articles.")
