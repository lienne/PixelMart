import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});

export const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('PostgreSQL connected at ', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to PostgreSQL', err);
    }
};

export default pool;