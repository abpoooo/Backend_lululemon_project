import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import paymentStatus from "../routes/paymentStatus";
import {PaymentStatus} from "../entity/PaymentStatus";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {IdCheckRes, MKController} from "./MKController";

export class PaymentStatusController extends MKController{
    public static get repo() {
        return getRepository(PaymentStatus)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let paymentStatus = []
        try {
            paymentStatus = await PaymentStatusController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentStatus))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {paymentStatusId} = request.params
        if (!paymentStatusId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let paymentStatus = null
        try {
            paymentStatus = await PaymentStatusController.repo.findOneOrFail(paymentStatusId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentStatus))
    }


    static async create(request: Request, response: Response, next: NextFunction) {
        let {status} = request.body
        let paymentStatus = new PaymentStatus()
        paymentStatus.status = status


        console.log(`paymentStatus new:`, paymentStatus)
        try {
            console.log('o1')
            const errors = await validate(paymentStatus)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            console.log('o2')
            await PaymentStatusController.repo.save(paymentStatus)
            console.log('o3')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentStatus))
    }



    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {

        const {paymentStatusId} = request.params
        if (!paymentStatusId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let paymentStatus = null
        // does not exist
        try {
            paymentStatus = await PaymentStatusController.repo.findOneOrFail(paymentStatusId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E404,ErrStr.ErrStore))
        }

        // existing
        let {status} = request.body
        paymentStatus.status = status



        const errors = await validate(paymentStatus)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }

        // save the data to db
        try {
            await PaymentStatusController.repo.save(paymentStatus)
        } catch (e){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK,paymentStatus))
    }


}
