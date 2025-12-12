# CapRover Deployment Authentication Fix

## Problem
CapRover is trying to clone from GitHub but failing with:
```
fatal: Authentication failed for 'https://github.com/Extrahand-Trizen/extrahand-web-app-nextjs/'
```

This happens because the repository is private and CapRover doesn't have authentication credentials.

## Solutions

### Solution 1: Add GitHub Personal Access Token (Recommended)

This is the best solution for private repositories.

#### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "CapRover Deployment")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

#### Step 2: Configure CapRover App

1. Open your CapRover dashboard
2. Navigate to your app: `nextjs-extrahand`
3. Go to **App Configs** tab
4. Scroll to **Deployment** section
5. Find **GitHub Repository** settings
6. Update the repository URL to include the token:
   ```
   https://YOUR_TOKEN@github.com/Extrahand-Trizen/extrahand-web-app-nextjs.git
   ```
   Or use the format:
   ```
   https://YOUR_USERNAME:YOUR_TOKEN@github.com/Extrahand-Trizen/extrahand-web-app-nextjs.git
   ```
7. Set the **Branch** to `eshaan` (or your target branch)
8. Click **Save & Update**

#### Alternative: Use CapRover's Built-in GitHub Integration

1. In CapRover dashboard → App Configs
2. Under **Deployment Method**, select **GitHub**
3. Click **Connect GitHub Account**
4. Authorize CapRover to access your repositories
5. Select the repository: `Extrahand-Trizen/extrahand-web-app-nextjs`
6. Select branch: `eshaan`
7. Click **Save & Update**

### Solution 2: Deploy from Local Files (Alternative)

If you prefer to deploy from your local machine instead of GitHub:

1. In CapRover dashboard → App Configs
2. Under **Deployment Method**, select **Upload tar file**
3. On your local machine, create a tar file:
   ```bash
   cd web-apps/extrahand-web-app-nextjs
   tar -czf ../nextjs-deploy.tar.gz .
   ```
4. Upload the tar file through CapRover UI
5. Click **Save & Update**

### Solution 3: Use SSH Instead of HTTPS

If you have SSH keys configured on your CapRover server:

1. In CapRover dashboard → App Configs
2. Update the repository URL to use SSH:
   ```
   git@github.com:Extrahand-Trizen/extrahand-web-app-nextjs.git
   ```
3. Ensure SSH keys are configured on CapRover server
4. Click **Save & Update**

## Verification

After applying any solution:

1. Go to **Deployment** tab in CapRover
2. Click **Trigger New Build**
3. Monitor the build logs
4. The build should now succeed without authentication errors

## Troubleshooting

### Still Getting Authentication Errors?

1. **Check token permissions**: Ensure the token has `repo` scope
2. **Verify repository URL**: Make sure it matches exactly: `Extrahand-Trizen/extrahand-web-app-nextjs`
3. **Check branch name**: Ensure the branch exists (e.g., `eshaan`)
4. **Token expiration**: GitHub tokens can expire; regenerate if needed
5. **Repository visibility**: Verify the repository is accessible with the token

### Build Fails After Authentication Fix?

1. Check build logs for other errors
2. Verify `captain-definition` file exists in the repository root
3. Ensure `Dockerfile` exists and is valid
4. Check that all required files are committed to the repository

## Security Best Practices

1. **Use fine-grained tokens** (if available) instead of classic tokens
2. **Limit token scope** to only what's needed (`repo` for private repos)
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Don't commit tokens** to version control
5. **Use environment variables** in CapRover for sensitive data

## Next Steps

After fixing authentication:

1. Ensure all code is committed and pushed to the `eshaan` branch
2. Verify environment variables are set in CapRover
3. Test the deployment
4. Monitor application logs after deployment




