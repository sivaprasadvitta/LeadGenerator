import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import leadsRouter from './routes/leads.js';

const app = express();
app.use(cors('*'));
app.use(express.json());
console.log(process.env.PORT)


app.use('/api/leads', leadsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));