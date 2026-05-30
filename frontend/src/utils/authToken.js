let supabaseAccessToken = null;

export function setSupabaseAccessToken(token) {
  supabaseAccessToken = token || null;
}

export function getAuthToken() {
  return supabaseAccessToken || localStorage.getItem('pakkarent_token');
}

export function clearAuthTokens() {
  supabaseAccessToken = null;
  localStorage.removeItem('pakkarent_token');
  localStorage.removeItem('pakkarent_user');
}
