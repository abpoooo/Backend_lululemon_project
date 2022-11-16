import {Router} from "express";

import {ReviewController} from "../controller/ReviewController";


const router = Router()

// restful api
// route parameter
// router.get('/', ReviewController.all)
router.get('/photo/:reviewId', ReviewController.one)
router.post('/create', ReviewController.create)
router.get('/',ReviewController.all)

// router.delete('/:studentId', ReviewController.delete)

export default router