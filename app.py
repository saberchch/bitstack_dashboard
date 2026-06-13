from flask import Flask, render_template

# Configure Flask to serve static files from the React build directory
app = Flask(__name__, 
            static_folder='frontend/dist/assets',
            static_url_path='/assets',
            template_folder='frontend/dist')

@app.route('/')
def index():
    # Render the React index.html
    return render_template('index.html')

# Catch-all route for React Router (if needed later)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
