const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_16PTSEJiFlbU@ep-wispy-glitter-aizp54zd-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});

async function getToken() {
    try {
        await client.connect();
        const res = await client.query('SELECT "resetPasswordToken", "resetPasswordExpires", NOW() as "dbTime" FROM admins WHERE email = \'admin@bensaoud.com\'');
        console.log('Token:', res.rows[0]?.resetPasswordToken);
        console.log('Expires:', res.rows[0]?.resetPasswordExpires);
        console.log('DB Time:', res.rows[0]?.dbTime);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

getToken();
