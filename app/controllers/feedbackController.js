const Feedback = require('../models/feedbackModel');

// Função para renderizar a página de feedback
exports.renderFeedbackPage = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.render('feedback', { feedbacks });
    } catch (error) {
        res.status(500).send('Erro ao obter feedbacks');
    }
};

// Função para criar um novo feedback
exports.createFeedback = async (req, res) => {
    const { clientName, quality, speed, results } = req.body;

    const newFeedback = new Feedback({
        clientName,
        quality,
        speed,
        results,
    });

    try {
        await newFeedback.save();
        res.redirect('/feedback');
    } catch (error) {
        res.status(400).send('Erro ao salvar feedback');
    }
};
