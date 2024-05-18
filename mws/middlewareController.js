const jwt = require("jsonwebtoken");
require('dotenv').config();
const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (token) {
            const accessToken = token;
            jwt.verify(accessToken,process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    res.clearCookie('token')
                    // res.status(403).json("Token is not valid");
                    res.redirect('/')
                }
                else{
                    req.user = user;
                    next()
                }
                

            });
        }
        else
        {
            next();
           // res.status(481).json("You're not authenticated");
        }
       
           
    },
    memberManagementMiddleware: (req,res,next)=>
    {
        try{
            let user = req.user.ROLE;
            if (user.id ===1)
            {
                next();
            }
            else{
                res.redirect("/");
            }
        }
        catch(err)
        {
            res.redirect("/")
        }
        
    },
    postManagementMiddleware: (req,res,next)=>
    {
        try{
        let user = req.user.ROLE;
       
        if (user.id ===1 || user.id===2)
        {
            next();
        }
        else{
            res.redirect("/");
        }
    }
    catch(err)
    {
        res.redirect("/")
    }
    },

}
module.exports = middlewareController;