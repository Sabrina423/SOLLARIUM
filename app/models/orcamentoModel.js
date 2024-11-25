const pool = require('../../config/pool_conexoes'); 


const orcamentoModel = {

    // Método para buscar um orçamento por ID
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return linhas[0]; // Retorna o primeiro resultado
        } catch (error) {
            console.error('Erro ao buscar orçamento por ID:', error);
            throw error;
        }
    },

    // Método para buscar todos os orçamentos
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ORCAMENTO o INNER JOIN CLIENTE c ON o.ID_CLIENTE = c.ID_CLIENTE');
            return linhas; // Retorna todos os orçamentos com os dados dos clientes
        } catch (error) {
            console.error('Erro ao buscar todos os orçamentos:', error);
            throw error;
        }
    },

    // Método para buscar todos os orçamentos de um cliente específico, incluindo o nome do profissional
    findAllById: async (idCliente) => {
        try {
            const [linhas] = await pool.query(`
                SELECT 
                    o.*, 
                    p.NOME_PROF 
                FROM 
                    ORCAMENTO o 
                LEFT JOIN 
                    PROFISSIONAIS p 
                ON 
                    o.PROFISSIONAIS_ID_PROF = p.ID_PROF 
                WHERE 
                    o.ID_CLIENTE = ?
            `, [idCliente]);
            return linhas; // Retorna todos os orçamentos do cliente, incluindo o nome do profissional
        } catch (error) {
            console.error('Erro ao buscar orçamentos por ID do cliente:', error);
            throw error;
        }
    },

    // Método para criar um novo orçamento
    create: async (orcamento) => {
        try {
            const { data_orcamento, valor_orcamento, id_cliente, servicos_prof_id_servico } = orcamento;
            const status = 1; // Status inicial do orçamento

            const result = await pool.query(
                'INSERT INTO ORCAMENTO (VALOR_ORCAMENTO, STATUS_ORCAMENTO, DATA_ORCAMENTO, ID_CLIENTE, SERVICOS_PROF_ID_SERVICO) VALUES (?, ?, ?, ?, ?)',
                [valor_orcamento, status === 1 ? "Pendente" : "Atualizado", data_orcamento, id_cliente, servicos_prof_id_servico]
            );

            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar orçamento:', error);
            throw error;
        }
    },

    // Método para atualizar um orçamento
    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE ORCAMENTO SET ? WHERE ID_ORCAMENTO = ?', [dadosForm, id]);
            return linhas; // Retorna a quantidade de linhas afetadas
        } catch (error) {
            console.error('Erro ao atualizar orçamento:', error);
            throw error;
        }
    },

    // Método para excluir um orçamento
    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar orçamento:', error);
            throw error;
        }
    }
};

module.exports = orcamentoModel; // Exporta o modelo para ser utilizado em outros arquivos
