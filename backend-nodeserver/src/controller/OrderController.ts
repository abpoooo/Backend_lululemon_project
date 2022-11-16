import {getRepository, MoreThan} from "typeorm";
import {NextFunction, Request, Response} from "express";
import order from "../routes/order";
import {Order} from "../entity/Order";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {IdCheckRes, MKController} from "./MKController";
import paymentStatus from "../routes/paymentStatus";
import {PaymentController} from "./PaymentController";
import {OrderStatusController} from "./OrderStatusController";
import payment from "../routes/payment";
import {promisify} from "util";

const redis = require('redis')
const redisClient = redis.createClient()
const getAsync = promisify(redisClient.get).bind(redisClient)

const DEFAULT_EXPIRATION = 3600
export class OrderController extends MKController{

    public static get repo() {
        return getRepository(Order)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let orders = []

        let currentDate = new Date()

        const {filterIndex} = request.query

        const filterId = parseInt(filterIndex as any) || 1

        try {
            if (filterId === 1) {
                orders = await OrderController.repo.find({
                    order: {
                        createAt: 'DESC'
                    }
                })
            }else if(filterId ===2) {
                currentDate.setMonth(currentDate.getMonth() - 6)
                const redisOrders = await getAsync("redisOrders")
                if (redisOrders != null) {
                    console.log('Cache Hit')
                    orders = JSON.parse(redisOrders)
                } else {
                    console.log("Cache Miss")

                orders = await OrderController.repo.find({
                    where: {
                        createAt: MoreThan(currentDate)
                    },
                    order: {
                        createAt: 'DESC'
                    }
                })
                redisClient.setex('redisOrders', DEFAULT_EXPIRATION, JSON.stringify(orders))
            }

            }else {
                currentDate.setMonth(currentDate.getMonth()-12)
                orders = await OrderController.repo.find({
                    where:{
                        createAt: MoreThan(currentDate)
                    },
                    order:{
                        createAt: 'DESC'
                    }
                })
            }
        // try{
        //     orders = await OrderController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderId} = request.params
        if (!orderId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order = await OrderController.repo.findOneOrFail(orderId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async validateOrder(orderStatus: number, payment: number){
        if (typeof orderStatus !== "number" ||
            orderStatus <= 0 ||
            typeof payment !== "number" ||
            payment <= 0
        ){
            throw (new Err(HttpCode.E400, 'invalid user id or product ids'))
        }
        console.log('v1111')
        //
        let res: IdCheckRes[] = []
        //
        try{
            console.log('v1')
            let temp = await OrderController.checkIdExists([orderStatus], OrderStatusController.repo)
            if (temp.index !== -1){
                throw (new Err(HttpCode.E400, 'invalid user id,' + temp.index))
            }
            res.push(temp)
            console.log('v2')
            temp = await  OrderController.checkIdExists([payment], PaymentController.repo)
            if (temp.index !== -1){
                throw (new Err(HttpCode.E400, 'invalid product id,' + temp.index))
            }
            console.log('v3')
            res.push(temp)
        } catch (e) {
            console.log('error, write to db', e)
            throw (new Err(HttpCode.E400, 'invalid product id or user id,', e))
        }

        return res
    }


    static async create(request: Request, response: Response, next: NextFunction) {
        let {beforeTax, taxRate, tax, quantity, subtotal, products, payment, orderStatus} = request.body
        let order = new Order()
        // order.orderNumber = orderNumber
        order.beforeTax = beforeTax
        order.taxRate = taxRate
        order.quantity = quantity
        order.tax = tax
        order.subtotal = subtotal
        order.products = products
        order.isDelete = false
        order.isActive = true

        console.log(`order new:`, order)
        try {
            console.log('o1')
            const errors = await validate(order)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            console.log('o2')
            let res = await OrderController.validateOrder(orderStatus, payment)

            console.log('o3')
            order.orderStatus = res[0].entities[0]
            order.payment = res[1].entities[0]

            await OrderController.repo.save(order)
            console.log('o4')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }



    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {

        const {orderId} = request.params
        if (!orderId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        // does not exist
        try {
            order = await OrderController.repo.findOneOrFail(orderId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E404,ErrStr.ErrStore))
        }

        // existing
        let { beforeTax, taxRate, tax, quantity, subtotal, products, orderStatus, payment} = request.body
        order.beforeTax = beforeTax
        order.taxRate = taxRate
        order.quantity = quantity
        order.tax = tax
        order.subtotal = subtotal
        order.products = products
        order.isDelete = false
        order.isActive = true
        order.orderStatus = orderStatus
        order.payment = payment



        const errors = await validate(order)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }

        // save the data to db
        try {
            const errors = await validate(order)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            let res = await OrderController.validateOrder(orderStatus, payment)
            order.orderStatus = res[0].entities[0]
            order.payment = res[1].entities[0]
            await OrderController.repo.save(order)
        } catch (e){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK,order))
    }


}
