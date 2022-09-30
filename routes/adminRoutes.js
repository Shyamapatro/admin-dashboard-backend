var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const adminController = require("../controllers/adminControllers");
const UploadFiles = require("../Helper/upload");
const authentication = require("../middleware/adminAuthentication.js").verifyToken;

router.post("/add",(req, res) => {
	let payload = req.body
	console.log("dd",payload)
	return sendResponse.executeMethod(adminController.addAdmin, payload, req, res);
});
router.post("/login", (req, res) => {
	return sendResponse.executeMethod(adminController.login, req.body, req, res);
});

router.put("/reset-password", (req, res) => {
	return sendResponse.executeMethod(adminController.resetNewPassword, req.body, req, res);
});

router.put("/change-password", authentication,(req, res) => {
	let payload=req.body
	let token = req.credentials;
	 payload.id = token.id;
	return sendResponse.executeMethod(adminController.resetPassword, req.body, req, res);
});

router.put("/logout", authentication,(req, res) => {
	let token = req.credentials;
	return sendResponse.executeMethod(adminController.logout, token, req, res);
});
router.get("/get", (req, res) => {
	 let payload = req.query;
	// if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
	// 	payload.skip = (payload.skip - 1) * payload.limit;
	// }
	return sendResponse.executeMethod(adminController.getAllAdmins, payload, req, res);
});

router.put("/profile-edit",UploadFiles.upload.single("image"), authentication, async (req, res) => {
    let payload = req.body;
	let path=req.file.path
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(adminController.updateAdmin, payload, path, res);
});

router.put("/edit",async (req, res) => {
    let payload = req.body;
	// let path=req.file.path
	// console.log("Path of the ...........",path)
	return sendResponse.executeMethod(adminController.updateAdmin1, payload, req, res);
});

router.put("/blocked", async (req, res) => {
	let payload = req.body;
	//  payload.id = req.credentials.id;
	return sendResponse.executeMethod(adminController.BlockedAdmin, payload, req, res);
});


router.post("/forgot-password", (req, res) => {
	let payload = req.body;
	return sendResponse.executeMethod(adminController.forgotPassword, payload, req, res);
});



router.get("/profile", authentication, (req, res) => {
	
	let token = req.credentials;
	
	return sendResponse.executeMethod(adminController.getAdminProfile, token.id, req, res);
});

router.get('/getadmin-detail/',authentication,async (req, res) => {
 let payload=req.query
	 payload.id = req.credentials.id;
    return sendResponse.executeMethod(adminController.getAdminDetail,payload,req,res)
})


router.get('/admin-details/:id',async (req, res) => {
	let payload=req.params
	   return sendResponse.executeMethod(adminController.getAdminDetail,payload,req,res)
   })
   

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(adminController.deleteAdmin,req.params,req, res);
});
module.exports = router;