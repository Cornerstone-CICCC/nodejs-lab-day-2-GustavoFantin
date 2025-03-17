import { Router } from 'express'
import userController from '../controllers/user.controller'


const userRouter = Router()
userRouter.get('/', userController.home)
userRouter.get('/get-info', userController.searchByUsername)

userRouter.post('/login', userController.loginUser)
userRouter.get('/users', userController.getUsers) 
userRouter.post('/signup', userController.addUser)
userRouter.get('/logout', userController.logout)
userRouter.get('/check-auth', userController.checkCookie) 


export default userRouter