# ビルドステージ
FROM node:20-alpine as build

WORKDIR /app

# 依存パッケージのインストール
COPY package.json package-lock.json* ./
RUN npm ci

# ソースコードのコピーとビルド
COPY public ./public
COPY src ./src
COPY webpack.config.js ./
COPY .babelrc* ./

# 環境変数の設定（ビルド時）
ARG REACT_APP_API_URL=http://localhost:5050
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# アプリケーションのビルド
RUN npm run build

# 実行ステージ
FROM nginx:alpine

# Nginxの設定
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポートの公開
EXPOSE 80

# Nginxの起動
CMD ["nginx", "-g", "daemon off;"]
