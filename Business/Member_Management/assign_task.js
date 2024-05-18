const userdb = require("../../Database/UserDatabase/AccessUserAccount");
const taskdb = require("../../DataAccess/TaskStorage/task");
var nodemailer = require('nodemailer');
require("dotenv").config();
module.exports = {
    getAssignTaskPage: async (req, res, next) => {
        var phongban = req.query.message;
        var ban;
        const todoTask = [];
        const inprogressTask = [];
        const doneTask = [];
        if (!phongban) {
            phongban = 'TruyenThong';
        }
        switch (phongban) {
            case 'TruyenThong':
                ban = "Truyền thông";
                break;
            case 'NoiDung':
                ban = "Nội dung";
                break;
            case 'HauCan':
                ban = "Hậu cần";
                break;
            case 'SuKien':
                ban = "Sự kiện";
                break;
        }
        const user = await userdb.getUserByGroup(ban);

        if (user) {

            for (let i of user) {
                let data = await taskdb.getTaskByUser(i.MSSV);

                if (data) {
                    for (j of data) {
                        j.TENNGUOITHUCHIEN = i.HOTEN;
                        switch (j.TRANGTHAI) {
                            case -1:
                                todoTask.push(j);
                                break;
                            case 0:
                                inprogressTask.push(j);
                                break;
                            case 1:
                                doneTask.push(j);
                                break;
                        }
                    }

                }
            }
        }
        res.render("index", { layout: "assign-task", taskmanager: true, addtask: false, TODOTask: todoTask, INPROGRESSTask: inprogressTask, DONETask: doneTask,isTaskManagement: true,isChuNhiem: true });
    },
    addtask: async (req, res, next) => {

        uservalue = await userdb.getAllUser();
        res.render("index", { layout: "assign-task", taskmanager: false, addtask: true, uservalue: uservalue,isTaskManagement: true,isChuNhiem: true  });
    },
    
    getTaskWithBan: async (req, res, next) => {
        var phongban = req.query.message;
        console.log(phongban);
        var ban;
        const todoTask = [];
        const inprogressTask = [];
        const doneTask = [];
        if (!phongban) {
            phongban = 'TruyenThong';
        }
        switch (phongban) {
            case 'TruyenThong':
                ban = "Truyền thông";
                break;
            case 'NoiDung':
                ban = "Nội dung";
                break;
            case 'HauCan':
                ban = "Hậu cần";
                break;
            case 'SuKien':
                ban = "Sự kiện";
                break;
        }
        const user = await userdb.getUserByGroup(ban);
        if (user) {

            for (let i of user) {

                let data = await taskdb.getTaskByUser(i.MSSV);
                if (data) {
                    for (j of data) {
                        j.TENNGUOITHUCHIEN = i.HOTEN;
                        switch (j.TRANGTHAI) {
                            case -1:
                                todoTask.push(j);
                                break;
                            case 0:
                                inprogressTask.push(j);
                                break;
                            case 1:
                                doneTask.push(j);
                                break;
                        }
                    }

                }
            }
        }
        res.json({ taskmanager: true, TODOTask: todoTask, INPROGRESSTask: inprogressTask, DONETask: doneTask });
    },
    addNewTask: async (req, res, next) => {
        const title = req.body.title;
        const mem_assigned = req.body.mem_assigned;
        const start_date = req.body.start_date;
        const due_date = req.body.due_date;
        const content = req.body.content;
        const cmt = req.body.cmt;
        const status = req.body.status;
        let err;
        let date = new Date();
        let date_due = new Date(due_date)
        let date_start = new Date(start_date)
        if (date > date_due || date >  date_start)
        {
            checkAdd = false;
            err = "Ngày phải sau ngày hiện tại"
        }
        else if (date_start > date_due){
            checkAdd = false;
            err = "Ngày kết thúc phải sau ngày bắt đầu"
        }
        else{
            checkAdd = true;
        }
        //TODO: xử lý lỗi
        switch (status) {
            case 'Chưa bắt đầu':
                status_num = -1;
                break;
            case 'Đang thực hiện':
                status_num = 0;
                break;
            case 'Đã hoàn thành':
                status_num = 1;
                break;
        }
        const member = await userdb.getUserByName(mem_assigned);
        console.log(member);
        const mem_assigned_id = (member[0]).MSSV;
        
        const email = member[0].EMAIL;
        console.log(email);
        if (checkAdd===true)
        {
            await taskdb.addNewTask(title, mem_assigned_id,start_date, due_date, content, cmt, status_num);

        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.CLUB_GMAIL,
              pass: process.env.CLUB_PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.CLUB_GMAIL,
            to: email,
            subject: "Giao task từ US-CMS Club",
            html: `<b>Tiêu đề: ${title}</b>
                    <p><b>Nội dung:</b> ${content}</p>
                    <p> <b> Ghi chú: </b> ${cmt}</p>
                    <p><b>Ngày bắt đầu: </b>${start_date}</p>
                    <p><b>Ngày kết thúc: </b>${due_date}</p>
                    <p><b>Trạng thái: </b>${status}</p>
                    `
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.json({checkAdd: checkAdd,err: err})

    },
    getEachTask: async (req, res) => {
        const id = req.query.id;
        const task = await taskdb.getTaskByID(id);
        const alluser = await userdb.getAllUser();

        const name = (await userdb.getUserByID(task.NGUOITHUCHIEN)).HOTEN;
        var status;
        switch (task.TRANGTHAI) {
            case -1:
                status = 'Chưa bắt đầu';
                break;
            case 0:
                status = 'Đang thực hiện';
                break;
            case 1:
                status = 'Đã hoàn thành';
                break;
        };
        const ngaydb = new Date(task.NGAYBD);
        let getBDdate = ngaydb.getDate();
        let getBDmonth = ngaydb.getMonth()+1;
        if (getBDdate < 10) {
            getBDdate = "0" + getBDdate.toString();
        }
        else {
            getBDdate = getBDdate.toString();
        }
        if (getBDmonth < 10) {
            getBDmonth = "0" + getBDmonth.toString();
        }
        else {
            getBDmonth = getBDmonth.toString();
        }
        let getBDyear = ngaydb.getFullYear();
        const dbdate = getBDyear + "-" + getBDmonth + "-" + getBDdate;
        const date1 = new Date(task.NGAYTOIHAN);
        let getDate = date1.getDate();
        let getMonth = date1.getMonth() + 1;
        if (getDate < 10) {
            getDate = "0" + getDate.toString();
        }
        else {
            getDate = getDate.toString();
        }
        if (getMonth < 10) {
            getMonth = "0" + getMonth.toString();
        }
        else {
            getMonth = getMonth.toString();
        }
        let getYear = date1.getFullYear();
        const date = getYear + "-" + getMonth + "-" + getDate;

        res.render("index", {
            layout: "assign-task", taskmanager: false, addtask: false, isTask: true,
            title: task.TIEUDE, member_name: name, uservalue: alluser, start_date: dbdate,due_date: date, content: task.NOIDUNG, cmt: task.GHICHU, status: status, id1: task.ID, id: task.ID,
            isTaskManagement: true,isChuNhiem: true 
        });
    },
    changeTask: async (req, res, next) => {
        const id = req.body.id;
        const title = req.body.title;
        const mem_assigned = req.body.mem_assigned;
        const start_date = req.body.start_date;
        const due_date = req.body.due_date;
        const content = req.body.content;
        const cmt = req.body.cmt;
        const status = req.body.status;
        switch (status) {
            case 'Chưa bắt đầu':
                status_num = -1;
                break;
            case 'Đang thực hiện':
                status_num = 0;
                break;
            case 'Đã hoàn thành':
                status_num = 1;
                break;
        }
        let err,checkChange;
        let date = new Date();
        let date_due = new Date(due_date)
        let date_start = new Date(start_date)
        if (date > date_due || date >  date_start)
        {
            checkChange= false;
            err = "Ngày phải sau ngày hiện tại"
        }
        else if (date_start > date_due){
            checkChange= false;
            err = "Ngày kết thúc phải sau ngày bắt đầu"
        }
        else{
            checkChange = true;
        }
        const mem_assigned_id = (await userdb.getUserByName(mem_assigned))[0].MSSV;
        if (checkChange===true)
        {
        await taskdb.changeTaskInformation(id, title, mem_assigned_id,start_date, due_date, content, cmt, status_num)
        }
        console.log(checkChange);
        //nếu thành công
        res.json({checkChange: checkChange,err:err})

    },
    deleteTask: async (req, res, next) => {
        const id = req.query.id;
        await taskdb.deleteTaskByID(id);
        res.redirect('/business/assigntask')
    },
    viewTask: async (req,res)=>{
        const id = req.query.id;
        const task = await taskdb.getTaskByID(id);
        const alluser = await userdb.getAllUser();

        const name = (await userdb.getUserByID(task.NGUOITHUCHIEN)).HOTEN;
        var status;
        switch (task.TRANGTHAI) {
            case -1:
                status = 'Chưa bắt đầu';
                break;
            case 0:
                status = 'Đang thực hiện';
                break;
            case 1:
                status = 'Đã hoàn thành';
                break;
        };
        const ngaydb = new Date(task.NGAYBD);
        let getBDdate = ngaydb.getDate();
        let getBDmonth = ngaydb.getMonth()+1;
        if (getBDdate < 10) {
            getBDdate = "0" + getBDdate.toString();
        }
        else {
            getBDdate = getBDdate.toString();
        }
        if (getBDmonth < 10) {
            getBDmonth = "0" + getBDmonth.toString();
        }
        else {
            getBDmonth = getBDmonth.toString();
        }
        let getBDyear = ngaydb.getFullYear();
        const dbdate = getBDyear + "-" + getBDmonth + "-" + getBDdate;
        const date1 = new Date(task.NGAYTOIHAN);
        let getDate = date1.getDate();
        let getMonth = date1.getMonth() + 1;
        if (getDate < 10) {
            getDate = "0" + getDate.toString();
        }
        else {
            getDate = getDate.toString();
        }
        if (getMonth < 10) {
            getMonth = "0" + getMonth.toString();
        }
        else {
            getMonth = getMonth.toString();
        }
        let getYear = date1.getFullYear();
        const date = getYear + "-" + getMonth + "-" + getDate;

        res.render("index", {
            layout: "viewtask", taskmanager: false, addtask: false, isTask: true,
            title: task.TIEUDE, member_name: name, uservalue: alluser, start_date: dbdate,due_date: date, content: task.NOIDUNG, cmt: task.GHICHU, status: status, id1: task.ID, id: task.ID,
            isTaskManagement: true,isChuNhiem: true 
        });
    }


}