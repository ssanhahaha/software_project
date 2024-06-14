from flask import Flask, jsonify, request, session, redirect, url_for, flash
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, redirect, url_for, request, flash, session, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from functools import wraps


app = Flask(__name__)
app.secret_key = 'your_secret_key'  
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, supports_credentials=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_user_id_from_session():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id FROM users WHERE username = ?', (session['username'],))
    user = cursor.fetchone()
    return user['id'] if user else None

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    hashed_password = generate_password_hash(password)

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        db.commit()
        return jsonify({'message': 'User registered successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'message': 'User already exists'}), 409
    
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    
    if user and check_password_hash(user['password'], password):
        session['username'] = username
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/api/home', methods=['GET'])
def home():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id, username FROM users')
    users = cursor.fetchall()
    users_list = [{'id': user['id'], 'username': user['username']} for user in users]
    
    if 'username' in session:
        username = session['username']
        cursor.execute('''
            SELECT photos.id, photos.filename, photos.description, photos.keywords, photos.user_id, users.username
            FROM photos JOIN users ON photos.user_id = users.id
        ''')
        photos = cursor.fetchall()
        photos_list = [{'id': photo['id'], 'filename': photo['filename'], 'description': photo['description'], 'keywords': photo['keywords'], 'username': photo['username']} for photo in photos]
    else:
        username = None
        photos_list = []

    return jsonify({'username': username, 'users': users_list, 'photos': photos_list})


@app.route('/api/messages', methods=['POST'])
def send_message():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    receiver_id = data.get('receiverId')
    content = data.get('content')

    if not receiver_id or not content:
        return jsonify({'error': 'Missing data'}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT username FROM users WHERE username = ?', (receiver_id,))
    
    receiver = cursor.fetchone()

    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404

    cursor.execute('INSERT INTO messages (sender, recipient, content) VALUES (?, ?, ?)',
                   (session['username'], receiver['username'], content))
    db.commit()
    
    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/api/messages', methods=['GET'])
def get_messages():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id, sender, content, timestamp FROM messages WHERE recipient = ?', (session['username'],))
    messages = cursor.fetchall()

    return jsonify([dict(message) for message in messages])

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM messages WHERE id = ?', (message_id,))
    db.commit()
    
    return jsonify({'message': 'Message deleted successfully'})

@app.route('/api/messages/reply', methods=['POST'])
def reply_message():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    original_message_id = data.get('messageId')
    content = data.get('content')

    if not original_message_id or not content:
        return jsonify({'error': 'Missing data'}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT username FROM users WHERE username = ?', (original_message_id,))
    
    receiver = cursor.fetchone()

    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404

    cursor.execute('INSERT INTO messages (sender, recipient, content) VALUES (?, ?, ?)',
                   (session['username'], receiver['username'], content))
    db.commit()
    
    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/api/check_login', methods=['GET'])
def check_login():
    if 'username' in session:
        return jsonify({'username': session['username']})
    else:
        return jsonify({'username': None}), 401

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        description = request.form.get('description', '')
        keywords = request.form.get('keywords', '')
        user_id = get_user_id_from_session()

        db = get_db()
        cursor = db.cursor()
        cursor.execute('INSERT INTO photos (user_id, filename, description, keywords) VALUES (?, ?, ?, ?)',
                       (user_id, filename, description, keywords))
        db.commit()

        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200

    return jsonify({'message': 'File upload failed'}), 500

@app.route('/api/photos/<int:photo_id>', methods=['PUT'])
def update_photo(photo_id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    description = request.form.get('description')
    keywords = request.form.get('keywords')
    file = request.files.get('file')

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM photos WHERE id = ?', (photo_id,))
    photo = cursor.fetchone()

    if not photo:
        return jsonify({'message': 'Photo not found'}), 404

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        old_filepath = os.path.join(app.config['UPLOAD_FOLDER'], photo['filename'])
        if os.path.exists(old_filepath):
            os.remove(old_filepath)

        cursor.execute('UPDATE photos SET filename = ?, description = ?, keywords = ? WHERE id = ?',
                       (filename, description, keywords, photo_id))
    else:
        cursor.execute('UPDATE photos SET description = ?, keywords = ? WHERE id = ?',
                       (description, keywords, photo_id))
    
    db.commit()
    return jsonify({'message': 'Photo updated successfully'})

@app.route('/api/search', methods=['GET'])
def search_photos():
    keyword = request.args.get('keyword', '')

    if not keyword:
        return jsonify({'message': 'No keyword provided'}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT photos.id, photos.filename, photos.description, photos.keywords, users.username
        FROM photos
        JOIN users ON photos.user_id = users.id
        WHERE photos.description LIKE ? OR photos.keywords LIKE ?
    ''', (f'%{keyword}%', f'%{keyword}%'))
    
    photos = cursor.fetchall()
    photos_list = [{'id': photo['id'], 'filename': photo['filename'], 'description': photo['description'], 'keywords': photo['keywords'], 'username': photo['username']} for photo in photos]

    return jsonify(photos_list)

if __name__ == '__main__':
    app.run(debug=True)
