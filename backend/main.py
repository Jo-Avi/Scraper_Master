from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_amazon
import os
import logging

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
    if not query:
        logger.warning("No query provided")
        return jsonify({"error": "Query is required"}), 400
    try:
        results = scrape_amazon(query)
        logger.info(f"Successfully scraped {len(results)} products")
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
