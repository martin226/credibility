# Credibility

```bash
npm install
poetry install
npm run dev
```

## Problem

Imagine you're deep into your research, sifting through countless articles, blogs, and websites. How often have you wondered: "Can I trust this source? Is this information accurate?" After all, how can your research be trusted when your sources can’t be? Researchers, students, and professionals alike face a common challenge: ensuring that the information they rely on is accurate, credible, and trustworthy. In a world filled with heaps of fake information, hidden biases, and misleading data, how can we distinguish what is real from what is fake?

## What it does

Introducing Credibility, the smart tool that revolutionizes how we verify sources. Credibility is a web-based program designed to intake any URL link and analyze its reliability for research purposes based on objective criteria. It evaluates the source's content quality, bias, sentiment, publisher reputation, and visual components using AI content analysis. The tool also considers key metrics like domain age, traffic rank, and whether important information such as the author and publish date is listed. Using this information, it computes a Credibility score, ranging from 0 to 100, to help researchers determine the trustworthiness of their sources.

## How we built it

Credibility was built by integrating AI technologies to analyze the textual and visual content of web pages. The program accesses the URL in a Google Chrome browser via Selenium, reads the page's content, and captures screenshots for visual analysis. It then feeds this information to GPT-4o for multimodal reasoning, generating bias, sentiment, reputation, and quality scores along with comments. Credibility combines this AI-driven content analysis with additional data points such as domain age, traffic rank, and the presence of essential metadata. All this information is processed to generate a Credibility score, offering a clear, objective measure of a source's reliability.

## Challenges we ran into

One of the key challenges we faced was ensuring that the AI accurately interpreted content quality and bias. Our solution to this problem was improving the LLM prompt by making GPT-4o explain its reasoning (chain-of-thought).

## Accomplishments that we're proud of

We are proud of creating a tool that solves a real problem that both of us face. As students, we often encounter the challenge of going through vast amounts of information while questioning the credibility of our sources. Credibility was born out of our need for a reliable tool to ensure that the information we rely on for our academic work is trustworthy.

## What we learned

Through the development of Credibility, we learned the importance of combining various data points to provide a well-rounded analysis. We also gained insights into the challenges of accurately measuring content bias and sentiment, which required refining our LLM prompts.

## What's next for Credibility

Looking ahead, we plan to expand Credibility's capabilities by incorporating additional metrics, such as social media influence and citation analysis, to further refine the Credibility score. In the future, we envision Credibility to function as a browser extension as well, automatically assigning scores to websites as users visit them.
