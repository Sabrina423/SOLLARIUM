const moment = require("moment");

gravarPedido: async (req, res) => {
    try {
        const carrinho = req.session.carrinho;
        const camposJsonPedido = {
            data_pedido: moment().format("YYYY-MM-DD HH:mm:ss"),
            cliente_id_cliente: req.session.autenticado.id,  // Cliente atual
            valor_total_pedido: req.query.total,  // Valor total do pedido
        };
        
        // Cria o pedido na tabela PEDIDOS
        const create = await pedidoModel.createPedido(camposJsonPedido);

        // Itera sobre o carrinho e cria os itens do pedido
        carrinho.forEach(async (element) => {
            // Relaciona o item do pedido com o pedido criado
            const camposJsonItemPedido = {
                pedidos_id_pedidos: create.insertId,  // ID do pedido criado
                servicos_prof_id_servico: element.codproduto,  // ID do serviço
                profissionais_id_prof: element.profissionalId,  // ID do profissional
                quantidade: element.qtde,  // Quantidade do serviço
            };

            // Cria o item no pedido na tabela ITEM_PEDIDO
            await pedidoModel.createItemPedido(camposJsonItemPedido);
        });

        // Se houver pagamento, registra na tabela PAGAMENTOS
        if (req.query.payment_id) {
            const camposJsonPagamento = {
                id_cliente: req.session.autenticado.id,
                id_prof: req.query.prof_id,  // ID do profissional relacionado ao pagamento
                valor_pagamento: req.query.total,  // Valor do pagamento
                data_pagamento: moment().format("YYYY-MM-DD"),  // Data do pagamento
                descricao_pagamento: req.query.status,  // Status do pagamento
                pedidos_id_pedidos: create.insertId,  // Relaciona o pagamento ao pedido
            };

            // Cria o pagamento na tabela PAGAMENTOS
            await pedidoModel.createPagamento(camposJsonPagamento);
        }

        // Limpa o carrinho após finalizar o pedido
        req.session.carrinho = [];
        
        // Redireciona o usuário para a página inicial ou outro local
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.status(500).send('Erro ao gravar pedido');
    }
}
