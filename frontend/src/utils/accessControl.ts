// アクセス制限の設定
const ALLOWED_USERS = [
  'junkiiwai', // あなたのGitHubユーザー名
  // ここにcollaboratorのGitHubユーザー名を追加
];

// GitHubユーザー名を取得（URLパラメータから）
export const getCurrentUser = (): string | null => {
  // 複数の方法でURLパラメータを取得
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');
  
  // デバッグ情報
  console.log('Full URL:', window.location.href);
  console.log('Search params:', window.location.search);
  console.log('URLSearchParams result:', user);
  
  // フォールバック: 直接URLから取得
  if (!user) {
    const url = new URL(window.location.href);
    const fallbackUser = url.searchParams.get('user');
    console.log('Fallback URL result:', fallbackUser);
    return fallbackUser;
  }
  
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