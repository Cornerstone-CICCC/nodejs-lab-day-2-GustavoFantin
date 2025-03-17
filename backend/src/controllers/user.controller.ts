import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'
import { log } from 'console'


const home = (req :Request, res : Response) => {
    res.status(200).send('Ryoga')
}

/**
 * Get all users
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} returns list of users.
 */
const getUsers = (req: Request, res: Response) => {
    const users = userModel.getUsers()
    res.status(200).json(users)
}

/**
 * Creates a new user and add to database
 * 
 * @param {Request<{},{}, Omit<User, 'id'>>} req 
 * @param {Response} res 
 * @returns returns new user
 */
const addUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const { username, password, firstname, lastname} = req.body
    if (!username || !password || !firstname || !lastname) {
        res.status(422).json({ message: "You should fill all inputs!" })
        return
    }
    const user = await userModel.createUser({ username, password, firstname, lastname })
    if (!user) {
        res.status(409).json({ error: "Username taken!" })
        return
    }
    res.status(201).json(user)
}

/**
 * Look for a user with username typed
 * 
 * @param {Request<{ username: string }>} req 
 * @param {Response} res 
 * @returns returns user that matches username
 */
const searchByUsername = (req: Request<{ username: string }>, res: Response) => {
    if (req.session && req.session.username) {
        const user = userModel.findByUsername(req.session.username)
        res.status(200).json(user)
        return
    }
    res.status(500).send('User is not logged in')
}

/**
 * Login user
 * 
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} returns a cookie and redirect
 */
const loginUser = async (req: Request<{}, {}, Omit<User, 'id'| 'firstname' | 'lastname'>>, res: Response) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(500).send('Username/password is missing')
        return
    }

    const user = await userModel.login(username, password)
    if (!user) {
        res.status(500).send("Login details incorrect!")
        return
    }

    if (req.session) {
        req.session.isLoggedIn = true
        req.session.username = user.username
    }
    res.status(200).send('logged')
}

/**
 * Logout user
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns clear all cookies and logout user
 */
const logout = (req: Request, res: Response) => {
    req.session = null
    res.status(301).json({
        message: "Cookie cleared, logout user"
    })
}


const checkCookie = (req: Request, res: Response) => {
    if (req.session && req.session.isLoggedIn) {
      res.status(200).json({
        content: req.session.isLoggedIn
      })
      return
    }
    res.status(500).json({
      content: "No cookies, have to log in!"
    })
  }

export default {
    home,
    getUsers,
    addUser,
    searchByUsername,
    loginUser,
    logout,
    checkCookie
}