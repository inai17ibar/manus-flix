# Netflix クローンアプリケーション - Docker版

このプロジェクトは、Netflixのクローンアプリケーションで、フロントエンドとバックエンドを分離した構成になっています。Docker Composeを使用して簡単に起動できます。

## 機能

- ユーザー認証（登録・ログイン）
- コンテンツ一覧表示
- カテゴリ別コンテンツ表示
- コンテンツ詳細表示
- お気に入り登録・管理
- 視聴履歴管理
- 検索機能

## 技術スタック

### バックエンド
- **フレームワーク**: Flask (Python)
- **データベース**: PostgreSQL
- **認証**: JWT (JSON Web Token)

### フロントエンド
- **フレームワーク**: React.js
- **状態管理**: Redux (@reduxjs/toolkit)
- **スタイリング**: styled-components
- **ルーティング**: react-router-dom
- **HTTP通信**: Axios

## Docker環境での起動方法

### 前提条件
- Docker と Docker Compose がインストールされていること
  - Docker: https://docs.docker.com/get-docker/
  - Docker Compose: https://docs.docker.com/compose/install/

### 起動手順

1. リポジトリをクローン
```
git clone <リポジトリURL>
cd netflix-clone
```

2. Docker Composeでサービスを起動
```
docker-compose up -d
```

3. ブラウザでアクセス
```
http://localhost
```

4. サンプルユーザーでログイン
```
メールアドレス: test@example.com
パスワード: password123
```

### サービスの停止
```
docker-compose down
```

### データの永続化
データベースのデータは `postgres_data` という名前のDockerボリュームに保存されます。
完全に削除する場合は以下のコマンドを実行してください：
```
docker-compose down -v
```

## Docker構成

### コンテナ構成
- **db**: PostgreSQLデータベース
- **backend**: Flaskバックエンド
- **frontend**: React + Nginxフロントエンド

### ポート
- フロントエンド: 80
- バックエンド: 5050
- データベース: 5432

### 環境変数
環境変数をカスタマイズする場合は、`.env`ファイルを作成して以下の変数を設定できます：

```
POSTGRES_PASSWORD=カスタムパスワード
POSTGRES_USER=カスタムユーザー
POSTGRES_DB=カスタムDB名
JWT_SECRET_KEY=カスタムシークレットキー
```

## ディレクトリ構造

```
netflix-clone/
├── docker-compose.yml      # Docker Compose設定
├── backend/
│   ├── Dockerfile          # バックエンドのDockerfile
│   ├── requirements.txt    # Pythonパッケージ依存関係
│   ├── src/                # ソースコード
│   │   ├── app.py          # メインアプリケーション
│   │   └── ...
│   ├── init_db.py          # DB初期化スクリプト
│   ├── seed_db.py          # サンプルデータ投入スクリプト
│   └── run.py              # アプリケーション起動スクリプト
│
├── frontend/
│   ├── Dockerfile          # フロントエンドのDockerfile
│   ├── nginx.conf          # Nginx設定
│   ├── .babelrc            # Babel設定
│   ├── public/             # 静的ファイル
│   ├── src/                # ソースコード
│   │   ├── api/            # API連携
│   │   ├── components/     # 共通コンポーネント
│   │   ├── features/       # Redux機能
│   │   ├── pages/          # ページコンポーネント
│   │   ├── App.js          # メインアプリケーション
│   │   └── index.js        # エントリーポイント
│   ├── package.json        # パッケージ設定
│   └── webpack.config.js   # Webpack設定
│
└── README.md               # このファイル
```

## トラブルシューティング

### ビルドエラー
ビルド時にエラーが発生した場合は、以下を確認してください：
- 各Dockerfileのパスが正しいか
- 必要なファイル（.babelrcなど）が存在するか
- docker-compose.ymlのビルドコンテキストが正しいか

```
# ビルドログの確認
docker-compose build --no-cache
```

### データベース接続エラー
バックエンドがデータベースに接続できない場合：
```
docker-compose restart backend
```

### フロントエンドがバックエンドに接続できない
APIエンドポイントの接続問題が発生した場合：
1. ブラウザのコンソールでエラーを確認
2. バックエンドのログを確認: `docker-compose logs backend`
3. Nginxのログを確認: `docker-compose logs frontend`

### コンテナのログ確認
```
docker-compose logs [サービス名]
```

### コンテナ内でコマンド実行
```
docker-compose exec [サービス名] [コマンド]
```

例：バックエンドでPythonシェルを起動
```
docker-compose exec backend python
```

## 開発環境での利用

開発モードで起動する場合は、以下のコマンドを使用します：
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

これにより、ホットリロードが有効になり、ソースコードの変更がリアルタイムで反映されます。

## 本番環境へのデプロイ

本番環境にデプロイする際は、以下の点に注意してください：

1. 環境変数を適切に設定（特に機密情報）
2. HTTPSの設定
3. データベースのバックアップ設定
4. スケーリング設定（必要に応じて）

## 注意事項

- このアプリケーションはデモ用です。本番環境にデプロイする場合は、セキュリティ対策を強化してください。
- パスワードは実際の実装ではハッシュ化する必要があります。
- 環境変数を使用して機密情報を管理することをお勧めします。
- Docker環境では、初回起動時にデータベースの初期化とサンプルデータの投入が自動的に行われます。
