# タスク管理ツール

GitHub Pages + アクセス制限で動作するタスク管理アプリケーションです。

## 🚀 デプロイ済みアプリケーション

**Vercelでデプロイ予定**

## 📋 機能

- **プロジェクト管理**: 階層化されたタスク管理
- **進捗追跡**: 自動計算される進捗率
- **メモ機能**: 履歴付きメモシステム
- **担当者管理**: GitHubユーザー名との紐付け
- **アクセス制限**: 指定されたユーザーのみアクセス可能

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **React Router** - ルーティング
- **Axios** - HTTPクライアント
- **Lucide React** - アイコン
- **date-fns** - 日付処理

### バックエンド
- **Node.js** - ランタイム
- **Express** - Webフレームワーク
- **TypeScript** - 型安全性
- **SQLite** - データベース
- **JWT** - 認証
- **GitHub OAuth** - 認証

## 🏗️ プロジェクト構造

```
todo/
├── frontend/          # React フロントエンド
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── contexts/      # React Context
│   │   ├── types/         # TypeScript型定義
│   │   └── utils/         # ユーティリティ
│   ├── public/            # 静的ファイル
│   └── package.json
├── backend/           # Express バックエンド
│   ├── src/
│   │   ├── routes/        # API ルート
│   │   ├── models/        # データベースモデル
│   │   ├── middleware/    # Express ミドルウェア
│   │   └── types/         # TypeScript型定義
│   └── package.json
└── package.json      # ワークスペース設定
```

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- npm
- Git

### 1. リポジトリをクローン
```bash
git clone https://github.com/junkiiwai/todo.git
cd todo
```

### 2. 依存関係をインストール
```bash
npm run install:all
```

### 3. 環境変数を設定

#### フロントエンド (.env)
```bash
cd frontend
cp env.example .env
```

`.env` ファイルを編集：
```env
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### バックエンド (.env)
```bash
cd ../backend
cp env.example .env
```

`.env` ファイルを編集：
```env
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. データベースを初期化
```bash
cd ../backend
npm run dev
```

### 5. フロントエンドを起動
```bash
cd ../frontend
npm run dev
```

## 🌐 アクセス方法

### ローカル開発
```
http://localhost:5173
```

### Vercelデプロイ
```
https://your-app-name.vercel.app
```

## 🔐 アクセス制限

アプリケーションは以下の方法でアクセス制限されています：

1. **URLパラメータ**: `?user=YOUR_GITHUB_USERNAME`
2. **許可されたユーザー**: `frontend/src/utils/accessControl.ts` で設定

### 使用方法
1. GitHubにログイン
2. このリポジトリのcollaboratorに招待される
3. 以下のURLでアクセス：
   ```
   https://your-app-name.vercel.app?user=YOUR_GITHUB_USERNAME
   ```

## 📝 機能詳細

### タスク管理
- **階層化**: 親タスクと子タスクの関係
- **自動計算**: 親タスクの所要時間と進捗率
- **プロジェクト**: 最上位タスクとその子タスク群

### 進捗管理
- **手動入力**: 最下層タスクのみ
- **自動計算**: 親タスクは子タスクの重み付き平均
- **完了判定**: 100%で「完了」セクションに移動

### メモ機能
- **履歴保存**: 過去のメモを保持
- **記入者情報**: 名前とタイムスタンプ
- **自由記入**: 現状・課題の記録

### 担当者管理
- **表示名設定**: 自由に設定可能
- **GitHub連携**: ユーザー名との紐付け
- **プルダウン選択**: 簡単な選択方式

## 🔧 開発コマンド

### 全体
```bash
npm run dev          # フロントエンドとバックエンドを同時起動
npm run build        # 全体をビルド
npm run install:all  # 全依存関係をインストール
```

### フロントエンド
```bash
cd frontend
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run preview      # ビルド結果をプレビュー
```

### バックエンド
```bash
cd backend
npm run dev          # 開発サーバー起動
npm run build        # TypeScriptコンパイル
npm start            # 本番サーバー起動
```

## 📦 デプロイ

### Vercel（フロントエンド）
1. [Vercel](https://vercel.com) にサインアップ
2. GitHubリポジトリをインポート
3. フロントエンドディレクトリを指定
4. 環境変数を設定
5. デプロイ

### Railway（バックエンド）
1. [Railway](https://railway.app) にサインアップ
2. GitHubリポジトリをインポート
3. バックエンドディレクトリを指定
4. 環境変数を設定
5. デプロイ

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
