const pool = require('../../config/pool_conexoes'); // Caminho relativo correto

const ClienteModel = {
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar cliente por ID:', error);
            throw error;
        }
    },

    findByEmail: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE WHERE EMAIL_CLIENTE = ?', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar cliente por ID:', error);
            throw error;
        }
    },

    findByEmailTot: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT *, count(*) as tot FROM CLIENTE WHERE EMAIL_CLIENTE = ?', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar cliente por ID:', error);
            throw error;
        }
    },


    findCampoCustom: async (criterioWhere) => {
        try {
            const [resultados] = await pool.query(
                "SELECT count(*) totalReg FROM CLIENTE WHERE ?",
                [criterioWhere]
            )
            return resultados[0].totalReg;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findUserCustom: async (criterioWhere) => {
        try {
            const [resultados] = await pool.query(
                "SELECT *  FROM CLIENTE WHERE ?",
                [criterioWhere]
            )
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    create: async (cliente) => {
        try {
            const { cpf_cliente, cep_cliente, nome_cliente, contato_cliente, email_cliente, senha_cliente, imagem_perfil_cliente } = cliente;
            const result = await pool.query(
                'INSERT INTO CLIENTE (CPF_CLIENTE, CEP_CLIENTE, NOME_CLIENTE, CONTATO_CLIENTE, EMAIL_CLIENTE, SENHA_CLIENTE, IMAGEM_PERFIL_CLIENTE) VALUES ( ?, ?, ?, ?,?,?,?)',
                [cpf_cliente, cep_cliente, nome_cliente, contato_cliente, email_cliente, senha_cliente, imagem_perfil_cliente]
            );
            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    update: async (id, cliente) => {
        try {
            const { cep_cliente, nome_cliente, contato_cliente, email_cliente, imagem_perfil_cliente,complemento_cliente, numero_casa_cliente} = cliente;
            const result = await pool.query(
                'UPDATE CLIENTE SET  CEP_CLIENTE = ?, NOME_CLIENTE = ?, CONTATO_CLIENTE = ?, EMAIL_CLIENTE = ?, IMAGEM_PERFIL_CLIENTE= ?, COMPLEMENTO_CLIENTE=?, NUMERO_CASA_CLIENTE=?  WHERE ID_CLIENTE = ?',
                [ cep_cliente, nome_cliente, contato_cliente, email_cliente, imagem_perfil_cliente, complemento_cliente, numero_casa_cliente,  id]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }
};

module.exports = ClienteModel;
