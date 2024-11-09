from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import ngrok
import json

app = Flask(__name__)

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("No API key found in environment variables")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/')
def index():
    print("Hello, World!")
    return "Hello, World!"

@app.route('/detect_structure', methods=['POST'])
def detect_structure():

    # data = request.json
    # html_snippet = data['html']
    html_snippet = request.json.get('html')
    
    prompt = f'''Analyze the following HTML snippet and identify the class or ID names used for each of the following components: card elements, titles, prices, and ratings. Return the result as a JSON object with these exact keys: `cardClass`, `titleSelector`, `priceSelector`, and `ratingSelector`. Ensure each key is associated with the most relevant class or ID selector found in the HTML.

            HTML snippet:
            \n\n{html_snippet}

            Expected JSON format:
            {{
            "cardClass": "class or ID selector for the main card element",
            "titleSelector": "class or ID selector for the title element within the card",
            "priceSelector": "class or ID selector for the price element within the card",
            "ratingSelector": "class or ID selector for the rating element within the card"
            }}'''
    response = model.generate_content(f"{prompt}").text
    print(f"Response from model: {response}")

    try:
        response_json = json.loads(response)
        structure = response_json['choices'][0]['text']
        return jsonify(eval(structure))  # Convert the structure into JSON format if needed
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")  # Debug statement
        return jsonify({"error": "Failed to decode JSON response from model"}), 500

@app.route('/sort_filter', methods=['POST'])
def sort_filter():
    data = request.json.get('data')
    user_query = request.json.get('query')
    
    prompt = f'''Analyze the following data and apply the user's query to filter or sort it. The data is an array of objects, where each object has fields like "title", "price", and "rating". Generate a list of clear, step-by-step instructions to filter or sort this data based on the user's query.

            Data:
            {data}

            User query:
            "{user_query}"

            Expected output:
            A JSON object with an "instructions" field that contains specific actions (like "sort by rating in descending order" or "filter for items with price below 50").

            Example format:
            {{
            "instructions": [
                "Sort by price in ascending order",
                "Filter for items with rating above 4.5"
            ]
            }}'''
    
    # Call the LLM to generate sorting/filtering instructions
    response = model.generate_content(f"{prompt}").text
    
    instructions = response['choices'][0]['text'].strip()

    # Execute sorting/filtering based on LLM's response
    sorted_filtered_data = process_instructions(data, instructions)
    return jsonify(sorted_filtered_data)

def process_instructions(data, instructions):
    # Apply sorting or filtering logic based on parsed instructions
    
    # Sorting example: "Sort by highest rating" or "Sort by lowest price"
    if "highest rating" in instructions:
        data.sort(key=lambda x: x.get('rating', 0), reverse=True)
    elif "lowest rating" in instructions:
        data.sort(key=lambda x: x.get('rating', 0))
    elif "highest price" in instructions:
        data.sort(key=lambda x: x.get('price', 0), reverse=True)
    elif "lowest price" in instructions:
        data.sort(key=lambda x: x.get('price', 0))

    # Filtering example: "Filter by rating above 4" or "Price below 50"
    if "rating above" in instructions:
        try:
            threshold = float(instructions.split("rating above")[1].strip())
            data = [item for item in data if item.get('rating', 0) > threshold]
        except ValueError:
            pass  # If parsing fails, ignore this filter

    if "price below" in instructions:
        try:
            threshold = float(instructions.split("price below")[1].strip())
            data = [item for item in data if item.get('price', 0) < threshold]
        except ValueError:
            pass  # If parsing fails, ignore this filter

    return data


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    