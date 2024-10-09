const pool = require('../../config/pool_conexoes'); // Certifique-se de que o caminho está correto

const profissionaisModel = {
    // Buscar profissional por ID
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE ID_PROF = ?', [id]);
            return linhas.length > 0 ? linhas[0] : null; // Retorna o profissional ou null se não encontrado
        } catch (error) {
            console.error('Erro ao buscar profissional por ID:', error);
            throw error;
        }
 }}

 findByEmail: async (id) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE EMAIL_PROFISSIONAL = ?', [id]);
        return linhas;
    } catch (error) {
        console.error('Erro ao buscar profisional por ID:', error);
        throw error;
    }
},

    // Criar um novo profissional
    create:async (profissional) => {
    create: async (profissional) => {
        try {
            const result = await pool.query(
                'INSERT INTO PROFISSIONAL (NOME_PROF, CONTATO_PROF, EMAIL_PROF, CPF_PROF, CEP_PROF, AREA_PROF, EXPERIENCIA_PROF, SENHA_PROF, IMAGEM_PROF) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)',
                [profissional.nome_prof, profissional.contato_prof, profissional.email_prof, profissional.cpf_prof, profissional.cep_prof, profissional.area_prof, profissional.senha_prof, imagem_prof]
            );
            return result[0]; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar profissional:', error);
            throw error;
        }
    },

    // Atualizar um profissional existente
    update: async (id, prof) => {
        try {
            const { nome_prof, contato_prof, email_prof, cep_prof, cpf_prof, data_prof, senha_prof, area_prof, experiencia_prof, endereco_prof, contato_prof, estado_prof, documento_prof } = prof;
            const result = await pool.query(
                'UPDATE PROFISSIONAL SET CPF_PROF = ?, ENDERECO_PROF = ?, NOME_PROF = ? contato_prof_PROF = ?, EMAIL_PROF = ?, SENHA_PROF = ?, AEREA_PROF =?, EXPERIENCIA_PROF=?, ESTADO_PROF = ?, DOCUMENTO_PROF = ?, DATA_NASC = ?, CEP_PROF = ? IMAGEM_PROF WHERE ID_PROF = ?',
                [cpf_prof, endereco_prof, nome_prof, contato_prof_prof, email_prof, senha_prof, estado_prof, documento_prof, data_prof, area_prof, experiencia_prof, cep_prof, id]
            );
            return result[0]; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar profissional:', error);
            throw error;
        }
    },

    // Deletar um profissional pelo ID
    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM PROFISSIONAL WHERE ID_PROF = ?', [id]);
            return result[0]; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar profissional:', error);
            throw error;
        }
    }
};

module.exports = profissionaisModel;

