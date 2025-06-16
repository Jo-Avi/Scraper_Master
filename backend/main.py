from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper_with_api import scrape_amazon
import os
import logging
import requests

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    logger.info("Home endpoint accessed")
    return 'Backend is running!', 200

@app.route('/scrape')
def scrape():
    logger.info(f"Scrape endpoint accessed with query: {request.args.get('query', '')}")
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 15))
    
    if not query:
        logger.warning("No query provided")
        return jsonify({"error": "Query is required"}), 400
    try:
        results = scrape_amazon(query, max_products=limit, start_page=page)
        if not results:
            logger.warning("No results found")
            return jsonify({"error": "No products found for the given query"}), 404
        logger.info(f"Successfully scraped {len(results)} products")
        return jsonify({
            "products": results,
            "page": page,
            "limit": limit,
            "hasMore": len(results) == limit
        })
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error during scraping: {str(e)}")
        return jsonify({"error": f"Network error: {str(e)}"}), 503
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
        return jsonify({"error": f"Scraping error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
