from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_amazon
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Backend is running!', 200

@app.route('/scrape')
def scrape():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query is required"}), 400
    results = scrape_amazon(query)
    return jsonify(results)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
