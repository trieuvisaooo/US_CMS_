const userdb = require("../../Database/UserDatabase/AccessUserAccount")
const postdb = require("../../DataAccess/PostStorage/AccessPost");
const activitiesdb = require("../../DataAccess/ClubActivitiesStorage/activities");
module.exports = {
    getHomepage: async (req, res) => {
        let allpost = await postdb.getThreeHighestLovePost();
        let activities = await activitiesdb.getActivites();

        activities = activities.map((obj) =>
        activities.indexOf(obj)== 0
          ? {
              value: obj,
              current: true,
            }
          : {
            value: obj,
            current: false,
          }
        )
    
        if (req.user) {
            let rs = await userdb.getUserByID(req.user.MSSV);
            // console.log(rs);
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
            res.render("index", { isUser: true ,isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem,top3Post:allpost, activities: activities});
        }
        else {
            res.render("index", { isUser: false, isSignUp: true, isSignIn: true,top3Post:allpost, activities: activities });
        }

    },
    getUserHomepage: async (req, res, next) => {
        res.render("index");
    },
    getAboutUsPage: async (req,res)=>{
        res.render("index", {layout: "about_us",isSignUp: true, isSignIn: true})
    },
    getContactPage: async (req,res)=>{
        res.render("index", {layout: "contact_us",isSignUp: true, isSignIn: true})
    },
    getActivitiesPage: async (req,res)=>{
        const listActivities = await activitiesdb.getActivites();
        if (req.user)
        {
            let rs = await userdb.getUserByID(req.user.MSSV);
            // console.log(rs);
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
            res.render("index", {layout: "activities",isUser: true,isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem, listActivities: listActivities })
        }
        else{
            res.render("index", {layout: "activities",isUser: false,isSignUp: true, isSignIn: true, listActivities: listActivities})
        }
    },
    getListPost: async (req,res)=>{
        const listPosts = await postdb.getPostApproved();
       
        for (i of listPosts)
        {
            i.NOIDUNG = i.NOIDUNG.substr(0,348)+ "..";
        }
        if (req.user)
        {
            let rs = await userdb.getUserByID(req.user.MSSV);
            // console.log(rs);
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
            res.render("index", {layout: "list_post",isUser: true,isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem, listPosts: listPosts })
        }
        else{
            res.render("index", {layout: "list_post",isUser: false,isSignUp: true, isSignIn: true, listPosts: listPosts})
        }
    }

}