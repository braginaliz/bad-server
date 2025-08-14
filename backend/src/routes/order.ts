import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import  auth from '../middlewares/auth'
import { validateOrderBody, validateQueryParameters  } from '../middlewares/validations'
import { Role } from '../models/user'
import { roleGuardMiddleware } from '../middlewares/auth'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, createOrder)
orderRouter.get('/all', auth, roleGuardMiddleware(Role.Admin), validateQueryParameters, getOrders)
orderRouter.get('/all/me', auth, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter