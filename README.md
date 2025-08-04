# タスク管理ツール

GitHub OAuth認証を使用したタスク管理ツールです。指定されたGitHub collaboratorのみがアクセスできます。

## 機能

- GitHub OAuth認証
- タスクの階層化（親タスク・子タスク）
- プロジェクト単位でのタスク管理
- 進捗度の自動計算
- メモ機能（履歴付き）
- 担当者管理
- 優先度・期限管理

## 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React（アイコン）
- date-fns（日付処理）

### バックエンド
- Node.js
- Express
- TypeScript
- SQLite
- JWT認証
- GitHub OAuth

## セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd todo
```

### 2. 依存関係のインストール
```bash
npm run install:all
```

### 3. 環境変数の設定

#### フロントエンド
```bash
cd frontend
cp env.example .env
```

`.env`ファイルを編集：
```
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### バックエンド
```bash
cd backend
cp env.example .env
```

`.env`ファイルを編集：
```
PORT=3001
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:5173
```

### 4. GitHub OAuthアプリケーションの設定

1. GitHubで新しいOAuthアプリケーションを作成
2. Authorization callback URLを`http://localhost:5173/login`に設定
3. Client IDとClient Secretを環境変数に設定

### 5. 開発サーバーの起動
```bash
# ルートディレクトリで実行
npm run dev
```

フロントエンド: http://localhost:5173
バックエンド: http://localhost:3001

## 使用方法

### 1. ログイン
- GitHubアカウントでログイン
- 指定されたcollaboratorのみアクセス可能

### 2. タスク作成
- 「新規作成」ボタンでタスクを作成
- 以下の項目を設定可能：
  - タスク名
  - タスク内容
  - 担当者
  - 優先度（1-5）
  - 所要時間
  - 期限
  - 残日数
  - 進捗度（0-100%）
  - 親タスク

### 3. タスク管理
- プロジェクト（最上位タスク）とその子タスクを表示
- 進捗度100%で完了タスクに自動移動
- メモ機能で現状・課題を記録

### 4. 自動計算機能
- 子タスクを持つタスクの所要時間は子タスクの合計
- 進捗度は子タスクの重み付き平均で自動計算

## デプロイ

### Vercel（フロントエンド）
1. Vercelにプロジェクトを接続
2. 環境変数を設定
3. ビルドコマンド: `npm run build:frontend`

### Railway（バックエンド）
1. Railwayにプロジェクトを接続
2. 環境変数を設定
3. ビルドコマンド: `npm run build:backend`

## ライセンス

MIT License 