import mongoose, {Schema} from "mongoose";

const lotoSchema = Schema({
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

export default mongoose.model('Loto', lotoSchema)