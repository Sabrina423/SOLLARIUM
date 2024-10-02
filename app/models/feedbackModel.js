<<<<<<< HEAD
var pool = require("../../config/pool_conexoes");
const mongoose = require('mongoose');

    const feedbackSchema = new mongoose.Schema({
        clientName: { type: String, required: true },
        date: { type: Date, default: Date.now },
        quality: { type: Number, required: true },
        speed: { type: Number, required: true },
        results: { type: Number, required: true },
    });
    
    const Feedback = mongoose.model('Feedback', feedbackSchema);
    module.exports = Feedback;

    
    

module.exports = feedbackModel
=======
>>>>>>> 7aaac52 (atualiza)
