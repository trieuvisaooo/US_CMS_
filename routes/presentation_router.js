const app = require('express');
const router = app.Router();
const control = require("../Presentation/controllers/homepage");
const mws = require("../mws/middlewareController")
router.get("/",mws.verifyToken,control.getHomepage);
router.get("/userhomepage",control.getUserHomepage);
router.get("/aboutus",control.getAboutUsPage)
router.get("/contact",control.getContactPage)
router.get("/activities",mws.verifyToken,control.getActivitiesPage)
router.get("/science",mws.verifyToken, control.getListPost)
module.exports = router;
