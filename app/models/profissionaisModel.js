const pool = require('../../config/pool_conexoes'); // Caminho relativo correto

const profissionaisModel = {
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE ID_PROF = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar profissional por ID:', error);
            throw error;
        }
    },

    create: async (profissional) => {
        try {
            const { cpf_prof, endereco_prof, nome_prof, contato_prof, email_prof, senha_prof, estado_prof,cep_prof, documento_prof, data_nasc} = profissional;
            const result = await pool.query(
                'INSERT INTO CLIENTE (CPF_PROF, ENDERECO_PROF, NOME_PROF, CONTATO_PROF, EMAIL_PROF, SENHA_PROF, ESTADO_PROF, DOCUMENTO_PROF, DATA_NASC) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?)',
                [cpf_prof, endereco_prof, nome_prof, contato_prof, email_prof, senha_prof, estado_prof, cep_prof, documento_prof, data_nasc]
            );
            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    },

    update: async (id, prof) => {
        try {
            const { cpf_prof, endereco_prof, nome_prof, contato_prof, email_prof, senha_prof, estado_prof, cep_prof, data_nasc, documento_prof } = prof;
            const result = await pool.query(
                'UPDATE PROFISSIONAL SET CPF_PROF = ?, ENDERECO_PROF = ?, NOME_PROF = ?, CONTATO_PROF = ?, EMAIL_PROF = ?, SENHA_PROF, ESTADO_PROF, DOCUMENTO_PROF, DATA_NASC, CEP_PROF = ? WHERE PROF = ?',
                [cpf_prof, endereco_prof, nome_prof, contato_prof, email_prof, senha_prof, estado_prof, cep_prof, documento_prof, data_nasc, id]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM PROFISSIONAL WHERE ID_PROF = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar profissional:', error);
            throw error;
        }
    }
};

module.exports = profissionaisModel;
