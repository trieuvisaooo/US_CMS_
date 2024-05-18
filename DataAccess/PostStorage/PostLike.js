const pg = require('pg')

require('dotenv').config();
const postTable = 'LIKES'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});

db.connect();
module.exports = {
    addLikePost: async(user,post)=>{
        const query = `INSERT INTO public."${postTable}" ("POSTID", "USERID") VALUES ($1,$2)`;
        const values = [post,user];
        db.query(query, values)
    }
    , 
    disLikePost: async(user,post)=>{
        const query = `DELETE FROM public."${postTable}" WHERE "POSTID"= '${post}' AND "USERID" ='${user}'`;
       
        db.query(query)
    },
    getUserPostLike: async (user,post)=>{
        console.log(user);
        const query = `SELECT* FROM public."${postTable}" WHERE "POSTID"= '${post}' AND "USERID" ='${user}'`;
       
        const data = await db.query(query);
        console.log(data);
        return data.rows[0];
    },
    deletePost: async(id)=>{
        const query = `DELETE FROM public."${postTable}" WHERE "POSTID"= '${id}' `;
       
        await db.query(query)
    },
    deleteUser: async(id)=>{
        const query = `DELETE FROM public."${postTable}" WHERE "USERID" ='${id}'`;
        await db.query(query)
    }
}