import {Router} from "express";

// @ts-ignore
import {PaymentTypesController} from "../controller/PaymentTypesController";

const router = Router()


router.get('/', PaymentTypesController.all)
router.get('/:paymentTypesId', PaymentTypesController.one)
router.post('/', PaymentTypesController.create)
router.put('/:paymentTypesId', PaymentTypesController.update)
router.delete('/:paymentTypesId', PaymentTypesController.delete)

export default router