# Job Search Backend API

Backend service that provides job listings from Indeed for the Ireland Job Search Tool.

## Features

- ✅ Enterprise Sales jobs (SDR, BDR, AE)
- ✅ Management Consulting roles
- ✅ Part-time Sales & Retail positions
- ✅ Match scoring based on profile
- ✅ Visa sponsorship likelihood detection
- ✅ CORS enabled for GitHub Pages

## API Endpoints

- `GET /` - Health check
- `GET /api/jobs/sales` - Fetch enterprise sales jobs (up to 50)
- `GET /api/jobs/consulting` - Fetch consulting jobs (up to 50)
- `GET /api/jobs/parttime` - Fetch part-time jobs (up to 50)
- `GET /api/jobs/all` - Fetch all categories at once

## Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:3000
```

## Deploy to Render (FREE)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (easiest)
3. No credit card required for free tier

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository (or upload these files to a new repo)
3. Configure:
   - **Name:** `job-search-backend`
   - **Region:** Choose closest to Ireland (e.g., Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or path to this folder if nested)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Your API will be live at: `https://job-search-backend-XXXXX.onrender.com`

### Step 4: Update Your HTML File
In your `index.html`, replace the `fetchIndeedJobs` function to call your backend:

```javascript
async function fetchEnterpriseSalesJobs() {
    const response = await fetch('https://YOUR-BACKEND-URL.onrender.com/api/jobs/sales');
    return await response.json();
}

async function fetchConsultingJobs() {
    const response = await fetch('https://YOUR-BACKEND-URL.onrender.com/api/jobs/consulting');
    return await response.json();
}

async function fetchPartTimeJobs() {
    const response = await fetch('https://YOUR-BACKEND-URL.onrender.com/api/jobs/parttime');
    return await response.json();
}
```

## Important Notes

### Free Tier Limitations
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free (enough for daily use)
- To keep it always on: upgrade to paid ($7/month) OR ping it every 10 minutes

### Keep Free Tier Awake (Optional)
Use a free service like UptimeRobot or cron-job.org to ping your backend every 10 minutes:
- URL to ping: `https://YOUR-BACKEND-URL.onrender.com/`
- Frequency: Every 10 minutes

## Upgrade to Real Indeed Data

Currently uses mock data. To connect real Indeed API:

1. Sign up for Indeed Publisher API: https://www.indeed.com/publisher
2. Get your Publisher ID
3. In `server.js`, replace the `searchIndeedJobs` function with real API calls
4. Add your API key as environment variable in Render dashboard

## Support

Questions? Issues? Open an issue on GitHub or contact habeebmasood@gmail.com
