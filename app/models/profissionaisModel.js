const pool = require('../../config/pool_conexoes'); // Certifique-se de que o caminho está correto

const profissionaisModel = {
    // Buscar profissionais por ID
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE ID_PROF = ?', [id]);
            return linhas.length > 0 ? linhas[0] : null; // Retorna o profissionais ou null se não encontrado
        } catch (error) {
            console.error('Erro ao buscar profissionais por ID:', error);
            throw error;
        }
    },

    // Buscar profissionais por email
    findByEmail: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE EMAIL_PROF = ?', [email]);
            return linhas.length > 0 ? linhas[0] : null; // Retorna o profissionais ou null se não encontrado
        } catch (error) {
            console.error('Erro ao buscar profissionais por email:', error);
            throw error;
        }
    },

    // Criar um novo profissionais
    create: async (profissionais) => {
        try {
            const result = await pool.query(
                'INSERT INTO PROFISSIONAIS (NOME_PROF, CONTATO_PROF, EMAIL_PROF, CPF_PROF, CEP_PROF, AREA_PROF, SENHA_PROF, IMAGEM_PROF) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    profissionais.nome_prof,
                    profissionais.contato_prof,
                    profissionais.email_prof,
                    profissionais.cpf_prof,
                    profissionais.cep_prof,
                    profissionais.area_prof,
                    profissionais.senha_prof,
                    profissionais.imagem_prof
                ]
            );
            return result[0]; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar profissionais:', error);
            throw error;
        }
    },

    // Atualizar um profissionais existente
    update: async (id, prof) => {
        try {
            const { 
                nome_prof, 
                contato_prof, 
                email_prof, 
                cep_prof, 
                cpf_prof, 
                data_prof, 
                senha_prof, 
                estado_prof, 
                documento_prof 
            } = prof;

            const result = await pool.query(
                'UPDATE PROFISSIONAIS SET CPF_PROF = ?, NOME_PROF = ?, CONTATO_PROF = ?, EMAIL_PROF = ?, SENHA_PROF = ?, ESTADO_PROF = ?, DOCUMENTO_PROF = ?, DATA_NASC = ?, CEP_PROF = ? WHERE ID_PROF = ?'
                [
                    cpf_prof,
                    nome_prof,
                    contato_prof,
                    email_prof,
                    senha_prof,
                    estado_prof,
                    documento_prof,
                    data_prof,
                    cep_prof,
                    id
                ]
            );
            return result[0]; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar profissionais:', error);
            throw error;
        }
    },

    // Deletar um profissionais pelo ID
    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM PROFISSIONAIS WHERE ID_PROF = ?', [id]);
            return result[0]; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar profissionais:', error);
            throw error;
        }
    }
};

module.exports = profissionaisModel;

