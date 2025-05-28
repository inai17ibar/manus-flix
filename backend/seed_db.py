#!/usr/bin/env python3

from src.app import app, db, User, Content, Category, ContentCategory

def seed_db():
    with app.app_context():
        # カテゴリ追加
        categories = [
            {"name": "トレンド", "description": "今話題の作品"},
            {"name": "人気作品", "description": "人気の高い作品"},
            {"name": "新着", "description": "最近追加された作品"},
            {"name": "アクション", "description": "アクション映画・ドラマ"},
            {"name": "コメディ", "description": "コメディ映画・ドラマ"},
            {"name": "ドラマ", "description": "ドラマ作品"},
            {"name": "SF", "description": "SF映画・ドラマ"},
            {"name": "アニメ", "description": "アニメーション作品"}
        ]
        
        for cat_data in categories:
            category = Category(**cat_data)
            db.session.add(category)
        
        db.session.commit()
        
        # コンテンツ追加
        contents = [
            {
                "title": "宇宙の彼方へ",
                "description": "宇宙探査隊が未知の惑星で遭遇する冒険を描いたSF作品",
                "release_year": 2023,
                "genre": "SF",
                "image_url": "https://via.placeholder.com/300x450?text=Space+Adventure",
                "video_url": "https://example.com/videos/space_adventure.mp4",
                "type": "movie"
            },
            {
                "title": "都市の影",
                "description": "大都市の裏社会で生きる主人公の姿を描いたクライムドラマ",
                "release_year": 2022,
                "genre": "ドラマ",
                "image_url": "https://via.placeholder.com/300x450?text=City+Shadows",
                "video_url": "https://example.com/videos/city_shadows.mp4",
                "type": "series"
            },
            {
                "title": "笑いの学校",
                "description": "個性豊かな教師と生徒たちの学園コメディ",
                "release_year": 2021,
                "genre": "コメディ",
                "image_url": "https://via.placeholder.com/300x450?text=Comedy+School",
                "video_url": "https://example.com/videos/comedy_school.mp4",
                "type": "series"
            },
            {
                "title": "最後の戦士",
                "description": "古代の戦士が現代に蘇り、新たな敵と戦うアクション映画",
                "release_year": 2023,
                "genre": "アクション",
                "image_url": "https://via.placeholder.com/300x450?text=Last+Warrior",
                "video_url": "https://example.com/videos/last_warrior.mp4",
                "type": "movie"
            },
            {
                "title": "魔法の森",
                "description": "不思議な力を持つ森と、そこに住む生き物たちのファンタジーアニメ",
                "release_year": 2022,
                "genre": "アニメ",
                "image_url": "https://via.placeholder.com/300x450?text=Magic+Forest",
                "video_url": "https://example.com/videos/magic_forest.mp4",
                "type": "movie"
            },
            {
                "title": "未来都市2150",
                "description": "2150年の未来都市を舞台にしたSFアクション",
                "release_year": 2023,
                "genre": "SF",
                "image_url": "https://via.placeholder.com/300x450?text=Future+City+2150",
                "video_url": "https://example.com/videos/future_city.mp4",
                "type": "movie"
            },
            {
                "title": "家族の絆",
                "description": "離れ離れになった家族の再会を描く感動のドラマ",
                "release_year": 2021,
                "genre": "ドラマ",
                "image_url": "https://via.placeholder.com/300x450?text=Family+Bonds",
                "video_url": "https://example.com/videos/family_bonds.mp4",
                "type": "series"
            },
            {
                "title": "秘密の任務",
                "description": "スパイとして活動する主人公の危険な任務を描くスリラー",
                "release_year": 2022,
                "genre": "アクション",
                "image_url": "https://via.placeholder.com/300x450?text=Secret+Mission",
                "video_url": "https://example.com/videos/secret_mission.mp4",
                "type": "series"
            }
        ]
        
        for content_data in contents:
            content = Content(**content_data)
            db.session.add(content)
        
        db.session.commit()
        
        # コンテンツとカテゴリの関連付け
        content_categories = [
            # トレンド
            {"content_id": 1, "category_id": 1},
            {"content_id": 4, "category_id": 1},
            {"content_id": 6, "category_id": 1},
            
            # 人気作品
            {"content_id": 2, "category_id": 2},
            {"content_id": 5, "category_id": 2},
            {"content_id": 7, "category_id": 2},
            
            # 新着
            {"content_id": 1, "category_id": 3},
            {"content_id": 4, "category_id": 3},
            {"content_id": 6, "category_id": 3},
            
            # アクション
            {"content_id": 4, "category_id": 4},
            {"content_id": 8, "category_id": 4},
            
            # コメディ
            {"content_id": 3, "category_id": 5},
            
            # ドラマ
            {"content_id": 2, "category_id": 6},
            {"content_id": 7, "category_id": 6},
            
            # SF
            {"content_id": 1, "category_id": 7},
            {"content_id": 6, "category_id": 7},
            
            # アニメ
            {"content_id": 5, "category_id": 8}
        ]
        
        for cc_data in content_categories:
            content_category = ContentCategory(**cc_data)
            db.session.add(content_category)
        
        db.session.commit()
        
        # サンプルユーザー追加
        user = User(
            username="testuser",
            email="test@example.com",
            password="password123"  # 実際の実装ではハッシュ化すること
        )
        db.session.add(user)
        db.session.commit()
        
        print("サンプルデータをデータベースに追加しました")

if __name__ == '__main__':
    seed_db()
