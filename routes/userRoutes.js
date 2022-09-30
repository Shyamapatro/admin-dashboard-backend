var express = require('express')
var router = express.Router()
let Controllers = require('../controllers/userControllers')
const sendResponse = require('../Helper/sendResponse')
const authentication = require("../middleware/userAuthentication").verifyToken;
const adminAuthentication = require("../middleware/adminAuthentication").verifyToken;

const UploadFiles = require("../Helper/upload");
//UploadFiles.upload.single("image"),
router.post('/add',(req, res) => {
  return sendResponse.executeMethod(Controllers.addUser,req.body,req,res)
})

router.post('/login',(req, res) => {
  return sendResponse.executeMethod(Controllers.login,req.body,req,res)
})

router.put("/reset-password", (req, res) => {
	return sendResponse.executeMethod(Controllers.resetNewPassword, req.body, req, res);
});

router.put("/user-edit", async (req, res) => {
  let payload = req.body;

//payload.id = req.credentials.id;
return sendResponse.executeMethod(Controllers.updateUser, payload, req, res);
});
//adminAuthentication,
router.get("/getall", (req, res) => {
  let payload = req.query;
// 	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
// 		payload.skip = (payload.skip - 1) * payload.limit;
// 	}
	return sendResponse.executeMethod(Controllers.getAllUsers, payload, req, res);
});
//authentication ,
router.get("/getUser/:id",(req, res) => {
  let payload=req.params
	return sendResponse.executeMethod(Controllers.getUser, payload, req, res);
});
//authentication,
router.put("/logout", (req, res) => {
	let token = req.credentials;
	return sendResponse.executeMethod(Controllers.logout, token, req, res);
});
//adminAuthentication,
router.delete('/delete/:id', (req, res) => {
  let payload = req.params
  return sendResponse.executeMethod(
    Controllers.deleteUserDetails,
    payload,
    req,
    res
  )
})
//authentication,
router.put("/blocked",  async (req, res) => {

	let payload = req.body;
	return sendResponse.executeMethod(Controllers.updateUser, payload, req, res);
});


module.exports = router
