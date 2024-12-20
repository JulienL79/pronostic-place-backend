import mongoose, {Schema} from "mongoose";

const euromillionsSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    numbers: {
        type: Array,
        required: true
    },
    bonus: {
        type: Array,
        required: true
    }
})

export default mongoose.model('Euromillions', euromillionsSchema)