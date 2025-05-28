FROM python:3.11-slim

WORKDIR /app

# 依存パッケージのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY src /app/src
COPY init_db.py /app/
COPY seed_db.py /app/
COPY run.py /app/

# PostgreSQL用のドライバーを追加
RUN pip install --no-cache-dir psycopg2-binary

# 環境変数の設定
ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/netflix_clone

# ポートの公開
EXPOSE 5050

# エントリーポイント
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
