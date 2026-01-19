/*
  Kayzen Izumi
*/
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { generateQrisDynamic, isStaticQrisConfigured } from './src/qris';
import { loadRouter, initAutoLoad } from './src/autoload';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const configNya = [
    path.join(__dirname, 'src', 'config.json'),
    path.join(__dirname, '..', 'src', 'config.json'),
    path.join(process.cwd(), 'src', 'config.json'),
    path.join('/var/task/src/config.json')
];

let configPath = '';
for (const p of configNya) {
    if (fs.existsSync(p)) {
        configPath = p;
        break;
    }
}
if (!configPath) {
    console.error('[✗] Config file not found');
    process.exit(1);
}

let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const visitor_db = path.join('/tmp', 'visitors.json');

const visit = (): number => {
    try {
        if (fs.existsSync(visitor_db)) {
            const data = fs.readFileSync(visitor_db, 'utf-8');
            return JSON.parse(data).count;
        }
        return parseInt(config.settings.visitors || "0");
    } catch (error) { 
        console.error('[✗] Error reading visitor count:', error);
        return 0; 
    }
};

const incrementVisitor = (): void => {
    try {
        let count = visit();
        count++;
        fs.writeFileSync(visitor_db, JSON.stringify({ count }));
    } catch (error) {
        console.error('[✗] Error incrementing visitor:', error);
    }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/src', express.static(path.join(process.cwd(), 'src')));

app.post('/api/create-payment', async (req: Request, res: Response) => {
    const { amount, name } = req.body;
    
    if (!isStaticQrisConfigured()) {
        return res.status(503).json({ 
            status: 'error', 
            message: 'QRIS payment is temporarily unavailable',
            creator: config.settings.creator,
            note: 'Please configure STATIC_QRIS in src/qris.ts'
        });
    }
    
    if (!amount || isNaN(parseInt(amount)) || parseInt(amount) < 1000) {
        res.status(400).json({ status: 'error', message: 'Minimum Rp 1.000' });
        return;
    }

    try {
        const nominal = parseInt(amount);
        const qrString = generateQrisDynamic(nominal);
        
        if (!qrString || qrString === "") {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Failed to generate QRIS',
                creator: config.settings.creator 
            });
        }
        
        const orderId = `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 

        await new Promise(r => setTimeout(r, 500));

        res.json({
            creator: config.settings.creator,
            status: 'success',
            order_id: orderId,
            amount: nominal,
            qr_string: qrString,
            expired_at: Date.now() + 300000
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

loadRouter(app, config);

app.get('/config', (req: Request, res: Response) => {
    try {
        const currentConfig = JSON.parse(JSON.stringify(config));
        currentConfig.settings.visitors = visit().toString();
        currentConfig.qris_configured = isStaticQrisConfigured();
        res.json({ creator: config.settings.creator, ...currentConfig });
    } catch (error) { res.status(500).json({ creator: config.settings.creator, error: "Internal Server Error" }); }
});

app.get('/', (req: Request, res: Response) => {
    incrementVisitor();
    res.sendFile(path.join(process.cwd(), 'public', 'landing.html'));
});

app.get('/docs', (req: Request, res: Response) => { res.sendFile(path.join(process.cwd(), 'public', 'docs.html')); });
app.get('/donasi', (req: Request, res: Response) => { res.sendFile(path.join(process.cwd(), 'public', 'donasi.html')); });

app.use((req: Request, res: Response) => {
    if (req.accepts('html')) {
        const possible404 = [path.join(process.cwd(), 'public', '404.html'), path.join(__dirname, 'public', '404.html')];
        for (const p of possible404) { if (fs.existsSync(p)) return res.status(404).sendFile(p); }
    }
    res.status(404).json({ status: false, creator: config.settings.creator, message: "Route not found" });
});

initAutoLoad(app, config, configPath);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`QRIS Configured: ${isStaticQrisConfigured() ? 'Yes' : 'No'}`);
});
export default app;
