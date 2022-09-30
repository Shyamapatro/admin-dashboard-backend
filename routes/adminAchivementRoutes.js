var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const Controller = require("../controllers/adminAcivementControllers");
const authentication =require("../middleware/adminAuthentication.js").verifyToken;

router.post("/add-Achievement", (req, res) => {
  payload=req.body
  return sendResponse.executeMethod(Controller.AddAchievement, payload, req, res);
});
router.get("/getall", (req, res) => {
    let payload = req.query;
  //   if (payload.skip && payload.limit && payload.skip > 0) {
  //   payload.skip = (payload.skip - 1) * payload.limit;
  // }
  return sendResponse.executeMethod(Controller.getAllAdminsAchievement,payload,req,res);
});
router.put("/edit-Achievement", (req, res) => {
  return sendResponse.executeMethod(Controller.editAchievement, req.body, req, res);
});

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controller.deleteAchievement,req.params,req,res);
});
router.get('/get-Achievement/:id',async (req, res) => {
  return sendResponse.executeMethod(Controller.getAchievementDetail,req.params,req,res)
})

module.exports = router;
