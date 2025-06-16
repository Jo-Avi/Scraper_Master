from scraper_with_api import scrape_amazon
import logging
import json
from datetime import datetime

def test_scraper():
    # Test search term
    search_term = "laptop"
    
    try:
        # Set up logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        
        logging.info(f"Starting test scrape for search term: {search_term}")
        
        # Run the scraper with a smaller number of products for testing
        results = scrape_amazon(
            search_term=search_term,
            max_products=5,  # Limit to 5 products for testing
            max_pages=2      # Limit to 2 pages for testing
        )
        
        # Save results to a JSON file with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"test_results_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Successfully scraped {len(results)} products")
        logging.info(f"Results saved to {filename}")
        
        # Print first product details for verification
        if results:
            logging.info("\nFirst product details:")
            for key, value in results[0].items():
                logging.info(f"{key}: {value}")
        
        return True
        
    except Exception as e:
        logging.error(f"Test failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    test_scraper() 