"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
// Create your server
const app = (0, express_1.default)();
//middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:4321",
    credentials: true
}));
app.use(express_1.default.json());
const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("Missing cookie keys");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [
        SIGN_KEY,
        ENCRYPT_KEY
    ],
    maxAge: 5 * 60 * 1000
}));
//Routes
app.use('/', user_routes_1.default);
//Fallback
app.use((req, res) => {
    res.status(404).send("Erorr 404. Page not found!");
});
//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runnin on http://localhost:${PORT}/`);
});
