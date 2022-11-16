import {Router} from "express";

// @ts-ignore
import {PaymentStatusController} from "../controller/PaymentStatusController";

const router = Router()


router.get('/', PaymentStatusController.all)
router.get('/:paymentStatusId', PaymentStatusController.one)
router.post('/', PaymentStatusController.create)
router.put('/:paymentStatusId', PaymentStatusController.update)
router.delete('/:paymentStatusId', PaymentStatusController.delete)

export default router