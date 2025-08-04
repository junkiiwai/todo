# タスク管理ツール

GitHub Pagesでホストされたプライベートタスク管理ツールです。

## 🚀 **アクセス方法**

### **1. 管理者による招待**
1. このリポジトリのcollaboratorとして招待される
2. 招待メールを受け取る
3. 招待を承認する

### **2. アプリケーションへのアクセス**
以下のURLでアクセスしてください：
```
https://junkiiwai.github.io/todo/?user=YOUR_GITHUB_USERNAME
```

**例:**
```
https://junkiiwai.github.io/todo/?user=junkiiwai
```

### **3. アクセス制限**
- リポジトリのcollaboratorのみアクセス可能
- URLパラメータ `?user=YOUR_GITHUB_USERNAME` が必要
- 権限のないユーザーはアクセス拒否されます

## 🛠 **技術スタック**

### **Frontend**
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Lucide React (icons)
- date-fns (date handling)
- カスタムCSS

### **Backend**
- Node.js
- Express
- TypeScript
- SQLite (database)
- JWT authentication
- GitHub OAuth

## 📁 **プロジェクト構造**

```
todo/
├── frontend/          # React フロントエンド
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── contexts/      # React Context
│   │   ├── utils/         # ユーティリティ
│   │   └── types/         # TypeScript型定義
│   └── dist/          # ビルド出力
├── backend/           # Node.js バックエンド
│   ├── src/
│   │   ├── routes/        # API ルート
│   │   ├── models/        # データベースモデル
│   │   ├── middleware/    # ミドルウェア
│   │   └── types/         # TypeScript型定義
│   └── data/          # SQLite データベース
└── .github/          # GitHub Actions
    └── workflows/     # デプロイワークフロー
```

## 🔧 **開発環境のセットアップ**

### **前提条件**
- Node.js 18+
- npm

### **インストール**
```bash
# 依存関係をインストール
npm run install:all

# 開発サーバーを起動
npm run dev
```

### **環境変数**
#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### **Backend (.env)**
```env
PORT=3001
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:5173
```

## 🚀 **デプロイ**

### **GitHub Pages**
1. リポジトリをパブリックに設定
2. Settings → Pages → Source: GitHub Actions
3. 自動デプロイが実行される

### **バックエンド (Railway推奨)**
1. Railwayにサインアップ
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ実行

## 📋 **機能**

### **タスク管理**
- ✅ タスクの作成・編集・削除
- ✅ 階層化されたタスク（親タスク・子タスク）
- ✅ 優先度設定（1-5段階）
- ✅ 進捗管理（0-100%）
- ✅ 期限設定
- ✅ 所要時間の見積もり

### **プロジェクト管理**
- ✅ プロジェクト単位でのタスク表示
- ✅ 完了プロジェクトの自動移動
- ✅ 進捗の自動計算（子タスクの重み付き平均）

### **ユーザー管理**
- ✅ GitHub OAuth認証
- ✅ 担当者設定
- ✅ メモ機能（履歴付き）

### **UI/UX**
- ✅ レスポンシブデザイン
- ✅ モダンなカードレイアウト
- ✅ インタラクティブな要素
- ✅ アクセシビリティ対応

## 🔒 **セキュリティ**

- GitHub OAuthによる認証
- JWTトークンによるセッション管理
- アクセス制限（collaboratorのみ）
- 環境変数による機密情報管理

## 📝 **ライセンス**

このプロジェクトはプライベート用途で作成されています。

## 🤝 **サポート**

問題や質問がある場合は、リポジトリのIssuesでお知らせください。 