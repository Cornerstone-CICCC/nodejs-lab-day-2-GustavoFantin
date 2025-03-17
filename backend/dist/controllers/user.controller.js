"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const home = (req, res) => {
    res.status(200).send('Ryoga');
};
/**
 * Get all users
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} returns list of users.
 */
const getUsers = (req, res) => {
    const users = user_model_1.default.getUsers();
    res.status(200).json(users);
};
/**
 * Creates a new user and add to database
 *
 * @param {Request<{},{}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns returns new user
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        res.status(422).json({ message: "You should fill all inputs!" });
        return;
    }
    const user = yield user_model_1.default.createUser({ username, password, firstname, lastname });
    if (!user) {
        res.status(409).json({ error: "Username taken!" });
        return;
    }
    res.status(201).json(user);
});
/**
 * Look for a user with username typed
 *
 * @param {Request<{ username: string }>} req
 * @param {Response} res
 * @returns returns user that matches username
 */
const searchByUsername = (req, res) => {
    if (req.session && req.session.username) {
        const user = user_model_1.default.findByUsername(req.session.username);
        res.status(200).json(user);
        return;
    }
    res.status(500).send('User is not logged in');
};
/**
 * Login user
 *
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} returns a cookie and redirect
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(500).send('Username/password is missing');
        return;
    }
    const user = yield user_model_1.default.login(username, password);
    if (!user) {
        res.status(500).send("Login details incorrect!");
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = user.username;
    }
    res.status(200).send('logged');
});
/**
 * Logout user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns clear all cookies and logout user
 */
const logout = (req, res) => {
    req.session = null;
    res.status(301).json({
        message: "Cookie cleared, logout user"
    });
};
const checkCookie = (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        res.status(200).json({
            content: req.session.isLoggedIn
        });
        return;
    }
    res.status(500).json({
        content: "No cookies, have to log in!"
    });
};
exports.default = {
    home,
    getUsers,
    addUser,
    searchByUsername,
    loginUser,
    logout,
    checkCookie
};
