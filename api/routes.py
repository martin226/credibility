from flask import request, jsonify
from app import app
import metrics

@app.route("/analyze", methods=["GET"])
def analyze():
    url = request.args.get("url")
    if not url:
        return jsonify(error="No URL provided"), 400
    domain = metrics.get_domain(url)
    domain_age = metrics.get_domain_age(domain)
    tranco_rank = metrics.get_tranco_rank(domain)
    html, screenshot = metrics.get_selenium_data(url)
    gpt_data = metrics.get_gpt_data(html, screenshot, domain)
    metadata = metrics.get_metadata(html)
    credibility_score = metrics.calculate_credibility_score(domain_age, tranco_rank, gpt_data, metadata)
    return jsonify(
        domain=domain,
        screenshot=screenshot,
        domain_age=domain_age,
        tranco_rank=tranco_rank,
        gpt_data=gpt_data,
        metadata=metadata,
        credibility_score=credibility_score
    )