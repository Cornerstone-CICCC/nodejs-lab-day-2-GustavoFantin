import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieSession from 'cookie-session'
import userRouter from './routes/user.routes'
dotenv.config()

// Create your server
const app = express()


//middleware
app.use(cors({
    origin: "http://localhost:4321",
    credentials: true
}))
app.use(express.json())
const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("Missing cookie keys")
}
app.use(cookieSession({
    name: "session",
    keys: [
        SIGN_KEY,
        ENCRYPT_KEY
    ],
    maxAge: 5 * 60 * 1000
}))

//Routes
app.use('/', userRouter)

//Fallback
app.use((req: Request, res: Response) => {
    res.status(404).send("Erorr 404. Page not found!")
})


//Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is runnin on http://localhost:${PORT}/`)
})