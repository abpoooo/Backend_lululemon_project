import {Router} from "express";

// @ts-ignore
import {OrderStatusController} from "../controller/OrderStatusController";

const router = Router()


router.get('/', OrderStatusController.all)
router.get('/:orderStatusId', OrderStatusController.one)
router.post('/', OrderStatusController.create)
router.put('/:orderStatusId', OrderStatusController.update)
router.delete('/:orderStatusId', OrderStatusController.delete)

export default router