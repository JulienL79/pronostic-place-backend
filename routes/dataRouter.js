import { Router } from "express";
import { getAllDraws, deleteDraw } from "../controllers/dataController.js";
import { dataValidation } from "../middlewares/dataValidation.js";

const dataRouter = Router()

dataRouter.get('/:game/updated', dataValidation, getAllDraws)

dataRouter.get('/:game/draws', getAllDraws)

dataRouter.delete('/:game/delete/:choice', deleteDraw)

export default dataRouter