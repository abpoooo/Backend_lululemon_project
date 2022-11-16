import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import payment from "../routes/payment";
import {Payment} from "../entity/Payment";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {IdCheckRes, MKController} from "./MKController";
import {OrderStatusController} from "./OrderStatusController";
import {PaymentStatusController} from "./PaymentStatusController";
import {PaymentTypesController} from "./PaymentTypesController";

export class PaymentController extends MKController{
    public static get repo() {
        return getRepository(Payment)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let payments = []
        try {
            payments = await PaymentController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, payments))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {paymentId} = request.params
        if (!paymentId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let payment = null
        try {
            payment = await PaymentController.repo.findOneOrFail(paymentId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, payment))
    }

    static async validateOrder(paymentStatus: number, paymentTypes: number){
        if (typeof paymentStatus !== "number" ||
            paymentStatus <= 0 ||
            typeof paymentTypes !== "number" ||
            paymentTypes <= 0
        ){
            throw (new Err(HttpCode.E400, 'invalid user id or product ids'))
        }
        console.log('v1111')
        //
        let res: IdCheckRes[] = []
        //
        try{
            console.log('v1')
            let temp = await PaymentController.checkIdExists([paymentStatus], PaymentStatusController.repo)
            if (temp.index !== -1){
                throw (new Err(HttpCode.E400, 'invalid user id,' + temp.index))
            }
            res.push(temp)
            console.log('v2')
            temp = await  PaymentController.checkIdExists([paymentTypes], PaymentTypesController.repo)
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
        let {cardNumber, expiryMonth, expiryYear, status, types} = request.body
        let payment = new Payment()

        payment.cardNumber = cardNumber
        payment.expiryMonth = expiryMonth
        payment.expiryYear = expiryYear

        payment.isDelete = false
        payment.isActive = true

        console.log(`payment new:`, payment)
        try {
            const error = await validate(payment)
            if (error.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrValidate, error))
            }

            console.log('o1')
            const errors = await validate(payment)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            console.log('o2')
            let res = await PaymentController.validateOrder(status,types)
            console.log('o3')
            payment.status = res[0].entities[0]
            payment.types = res[1].entities[0]

            await PaymentController.repo.save(payment)
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, payment))
    }



    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {

        const {paymentId} = request.params
        if (!paymentId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let payment = null
        // does not exist
        try {
            payment = await PaymentController.repo.findOneOrFail(paymentId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E404,ErrStr.ErrStore))
        }

        // existing
        let {cardNumber, expiryMonth, expiryYear, status, types} = request.body

        payment.cardNumber = cardNumber
        payment.expiryMonth = expiryMonth
        payment.expiryYear = expiryYear
        payment.status = status
        payment.types = types
        payment.isDelete = false
        payment.isActive = true



        const errors = await validate(payment)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }

        // save the data to db
        try {
            const errors = await validate(payment)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrValidate, errors))
            }
            let res = await PaymentController.validateOrder(status, types)

            payment.status = res[0].entities[0]
            payment.type = res[1].entities[0]

            await PaymentController.repo.save(payment)
        } catch (e){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK,payment))
    }


}
