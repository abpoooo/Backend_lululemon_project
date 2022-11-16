import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import orderStatus from "../routes/orderStatus";
import {OrderStatus} from "../entity/OrderStatus";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {IdCheckRes, MKController} from "./MKController";

export class OrderStatusController extends MKController{
    public static get repo() {
        return getRepository(OrderStatus)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let orderStatus = []
        try {
            orderStatus = await OrderStatusController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orderStatus))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {orderStatusId} = request.params
        if (!orderStatusId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let orderStatus = null
        try {
            orderStatus = await OrderStatusController.repo.findOneOrFail(orderStatusId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orderStatus))
    }


    static async create(request: Request, response: Response, next: NextFunction) {
        let {status} = request.body
        let orderStatus = new OrderStatus()
        orderStatus.status = status


        console.log(`orderStatus new:`, orderStatus)
        try {
            console.log('o1')
            const errors = await validate(orderStatus)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            console.log('o2')
            await OrderStatusController.repo.save(orderStatus)
            console.log('o3')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orderStatus))
    }



    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {

        const {orderStatusId} = request.params
        if (!orderStatusId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let orderStatus = null
        // does not exist
        try {
            orderStatus = await OrderStatusController.repo.findOneOrFail(orderStatusId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E404,ErrStr.ErrStore))
        }

        // existing
        let {status} = request.body
        orderStatus.status = status



        const errors = await validate(orderStatus)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }

        // save the data to db
        try {
            await OrderStatusController.repo.save(orderStatus)
        } catch (e){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK,orderStatus))
    }


}
