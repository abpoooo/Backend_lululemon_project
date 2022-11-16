
import {Router} from "express";
// import ro from "@faker-js/faker/dist/types/locales/ro";
import {BillingController} from "../controller/BillingController";

const router = Router()


router.get('/', BillingController.all)
router.get('/:billingId', BillingController.one)
router.post('/', BillingController.create)
router.put('/:billingId', BillingController.update)
router.delete('/:billingId', BillingController.delete)

export default router