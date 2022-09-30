var express = require('express')
var router = express.Router()
let Controllers = require('../controllers/socialAccountControllers')
const sendResponse = require('../Helper/sendResponse')
const authentication = require("../middleware/adminAuthentication.js").verifyToken;


//authentication,
router.post('/add-social', (req, res) => {
  
    let payload = req.body;
    return sendResponse.executeMethod(Controllers.addSocialAccounts,payload,req,res)
})

module.exports = router
