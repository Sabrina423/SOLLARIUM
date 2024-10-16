const moment = require("moment");

gravarPedido: async (req, res) => {
    try {
        const carrinho = req.session.carrinho || [];  // Garante que carrinho é um array
        const camposJsonPedido = {
            data_pedido: moment().format("YYYY-MM-DD HH:mm:ss"),
            cliente_id_cliente: req.session.autenticado.id,
            valor_total_pedido: req.query.total,
        };

        // Cria o pedido na tabela PEDIDOS
        const create = await pedidoModel.createPedido(camposJsonPedido);

        // Itera sobre o carrinho e cria os itens do pedido
        for (const element of carrinho) {
            const camposJsonItemPedido = {
                pedidos_id_pedidos: create.insertId,
                servicos_prof_id_servico: element.codproduto,
                profissionais_id_prof: element.profissionalId,
                quantidade: element.qtde,
            };
            await pedidoModel.createItemPedido(camposJsonItemPedido);
        }

        // Registra pagamento se houver
        if (req.query.payment_id) {
            const camposJsonPagamento = {
                id_cliente: req.session.autenticado.id,
                id_prof: req.query.prof_id,
                valor_pagamento: req.query.total,
                data_pagamento: moment().format("YYYY-MM-DD"),
                descricao_pagamento: req.query.status,
                pedidos_id_pedidos: create.insertId,
            };
            await pedidoModel.createPagamento(camposJsonPagamento);
        }

        // Limpa o carrinho após finalizar o pedido
        req.session.carrinho = [];
        
        // Redireciona o usuário para a página do pedido ou checkout, garantindo que o carrinho esteja disponível
        res.render("pages/cadastrocartao", { autenticado:req.session.autenticado, carrinho: req.session.carrinho});
    } catch (e) {
        console.log(e);
        res.status(500).send('Erro ao gravar pedido');
    }
}
