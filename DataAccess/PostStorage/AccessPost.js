const pg = require('pg')

require('dotenv').config();
const postTable = 'POST'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});

db.connect();

// Status: 0 (chua duyet), 1 (duyet), 2 (tu choi)
module.exports = {
    getThreeHighestLovePost: async() =>{
        const query = `SELECT * FROM public."${postTable}" WHERE "TRANGTHAI" = 1 ORDER BY "LUOTLIKE" DESC LIMIT 3`;
        const data = await db.query(query);
        return data.rows;
    },
    checkPostExisted : async (id) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "ID" = $1`
        const values = [id]

        const result = await db.query(query, values);
        // Check if any rows were returned
        return result.rows.length > 0;
    },

    createPost : async (id, author, title, date, content) => {
        const query = `INSERT INTO public."${postTable}" ("ID", "NGUOIDANG", "TIEUDE", "NGAYDANG", "NOIDUNG","LUOTLIKE","LUOTBINHLUAN", "TRANGTHAI") VALUES ($1,$2,$3,$4,$5,$6)`;
        // trang thai bai dang = 0 (chua duyet)
        const values = [id, author, title, date, content,0,0,0];
        db.query(query, values)
    },

    editPost : async (id, author, title, date, content) => {
        const query = `UPDATE public."${postTable}"" SET "NGUOIDANG" = $2, "TIEUDE" = $3, "NGAYDANG" = $4, "NOIDUNG" = $5, "TRANGTHAI" = $6 WHERE "ID" = $1`
        const values = [id, author, title, date, content, 0];
        db.query(query, values)
    },

    getPostbyID : async (id) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "ID" = '${id}'`;
        const data = await db.query(query);
        return data.rows[0];
    },

    getPostPending : async () => {
        const query = `SELECT * FROM public."${postTable}" WHERE "TRANGTHAI" = 0`;
        const data = await db.query(query);
        return data.rows;
    },

    getPostApproved : async () => {
        const query = `SELECT * FROM public."${postTable}" WHERE "TRANGTHAI" = 1`;
        const data = await db.query(query);
        return data.rows;
    },

    getPostDenied : async () => {
        const query = `SELECT * FROM public."${postTable}" WHERE "TRANGTHAI" = 2`;
        const data = await db.query(query);
        return data.rows;
    },

    approvePost : async (id) => {
        const query = `UPDATE public."${postTable}" SET "TRANGTHAI" = 1 WHERE "ID" = $1`
        const values = [id];
        db.query(query, values)
    },

    denyPost : async (id) => {
        const query = `UPDATE public."${postTable}" SET "TRANGTHAI" = 2 WHERE "ID" = $1`
        const values = [id];
        db.query(query, values)
    },

    getPostbyAuthor : async (author) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "NGUOIDANG" = '${author}'`;
        const data = await db.query(query);
        return data.rows;
    },

    getPendingPostbyAuthor : async (author) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "NGUOIDANG" = '${author}' AND "TRANGTHAI" = 0`;
        const data = await db.query(query);
        return data.rows;
    },

    getApprovedPostbyAuthor : async (author) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "NGUOIDANG" = '${author}' AND "TRANGTHAI" = 1`;
        const data = await db.query(query);
        return data.rows;
    },

    getDeniedPostbyAuthor : async (author) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "NGUOIDANG" = '${author}' AND "TRANGTHAI" = 2`;
        const data = await db.query(query);
        return data.rows;
    },

    deletePost : async (id) => {
        const query = `DELETE FROM public."${postTable}" WHERE "ID" = $1`
        const values = [id];
        db.query(query, values)
    },
    
    findPost : async (keyword) => {
        const query = `SELECT * FROM public."${postTable}" WHERE "TIEUDE" LIKE '%${keyword}%' OR "NOIDUNG" LIKE '%${keyword}%' OR "NGUOIDANG" LIKE '%${keyword}%' AND "TRANGTHAI" = 1`;
        const data = await db.query(query);
        return data.rows;
    },

    addPost : async (newPost) => {
        const query = `INSERT INTO public."${postTable}" ("TIEUDE", "NOIDUNG", "NGAYDANG", "TRANGTHAI", "ANHDINHKEM", "NGUOIDANG","LUOTLIKE", "LUOTBINHLUAN") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
        const values = [newPost.TIEUDE, newPost.NOIDUNG, newPost.NGAYDANG, newPost.TRANGTHAI, newPost.ANHDINHKEM, newPost.NGUOITAO,0,0];
        db.query(query, values)
    },

    updatePost : async (id, newPost) => {
        const query = `UPDATE public."${postTable}" SET "TIEUDE" = $2, "NOIDUNG" = $3, "NGAYDANG" = $4, "TRANGTHAI" = $5, "ANHDINHKEM" = $6 WHERE "ID" = $1`
        const values = [id, newPost.TIEUDE, newPost.NOIDUNG, newPost.NGAYDANG, newPost.TRANGTHAI, newPost.ANHDINHKEM];
        db.query(query, values)
    },
    changePostLike: async(postID,like)=>
    {
        const query = `UPDATE public."${postTable}" SET "LUOTLIKE" = $1 WHERE "ID" = $2`
        const values = [like,postID];
        db.query(query, values)
    },
    closeConnection: () => {
        db.end();
    },
    getPostFromYear: async(year) =>{
        const query = `SELECT * FROM public."${postTable}" WHERE EXTRACT(YEAR FROM "NGAYDANG") = '${year}';`;
        const data = await db.query(query);
        return data.rows;
    },
    deletePostByUser: async(user) =>
    {
        const query = `DELETE FROM public."${postTable}" WHERE "NGUOIDANG" = $1`;
        const values = [user];
       await  db.query(query, values)
    }
}