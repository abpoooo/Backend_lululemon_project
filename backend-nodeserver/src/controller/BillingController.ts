import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Billing} from "../entity/Billing";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import billing from "../routes/billing";
// @ts-ignore

export class BillingController {
    public static get repo() {
        return getRepository(Billing)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let billingAddress = []
        try {
            billingAddress = await BillingController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, billingAddress))

    }

    static async one(request: Request, response: Response, next: NextFunction) {

        const {billingId} = request.params
        if (!billingId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order = await BillingController.repo.findOneOrFail(billingId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }


    static async create(request: Request, response: Response, next: NextFunction) {

        let {Address, City, Country, Province, PostalCode, PhoneNumber} = request.body
        let billing = new Billing()
        billing.Address = Address
        billing.City = City
        billing.Country = Country
        billing.Province = Province
        billing.PostalCode = PostalCode
        billing.PhoneNumber = PhoneNumber

        console.log(`billing address new:`, billing)
        console.log('t0')
        try {
            const errors = await validate(billing)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '12321323', errors))
            }
            console.log('t1')
            await BillingController.repo.save(billing)
            console.log('t2')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, billing))

    }
    static async delete(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }


}

