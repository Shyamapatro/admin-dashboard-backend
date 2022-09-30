var express = require('express')
var router = express.Router()
let Controllers = require('../controllers/categoryControllers')
const sendResponse = require('../Helper/sendResponse')
const authentication = require("../middleware/adminAuthentication.js").verifyToken;
const UploadFiles = require("../Helper/upload");
 const path = require("path");

//authentication,
router.post('/add-category', UploadFiles.upload.single("image"),(req, res) => {
    let payload = req.body;
    let path=req.file.path
    console.log(path)
    
    return sendResponse.executeMethod(Controllers.addCategory,payload,path,res)
})
// ,authentication
router.get('/get-category-details/', (req, res) => {
    let payload = req.query
    return sendResponse.executeMethod(Controllers.getAllCategory,payload,req,res)
})
// authentication,
router.get('/getcategory/:id', async (req, res) => {
    return sendResponse.executeMethod(Controllers.getCategoryDetail,req.params,req,res)
})
//authentication,
router.get('/getall', async (req, res) => {
    let payload = req.query
    // if (payload.skip && payload.limit && payload.skip > 0) {
    //     payload.skip = (payload.skip - 1) * payload.limit
    // }
    return sendResponse.executeMethod(Controllers.getFilterDetails,payload,req,res)
})
//authentication,
router.delete("/delete/:id", (req, res) => {
    return sendResponse.executeMethod(Controllers.deleteCategory,req.params,req, res);
});
// authentication,
router.put('/edit',UploadFiles.upload.single("image"), async (req, res) => {
    let path=req.file.path
    let payload = req.body
    return sendResponse.executeMethod(
        Controllers.editcategory,
        payload,
        path,
        res
    )
})




module.exports = router
