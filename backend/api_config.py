"""
API Configuration for Web Scraping
"""

# API Keys
SCRAPINGBEE_API_KEY = "K23EMB7SJF1THPXG4R1KN006PIGE3RR77B0JOHQ9YSBDBEY3UZ540ZT68PW4Y76MSDZZBHJA13QQE6YM"
SCRAPERAPI_KEY = "d98eaab060c7ba476bf0d77ec32d27ab"
PROXYSCRAPE_API_KEY = "xh0j43mkozjtk3a2e3qf"

# API URLs
SCRAPINGBEE_URL = "https://app.scrapingbee.com/api/v1/"
SCRAPERAPI_URL = "http://api.scraperapi.com"
PROXYSCRAPE_URL = "https://api.proxyscrape.com/v2/"

# Default headers
DEFAULT_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
    'TE': 'Trailers',
}

# List of User-Agents to rotate
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
]

# Scraping configuration
SCRAPING_CONFIG = {
    'max_retries': 5,
    'initial_delay': 2,
    'backoff_factor': 2,
    'max_delay': 30,
    'timeout': 30,
}

# Proxy configuration
PROXY_CONFIG = {
    'protocol': 'http',
    'timeout': 10000,
    'country': 'in',
    'ssl': 'all',
    'anonymity': 'all',
} 