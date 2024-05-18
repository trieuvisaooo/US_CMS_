const postDB = require("../../DataAccess/PostStorage/AccessPost")
const likeDB = require("../../DataAccess/PostStorage/PostLike")
module.exports = {
    likePost: async(req,res)=>{
        if (!req.user){
            return res.redirect("/application/signin");
       }
        const userID = req.user.MSSV;
        const postID = req.query.postID;
        console.log(userID);
        console.log(postID);
        await likeDB.addLikePost(userID,postID);
        const like = (await postDB.getPostbyID(postID)).LUOTLIKE;
        await postDB.changePostLike(postID,like+1)
        res.json();
    },
    dislikePost: async(req,res)=>{
        if (!req.user){
            return res.redirect("/application/signin");
       }
        const userID = req.user.MSSV;
        const postID = req.query.postID;
        await likeDB.disLikePost(userID,postID);
        const like = (await postDB.getPostbyID(postID)).LUOTLIKE;
        await postDB.changePostLike(postID,like-1)
        res.json();

    }
}