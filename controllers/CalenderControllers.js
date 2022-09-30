const Service = require("../services");
const message = require("../config/messages.js");
const moment = require("moment");
let Response = require("../config/response");
const Joi = require("joi");
const commonHelper = require("../Helper/common");
const _ = require("underscore");

const CalenderProjection = ["id", "title", "start", "end"];

module.exports = {
 
getAllCalender: async () => {
    let CalenderDetails = Service.calenderServices.getAllCalender(
      CalenderProjection
    );
    if (CalenderDetails) {
      return CalenderDetails;
    } else {
      throw Response.error_msg.recordNotFound;
    }
},
addCalender: async (payloadData) => {
   
    try{
    const schema = Joi.object().keys({
      title: Joi.string().optional(),
        start:Joi.date().format('YYYY-MM-DD').utc().optional(),
        end:Joi.date().format('YYYY-MM-DD').utc().optional()
    })

    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    if (!payload) throw Response.error_msg.fieldsRequired
    let objToSave = {}
    if (_.has(payload, 'title') && payload.title != '')
      objToSave.title = payload.title
    if (_.has(payload, 'start') && payload.start != '')
      objToSave.start = payload.start
    if (_.has(payload, 'end') && payload.end != '')
      objToSave.end = payload.end
      
    
    let CalenderData = await Service.calenderServices.addCalender(objToSave)
  
    if (CalenderData) {
      return message.success.ADDED
    } else {
      return Response.error_msg.InvalidData
    }
  
  }catch (err) {
    console.log(err)
    throw Response.error_msg.implementationError
  }
},
updateCalender: async (payloadData) => {
    try {
      const schema = Joi.object().keys({
        title: Joi.string().optional(),
        start:Joi.date().format('YYYY-MM-DD').utc().optional(),
        end:Joi.date().format('YYYY-MM-DD').utc().optional(),
      
        id: Joi.string()
          .guid({ version: 'uuidv4' })
          .required()
      })

      let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
      let criteria = {
        id: payloadData.id
      }
      let objToUpdate = {}
      if (_.has(payload, 'title') && payload.title != '')
        objToUpdate.title = payload.title
      if (_.has(payload, 'start') && payload.start != '')
        objToUpdate.start = payload.start
      if (_.has(payload, 'end') && payload.end != '')
        objToUpdate.end = payload.end
      
      let isUpdated = await Service.calenderServices.updateCalender(
        criteria,
        objToUpdate
      )
      if (isUpdated) {
        return message.success.UPDATED
      } else {
        throw Response.error_msg.implementationError
      }
    } catch (err) {
      console.log(err)
      throw err
    }
},
deleteCalenderDetails: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(paramData, schema)

    let criteria = {
      id: payload.id
    }
    let deleteData = Service.calenderServices.deleteCalender(criteria)
    if (deleteData) {
      return message.success.DELETED
    } else {
      throw Response.error_msg.implementationError
    }
},
getCalendertDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    let criteria = {
      id: payload.id
    }
    let CalenderDetail = Service.calenderServices.getCalenderDetails(
      criteria,
     CalenderProjection
    )
    if (CalenderDetail) {
      return CalenderDetail
    } else {
      throw Response.error_msg.recordNotFound
    }
}

};
