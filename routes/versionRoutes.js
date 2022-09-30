var express = require("express");
var router = express.Router();
exports.router = router;
let Controllers = require("../controllers/versionControllers");
const sendResponse = require("../Helper/sendResponse");
const authentication = require("../middleware/adminAuthentication").verifyToken;
//authentication,
router.post("/add",(req, res) => {
  return sendResponse.executeMethod(
    Controllers.addAppDetails,
    req.body,
    req,
    res
  );
});
router.get("/getall",(req, res) => {
  let payload = req.query;
  return sendResponse.executeMethod(
    Controllers.getAppDetails,
    payload,
    req,
    res
  );
});
//authentication,
router.delete("/delete/:id", (req, res) => {
  let payload = req.params;
  return sendResponse.executeMethod(
    Controllers.deleteAppVersion,
    payload,
    req,
    res
  );
});
router.put("/edit/",async (req, res) => {
  let payload = req.body;
  return sendResponse.executeMethod(Controllers.editDetails, payload, req, res);
});

router.get("/getdetail/:id",(req, res) => {
  let payload = req.params;
  return sendResponse.executeMethod(Controllers.getAppDetailid, payload, req, res);
});
router.get("/getplatform-details/:platform",(req, res) => {
  let payload = req.params;
  return sendResponse.executeMethod(Controllers.getPlatform, payload, req, res);
});
router.get("/app-version-details/:appname",(req, res) => {
  let payload = req.params;
  return sendResponse.executeMethod(
    Controllers.appVersionDetails,
    payload,
    req,
    res
  );

});


router.get("/count-app-versions/:appname/:platform", authentication,(req, res) => {
	let payload = req.params;
	return sendResponse.executeMethod(
		Controllers.countAppVersion,
		payload,
		req,
		res
	);
});

module.exports = router;
