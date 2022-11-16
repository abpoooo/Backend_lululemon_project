
import {Router} from "express";
import profile from "./billing";
import billing from "./billing";
import order from "./order";
import shipping from "./shipping";
import payment from "./payment";
import paymentStatus from "./paymentStatus";
import paymentTypes from "./paymentTypes";
import orderStatus from "./orderStatus";
import stripe from "./stripe";
import review from "./review";

const routes = Router()

routes.use('/billing', billing)
routes.use('/order', order)
routes.use('/shipping',shipping)
routes.use('/payment', payment)
routes.use('/paymentStatus',paymentStatus)
routes.use('/paymentTypes',paymentTypes)
routes.use('/orderStatus', orderStatus)
routes.use('/stripe12', stripe)
routes.use('/review', review)



export default routes