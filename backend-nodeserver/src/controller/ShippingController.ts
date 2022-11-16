import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Shipping} from "../entity/Shipping";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {validate} from "class-validator";
import shipping from "../routes/shipping";
// @ts-ignore

export class ShippingController {
    public static get repo() {
        return getRepository(Shipping)
    }


    static async all(request: Request, response: Response, next: NextFunction) {
        let shippingAddress = []
        try {
            shippingAddress = await ShippingController.repo.find()
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, shippingAddress))

    }

    static async one(request: Request, response: Response, next: NextFunction) {

        const {shippingId} = request.params
        if (!shippingId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order = await ShippingController.repo.findOneOrFail(shippingId)
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }


    static async create(request: Request, response: Response, next: NextFunction) {

        let {firstName, lastName, email, Address, City, Country, Province, PostalCode, PhoneNumber } = request.body
        let shipping = new Shipping()
        shipping.firstName = firstName
        shipping.lastName = lastName
        shipping.email = email
        shipping.Address = Address
        shipping.City = City
        shipping.Province = Province
        shipping.PostalCode = PostalCode
        shipping.PhoneNumber = PhoneNumber

        console.log(`shipping address new:`, shipping)
        console.log('t0')
        try {
            const errors = await validate(shipping)
            if (errors.length > 0) {
                return response.status(400).send(new Err(HttpCode.E400, '12321323', errors))
            }
            console.log('t1')
            await ShippingController.repo.save(shipping)
            console.log('t2')
        } catch (e) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, shipping))

    }
    static async delete(request: Request, response: Response, next: NextFunction) {
    }
    static async update(request: Request, response: Response, next: NextFunction) {
    }


}
