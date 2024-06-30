"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./Config/db.config"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const conversation_1 = require("./Routes/conversation");
const messageRoute_1 = require("./Routes/messageRoute");
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const vendorRoutes_1 = __importDefault(require("./Routes/vendorRoutes"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const OtpExpiration_1 = require("./Middleware/OtpExpiration");
const path_1 = __importDefault(require("path"));
const { initializeSocket } = require('./socket.js');
const http_1 = require("http");
dotenv_1.default.config();
(0, db_config_1.default)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: ['http://localhost:5000', "https://eventcrest.online"],
    credentials: true
}));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../Frontend/dist')));
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax' }
});
app.use(sessionMiddleware);
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(OtpExpiration_1.userOtpExpiration);
app.use(OtpExpiration_1.vendorOtpExpiration);
app.use(OtpExpiration_1.userEmailVerifyOtp);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/vendor', vendorRoutes_1.default);
app.use('/api/conversation', conversation_1.router);
app.use('/api/messages', messageRoute_1.router);
initializeSocket(server);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../Frontend/dist/index.html'));
});
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`BACKEND SERVER RUNNING ON ${PORT}...`);
});
