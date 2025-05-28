import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

# アプリケーションの初期化
app = Flask(__name__)
CORS(app)

# 環境変数から設定を取得
database_url = os.environ.get('DATABASE_URL', 'sqlite:///netflix_clone.db')
jwt_secret_key = os.environ.get('JWT_SECRET_KEY', 'netflix-clone-secret-key')

# SQLiteからPostgreSQLへの接続文字列変換（必要な場合）
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

# 設定
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = jwt_secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# 拡張機能の初期化
db = SQLAlchemy(app)
jwt = JWTManager(app)

# モデル定義
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

class Content(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    release_year = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    video_url = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(10), nullable=False)  # movie or series
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)

class ContentCategory(db.Model):
    content_id = db.Column(db.Integer, db.ForeignKey('content.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), primary_key=True)

class Favorite(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('content.id'), primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class WatchHistory(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('content.id'), primary_key=True)
    watch_position = db.Column(db.Integer, default=0)  # 秒単位
    last_watched = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

# API エンドポイント
@app.route('/')
def index():
    return jsonify({"message": "Welcome to Netflix Clone API"})

# 認証関連 API
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 既存ユーザーチェック
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400
    
    # 新規ユーザー作成
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']  # 実際の実装では必ずハッシュ化すること
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # トークン生成
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # ユーザー検索
    user = User.query.filter_by(email=data['email']).first()
    
    # 認証
    if not user or user.password != data['password']:  # 実際の実装ではハッシュ比較
        return jsonify({"error": "Invalid credentials"}), 401
    
    # トークン生成
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200

# コンテンツ関連 API
@app.route('/api/contents', methods=['GET'])
def get_contents():
    contents = Content.query.all()
    result = []
    
    for content in contents:
        result.append({
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "release_year": content.release_year,
            "genre": content.genre,
            "image_url": content.image_url,
            "video_url": content.video_url,
            "type": content.type
        })
    
    return jsonify(result), 200

@app.route('/api/contents/<int:content_id>', methods=['GET'])
def get_content(content_id):
    content = Content.query.get_or_404(content_id)
    
    return jsonify({
        "id": content.id,
        "title": content.title,
        "description": content.description,
        "release_year": content.release_year,
        "genre": content.genre,
        "image_url": content.image_url,
        "video_url": content.video_url,
        "type": content.type
    }), 200

# カテゴリ関連 API
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = []
    
    for category in categories:
        result.append({
            "id": category.id,
            "name": category.name,
            "description": category.description
        })
    
    return jsonify(result), 200

@app.route('/api/categories/<int:category_id>/contents', methods=['GET'])
def get_category_contents(category_id):
    # カテゴリに属するコンテンツを取得
    content_categories = ContentCategory.query.filter_by(category_id=category_id).all()
    content_ids = [cc.content_id for cc in content_categories]
    contents = Content.query.filter(Content.id.in_(content_ids)).all()
    
    result = []
    for content in contents:
        result.append({
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "release_year": content.release_year,
            "genre": content.genre,
            "image_url": content.image_url,
            "video_url": content.video_url,
            "type": content.type
        })
    
    return jsonify(result), 200

# お気に入り関連 API
@app.route('/api/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    
    # ユーザーのお気に入りを取得
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    content_ids = [fav.content_id for fav in favorites]
    contents = Content.query.filter(Content.id.in_(content_ids)).all()
    
    result = []
    for content in contents:
        result.append({
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "release_year": content.release_year,
            "genre": content.genre,
            "image_url": content.image_url,
            "video_url": content.video_url,
            "type": content.type
        })
    
    return jsonify(result), 200

@app.route('/api/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    content_id = data.get('content_id')
    
    # 既存チェック
    existing = Favorite.query.filter_by(user_id=user_id, content_id=content_id).first()
    if existing:
        return jsonify({"message": "Already in favorites"}), 200
    
    # 新規お気に入り追加
    new_favorite = Favorite(user_id=user_id, content_id=content_id)
    db.session.add(new_favorite)
    db.session.commit()
    
    return jsonify({"message": "Added to favorites"}), 201

@app.route('/api/favorites/<int:content_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(content_id):
    user_id = get_jwt_identity()
    
    # お気に入り削除
    favorite = Favorite.query.filter_by(user_id=user_id, content_id=content_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Removed from favorites"}), 200
    
    return jsonify({"error": "Favorite not found"}), 404

# 視聴履歴関連 API
@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_watch_history():
    user_id = get_jwt_identity()
    
    # ユーザーの視聴履歴を取得
    history_items = WatchHistory.query.filter_by(user_id=user_id).order_by(WatchHistory.last_watched.desc()).all()
    result = []
    
    for item in history_items:
        content = Content.query.get(item.content_id)
        result.append({
            "content": {
                "id": content.id,
                "title": content.title,
                "image_url": content.image_url,
                "type": content.type
            },
            "watch_position": item.watch_position,
            "last_watched": item.last_watched.isoformat()
        })
    
    return jsonify(result), 200

@app.route('/api/history', methods=['POST'])
@jwt_required()
def update_watch_history():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    content_id = data.get('content_id')
    watch_position = data.get('watch_position', 0)
    
    # 既存の視聴履歴を検索
    history = WatchHistory.query.filter_by(user_id=user_id, content_id=content_id).first()
    
    if history:
        # 既存の履歴を更新
        history.watch_position = watch_position
        history.last_watched = db.func.now()
    else:
        # 新規履歴を作成
        history = WatchHistory(
            user_id=user_id,
            content_id=content_id,
            watch_position=watch_position
        )
        db.session.add(history)
    
    db.session.commit()
    
    return jsonify({"message": "Watch history updated"}), 200

# 検索 API
@app.route('/api/search', methods=['GET'])
def search_contents():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify([]), 200
    
    # タイトルまたは説明で検索
    contents = Content.query.filter(
        (Content.title.ilike(f'%{query}%')) | 
        (Content.description.ilike(f'%{query}%'))
    ).all()
    
    result = []
    for content in contents:
        result.append({
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "release_year": content.release_year,
            "genre": content.genre,
            "image_url": content.image_url,
            "video_url": content.video_url,
            "type": content.type
        })
    
    return jsonify(result), 200

# ヘルスチェックエンドポイント
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
