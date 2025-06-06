interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export async function getGitHubUser(code: string): Promise<GitHubUser | null> {
  try {
    console.log('Exchanging code for access token');
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.GITHUB_APP_CLIENT_ID,
        client_secret: import.meta.env.GITHUB_APP_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', { 
      hasAccessToken: !!tokenData.access_token,
      error: tokenData.error,
      errorDescription: tokenData.error_description 
    });
    
    if (!tokenData.access_token) {
      console.error('No access token received:', tokenData);
      return null;
    }

    console.log('Getting user info with access token');
    // Get user info with access token
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info:', await userResponse.text());
      return null;
    }

    const userData = await userResponse.json();
    console.log('GitHub user data:', {
      id: userData.id,
      login: userData.login,
      name: userData.name,
      email: userData.email,
      hasEmail: !!userData.email
    });

    // Use the email from the user profile
    // If no email is available, use a fallback based on the GitHub username
    const email = userData.email || `${userData.login}@users.noreply.github.com`;

    return {
      id: userData.id,
      login: userData.login,
      name: userData.name || userData.login,
      email: email,
      avatar_url: userData.avatar_url,
    };
  } catch (error) {
    console.error('Error in getGitHubUser:', error);
    return null;
  }
} 