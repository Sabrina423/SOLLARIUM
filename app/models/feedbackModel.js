var pool = require("../../config/pool_conexoes");

const feedbackModel = {


    
}
const mysql = require('mysql');

    const feedbackSchema = new mysql.Schema({
        clienteName: { type: String, required: true },
        date: { type: Date, default: Date.now },
        quality: { type: Number, required: true },
        speed: { type: Number, required: true },
        results: { type: Number, required: true },
    });
    
    const Feedback = mysql.model('Feedback', feedbackSchema);
    module.exports = Feedback;

    

module.exports = feedbackModel

