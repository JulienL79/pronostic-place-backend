import Loto from "../models/Loto.js";
import Euromillions from "../models/Euromillions.js";

export const getAllDraws = async (req, res) => {
    const {game} = req.params
    try {
        const draws = 
            game === 'euromillions' ?
                await Euromillions.find().sort({ date: -1 }) :
            game === 'loto' ?
                await Loto.find().sort({ date: -1 }) :
            null
        if(!draws || draws.length < 1) {
            return res.status(404).json({message: 'Draws not found'})
        }
        return res.json(draws)
    }
    catch(err) {
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const deleteDraw = async (req, res) => {
    const {game, choice} = req.params
    const dateFiltered = 
        choice === '1' && game === 'euromillions' ?
            new Date(2011, 4, 7) :
        choice === '2' && game === 'euromillions' ?
            new Date(2014, 1, 1) :
        choice === '3' && game === 'euromillions' ?
            new Date(2016, 8, 24) :
        choice === '4' && game === 'euromillions' ?
            new Date(2019, 1, 27) :
        choice === '5' && game === 'euromillions' ?
            new Date(2020, 1, 1) :
        choice === '6' && game === 'euromillions' ?
            new Date() :
        choice === '1' && game === 'loto' ?
            new Date(2017, 2, 5) :
        choice === '2' && game === 'loto' ?
            new Date(2019, 1, 26) :
        choice === '3' && game === 'loto' ?
            new Date(2019, 10, 3) :
        choice === '4' && game === 'loto' ?
            new Date() :
        null

    if(!dateFiltered) {
        return res.status(404).json({message: 'Filter not found'})
    }

    try {
        const deletedDraws = 
            game === 'euromillions' ?
                await Euromillions.deleteMany({ date: { $lt: dateFiltered } }) :
            game === 'loto' ?
                await Loto.deleteMany({ date: { $lt: dateFiltered } }) :
            null
        if(!deletedDraws) {
            return res.status(404).json({message: 'Draws not found'})
        }
        return res.status(203).json({message: `Draws have been deleted before ${dateFiltered}`})
    }
    catch(err) {
        return res.status(500).json({message: 'Internal server error'})
    }
}