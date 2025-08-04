// アクセス制限の設定
const ALLOWED_USERS = [
  'junkiiwai', // あなたのGitHubユーザー名
  // ここにcollaboratorのGitHubユーザー名を追加
];

// GitHubユーザー名を取得（URLパラメータから）
export const getCurrentUser = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');
  console.log('Current user from URL:', user);
  return user;
};

// アクセス権限をチェック
export const checkAccess = (): boolean => {
  const currentUser = getCurrentUser();
  
  console.log('Checking access for user:', currentUser);
  console.log('Allowed users:', ALLOWED_USERS);
  
  if (!currentUser) {
    console.log('No user parameter found');
    return false;
  }
  
  const hasAccess = ALLOWED_USERS.includes(currentUser);
  console.log('User has access:', hasAccess);
  
  return hasAccess;
};

// アクセス拒否時の処理
export const handleAccessDenied = () => {
  const currentUser = getCurrentUser();
  
  console.log('Access denied for user:', currentUser);
  
  if (!currentUser) {
    alert('アクセス権限がありません。\n\n使用方法:\n1. GitHubにログイン\n2. このリポジトリのcollaboratorに招待される\n3. 以下のURLでアクセス:\n' + 
          window.location.origin + window.location.pathname + '?user=junkiiwai');
    return false;
  }
  
  if (!ALLOWED_USERS.includes(currentUser)) {
    alert(`ユーザー "${currentUser}" にはアクセス権限がありません。\n\n管理者に連絡してください。\n\n許可されたユーザー: ${ALLOWED_USERS.join(', ')}`);
    return false;
  }
  
  return true;
}; 