import { Router } from "express";
import { getAllDraws, deleteDraw, deleteDrawByID } from "../controllers/dataController.js";
import { dataValidation } from "../middlewares/dataValidation.js";

const dataRouter = Router()

dataRouter.get('/:game/updated', dataValidation, getAllDraws)

dataRouter.get('/:game/draws', getAllDraws)

dataRouter.delete('/:game/delete/:choice', deleteDraw)

dataRouter.delete('/:game/deletebyid/:id', deleteDrawByID)

export default dataRouter