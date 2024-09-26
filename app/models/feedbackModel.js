var pool = require("../../config/pool_conexoes");

const feedback = {
    findAll: async() =>{
        try{
        const[resultados] = await pool.query('SELECT * FROM tarefas WHERE status_tarefa = 1') 
        return resultados;
        } catch(error){
            return error;
        }
        
    },

    create: async(dadosForm)=> {
        try{
            const [resultados] = await pool.query('INSERT INTO tarefas SET ?',[dadosForm0]) 
            return resultados;
            } catch(error){
                console.log(error);
                return null;
            }
    }
};

module.exports = feedbackModel