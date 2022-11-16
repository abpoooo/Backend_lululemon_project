import {Router} from "express";
// import ro from "@faker-js/faker/dist/types/locales/ro";
import {StripeController} from "../controller/StripeController";

const router = Router()


router.get('/:id', StripeController.one)
router.post('/', StripeController.create)

export default router