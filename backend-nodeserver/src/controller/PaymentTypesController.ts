import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import paymentTypes from "../routes/paymentTypes";
import {PaymentTypes} from "../entity/PaymentTypes";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import {IdCheckRes, MKController} from "./MKController";

export class PaymentTypesController extends MKController{
    public static get repo() {
        return getRepository(PaymentTypes)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let paymentTypes = []
        try {
            paymentTypes = await PaymentTypesController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentTypes))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {paymentTypesId} = request.params
        if (!paymentTypesId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let paymentTypes = null
        try {
            paymentTypes = await PaymentTypesController.repo.findOneOrFail(paymentTypesId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentTypes))
    }


    static async create(request: Request, response: Response, next: NextFunction) {
        let {types} = request.body
        let paymentTypes = new PaymentTypes()
        paymentTypes.types = types


        console.log(`paymentTypes new:`, paymentTypes)
        try {
            console.log('o1')
            const errors = await validate(paymentTypes)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '', errors))
            }
            console.log('o2')
            await PaymentTypesController.repo.save(paymentTypes)
            console.log('o3')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, paymentTypes))
    }



    static async delete(request: Request, response: Response, next: NextFunction) {
    }

    static async update(request: Request, response: Response, next: NextFunction) {

        const {paymentTypesId} = request.params
        if (!paymentTypesId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let paymentTypes = null
        // does not exist
        try {
            paymentTypes = await PaymentTypesController.repo.findOneOrFail(paymentTypesId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E404,ErrStr.ErrStore))
        }

        // existing
        let {types} = request.body
        paymentTypes.types = types




        const errors = await validate(paymentTypes)
        if (errors.length > 0) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors))
        }

        // save the data to db
        try {
            await PaymentTypesController.repo.save(paymentTypes)
        } catch (e){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK,paymentTypes))
    }


}
