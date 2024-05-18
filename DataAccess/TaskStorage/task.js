const pg = require('pg')
require('dotenv').config();
const taskTable = 'TASK'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getTaskByUser: async(id)=>{
        
        const query = `SELECT * FROM public."${taskTable}" WHERE "NGUOITHUCHIEN" = '${id}'`;
        // console.log(query);
        const data = await db.query(query);
        return data.rows;
    },
    addNewTask: async(title,mem_assignned,start_date,due_date,content,cmt,status) =>{
        const query = `INSERT INTO public."${taskTable}"(
             "NGUOITHUCHIEN", "TIEUDE", "NOIDUNG","NGAYBD", "NGAYTOIHAN", "GHICHU", "TRANGTHAI")
            VALUES ('${mem_assignned}', '${title}', '${content}','${start_date}' ,'${due_date}', '${cmt}', '${status}');`;
        const check =  await db.query(query);
    },
    
    getTaskByID: async(id)=>{
        const query =  `SELECT * FROM public."${taskTable}" WHERE "ID" = '${id}'`;
        const data = await db.query(query);
        return data.rows[0];
    },
    changeTaskInformation: async(id ,title, mem_assigned_id, start_date,due_date, content, cmt, status_num)=>{
        const query = `UPDATE public."${taskTable}"
        SET  "NGUOITHUCHIEN"='${mem_assigned_id}', "TIEUDE"='${title}', "NOIDUNG"='${content}', "NGAYBD"='${start_date}',"NGAYTOIHAN"='${due_date}', "GHICHU"='${cmt}', "TRANGTHAI"='${status_num}'
        WHERE "ID"='${id}';`;
        await db.query(query);
    },
    deleteTaskByID: async(id) =>{
        const query = `DELETE FROM public."${taskTable}"
        WHERE "ID"='${id}';`;
        await db.query(query)
        
    }
    ,
    getTaskFromYear: async(year)=>{
        const query =  `SELECT * FROM public."${taskTable}" WHERE EXTRACT(YEAR FROM "NGAYBD") = '${year}';`;
        const data = await db.query(query);
        return data.rows;
    },
    getSearchTask :async (search)=>{
        const query =  `SELECT * FROM public."${taskTable}" WHERE "NGUOITHUCHIEN" LIKE'%${search}%' OR "TIEUDE" LIKE'%${search}%' OR "NOIDUNG" LIKE'%${search}%' OR "GHICHU" LIKE'%${search}%';`;
        const data = await db.query(query);
        return data.rows;
    },
    deleteTaskByUser: async(user)=>{
        const query = `DELETE FROM public."${taskTable}"
        WHERE "NGUOITHUCHIEN"='${user}';`;
        await db.query(query)
    }
}