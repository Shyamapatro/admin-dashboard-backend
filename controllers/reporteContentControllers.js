const _ = require('underscore')
const Services = require('../services')
const message = require('../config/messages.js')
let Response = require('../config/response')
const Joi = require('joi')
let commonHelper = require('../Helper/common')
const reportedContentProjection = ['id', 'reportedBy', 'reportedItem', 'status','Description']

module.exports = {
  addReportedContent: async (payloadData) => {
    console.log(payloadData)
    try{
    const schema = Joi.object().keys({
      reportedBy: Joi.string().required(),
      reportedItem: Joi.string().required(),
      status: Joi.string().valid('pending', 'approved', 'declined'),
      Description: Joi.string().required(),
      
    })

    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    if (!payload) throw Response.error_msg.fieldsRequired
    let objToSave = {}
    if (_.has(payload, 'reportedBy') && payload.reportedBy != '')
      objToSave.reportedBy = payload.reportedBy
    if (_.has(payload, 'reportedItem') && payload.reportedItem != '')
      objToSave.reportedItem = payload.reportedItem
    if (_.has(payload, 'status') && payload.status != '')
      objToSave.status = payload.status
      if (_.has(payload, 'Description') && payload.Description != '')
      objToSave.Description = payload.Description
    
    let ContentData = await Services.reportedContentServices.addReportedContent(objToSave)
  
    if (ContentData) {
      return message.success.ADDED
    } else {
      return Response.error_msg.InvalidData
    }
  
  }catch (err) {
    console.log(err)
    throw Response.error_msg.implementationError
  }
},
  getAllReported: async (payloadData) => {
    try{
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string()
        .optional()
        .allow(''),
     
    })
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    let ContentData = await Services.reportedContentServices.getAllReportedContent(
      payload,
      reportedContentProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    )
    let criteria12 ={status:"pending"}
    let reportContentpending= await Services.reportedContentServices.getAllReportedContent(criteria12);
    //  let countpendingData=reportContentpending.count
    let criteria13 ={status:"approved"}
    let reportContentapproved= await Services.reportedContentServices.getAllReportedContent(criteria13);
    //  let countapproveData=reportContentapproved.count
    let criteria14 ={status:"declined"}
    let reportContentdeclined=  await Services.reportedContentServices.getAllReportedContent(criteria14);
    // let countdeclinedData=reportContentdeclined.count
    // console.log(countdeclinedData)
    if (ContentData && reportContentpending && reportContentapproved && reportContentdeclined) {
      return {
        ContentData: ContentData,
        reportContentpending: reportContentpending,
        reportContentapproved: reportContentapproved,
        reportContentdeclined:reportContentdeclined
      };
    }
    // if (ContentData) {
    //   return ContentData
    // } 
    else {
      return {
        rows: [],
        count: 0
      }
    }
    }catch (err) {
        console.log(err)
        throw Response.error_msg.implementationError
      }  
},
updateReportedContent: async (payloadData) => {
    try {
      const schema = Joi.object().keys({
        reportedBy: Joi.string().required(),
        reportedItem: Joi.string().required(),
        status: Joi.string().valid('pending', 'approved', 'declined'),
        Description: Joi.string().required(),
        id: Joi.string()
          .guid({ version: 'uuidv4' })
          .required()
      })

      let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
      let criteria = {
        id: payloadData.id
      }
      let objToUpdate = {}
      if (_.has(payload, 'reportedBy') && payload.reportedBy != '')
        objToUpdate.reportedBy = payload.reportedBy
      if (_.has(payload, 'reportedItem') && payload.reportedItem != '')
        objToUpdate.reportedItem = payload.reportedItem
      if (_.has(payload, 'status') && payload.status != '')
        objToUpdate.status = payload.status
        if (_.has(payload, 'Description') && payload.Description != '')
        objToUpdate.Description = payload.Description
      
      let isUpdated = await Services.reportedContentServices.updateReportedContent(
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
  deleteReportedContent: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(paramData, schema)

    let criteria = {
      id: payload.id
    }
    let deleteData = Services.reportedContentServices.deleteReportedContent(criteria)
    if (deleteData) {
      return message.success.DELETED
    } else {
      throw Response.error_msg.implementationError
    }
  },
  getReportedContentDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    let criteria = {
      id: payload.id
    }
    let reportedContentDetail = Services.reportedContentServices.getReportedContent(
      criteria,
      reportedContentProjection
    )
    if (reportedContentDetail) {
      return reportedContentDetail
    } else {
      throw Response.error_msg.recordNotFound
    }
  }
}
