from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_amazon

app = Flask(__name__)
CORS(app)

@app.route('/scrape')
def scrape():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query is required"}), 400
    results = scrape_amazon(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
