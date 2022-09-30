var express = require('express')
var router = express.Router()
let Controllers = require('../controllers/notificationControllers')
const sendResponse = require('../Helper/sendResponse')
const authentication = require("../middleware/adminAuthentication.js").verifyToken;
const UploadFiles = require("../Helper/upload");
//const path = require("path");
//authentication,
router.post('/add-notification', UploadFiles.upload.single("image"), (req, res) => {
    let path=req.file.path
    let payload = req.body;
    return sendResponse.executeMethod(Controllers.addNotification,payload,path,res)
})

router.get('/get-notification-details', authentication,(req, res) => {
    let payload = req.query
    return sendResponse.executeMethod(Controllers.getAllNotifications,payload,req,res)
})

router.get('/getNotification/:id',async (req, res) => {
    return sendResponse.executeMethod(Controllers.getNotificationDetail,req.params,req,res)
})

router.get('/getall',async (req, res) => {
    let payload = req.query
    // if (payload.skip && payload.limit && payload.skip > 0) {
    //     payload.skip = (payload.skip - 1) * payload.limit
    // }
    return sendResponse.executeMethod(Controllers.getFilterDetails,payload,req,res)
})

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controllers.deleteNotification,req.params,req, res);
});
// 
router.put("/edit",UploadFiles.upload.single("image"), (req, res) => {
    let path=req.file.path
    console.log(path)
    return sendResponse.executeMethod(Controllers.editNotification,req.body,path,res);
});



module.exports = router
