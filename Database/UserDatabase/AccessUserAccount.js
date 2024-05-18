const pg = require('pg')
const bcrypt = require('bcrypt');
require('dotenv').config();
const userTable = 'USER_CLB'
const db = new pg.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB,
});

const default_referral_code = 1;
db.connect();

function normalize_role(user_list) {
    for (let i = 0; i < user_list.length; i++) {
        switch (user_list[i].CHUCVU) {
            case 1:
                user_list[i].CHUCVU = 'Trưởng CLB'
                break
            case 2:
                user_list[i].CHUCVU = 'Phó CLB'
                break
            case 3:
                user_list[i].CHUCVU = 'Thành viên'
                break
        }
    }
}

module.exports = {

    checkQuery: async () => {

        const result = await db.query(`SELECT * FROM public."${userTable}"`)
        // console.log(result)
    },

    checkExisted: async (student_id) => {
        const query = `SELECT * FROM public."${userTable}" WHERE "MSSV" = $1`
        const values = [student_id]

        const result = await db.query(query, values);
        // Check if any rows were returned
        return result.rows.length > 0;
    },

    addUser: async (usr, psw) => {
        const hashedPassword = await bcrypt.hash(psw, 10);
        const today = new Date()
        const query = `INSERT INTO public."${userTable}" ("MSSV", "MATKHAU","CHUCVU", "NGAYVAOCLB", "TRANGTHAI") VALUES ($1,$2,$3,$4,$5)`;
        const values = [usr, hashedPassword,3, today, 1];
        db.query(query, values)
    },
    closeConnection: () => {
        db.end();
    },
    getUserByID: async (id)=>{
        // const query = `SELECT * FROM public."${userTable}" WHERE "MSSV" = '${id}'`;
        // const data = await db.query(query);
        // normalize_role(data.rows)
        // return data.rows[0];

        const query = `SELECT * FROM public."${userTable}" WHERE "MSSV" = '${id}'`;
        const data = await db.query(query);
        return data.rows[0];
    },
    // Lay user list theo `BAN`
    getUserByGroup: async (type) => {
        const query = `SELECT * FROM public."${userTable}" WHERE "BAN" = '${type}'`
        const data = await db.query(query)

        for (let i = 0; i < data.rows.length; i++) {
            switch (data.rows[i].CHUCVU) {
                case 1:
                    data.rows[i].CHUCVU = 'Trưởng CLB'
                    break
                case 2:
                    data.rows[i].CHUCVU = 'Phó CLB'
                    break
                case 3:
                    data.rows[i].CHUCVU = 'Thành viên'
                    break
            }
        }

        return data.rows
    },

    getAllUser:  async () => {
        const query = `SELECT * FROM public."${userTable}"`
        const data = await db.query(query)
        normalize_role(data.rows)
        return data.rows
    },
    delete_member: async(mssv) => {

        const query = `DELETE FROM public."${userTable}" WHERE "MSSV" = '${mssv}'`
        const result = await db.query(query)
        // console.log(result)
    },
    update_role: async(mssv, new_role) => {

        const query = `UPDATE public."${userTable}"
        SET "CHUCVU" = ${new_role}
        WHERE "MSSV" = '${mssv}';`
        db.query(query)
    },
    update_account_status: async(mssv, new_status) => {

        const query = `UPDATE public."${userTable}"
        SET "TRANGTHAI" = ${new_status}
        WHERE "MSSV" = '${mssv}';`
        db.query(query)
    },

    //forget password
    checkAccount: async (student_id,email) => {
        const query = `SELECT * FROM public."${userTable}" WHERE "MSSV" = $1 AND "EMAIL" = $2`
        const values = [student_id, email]
        const result = await db.query(query, values);
        // Check if any rows were returned
        return result.rows.length > 0;
    },
    
    updatePassword: async (student_id, password) => {
        const hasedPsw = await bcrypt.hash(password, 10)
        const query = `UPDATE public."${userTable}" SET "MATKHAU" = $2 WHERE "MSSV" = $1`
        const values = [student_id, hasedPsw]
        db.query(query, values)
    },
    getUserByName:  async(name) =>{
        const query = `SELECT * FROM public."${userTable}" WHERE "HOTEN" = '${name}'`;
        const data = await db.query(query);
        normalize_role(data.rows)
        return data.rows;
    },

    getUserByRole: async (role) =>{
        const query = `SELECT * FROM public."${userTable}" WHERE "CHUCVU" = ${role}`;
        const data = await db.query(query);
        normalize_role(data.rows)
        return data.rows;
    },
    update_user_info: async(student_id, new_data) => {

        const query = `UPDATE public."${userTable}" SET 
                        "HOTEN" = $2,
                        "LOP" = $3,
                        "SDT" = $4,
                        "NGAYSINH" = $5,
                        "EMAIL" = $6
                         WHERE "MSSV" = $1`
        const values = [student_id, new_data.new_name, new_data.new_class,
        new_data.new_phone, new_data.new_birthday, new_data.new_email]
        db.query(query, values)
    },
    update_group: async (student_id, new_group) => {

        const query = `UPDATE public."${userTable}" SET "BAN" = $2 WHERE "MSSV" = $1`
        const values = [student_id, new_group]
        db.query(query, values)
    },
    get_refferal_code: async (student_id) => {

        const query = `SELECT "MAGIOITHIEU" FROM "REFERRAL_CODE" WHERE "MSSV" = $1`
        const values = [student_id]
        const result = await db.query(query, values)
        return result
    },
    add_ref_code: async (student_id, ref_code) => {
        const query = `INSERT INTO public."REFERRAL_CODE" VALUES ($1, $2)`
        // len(mssv) = 8, len(ref_code) = 4
        const values = [student_id, ref_code]
        db.query(query, values)
    },
    check_existed_user_ref: async (student_id) => {
        const query = `SELECT * FROM public."REFERRAL_CODE" WHERE "MSSV" = $1`
        const values = [student_id]
        const result = await db.query(query, values)
        return result.rows.length === 1
    },
    get_all_user_ref: async (student_id) => {
        const result = await db.query(`SELECT * FROM public."REFERRAL_CODE"`)
        return result.rows
    },
    delete_ref_code: async (student_id) => {

        const query = `DELETE FROM public."REFERRAL_CODE" WHERE "MSSV" = $1`
        const values = [student_id]
        await db.query(query, values)
    },
    update_avatar: async (student_id, img_url) => {
        const query = `UPDATE public."${userTable}" SET "AVATAR" = $2 WHERE "MSSV" = $1`
        const values = [student_id, img_url]
        await db.query(query, values)
    },
    update_pass: async (student_id, new_pass) => {
        const query = `UPDATE public."${userTable}" SET "MATKHAU" = $2 WHERE "MSSV" = $1`
        const values = [student_id, new_pass]
        await db.query(query, values)
    },
    getLockUser: async() =>{
        const query = `SELECT * FROM public."${userTable}" WHERE "TRANGTHAI" = '0'`
        const data = await db.query(query)
        normalize_role(data.rows)
        return data.rows
    }
}

