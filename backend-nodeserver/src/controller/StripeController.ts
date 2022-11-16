import {NextFunction, Request, Response} from "express";
import {Err, ErrStr, HttpCode} from "../helper/Err";


const stripe = require("stripe")('sk_test_51LwXYfKsWwHv6sipO1D8F6tO6wiPGfn2o4GAzp3oEm6lweNschUVe49M570niWK5bm3chL5gB7t959KXqEI2gTNS00HhwQFpHo');

export class StripeController {
    static async create(request: Request, response: Response, next: NextFunction) {
        let {total} = request.body

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "CAD",
                amount: total,
                automatic_payment_methods: {enabled: true},
            });
            response.send({clientSecret: paymentIntent.client_secret})
            console.log(paymentIntent.client_secret)
        } catch (e) {
            return response.status(400).send({error: {message: e.message}})
        }
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {id} = request.params
        try {
            const paymentMethod = await stripe.paymentMethods.retrieve(id)
            console.log(paymentMethod)
            response.send({payment: paymentMethod.card})
        } catch (e) {
            return response.status(400).send({error: {message: e.message}})
        }
    }
}