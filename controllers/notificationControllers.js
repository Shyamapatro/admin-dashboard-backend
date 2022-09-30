const Service = require("../services");
const message = require("../config/messages.js");
const moment = require("moment");
let Response = require("../config/response");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
const _ = require("underscore");
const upload = require("../Helper/upload");
const notificationProjection = ["id", "Title", "message", "image"];

module.exports = {
  addNotification: async (payloadData, path) => {
    try {
      console.log("adding notification", path);
      const schema = Joi.object().keys({
        Title: Joi.string().optional(),
        message: Joi.string().optional(),
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      const data = {
        Title: payload.Title,
        message: payload.message,
        image: path,
      };

      if (!data) {
        return Response.error_msg.InvalidData;
      } else {
        let objToSave = {};
        if (_.has(payload, "Title") && payload.Title != "")
          objToSave.Title = payload.Title;
        if (_.has(payload, "message") && payload.message != "")
          objToSave.message = payload.message;
        if (_.has(payload, "image") && payload.image != "")
          objToSave.image = payload.image;
          objToSave.createdAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    
        let addNotification =
          await Service.notificationServices.addNotification(data);
        return addNotification;
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
    }
  },
  getAllNotifications: async () => {
    let notificationDetail = Service.notificationServices.getAllNotification(
      notificationProjection
    );
    if (notificationDetail) {
      return notificationDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },
  getNotificationDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id,
    };
    let notificationDetail = Service.notificationServices.getNotification(
      criteria,
      notificationProjection,
      true
    );
    if (notificationDetail) {
      return notificationDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },
  deleteNotification: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let deleteData = Service.notificationServices.deleteNotification(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
  editNotification: async (payloadData,path) => {
    console.log('payloadData',payloadData)
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).optional(),
      Title: Joi.string().optional(),
      message: Joi.string().optional(),
      isBlocked: Joi.string().optional()
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

    let criteria = {
      id: payload.id,
    };
    let objToSave = {};
        if (_.has(payload, "Title") && payload.Title != "")
          objToSave.Title = payload.Title;
        if (_.has(payload, "message") && payload.message != "")
          objToSave.message = payload.message;
          objToSave.image = path;
          if (_.has(payload, "isBlocked") && payload.isBlocked != "")
          objToSave.isBlocked = payload.isBlocked;
        
    let projection = [...notificationProjection];
    projection.push("isBlocked");
    let updateData = Service.notificationServices.updateNotification(criteria,
      objToSave,notificationProjection
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
    let notification = await Service.notificationServices.getAllNotification(
      payload,
      notificationProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (notification) {
      return notification;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  upload,
};
