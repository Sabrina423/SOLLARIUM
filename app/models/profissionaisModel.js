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
    },

    // Buscar profissional por email
    findByEmail: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAL WHERE EMAIL_PROF = ?', [email]);
<<<<<<< HEAD
            return linhas.length > 0 ? linhas[0] : null;
=======
            return linhas.length > 0 ? linhas[0] : null; // Retorna o profissional ou null se não encontrado
>>>>>>> 5f55786 (as)
        } catch (error) {
            console.error('Erro ao buscar profissional por email:', error);
            throw error;
        }
    },

    // Criar um novo profissional
    create: async (profissional) => {
        try {
            const result = await pool.query(
<<<<<<< HEAD
                'INSERT INTO PROFISSIONAL (NOME_PROF, CONTATO_PROF, EMAIL_PROF, CPF_PROF, CEP_PROF, AREA_PROF, EXPERIENCIA_PROF, SENHA_PROF, IMAGEM_PROF) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [profissional.nome_prof, profissional.contato_prof, profissional.email_prof, profissional.cpf_prof, profissional.cep_prof, profissional.area_prof, profissional.experiencia_prof, profissional.senha_prof, profissional.imagem_prof]
=======
                'INSERT INTO PROFISSIONAL (NOME_PROF, CONTATO_PROF, EMAIL_PROF, CPF_PROF, CEP_PROF, AREA_PROF, SENHA_PROF) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [profissional.nome_prof, profissional.contato_prof, profissional.email_prof, profissional.cpf_prof, profissional.cep_prof, profissional.area_prof, profissional.senha_prof]
>>>>>>> 5f55786 (as)
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
<<<<<<< HEAD
            const { nome_prof, contato_prof, email_prof, cep_prof, cpf_prof, data_prof, senha_prof, area_prof, experiencia_prof, endereco_prof, estado_prof, documento_prof, imagem_prof } = prof;
            const result = await pool.query(
                'UPDATE PROFISSIONAL SET CPF_PROF = ?, ENDERECO_PROF = ?, NOME_PROF = ?, CONTATO_PROF = ?, EMAIL_PROF = ?, SENHA_PROF = ?, AREA_PROF = ?, EXPERIENCIA_PROF = ?, ESTADO_PROF = ?, DOCUMENTO_PROF = ?, DATA_NASC = ?, CEP_PROF = ?, IMAGEM_PROF = ? WHERE ID_PROF = ?',
                [cpf_prof, endereco_prof, nome_prof, contato_prof, email_prof, senha_prof, area_prof, experiencia_prof, estado_prof, documento_prof, data_prof, cep_prof, imagem_prof, id]
            );
=======
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
                'UPDATE PROFISSIONAL SET CPF_PROF = ?, NOME_PROF = ?, CONTATO_PROF = ?, EMAIL_PROF = ?, SENHA_PROF = ?, ESTADO_PROF = ?, DOCUMENTO_PROF = ?, DATA_NASC = ?, CEP_PROF = ? WHERE ID_PROF = ?',
                [cpf_prof, nome_prof, contato_prof, email_prof, senha_prof, estado_prof, documento_prof, data_prof, cep_prof, id]
            );

>>>>>>> 5f55786 (as)
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

<<<<<<< HEAD
module.exports = profissionaisModel;
=======
module.exports = profissionaisModel;
>>>>>>> 5f55786 (as)
