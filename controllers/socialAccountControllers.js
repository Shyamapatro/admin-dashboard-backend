const Service = require("../services");
const message = require("../config/messages.js");
const moment = require("moment");
let Response = require("../config/response");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
const _ = require("underscore");

module.exports = {
  addSocialAccounts: async (payloadData) => {
    const schema = Joi.object().keys({
      userId: Joi.string().optional(),
      loginType: Joi.number().integer().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let objToSave = {};
    if (_.has(payload, "userId") && payload.userId != "")
      objToSave.userId = payload.userId;
    if (_.has(payload, "loginType") && payload.loginType != "")
      objToSave.loginType = payload.loginType;
    objToSave.createdAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    let addSocialAccounts = await Service.socialAccountServices.addSocialAccounts(objToSave);
    if (addSocialAccounts) {
      return message.success.ADDED;
    } else {
      throw Response.error_msg.implementationError;
    }
  }
};
