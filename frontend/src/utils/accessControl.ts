// アクセス制限の設定
const ALLOWED_USERS = [
  'junkiiwai', // あなたのGitHubユーザー名
  // ここにcollaboratorのGitHubユーザー名を追加
];

// GitHubユーザー名を取得（URLパラメータから）
export const getCurrentUser = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('user');
};

// アクセス権限をチェック
export const checkAccess = (): boolean => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return false;
  }
  
  return ALLOWED_USERS.includes(currentUser);
};

// アクセス拒否時の処理
export const handleAccessDenied = () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    alert('アクセス権限がありません。\n\n使用方法:\n1. GitHubにログイン\n2. このリポジトリのcollaboratorに招待される\n3. 以下のURLでアクセス:\n' + 
          window.location.origin + window.location.pathname + '?user=' + currentUser);
    return false;
  }
  
  if (!ALLOWED_USERS.includes(currentUser)) {
    alert(`ユーザー "${currentUser}" にはアクセス権限がありません。\n\n管理者に連絡してください。`);
    return false;
  }
  
  return true;
}; 