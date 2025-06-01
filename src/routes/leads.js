import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config'
import validateData from '../validation.js';

const router = express.Router();
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

router.post('/', async (req, res) => {
    console.log(req.body)
    const { username, email, company, message } = req.body

    const error = validateData({ username, email, company, message });
    if (error) {
        return res.status(400).json({ error: error.message, field: error.field });
    }

    try {
        const payload = {
            username: username.trim(),
            email: email.trim(),
            company: company?.trim() ?? null,
            message: message?.trim() ?? null
        };

        const n8nResp = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(n8nResp)

        if (!n8nResp.ok) {
            throw new Error(`n8n responded with status ${n8nResp.status}`);
        }

        return res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error('Error forwarding to n8n:', err);
        return res.status(502).json({ error: 'Failed to forward lead to n8n' });
    }
});

export default router;