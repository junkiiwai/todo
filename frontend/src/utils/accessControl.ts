// アクセス制限の設定
const ALLOWED_USERS = [
  'junkiiwai', // あなたのGitHubユーザー名
  // ここにcollaboratorのGitHubユーザー名を追加
];

// GitHubユーザー名を取得（URLパラメータから）
export const getCurrentUser = (): string | null => {
  // 複数の方法でURLパラメータを取得
  console.log('=== URL Parameter Debug ===');
  console.log('window.location.href:', window.location.href);
  console.log('window.location.search:', window.location.search);
  console.log('window.location.pathname:', window.location.pathname);
  
  // 方法1: URLSearchParams
  const urlParams = new URLSearchParams(window.location.search);
  const user1 = urlParams.get('user');
  console.log('Method 1 (URLSearchParams):', user1);
  
  // 方法2: 直接URLオブジェクト
  let user2 = null;
  try {
    const url = new URL(window.location.href);
    user2 = url.searchParams.get('user');
    console.log('Method 2 (URL object):', user2);
  } catch (error) {
    console.log('Method 2 error:', error);
  }
  
  // 方法3: 正規表現
  const match = window.location.search.match(/[?&]user=([^&]*)/);
  const user3 = match ? match[1] : null;
  console.log('Method 3 (regex):', user3);
  
  // 方法4: 手動パース
  const search = window.location.search.substring(1);
  const params = search.split('&');
  let user4 = null;
  for (const param of params) {
    const [key, value] = param.split('=');
    if (key === 'user') {
      user4 = value;
      break;
    }
  }
  console.log('Method 4 (manual parse):', user4);
  
  // 最初に見つかった値を返す
  const result = user1 || user2 || user3 || user4;
  console.log('Final result:', result);
  console.log('=== End Debug ===');
  
  return result;
};

// アクセス権限をチェック
export const checkAccess = (): boolean => {
  const currentUser = getCurrentUser();
  
  console.log('Checking access for user:', currentUser);
  console.log('Allowed users:', ALLOWED_USERS);
  
  // 一時的にアクセス制限を無効化（デバッグ用）
  console.log('Temporarily allowing all access for debugging');
  return true;
  
  // 元のコード（コメントアウト）
  /*
  if (!currentUser) {
    console.log('No user parameter found');
    return false;
  }
  
  const hasAccess = ALLOWED_USERS.includes(currentUser);
  console.log('User has access:', hasAccess);
  
  return hasAccess;
  */
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