const pg = require('pg')
require('dotenv').config();
const table = 'ACTIVITIES'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});
db.connect();
module.exports = {
    getActivites: async() =>{
        const query = `SELECT * FROM public."${table}"`;
        //     // console.log(query);
            const data = await db.query(query);
            return data.rows;
    },
    getAnotherActivites: async(id) =>{
        const query = `SELECT * FROM public."${table}" WHERE "ID" !='${id}'`;
        //     // console.log(query);
            const data = await db.query(query);
            return data.rows;
    },
    getActivityByID: async (id)=>{
        const query = `SELECT * FROM public."${table}" WHERE "ID" = '${id}'`;
        //     // console.log(query);
            const data = await db.query(query);
            return data.rows[0];
    }
    // getTaskByUser: async(id)=>{
        
    //     const query = `SELECT * FROM public."${taskTable}" WHERE "NGUOITHUCHIEN" = '${id}'`;
    //     // console.log(query);
    //     const data = await db.query(query);
    //     return data.rows;
    // },
    // addNewTask: async(title,mem_assignned,start_date,due_date,content,cmt,status) =>{
    //     const query = `INSERT INTO public."${taskTable}"(
    //          "NGUOITHUCHIEN", "TIEUDE", "NOIDUNG","NGAYBD", "NGAYTOIHAN", "GHICHU", "TRANGTHAI")
    //         VALUES ('${mem_assignned}', '${title}', '${content}','${start_date}' ,'${due_date}', '${cmt}', '${status}');`;
    //     const check =  await db.query(query);
    // },
    
    // getTaskByID: async(id)=>{
    //     const query =  `SELECT * FROM public."${taskTable}" WHERE "ID" = '${id}'`;
    //     const data = await db.query(query);
    //     return data.rows[0];
    // },
    // changeTaskInformation: async(id ,title, mem_assigned_id, start_date,due_date, content, cmt, status_num)=>{
    //     const query = `UPDATE public."${taskTable}"
    //     SET  "NGUOITHUCHIEN"='${mem_assigned_id}', "TIEUDE"='${title}', "NOIDUNG"='${content}', "NGAYBD"='${start_date}',"NGAYTOIHAN"='${due_date}', "GHICHU"='${cmt}', "TRANGTHAI"='${status_num}'
    //     WHERE "ID"='${id}';`;
    //     await db.query(query);
    // },
    // deleteTaskByID: async(id) =>{
    //     const query = `DELETE FROM public."${taskTable}"
    //     WHERE "ID"='${id}';`;
    //     await db.query(query)
        
    // }
        
}