import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'

const customerRouter = Router()

customerRouter.get('/', auth, roleGuardMiddleware(Role.Admin), getCustomers)
customerRouter.get('/:id', roleGuardMiddleware(Role.Admin), auth, getCustomerById)
customerRouter.patch('/:id', roleGuardMiddleware(Role.Admin), auth, updateCustomer)
customerRouter.delete('/:id', roleGuardMiddleware(Role.Admin), auth, deleteCustomer)

export default customerRouter
