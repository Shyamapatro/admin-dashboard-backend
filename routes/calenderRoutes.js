var express = require('express')
var router = express.Router()
let Controllers = require('../controllers/CalenderControllers')
const sendResponse = require('../Helper/sendResponse')
// const authentication = require("../middleware/adminAuthentication.js").verifyToken;

router.post('/add-Calender',(req, res) => {
    let payload = req.body;
    console.log("Payload data",payload)
    return sendResponse.executeMethod(Controllers.addCalender,payload,res)
})
// ,authentication
router.get('/get-Calender-details/', (req, res) => {
    let payload = req.query
    return sendResponse.executeMethod(Controllers.getAllCalender,payload,req,res)
})

router.put("/edit", (req, res) => {
    return sendResponse.executeMethod(Controllers.updateCalender,req.body,req,res);
});

router.get('/getcalender/:id', async (req, res) => {
    return sendResponse.executeMethod(Controllers.getCalendertDetail,req.params,req,res)
})

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controllers.deleteCalenderDetails,req.params,req, res);
});

module.exports = router;