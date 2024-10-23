const pool = require('../../config/pool_conexoes'); // Caminho relativo correto

const admModel = {
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ADM WHERE ID_ADM = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar adm por ID:', error);
            throw error;
        }
    },

    findByEmail: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ADM WHERE EMAIL_ADM = ?', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar adm por ID:', error);
            throw error;
        }
    },

    create: async (adm) => {
        try {
            const { cpf_adm, cep_adm, nome_adm, contato_adm, email_adm, senha_adm } = adm;
            const result = await pool.query(
                'INSERT INTO ADM (CPF_ADM, CEP_ADM, NOME_ADM, CONTATO_ADM, EMAIL_ADM, SENHA_ADM) VALUES (?, ?, ?, ?, ?,?)',
                [cpf_adm, cep_adm, nome_adm, contato_adm, email_adm, senha_adm]
            );
            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar adm:', error);
            throw error;
        }
    },

    update: async (id, adm) => {
        try {
            const { cpf_adm, cep_adm, nome_adm, contato_adm, email_adm, senha_adm } = adm;
            const result = await pool.query(
                'UPDATE ADM SET CPF_ADM = ?, CEP_ADM = ?, NOME_ADM = ?, CONTATO_ADM = ?, EMAIL_ADM = ?, SENHA_ADM = ? WHERE ID_ADM = ?',
                [cpf_adm, cep_adm, nome_adm, contato_adm, email_adm,senha_adm, id]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar adm:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM ADM WHERE ID_ADM = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar adm:', error);
            throw error;
        }
    }
};

module.exports = admModel;
