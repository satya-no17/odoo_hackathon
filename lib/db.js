import pkg from 'pg'

const { Pool } = pkg
export const pool = new Pool({
    connectionString: process.env.DB_URL
})
export const connectDB = async () => {
    try {
        await pool.query("select now()")
        return "db connected"
    } catch (error) {
        console.error('db connection failed')
    }
}