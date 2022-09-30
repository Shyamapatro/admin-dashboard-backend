const express = require("express");
const router = express.Router();
const Controllers = require("../Controllers/reportedBugControllers");
const authentication = require("../middleware/adminAuthentication").verifyToken;
const sendResponse = require("../Helper/sendResponse");

router.post('/add-reportbug',(req, res) => {
    let payload = req.body;
    return sendResponse.executeMethod(Controllers.addReportBug,payload,req,res)
})

router.put("/edit", (req, res) => {
    return sendResponse.executeMethod(Controllers.updateReportBug,req.body,req,res);
});

router.get("/getall", (req, res) => {
    let payload = req.query;
    // if (payload.skip && payload.limit && payload.skip > 0) {
    //   payload.skip = (payload.skip - 1) * payload.limit;
    // }
    return sendResponse.executeMethod(Controllers.getAllReported,payload,req,res);
  });

router.get('/getreported-bug/:id', async (req, res) => {
    return sendResponse.executeMethod(Controllers.getReportBugDetail,req.params,req,res)
})

router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controllers.deleteReportBug,req.params,req, res);
});

module.exports = router;