import requests
from bs4 import BeautifulSoup
import time
import random
import logging
from api_config import *

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_random_headers():
    """Get random headers with a random User-Agent"""
    headers = DEFAULT_HEADERS.copy()
    headers['User-Agent'] = random.choice(USER_AGENTS)
    return headers

def exponential_backoff(attempt):
    """Calculate delay with exponential backoff"""
    delay = min(SCRAPING_CONFIG['initial_delay'] * (SCRAPING_CONFIG['backoff_factor'] ** attempt),
                SCRAPING_CONFIG['max_delay'])
    return delay + random.uniform(0, 1)

def make_request(url, method='get', **kwargs):
    """Make a request with retry logic and exponential backoff"""
    headers = get_random_headers()
    kwargs['headers'] = headers
    kwargs['timeout'] = SCRAPING_CONFIG['timeout']

    for attempt in range(SCRAPING_CONFIG['max_retries']):
        try:
            if method.lower() == 'get':
                response = requests.get(url, **kwargs)
            else:
                response = requests.post(url, **kwargs)

            if response.status_code == 200:
                return response
            elif response.status_code == 503:
                logging.warning(f"Service unavailable (503) on attempt {attempt + 1}")
            else:
                logging.error(f"Request failed with status code {response.status_code} on attempt {attempt + 1}")

        except requests.RequestException as e:
            logging.error(f"Request failed on attempt {attempt + 1}: {str(e)}")

        if attempt < SCRAPING_CONFIG['max_retries'] - 1:
            delay = exponential_backoff(attempt)
            logging.info(f"Waiting {delay:.2f} seconds before retry {attempt + 2}")
            time.sleep(delay)

    return None

def scrape_amazon(search_term, max_products=100, max_pages=20):
    """
    Scrape Amazon products with enhanced reliability
    """
    base_url = f"https://www.amazon.in/s?k={search_term.replace(' ', '+')}"
    results = []
    products_scraped = 0

    for page in range(1, max_pages + 1):
        if products_scraped >= max_products:
            logging.info(f"Reached target of {max_products} products")
            break

        url = base_url + f"&page={page}"
        logging.info(f"Fetching page {page}: {url}")

        # Try direct request first
        response = make_request(url)
        
        if not response:
            logging.error(f"Failed to fetch page {page}")
            continue

        if "Robot Check" in response.text or "captcha" in response.text.lower():
            logging.error("Amazon detected automated access")
            continue

        soup = BeautifulSoup(response.content, "html.parser")
        products = soup.select('div.s-main-slot div[data-component-type="s-search-result"]')

        if not products:
            logging.warning(f"No products found on page {page}")
            break

        for product in products:
            if products_scraped >= max_products:
                break

            try:
                # Enhanced product details extraction
                link_tag = product.select_one('a.a-link-normal.s-link-style.a-text-normal')
                name_tag = link_tag.select_one('h2 span') if link_tag else None
                price_tag = product.select_one('span.a-price-whole')
                image_tag = product.select_one('img.s-image')
                rating_tag = product.select_one('span.a-icon-alt')
                review_count_tag = product.select_one('span.a-size-base.s-underline-text')
                availability_tag = product.select_one('span.a-color-success')
                prime_tag = product.select_one('i.a-icon-prime')
                discount_tag = product.select_one('span.a-badge-text')

                if not name_tag or not price_tag:
                    continue

                product_data = {
                    'name': name_tag.text.strip() if name_tag else 'N/A',
                    'price': price_tag.text.strip() if price_tag else 'N/A',
                    'link': "https://www.amazon.in" + link_tag['href'] if link_tag and link_tag['href'].startswith('/') else (link_tag['href'] if link_tag else '#'),
                    'image': image_tag['src'] if image_tag else '',
                    'rating': rating_tag.text.strip() if rating_tag else 'No rating',
                    'review_count': review_count_tag.text.strip() if review_count_tag else '0',
                    'availability': availability_tag.text.strip() if availability_tag else 'Unknown',
                    'is_prime': bool(prime_tag),
                    'discount': discount_tag.text.strip() if discount_tag else 'No discount',
                }
                
                results.append(product_data)
                products_scraped += 1
                
                if products_scraped % 10 == 0:
                    logging.info(f"Scraped {products_scraped} products so far")

            except Exception as e:
                logging.error(f"Error processing product: {str(e)}")
                continue

        # Add random delay between pages
        time.sleep(random.uniform(3, 5))

    if not results:
        raise Exception("No products found. Amazon might be blocking the request.")

    logging.info(f"Scraping completed. Total products collected: {len(results)}")
    return results 