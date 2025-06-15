import requests # Import the requests library
from bs4 import BeautifulSoup
import time
import random
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def scrape_amazon(search_term, max_products=100, max_pages=20):
    """
    Scrape Amazon products with enhanced details and better error handling
    """
    base_url = f"https://www.amazon.in/s?k={search_term.replace(' ', '+')}"
    results = []
    products_scraped = 0
    max_retries = 3

    for page in range(1, max_pages + 1):
        if products_scraped >= max_products:
            logging.info(f"Reached target of {max_products} products")
            break

        url = base_url + f"&page={page}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        }
        
        logging.info(f"Fetching page {page}: {url}")
        
        for retry in range(max_retries):
            try:
                response = requests.get(url, headers=headers, timeout=15)
                response.raise_for_status()
                
                if "Robot Check" in response.text or "captcha" in response.text.lower():
                    raise Exception("Amazon detected automated access. Please try again later.")
                
                break
            except requests.RequestException as e:
                if retry == max_retries - 1:
                    logging.error(f"Failed to fetch page {page} after {max_retries} attempts: {str(e)}")
                    raise
                logging.warning(f"Retry {retry + 1}/{max_retries} for page {page}")
                time.sleep(random.uniform(3, 5))  # Increased delay between retries

        time.sleep(random.uniform(2, 4))  # Reduced delay for faster scraping

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
                    continue  # Skip products with missing essential information

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

        logging.info(f"Completed page {page}, total products scraped: {products_scraped}")

    if not results:
        raise Exception("No products found. Amazon might be blocking the request.")

    logging.info(f"Scraping completed. Total products collected: {len(results)}")
    return results
