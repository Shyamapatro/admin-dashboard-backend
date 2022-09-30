const _ = require('underscore')
const Services = require('../services')
const message = require('../config/messages.js')
let Response = require('../config/response')
const Joi = require('joi')
let commonHelper = require('../Helper/common')
const reportBugProjection = ['id', 'reportedBy', 'reportedItem', 'status']

module.exports = {
  addReportBug: async (payloadData) => {
    console.log(payloadData)
    try{
    const schema = Joi.object().keys({
      reportedBy: Joi.string().required(),
      reportedItem: Joi.string().required(),
      status: Joi.string().valid('pending', 'approved', 'declined')
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
    let bugData = await Services.reportedBugServices.addReportBug(objToSave)
  
    if (bugData) {
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
      reportedBy: Joi.string().optional(),
      reportedItem: Joi.string().optional(),
      status: Joi.string().optional()
    })
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    let bugData = await Services.reportedBugServices.getAllReportBug(
      payload,
      reportBugProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    )

    let criteria12 ={status:"pending"}
    let reportBugpending= await Services.reportedBugServices.getAllReportBug(criteria12);

    let criteria13 ={status:"approved"}
    let reportBugapproved= await Services.reportedBugServices.getAllReportBug(criteria13);

    let criteria14 ={status:"declined"}
    let reportBugdeclined= await Services.reportedBugServices.getAllReportBug(criteria14);
   
    if (bugData && reportBugpending && reportBugapproved && reportBugdeclined) {
      return {
        bugData: bugData,
        reportBugpending: reportBugpending,
        reportBugapproved: reportBugapproved,
        reportBugdeclined:reportBugdeclined
      };
    }
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
  updateReportBug: async (payloadData) => {
    try {
      const schema = Joi.object().keys({
        reportedBy: Joi.string().required(),
        reportedItem: Joi.string().required(),
        status: Joi.string().valid('pending', 'approved', 'declined'),
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

      let isUpdated = await Services.reportedBugServices.updateReportBug(
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
  deleteReportBug: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(paramData, schema)

    let criteria = {
      id: payload.id
    }
    let deleteData = Services.reportedBugServices.deleteReportBug(criteria)
    if (deleteData) {
      return message.success.DELETED
    } else {
      throw Response.error_msg.implementationError
    }
  },
  getReportBugDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
    })
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema)
    let criteria = {
      id: payload.id
    }
    let reportedbugDetail = Services.reportedBugServices.getReportBug(
      criteria,
      reportBugProjection
    )
    if (reportedbugDetail) {
      return reportedbugDetail
    } else {
      throw Response.error_msg.recordNotFound
    }
  }
}
