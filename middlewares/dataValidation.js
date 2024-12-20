import Euromillions from "../models/Euromillions.js";
import Loto from "../models/Loto.js";
import { fetchData } from "../utils/fetchData.js";

export const dataValidation = async (req, res, next) => {
    const {game} = req.params;
    if(game) {
        try {
            const lastDraw = game === 'euromillions' ?
                    await Euromillions.findOne().sort({ date: -1 }) :
                game === 'loto' ?
                    await Loto.findOne().sort({ date: -1 }) :
                null
            const newDatas = await fetchData(game, lastDraw)

            console.log(`${newDatas.length || 0} nouvelles données à intégrer à la table ${game}`)

            if(!newDatas) {
                next()
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

            console.log(`Nouvelle(s) donnée(s) intégrée(s)`)
            
            next()
        }
        catch(err) {
            console.log(err)
        }
    }
}