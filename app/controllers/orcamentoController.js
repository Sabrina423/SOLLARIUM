const pool = require('../pool_conexoes');

const validarOrcamento = (dados) => {
    const {  servico, detalhe, valor, data } = dados;
    let errors = [];

    if (!servico) {
        errors.push({ field: 'servico', message: 'Serviço é obrigatório.' });
    }

    if (!detalhe) {
        errors.push({ field: 'detalhe', message: 'Detalhe do serviço é obrigatório.' });
    }

    if (!valor) {
        errors.push({ field: 'valor', message: 'Valor esperado é obrigatório.' });
    }

    if (!data) {
        errors.push({ field: 'data', message: 'Valor esperado é obrigatório.' });
    }


    return errors;
}

const criarOrcamento = async (req, res) => {
    const { servico, detalhe, valor, data } = req.body;

    const errors = validarOrcamento(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const [rows] = await pool.query(
            'INSERT INTO orcamento (servico, detalhe, valor, data) VALUES (?, ?, ?, ?, ?)',
            [estado, cidade, servico, detalhe, valor, data]
        );
        res.status(200).json({ mensagem: 'Orçamento enviado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ field: 'general', message: 'Erro ao salvar os dados no banco de dados.' }] });
    }
}

module.exports = { criarOrcamento };
