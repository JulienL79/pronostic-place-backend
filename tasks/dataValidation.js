import Euromillions from "../models/Euromillions.js";
import Loto from "../models/Loto.js";
import { fetchData } from "./fetchData.js";

export const dataValidation = async (game) => {
    if(game) {
        try {
            const lastDraw = game === 'euromillions' ?
                    await Euromillions.findOne().sort({ date: -1 }) :
                game === 'loto' ?
                    await Loto.findOne().sort({ date: -1 }) :
                null
            
            const newDatas = await fetchData(game, lastDraw)

            console.log(`${newDatas.length > 0 || 'Aucune'} nouvelle(s) donnée(s) à intégrer à la table ${game}`)

            if(newDatas.length < 1) {
                return false
            }

            newDatas.map(async (data) => {
                const newData = 
                            game === 'euromillions' ?
                                await new Euromillions(data) :
                            game === 'loto' ?
                                await new Loto(data) :
                            null
                newData && newData.save()
            })

            console.log(`Nouvelle(s) donnée(s) intégrée(s) à la table ${game}`)
            
            return true
        }
        catch(err) {
            console.log(err)
        }
    }

    console.log(`Aucun jeu selectionné pour la mise à jour des données`)
    return false
}