import express from 'express';
import axios from 'axios';
import { db } from '../models/database';
import { generateToken } from '../middleware/auth';
import { User } from '../types';

const router = express.Router();

// GitHub OAuth認証
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: '認証コードが必要です' });
    }

    // GitHubからアクセストークンを取得
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'GitHub認証に失敗しました' });
    }

    // GitHubからユーザー情報を取得
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const githubUser = userResponse.data;

    // データベースでユーザーを検索または作成
    db.get('SELECT * FROM users WHERE github_username = ?', [githubUser.login], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'データベースエラー' });
      }

      let user: User;

      if (row) {
        // 既存ユーザー
        user = row;
      } else {
        // 新規ユーザー作成
        db.run(
          'INSERT INTO users (github_username, display_name) VALUES (?, ?)',
          [githubUser.login, githubUser.name || githubUser.login],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'ユーザー作成エラー' });
            }

            // 作成されたユーザーを取得
            db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
              if (err) {
                return res.status(500).json({ error: 'ユーザー取得エラー' });
              }
              
              const token = generateToken(newUser);
              res.json({
                access_token: token,
                user: newUser
              });
            });
          }
        );
        return;
      }

      const token = generateToken(user);
      res.json({
        access_token: token,
        user: user
      });
    });

  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).json({ error: '認証エラー' });
  }
});

// 現在のユーザー情報取得
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'アクセストークンが必要です' });
  }

  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: '無効なトークンです' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'ユーザー取得エラー' });
      }

      if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      res.json(user);
    });
  });
});

export default router; 