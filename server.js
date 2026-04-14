const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your GitHub Pages site
app.use(cors({
    origin: ['https://habeebmasood.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Profile keywords for match scoring
const PROFILE_KEYWORDS = {
    high: ['enterprise', 'saas', 'solutions', 'consulting', 'gtm', 'cxo', 'arr', 'growth', 'strategy'],
    medium: ['sales', 'account', 'business development', 'bdr', 'sdr', 'ae', 'management', 'b2b'],
    tech: ['cloud', 'software', 'technology', 'digital', 'transformation', 'ai', 'data']
};

// Companies likely to sponsor
const SPONSOR_COMPANIES = [
    'google', 'aws', 'amazon', 'microsoft', 'salesforce', 'meta', 'facebook', 'linkedin',
    'anthropic', 'openai', 'datadog', 'workday', 'mckinsey', 'bcg', 'bain', 'pwc',
    'deloitte', 'ey', 'kpmg', 'accenture', 'stripe', 'oracle', 'sap', 'adobe',
    'hubspot', 'slack', 'zoom', 'snowflake', 'databricks', 'rippling', 'clickup'
];

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Job Search Backend API',
        endpoints: {
            '/api/jobs/sales': 'Fetch enterprise sales jobs',
            '/api/jobs/consulting': 'Fetch consulting jobs',
            '/api/jobs/parttime': 'Fetch part-time jobs',
            '/api/jobs/all': 'Fetch all job categories'
        }
    });
});

// Mock Indeed API function (replace with real API calls when you have credentials)
async function searchIndeedJobs(searchTerm, location, jobType) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, this would be:
    // const response = await fetch(`https://api.indeed.com/ads/apisearch?publisher=${INDEED_API_KEY}&v=2&format=json&q=${searchTerm}&l=${location}&co=ie&jt=${jobType}&limit=20`);
    // const data = await response.json();
    // return data.results;
    
    // Mock data for now
    const jobCount = Math.floor(Math.random() * 8) + 3;
    const jobs = [];
    
    const companiesByCategory = {
        sales: ['Salesforce', 'AWS', 'Microsoft', 'Google Cloud', 'Datadog', 'HubSpot', 'Stripe', 'Snowflake', 'Oracle', 'Workday', 'Rippling', 'ClickUp'],
        consulting: ['McKinsey & Company', 'Boston Consulting Group', 'Bain & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'Oliver Wyman', 'Strategy&'],
        parttime: ['Tesco Ireland', 'Boots', 'Dunnes Stores', 'Vodafone Ireland', 'Three Ireland', 'Dubray Books', 'Eason', 'Supervalu']
    };
    
    const category = searchTerm.toLowerCase().includes('consultant') ? 'consulting' : 
                     searchTerm.toLowerCase().includes('retail') || searchTerm.toLowerCase().includes('sales advisor') ? 'parttime' : 'sales';
    
    const companies = companiesByCategory[category];
    
    for (let i = 0; i < jobCount; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const daysAgo = Math.floor(Math.random() * 14);
        const isRemote = Math.random() > 0.7;
        
        jobs.push({
            id: `indeed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: generateJobTitle(searchTerm, category),
            company: company,
            location: isRemote ? 'Remote' : location,
            postedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
            salary: generateSalary(category, jobType),
            description: `Join our team as a ${searchTerm}...`,
            url: `https://ie.indeed.com/viewjob?jk=${Math.random().toString(36).substr(2, 16)}`
        });
    }
    
    return jobs;
}

function generateJobTitle(searchTerm, category) {
    const prefixes = {
        sales: ['Senior', 'Junior', 'Lead', ''],
        consulting: ['Associate', 'Senior', 'Principal', ''],
        parttime: ['Part-time', '', 'Weekend']
    };
    
    const suffixes = {
        sales: ['- Enterprise', '- SaaS', '- Cloud', '- Technology', ''],
        consulting: ['- Strategy', '- Digital Transformation', '- Tech', ''],
        parttime: ['', '(16 hrs/week)', '(20 hrs/week)']
    };
    
    const prefix = prefixes[category][Math.floor(Math.random() * prefixes[category].length)];
    const suffix = suffixes[category][Math.floor(Math.random() * suffixes[category].length)];
    
    return `${prefix} ${searchTerm} ${suffix}`.trim().replace(/\s+/g, ' ');
}

function generateSalary(category, jobType) {
    if (jobType === 'parttime') {
        return `€${12 + Math.floor(Math.random() * 6)}-${16 + Math.floor(Math.random() * 4)}/hr`;
    }
    
    if (category === 'sales') {
        const base = 40 + Math.floor(Math.random() * 40);
        return `€${base}K-${base + 20}K + OTE`;
    }
    
    if (category === 'consulting') {
        const base = 45 + Math.floor(Math.random() * 45);
        return `€${base}K-${base + 25}K`;
    }
    
    return null;
}

function calculateMatchScore(title, company, category) {
    let score = 60;
    
    const titleLower = title.toLowerCase();
    const companyLower = company.toLowerCase();
    
    PROFILE_KEYWORDS.high.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 8;
    });
    
    PROFILE_KEYWORDS.medium.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 4;
    });
    
    if (SPONSOR_COMPANIES.includes(companyLower)) {
        score += 10;
    }
    
    if (category === 'sales' || category === 'consulting') {
        score += 10;
    }
    
    return Math.min(100, score);
}

function isLikelySponsor(company) {
    return SPONSOR_COMPANIES.includes(company.toLowerCase());
}

function isTechRole(title) {
    const techKeywords = ['tech', 'digital', 'transformation', 'strategy', 'cloud', 'software'];
    return techKeywords.some(keyword => title.toLowerCase().includes(keyword));
}

// API Endpoints
app.get('/api/jobs/sales', async (req, res) => {
    try {
        const searches = [
            { term: 'SDR', location: 'Dublin' },
            { term: 'BDR', location: 'Dublin' },
            { term: 'Account Executive', location: 'Dublin' },
            { term: 'Sales Development', location: 'Ireland' },
            { term: 'Enterprise Sales', location: 'Dublin' }
        ];
        
        const allJobs = [];
        const seenIds = new Set();
        
        for (const search of searches) {
            const jobs = await searchIndeedJobs(search.term, search.location, 'fulltime');
            jobs.forEach(job => {
                if (!seenIds.has(job.id)) {
                    seenIds.add(job.id);
                    allJobs.push({
                        ...job,
                        category: 'sales',
                        matchScore: calculateMatchScore(job.title, job.company, 'sales'),
                        likelySponsor: isLikelySponsor(job.company),
                        isTechTransformation: isTechRole(job.title)
                    });
                }
            });
        }
        
        res.json(allJobs.slice(0, 50));
    } catch (error) {
        console.error('Error fetching sales jobs:', error);
        res.status(500).json({ error: 'Failed to fetch sales jobs' });
    }
});

app.get('/api/jobs/consulting', async (req, res) => {
    try {
        const searches = [
            { term: 'Management Consultant', location: 'Dublin' },
            { term: 'Strategy Consultant', location: 'Ireland' },
            { term: 'Associate Consultant', location: 'Dublin' },
            { term: 'Business Analyst', location: 'Dublin' },
            { term: 'Digital Transformation', location: 'Ireland' }
        ];
        
        const allJobs = [];
        const seenIds = new Set();
        
        for (const search of searches) {
            const jobs = await searchIndeedJobs(search.term, search.location, 'fulltime');
            jobs.forEach(job => {
                if (!seenIds.has(job.id)) {
                    seenIds.add(job.id);
                    allJobs.push({
                        ...job,
                        category: 'consulting',
                        matchScore: calculateMatchScore(job.title, job.company, 'consulting'),
                        likelySponsor: isLikelySponsor(job.company),
                        isTechTransformation: isTechRole(job.title)
                    });
                }
            });
        }
        
        res.json(allJobs.slice(0, 50));
    } catch (error) {
        console.error('Error fetching consulting jobs:', error);
        res.status(500).json({ error: 'Failed to fetch consulting jobs' });
    }
});

app.get('/api/jobs/parttime', async (req, res) => {
    try {
        const searches = [
            { term: 'Sales Advisor', location: 'Dublin' },
            { term: 'Retail Sales', location: 'Dublin' },
            { term: 'Shop Assistant', location: 'Dublin' },
            { term: 'Customer Service', location: 'Dublin' }
        ];
        
        const allJobs = [];
        const seenIds = new Set();
        
        for (const search of searches) {
            const jobs = await searchIndeedJobs(search.term, search.location, 'parttime');
            jobs.forEach(job => {
                if (!seenIds.has(job.id)) {
                    seenIds.add(job.id);
                    allJobs.push({
                        ...job,
                        category: 'parttime',
                        matchScore: calculateMatchScore(job.title, job.company, 'parttime'),
                        likelySponsor: isLikelySponsor(job.company),
                        isTechTransformation: false
                    });
                }
            });
        }
        
        res.json(allJobs.slice(0, 50));
    } catch (error) {
        console.error('Error fetching part-time jobs:', error);
        res.status(500).json({ error: 'Failed to fetch part-time jobs' });
    }
});

app.get('/api/jobs/all', async (req, res) => {
    try {
        const [salesJobs, consultingJobs, partTimeJobs] = await Promise.all([
            fetch(`${req.protocol}://${req.get('host')}/api/jobs/sales`).then(r => r.json()),
            fetch(`${req.protocol}://${req.get('host')}/api/jobs/consulting`).then(r => r.json()),
            fetch(`${req.protocol}://${req.get('host')}/api/jobs/parttime`).then(r => r.json())
        ]);
        
        res.json({
            sales: salesJobs,
            consulting: consultingJobs,
            parttime: partTimeJobs,
            total: salesJobs.length + consultingJobs.length + partTimeJobs.length
        });
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        res.status(500).json({ error: 'Failed to fetch all jobs' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Job Search API running on port ${PORT}`);
    console.log(`Test it: http://localhost:${PORT}`);
});
