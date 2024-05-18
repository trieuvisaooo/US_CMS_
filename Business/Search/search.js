const taskDB = require("../../DataAccess/TaskStorage/task")
const userDB = require("../../Database/UserDatabase/AccessUserAccount")
module.exports = {
    getSearchTask: async(req,res)=>{
        let role = req.user.ROLE.id;
        let isChuNhiem = false, isPhoChuNhiem = false
        if (role===1)
        {
            isChuNhiem = true;
        }
        if (role===2)
        {
            isPhoChuNhiem = true;
        }
        console.log(req.query.search);
        const task = await taskDB.getSearchTask(req.query.search)
        for (i of task)
        {
            i.TENNGUOITHUCHIEN = (await userDB.getUserByID(i.NGUOITHUCHIEN)).HOTEN
        }
        res.render("index", {layout: 'searchtask', isChuNhiem:isChuNhiem, isPhoChuNhiem: isPhoChuNhiem,isTaskManagement: true, task: task})
    }
}