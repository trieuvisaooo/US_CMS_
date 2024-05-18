const userDB = require('../../Database/UserDatabase/AccessUserAccount.js')
const taskDB = require("../../DataAccess/TaskStorage/task.js")
const postDB = require("../../DataAccess/PostStorage/AccessPost.js")
module.exports = {
    viewChart: async(req,res)=>{
       
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
        res.render("index", {layout: "chart", isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem})
    },
    getMember: async(req,res)=>{
        const allUser = (await userDB.getAllUser()).length;
        const lockUser = (await userDB.getLockUser()).length;
        console.log(allUser);
        console.log(lockUser);
        res.json({allUser: allUser, lockUser: lockUser});
    },
    getPostAndTask: async(req,res)=>{ 
         const year = 2024;
        const allTask = await taskDB.getTaskFromYear(year);
        const allPost = await postDB.getPostFromYear(year);
        let taskArray = Array(12).fill(0);
        let postArray = Array(12).fill(0);
        for (i of allTask)
        {
            const value = i.NGAYBD.getMonth();
            taskArray[value] = taskArray[value] +1;
        }
        for (i of allPost)
        {
            const value = i.NGAYDANG.getMonth();
            postArray[value] = postArray[value] +1;
        }
        res.json({year: year, taskArray: taskArray, postArray: postArray})
    }
}