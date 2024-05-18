const app = require('express');
const router = app.Router();
const control = require("../Business/Member_Management/manage_view");
const postcontrol = require("../Business/PostManagement/manage_post");
const assignTaskControl = require("../Business/Member_Management/assign_task")
const mws = require("../mws/middlewareController")
const cloudUploader = require("../mws/uploader");
const interact = require("../Business/InteractWithPosts/postlove");
const chart = require("../Business/Member_Management/chart")
const search = require("../Business/Search/search")

//Quản lý task
router.get("/assigntask",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.getAssignTaskPage);
router.get("/assigntask/addtask",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.addtask);
router.get("/taskonBan",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.getTaskWithBan);
router.post("/addNewTask",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.addNewTask);
router.get("/eachtask",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.getEachTask);
router.post("/changeTask",mws.verifyToken,assignTaskControl.changeTask);
router.get("/deleteTask",mws.verifyToken,mws.memberManagementMiddleware,assignTaskControl.deleteTask);
router.get("/viewtask",mws.verifyToken,assignTaskControl.viewTask);
router.get("/searchtask",mws.verifyToken, mws.memberManagementMiddleware,search.getSearchTask)

// quan ly bai viet
router.get("/manage_post", mws.verifyToken,mws.postManagementMiddleware,postcontrol.postPending)
router.get("/manage_post_approved",mws.verifyToken, mws.postManagementMiddleware,postcontrol.postApproved)
router.get("/manage_post_denied",mws.verifyToken,mws.postManagementMiddleware, postcontrol.postDenied)
router.get("/approve_post", mws.verifyToken,mws.postManagementMiddleware,postcontrol.approvePost)
router.get("/deny_post",mws.verifyToken,mws.postManagementMiddleware, postcontrol.denyPost)
router.get("/post-:id", mws.verifyToken,postcontrol.postInfo)
router.get("/add_post", mws.verifyToken, postcontrol.addPostPage)
router.post("/add_post_confirm", mws.verifyToken, cloudUploader.single('image'), postcontrol.confirmAddPost)
router.get("/delete_post", mws.verifyToken,mws.postManagementMiddleware,postcontrol.deletePost)
router.get("/my_post", mws.verifyToken,postcontrol.myPost)
router.get("/search_post", mws.verifyToken,postcontrol.searchPost)
router.get("/update_post-:id", mws.verifyToken,postcontrol.updatePostPage)
router.get("/update_post2-:id", mws.verifyToken,postcontrol.updatePostPage2)

router.post("/update_post_confirm-:id", mws.verifyToken,cloudUploader.single('image'),postcontrol.updatePost)
router.post("/update_post_confirm2-:id", mws.verifyToken,cloudUploader.single('image'),postcontrol.updatePost2)


// quan ly thanh vien
router.get("/manage_member", mws.verifyToken,mws.memberManagementMiddleware,control.manage_member)
router.get("/banTruyenThong",mws.verifyToken,mws.memberManagementMiddleware, control.banTruyenThong)
router.get("/banNoiDung",mws.verifyToken,mws.memberManagementMiddleware, control.banNoiDung)
router.get("/banHauCan", mws.verifyToken,mws.memberManagementMiddleware,control.banHauCan)
router.get("/banSuKien", mws.verifyToken,mws.memberManagementMiddleware,control.banSuKien)
router.get("/modifyMember/:id",mws.verifyToken, mws.memberManagementMiddleware,control.modify_member)
router.post("/modifyMember/confirm/:id", mws.verifyToken,mws.memberManagementMiddleware,control.confirm_changes)
router.get("/member-info-:id",mws.verifyToken, control.member_info)
router.post("/search_member", mws.verifyToken,mws.memberManagementMiddleware,control.search_member)
router.get("/updateUserInfo-:id",mws.verifyToken,control.update_info_page)

router.post("/add_user",mws.verifyToken,mws.memberManagementMiddleware,control.add_user)
router.post("/updateUserInfo/apply_changes-:id",mws.verifyToken, control.apply_changes)
router.post("/updateUserInfo/change_avatar-:id" , mws.verifyToken, cloudUploader.single('new_avatar'), control.change_avatar)
router.post("/updateUserInfo/update_password",mws.verifyToken, control.update_password)

router.get("/my_profile", mws.verifyToken, control.view_profile)
router.get("/:id", control.delete_member)


router.get("/likepost/likepost", mws.verifyToken,interact.likePost)
router.get("/likepost/dislikepost", mws.verifyToken, interact.dislikePost)
router.get("/viewchart/view",mws.verifyToken, mws.postManagementMiddleware, chart.viewChart)
router.get("/viewchart/getmember",chart.getMember)
router.get("/viewchart/gettaskandpost",chart.getPostAndTask)

module.exports = router;


