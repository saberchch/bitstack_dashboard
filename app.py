import os

from flask import Flask, render_template, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'frontend', 'dist')
ASSETS_DIR = os.path.join(DIST_DIR, 'assets')

app = Flask(
    __name__,
    static_folder=ASSETS_DIR,
    static_url_path='/assets',
    template_folder=DIST_DIR,
)


def dist_ready():
    return os.path.isfile(os.path.join(DIST_DIR, 'index.html'))


def build_instructions():
    return (
        'Frontend build missing. On Render, set Build Command to: '
        'chmod +x build.sh && ./build.sh'
    ), 503


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if not dist_ready():
        return build_instructions()

    if path:
        file_path = os.path.join(DIST_DIR, path)
        if os.path.isfile(file_path):
            return send_from_directory(DIST_DIR, path)

    return render_template('index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
