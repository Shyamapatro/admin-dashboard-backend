var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const Controllers = require("../controllers/adminAcivementLevelControllers");
const authentication =require("../middleware/adminAuthentication.js").verifyToken;

router.post("/add-achievement-level", (req, res) => {
  payload=req.body
  return sendResponse.executeMethod(Controllers.AddAchievementLevel, payload, req, res);
});

router.put("/edit-achievement-level", (req, res) => {
  return sendResponse.executeMethod(Controllers.editAchievementLevel, req.body, req, res);
});

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controllers.deleteAchievementLevel,req.params,req,res);
});

router.get('/get-achievement-level/:id', async (req, res) => {
  return sendResponse.executeMethod(Controllers.getAchievementLevel,req.params,req,res)
})

module.exports = router;
