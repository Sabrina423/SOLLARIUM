const pool = require('../../config/pool_conexoes'); // Certifique-se de que o caminho está correto

const profissionaisModel = {
    // Buscar profissionais por ID
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAIS WHERE ID_PROF = ?', [id]);
            return linhas // Retorna o profissionais ou null se não encontrado
        } catch (error) {
            console.error('Erro ao buscar profissionais por ID:', error);
            throw error;
        }
    },

    // Buscar profissionais por email
    findByEmail: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM PROFISSIONAIS WHERE EMAIL_PROF = ?', [email]);
            return linhas; // Retorna o profissionais ou null se não encontrado
        } catch (error) {
            console.error('Erro ao buscar profissionais por email:', error);
            throw error;
        }
    },
    
    findfindByEmailTot: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT *, count(*) as tot FROM PROFISSIONAIS WHERE EMAIL_PROF = ?', [email]);
            return linhas; 
        } catch (error) {
            console.error('Erro ao buscar profissionais por email:', error);
            throw error;
        }
    },

    findUserCustom: async (criterioWhere) => {
        try {
            const [resultados] = await pool.query(
                "SELECT *  FROM PROFISSIONAIS WHERE ?",
                [criterioWhere]
            )
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
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
                    profissionais.imagem_prof,
                   
                ]
            );
            return result; // Retorna o resultado da inserção
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
                complemento_prof,
                numero_casa_prof
                
                
            } = prof;

            const result = await pool.query(
                'UPDATE PROFISSIONAIS SET CPF_PROF = ?, NOME_PROF = ?, CONTATO_PROF = ?, EMAIL_PROF = ?, COMPLEMENTO_PROF=?, NUMERO_CASA_PROF=?  , CEP_PROF = ? WHERE ID_PROF = ?'
                [
                    nome_prof,
                    contato_prof,
                    email_prof,
                    cep_prof,
                    complemento_prof,
                    numero_casa_prof,
                    id
                ]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar profissionais:', error);
            throw error;
        }
    },

    // Deletar um profissionais pelo ID
    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM PROFISSIONAIS WHERE ID_PROF = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar profissionais:', error);
            throw error;
        }
    }
};

module.exports = profissionaisModel;

