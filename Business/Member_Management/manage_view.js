const userDB = require('../../Database/UserDatabase/AccessUserAccount.js')
const taskDB = require("../../DataAccess/TaskStorage/task.js")
const postDB = require("../../DataAccess/PostStorage/AccessPost.js")
const likeDB = require("../../DataAccess/PostStorage/PostLike.js")
const {delete_member, check_existed_ref_code, getUserByID, update_user_info} = require("../../Database/UserDatabase/AccessUserAccount");
const { all } = require('../../routes/presentation_router.js');
const bcrypt = require("bcrypt");


function getRoleNumber(text) {
    let res = -1
    if (text.toLowerCase() === 'trưởng clb') {
        res = 1
    }
    if (text === 'phó clb') {
        res = 2
    }
    if (text === 'thành viên') {
        res = 3
    }
    return res
}
function normailize_date(date_object) {
    return date_object.getFullYear().toString() + '-' + (date_object.getMonth() + 1).toString() + '-' + date_object.getDate().toString()
}

module.exports = {

    manage_member: async (req, res) => {
        const rows = await userDB.getAllUser()
        const ref_codes = await userDB.get_all_user_ref()
        res.render('index', { layout: "manage_member", isManageMember: true ,active_all: true ,members: rows, refs: ref_codes ,isChuNhiem: true,isMemberManagement: true});
    },
    banTruyenThong: async (req, res) => {

        const rows = await userDB.getUserByGroup('Truyền thông')
        res.render('index', { layout: "manage_member", isManageMember: true , active_first: true, members: rows,isChuNhiem: true,isMemberManagement: true});
    },
    banNoiDung: async (req, res) => {
        const rows = await userDB.getUserByGroup('Nội dung')
        res.render('index', { layout: "manage_member", isManageMember: true , active_second: true, members: rows,isChuNhiem: true,isMemberManagement: true});
    },
    banHauCan: async (req, res) => {
        const rows = await userDB.getUserByGroup('Hậu cần')
        res.render('index', { layout:"manage_member", isManageMember: true , active_third: true, members: rows,isChuNhiem: true,isMemberManagement: true});
    },
    banSuKien: async (req, res) => {
        const rows = await userDB.getUserByGroup('Sự kiện')
        res.render('index', { layout: "manage_member", isManageMember: true ,active_fourth: true, members: rows,isChuNhiem: true,isMemberManagement: true});
    },
    delete_member: async(req, res) => {

        // url: `/mssv`
        const mssv = req.url.slice(1);
        const allPost = await postDB.getPostbyAuthor(mssv);
        for (i of allPost)
        {
            await likeDB.deletePost(i.ID)
        }
        await likeDB.deleteUser(mssv);

        await taskDB.deleteTaskByUser(mssv);
        await postDB.deletePostByUser(mssv);
        await userDB.delete_member(mssv);
     
        // redirect
        res.redirect('/business/manage_member')
        //res.render('manage-member', { layout: false});
    },
    modify_member: async(req, res) => {

        const id = req.url.split('/')[2]
        res.render('index', { layout: "manage_member",isModify:true,MSSV: id,isChuNhiem: true,isMemberManagement: true})
    },

    confirm_changes: async (req, res) => {


        const new_role = req.body.new_role
        const new_status = req.body.account_status
        const new_group = req.body.new_group

        const mssv= req.url.split('/')[3]
        await userDB.update_role(mssv, new_role)
        await userDB.update_account_status(mssv, new_status)
        await userDB.update_group(mssv, new_group)

        res.redirect('/business/manage_member')
    },
    member_info: async(req, res) => {
        const role = req.user.ROLE;
        let isChuNhiem = false;
        let isPhoChuNhiem = false
        switch (role.id) {
            case 1:
                isChuNhiem = true;
                isPhoChuNhiem = false;
                break;
            case 2:
                isChuNhiem = false;
                isPhoChuNhiem = true;
                break;
            case 3:
                break;

        }
        const id = req.url.split('/')[1].split('-')[2]
        const mem = await userDB.getUserByID(id)
        if (mem.NGAYSINH) {
            mem.NGAYSINH = normailize_date(mem.NGAYSINH)
        }
        if (mem.NGAYVAOCLB) {
            mem.NGAYVAOCLB = normailize_date(mem.NGAYVAOCLB)
        }
        const allTask = await taskDB.getTaskByUser(id);
        console.log(allTask);
        res.render('index', {layout: "manage_member",isMemberInfo:true, mem: mem,isChuNhiem: isChuNhiem,isPhoChuNhiem: isPhoChuNhiem,isMemberManagement: true,allTask: allTask})
    },
    search_member: async (req, res) => {

        const input = req.body.search_content
        let result = await userDB.getUserByID(input)
        // case: search by id
        if (result) {
            res.render('index', { layout:'manage_member',  isManageMember: true,active_all: true ,members: [result],isChuNhiem: true,isMemberManagement: true});
        }
        else {
            // case: search by name
            result = await userDB.getUserByName(input)
            if (result.length > 0) {
                res.render('index', { layout:'manage_member',  isManageMember: true,active_all: true ,members: result, isChuNhiem: true,isMemberManagement: true});
            }
            else {
                // case: search by Group
                result = await userDB.getUserByGroup(input)
                if (result.length > 0 ) {
                    res.render('index', { layout:'manage_member',  isManageMember: true,active_all: true ,members: result,isChuNhiem: true,isMemberManagement: true});
                }
                else {
                    // case: search by Role
                    result = await userDB.getUserByRole(getRoleNumber(input))
                    if (result.length > 0) {
                        res.render('index', { layout:'manage_member',  isManageMember: true,active_all: true ,members: result,isChuNhiem: true,isMemberManagement: true});
                    }
                    else {
                        res.render('index', { layout: 'manage_member', isManageMember: true,active_all: true, isChuNhiem: true,isMemberManagement: true});
                    }

                }

            }
        }
    },
    update_info_page: async (req, res) => {
        if (!req.user)
        {
            res.redirect("/");
        }
        const role = req.user.ROLE;
        let isChuNhiem = false;
        let isPhoChuNhiem = false
        switch (role.id) {
            case 1:
                isChuNhiem = true;
                isPhoChuNhiem = false;
                break;
            case 2:
                isChuNhiem = false;
                isPhoChuNhiem = true;
                break;
            case 3:
                break;

        }
        const id = req.url.split('?')[0].split('-')[1]
        const mem = await userDB.getUserByID(id)
        // normalize NGAYSINH to YYYY-MM-DD
        if (mem.NGAYSINH) {
            mem.NGAYSINH = mem.NGAYSINH.toISOString().split('T')[0]
        }

        if (Object.keys(req.query).length !== 0) {
            if (req.query.success) {
                res.render('index', { layout: "manage_member",isUpdateUserInfo:true,mem:mem, MSSV: id,isChuNhiem: isChuNhiem,isPhoChuNhiem: isPhoChuNhiem,isMemberManagement: true, success: true})

            }
            else if (req.query.fail_verify) {
                res.render('index', { layout: "manage_member",isUpdateUserInfo:true,mem:mem, MSSV: id,isChuNhiem: isChuNhiem,isPhoChuNhiem: isPhoChuNhiem,isMemberManagement: true, fail_verify: true})
            }
            else {
                res.render('index', { layout: "manage_member",isUpdateUserInfo:true,mem:mem, MSSV: id,isChuNhiem: isChuNhiem,isPhoChuNhiem: isPhoChuNhiem,isMemberManagement: true, fail_old_pass: true})
            }
        }
        else {
            res.render('index', { layout: "manage_member",isUpdateUserInfo:true,mem:mem, MSSV: id,isChuNhiem: isChuNhiem,isPhoChuNhiem: isPhoChuNhiem,isMemberManagement: true})
        }
    },
    apply_changes: async (req, res) => {

        const id = req.url.split('/')[2].split('-')[1]
        const new_data = req.body
        await userDB.update_user_info(id, new_data)
        res.redirect("/business/member-info-" + id)
    },
    change_avatar: async (req, res) => {
        //const file_data = req.file
        const image_url = req.file?.path
        const id = req.url.split('-')[1]

        if (image_url) {
            userDB.update_avatar(id, image_url)
        }
        res.redirect("/business/updateUserInfo-" + id)
    },
    add_user: async (req, res) => {

        const student_id = req.body.new_user_id
        const ref_code = req.body.referral_code
        let success = true
        let duplicated = false

        if (await userDB.check_existed_user_ref(student_id)) {
            duplicated = true
            success = false
        }
        else {
            await userDB.add_ref_code(student_id, ref_code)
        }

        const rows = await userDB.getAllUser()
        res.render('index', { layout: "manage_member", isManageMember: true ,active_all: true ,members: rows,isChuNhiem: true,isMemberManagement: true, on_notification: true, duplicated: duplicated, success: success});
        //res.redirect("/business/manage_member")
    },
    view_profile:  (req, res) => {
        const id = req.user.MSSV
        const url = "/business/member-info-" + id.toString()
        res.redirect(url)

    },
    update_password: async (req, res) => {

        const id = req.query.user_id
        const old_pass = req.body.old_pass
        const new_pass = req.body.new_pass
        const verify_pass = req.body.verify_pass
        const mem = await userDB.getUserByID(id)
        // normalize NGAYSINH to YYYY-MM-DD
        if (mem.NGAYSINH) {
            mem.NGAYSINH = mem.NGAYSINH.toISOString().split('T')[0]
        }
        const user_pass = mem.MATKHAU
        let url = ''
        if (bcrypt.compareSync(old_pass, user_pass)) {

            if (new_pass === verify_pass) {
                const hashed_pass = await bcrypt.hash(new_pass, 10);
                await userDB.update_pass(id, hashed_pass)
                url = "/business/updateUserInfo-" + id.toString() + "?success=true"
            }
            else {
                url = "/business/updateUserInfo-" + id.toString() + "?fail_verify=true"
            }
        }
        else {
            url = "/business/updateUserInfo-" + id.toString() + "?fail_old_pass=true"
        }
        res.redirect(url)
    },
}