#!/usr/bin/env python3

from src.app import app, db

def init_db():
    with app.app_context():
        db.create_all()
        print('データベースを初期化しました')

if __name__ == '__main__':
    init_db()
