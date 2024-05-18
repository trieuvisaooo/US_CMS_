const PostDB = require('../../DataAccess/PostStorage/AccessPost.js');
const UserDB = require("../../Database/UserDatabase/AccessUserAccount.js")
const likeDB = require("../../DataAccess/PostStorage/PostLike.js")
function normailize_date(date_object) {
    return date_object.getFullYear().toString() + '-' + (date_object.getMonth() + 1).toString() + '-' + date_object.getDate().toString()
}
function convertToHTML(text) {
    // Tách các dòng văn bản thành mảng các dòng
    const lines = text.split('\n');

    // Sử dụng mảng để xây dựng đoạn HTML
    const htmlArray = lines.map(line => `<p>${line}</p>`);

    // Kết hợp các đoạn HTML thành một chuỗi
    const htmlString = htmlArray.join('');

    return htmlString;
}
module.exports = {
    postPending : async (req, res) => {
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
        rows = await PostDB.getPostPending()
        res.render('index', { layout:'manage_post', status_0: true, posts: rows, isPostManagement: true,isManagePost: true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },

    postApproved : async (req, res) => {
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
        const rows = await PostDB.getPostApproved()
        res.render('index', { layout:'manage_post', status_1: true, posts: rows,isPostManagement: true,isManagePost: true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },

    postDenied : async (req, res) => {
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
        const rows = await PostDB.getPostDenied()
        res.render('index', { layout: 'manage_post', status_2: true, posts: rows,isPostManagement: true,isManagePost: true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },

    approvePost : async (req, res) => {
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
        const id = req.url.split('/')[1].split('=')[1]
        const post = await PostDB.getPostbyID(id)
        await PostDB.approvePost(id)
        rows = await PostDB.getPostPending()
        res.render('index', {layout: 'manage_post', message: true ,approvemessage: true, status_0: true, posts: rows, post: post,isPostManagement: true,isManagePost: true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem})
    },

    denyPost : async (req, res) => {
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
        const id = req.url.split('/')[1].split('=')[1]
        const post = await PostDB.getPostbyID(id)
        await PostDB.denyPost(id)
        rows = await PostDB.getPostPending()
        res.render('index', {layout: 'manage_post',message: true, denymessage: true, status_0: true, posts: rows, post: post,isPostManagement: true,isManagePost: true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem})
    },

    postInfo : async (req, res) => {
        let role = req.user.ROLE.id;
        let isChuNhiem = false, isPhoChuNhiem = false, isMyPost = false
        
        
        const id = req.url.split('/')[1].split('-')[1]
        const post = await PostDB.getPostbyID(id);
        if (post.NGUOIDANG === req.user.MSSV) {
            isMyPost = true;
        }
        if (role===1)
        {
            isChuNhiem = true;
            isMyPost = false;

        }
        if (role===2)
        {
            isPhoChuNhiem = true;
            isMyPost = false;

        }
        if (post.TRANGTHAI===0)
        {
            chuaDuyet=true;
        }
        else{
            chuaDuyet = false;
        }
        isPermission =  isChuNhiem || isPhoChuNhiem
        // post.NOIDUNG = convertToHTML(post.NOIDUNG)
        post.PARAGRAPH = post.NOIDUNG.split('\n').map(line => ({ text: line }));
        post.NGAYDANG = normailize_date(post.NGAYDANG)
        post.TENNGUOIDANG = (await UserDB.getUserByID(post.NGUOIDANG)).HOTEN
        res.render('index', { layout: 'manage_post', post: post,isPostManagement: true,isPost:true,isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem, isMyPost: isMyPost, chuaDuyet : chuaDuyet, isPermission: isPermission});
    },

    addPostPage : async (req, res) => {
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
        res.render('index', { layout: 'my_post', isAddPost: true, isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },

    confirmAddPost : async (req, res) => {
        const title = req.body.title;
        const content = req.body.description;
        const author = req.user.MSSV;
        const status = 0;
        const date = new Date();
        const img_url = req.file?.path;
        const newPost = {
            TIEUDE: title,
            NOIDUNG: content,
            NGAYDANG: date,
            TRANGTHAI: status,
            NGUOITAO: author
        }
        if (img_url) {
            newPost.ANHDINHKEM = img_url
        }
        await PostDB.addPost(newPost);
        res.redirect('/business/my_post');
    },

    deletePost : async (req, res) => {

        const id = req.url.split('/')[1].split('=')[1]
        const post = await PostDB.getPostbyID(id)
        await likeDB.deletePost(id);
        await PostDB.deletePost(id)
        ext = ''
        if (post.TRANGTHAI===1)
        {
            ext = '_approved'
        }
        if (post.TRANGTHAI===2)
        {
            ext = '_denied'
        }
        res.redirect('/business/manage_post'+ext);
    },

    myPost : async (req, res) => {
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
        const author = req.user.MSSV;
        const pendingPost = await PostDB.getPendingPostbyAuthor(author)
        const approvedPost = await PostDB.getApprovedPostbyAuthor(author)
        const deniedPost = await PostDB.getDeniedPostbyAuthor(author)
        res.render('index', { layout: 'my_post',myPosts: true, pPosts: pendingPost, aPosts: approvedPost, dPosts: deniedPost , isPostManagement: false, isManagePost: true, isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem} );
    },

    searchPost : async (req, res) => {
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
        const keyword = req.url.split('/')[1].split('=')[1].replace("+", " ");
        const rows = await PostDB.findPost(keyword)
        res.render('index', { layout: 'my_post', result: rows, myPosts: true, isSearchPost: true, isManagePost: true, isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },

    updatePostPage : async (req, res) => {
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
        const id = req.url.split('-')[1]
        const post = await PostDB.getPostbyID(id);
        res.render('index', { layout: 'my_post', post: post,isUpdatePost: true, isAddPost: true, isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem});
    },
    updatePostPage2 : async (req, res) => {
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
        const id = req.url.split('-')[1]
        const post = await PostDB.getPostbyID(id);
        res.render('index', { layout: 'my_post', post: post,isUpdatePost: true, isAddPost: true, isPhoChuNhiem: isPhoChuNhiem, isChuNhiem: isChuNhiem, isManage: true});
    },
    updatePost : async (req, res) => {
        const id = req.url.split('-')[1]
        const title = req.body.title;
        const content = req.body.description;
        const date = new Date();
        const img_url = req.file?.path;
        const newPost = {
            TIEUDE: title,
            NOIDUNG: content,
            NGAYDANG: date,
            TRANGTHAI: 0,
        }
        if (img_url) {
            newPost.ANHDINHKEM = img_url
        }
        await PostDB.updatePost(id, newPost);
        res.redirect('/business/my_post');
    },
    updatePost2 : async (req, res) => {
        const id = req.url.split('-')[1]
        console.log("object");
        const title = req.body.title;
        const content = req.body.description;
        const date = new Date();
        const img_url = req.file?.path;
        const newPost = {
            TIEUDE: title,
            NOIDUNG: content,
            NGAYDANG: date,
            TRANGTHAI: 0,
        }
        if (img_url) {
            newPost.ANHDINHKEM = img_url
        }
        await PostDB.updatePost(id, newPost);
        res.redirect('/business/manage_post');
    }
}
