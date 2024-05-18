const activityDB = require("../../DataAccess/ClubActivitiesStorage/activities")
const userDB = require("../../Database/UserDatabase/AccessUserAccount")
const postDB = require("../../DataAccess/PostStorage/AccessPost")
const likesDB = require("../../DataAccess/PostStorage/PostLike")
function normailize_date(date_object) {
    return date_object.getFullYear().toString() + '-' + (date_object.getMonth() + 1).toString() + '-' + date_object.getDate().toString()
}
module.exports = {
    viewActivity: async(req,res)=>{
        const id = req.query.id;
        const activity = await activityDB.getActivityByID(id);
        activity.NGAYDANG = normailize_date(activity.NGAYDANG)
        activity.PARAGRAPH =  activity.NOIDUNG.split('\n').map(line => ({ text: line }));
        console.log(activity);
        const allActivities = await activityDB.getAnotherActivites(id);
        for (i of allActivities)
        {
            i.NGAYDANG = normailize_date(i.NGAYDANG)
        }
        if (req.user) {
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
            res.render("index", {layout:"single_activity", isUser: true, isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem, activity: activity, allActivities: allActivities})

            // res.render("index", { isUser: true ,isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem,top3Post:allpost, activities: activities});
        }
        else {
            res.render("index", { layout:"single_activity",isUser: false, isSignUp: true, isSignIn: true , activity: activity, allActivities: allActivities});
        }
    },
    viewPost: async(req,res)=>{
        const id = req.query.id;
        const post = await postDB.getPostbyID(id);
        
      
        post.PARAGRAPH = post.NOIDUNG.split('\n').map(line => ({ text: line }));
        post.NGAYDANG = normailize_date(post.NGAYDANG)
        post.TENNGUOIDANG = (await userDB.getUserByID(post.NGUOIDANG)).HOTEN
        if (req.user) {
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

            }const user = req.user.MSSV;
            let checkUserLike = await likesDB.getUserPostLike(user,id);
    
            if (checkUserLike)
            {
                checkUserLike = true;
            }
            else{
                checkUserLike = false;
            }
            res.render("index", {layout:"viewpost", isUser: true, isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem,post: post,checkUserLike: checkUserLike})

            // res.render("index", { isUser: true ,isChuNhiem: isChuNhiem, isPhoChuNhiem: isPhoChuNhiem,top3Post:allpost, activities: activities});
        }
        else {
            res.render("index", { layout:"viewpost",isUser: false, isSignUp: true, isSignIn: true ,post: post});
        }
    }
}