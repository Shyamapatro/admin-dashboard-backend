const Service = require("../services");
const message = require("../config/messages.js");
const moment = require("moment");
let Response = require("../config/response");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
const _ = require("underscore");
const upload = require("../Helper/upload");

const categoryProjection = ["id", "name", "image"];

module.exports = {
  addCategory: async (payloadData, path) => {
    try {
     console.log("Add data:",payloadData)
      const schema = Joi.object().keys({
        name: Joi.string().optional(),
        
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      const data = {
        name: payload.name,
        image: path,
      };

      if (!data) {
        return Response.error_msg.InvalidData;
      } else {
        let objToSave = {};
        if (_.has(payload, "name") && payload.name != "")
          objToSave.name = payload.name;
        if (_.has(payload, "image") && payload.image != "")
          objToSave.image = payload.image;
          objToSave.createdAt =  moment().format("MMMM Do YYYY, h:mm:ss a");
    
        let addCategory =
          await Service.categoryServices.addCategory(data);
        return addCategory;
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
    }
  },
  getAllCategory: async () => {
    let categoryDetail = Service.categoryServices.getAllCategory(
		categoryProjection
    );
    if (categoryDetail) {
      return categoryDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },
  getCategoryDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id,
    };
    let categoryDetail = Service.categoryServices.getCategory(
      criteria,
      categoryProjection,
      true
    );
    if (categoryDetail) {
      return categoryDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },
  deleteCategory: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
	
    let deleteData = Service.categoryServices.deleteCategory(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
  editcategory: async (payloadData,path) => {
    console.log('payloadData',path)
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
      name: Joi.string().optional()
       });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

    let criteria = {
      id: payload.id,
    };
   

  
    let objToSave = {};
        if (_.has(payload, "name") && payload.name != "")
          objToSave.name = payload.name;
          
          objToSave.image = path;
          
        
    let projection = [...categoryProjection];
    let updateData = Service.categoryServices.updateCategory(criteria,
      objToSave,projection
    );
    if (updateData) {
      return message.success.UPDATED;
    } else {
      throw Response.error_msg.implementationError;
    }
 
  },
  getFilterDetails: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      userType: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let category = await Service.categoryServices.getFilterDetails(
      payload,
      categoryProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (category) {
      return category;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  upload,
};
