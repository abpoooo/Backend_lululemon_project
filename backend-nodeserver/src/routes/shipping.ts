
import {Router} from "express";
// import ro from "@faker-js/faker/dist/types/locales/ro";
import {ShippingController} from "../controller/ShippingController";

const router = Router()


router.get('/', ShippingController.all)
router.get('/:shippingId', ShippingController.one)
router.post('/', ShippingController.create)
router.put('/:shippingId', ShippingController.update)
router.delete('/:shippingId', ShippingController.delete)

export default router