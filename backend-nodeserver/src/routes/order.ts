
import {Router} from "express";
// import ro from "@faker-js/faker/dist/types/locales/ro";
import {OrderController} from "../controller/OrderController";

const router = Router()


router.get('/', OrderController.all)
router.get('/:orderId', OrderController.one)
router.post('/', OrderController.create)
router.put('/:orderId', OrderController.update)
router.delete('/:orderId', OrderController.delete)

export default router