const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
const moment = require("moment");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services");
module.exports = {
  addAppDetails: async (payloadData) => {
    try {
      const schema = Joi.object({
        appname: Joi.string().min(3).max(30).required(),
        version: Joi.number().precision(2).required(),
        platform: Joi.string().valid("Android", "IOS"),
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      const { appname, version, platform } = payload;
      if (!payload) {
        throw Response.error_msg.InvalidData;
      } else {
        let criteria = {
          appname: appname,
        };
        let checkversiondata = await Services.versionServices.checkVersion(
          criteria
        );
        if (checkversiondata == null) {
          dataToSave = {
            appname: appname,
            version: version,
            platform: platform,
            minimumVersion: version,
            latestVersion: version,
          };
          dataToSave.createdAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    
          appdata = await Services.versionServices.addAppDetails(dataToSave);
          return appdata;
        } else if (checkversiondata.appname === appname && checkversiondata.platform === platform && checkversiondata.version === version) {
          console.log("App already exist with same version data and platform");
          throw Response.error_msg.APPAlreadyExist;
        } else if (
          checkversiondata.appname === appname &&
          checkversiondata.platform === platform
        ) {
          if (checkversiondata.version > version) {
            console.log("Please Enter greater version");
            throw Response.error_msg.ENTERGreaterVersion;
          } else if (checkversiondata.version === version) {
            console.log(" version is equal");
            throw Response.error_msg.EQUALVersion;
          } else {
            dataToSave = {
              appname: appname,
              version: version,
              platform: platform,
              minimumVersion: checkversiondata.minimumVersion,
              latestVersion: version,
            };
            appdata = await Services.versionServices.addAppDetails(dataToSave);
            return appdata;
          }
        } else {
          dataToSave = {
            appname: appname,
            version: version,
            platform: platform,
            minimumVersion: checkversiondata.minimumVersion,
            latestVersion: version,
          };
          appdata = await Services.versionServices.addAppDetails(dataToSave);
          return appdata;
        }
      }
    } catch (err) {
      console.log("-----", err);
      throw Response.error_msg.implementationError;
    }
  },
  getAppDetails: async () => {
    let criteria = {};
    let projection = [
      "id",
      "appname",
      "version",
      "platform",
      "minimumVersion",
      "latestVersion",
    ];
    let appDetails = await Services.versionServices.getAppDetails(
      criteria,
      projection,  );
    console.log("getUserfucntion--------", appDetails);
    return appDetails;
  },

  getPlatform: async (data) => {
    try{
    let criteria = { platform: data.platform };
    console.log("-----------------", criteria);
    let projection = ["id", "appname", "platform"];
    let PlatformData = await Services.versionServices.getPlatform(
      criteria,
      projection
    );
    return PlatformData;
    }
    catch (err) {
      console.log("-----", err);
      throw Response.error_msg.implementationError;
    }
  },

  getAppDetailid: async (data) => {
    try{
     
    let criteria = { id: data.id };
    console.log(criteria);
    let projection = [
      "appname",
      "platform",
      "version",
      "minimumVersion",
      "latestVersion",
    ];
    let getversionData = await Services.versionServices.getAppDetail(
      criteria,
      projection
    );
    console.log("getAppDetailid--------", getversionData);
    return getversionData;
    }catch(err) {
      console.log("-----", err);
      throw Response.error_msg.implementationError;
    }
  },
  getAppDetail: async (data) => {
    try{
     
    let criteria = { appname: data.appname };
    console.log(criteria);
    let projection = [
      "appname",
      "platform",
      "version",
      "minimumVersion",
      "latestVersion",
    ];
    let getversionData = await Services.versionServices.getAppDetail(
      criteria,
      projection
    );
    return getversionData;
    }catch(err) {
      console.log("-----", err);
      throw Response.error_msg.implementationError;
    }
  },
  countAppVersion: async (data) => {
    try{
    let criteria = { appname: data.appname, platform: data.platform };
    let projection = ["appname", "platform", "version"];
    let countAppVersionDetails = await Services.versionServices.countAppVersion(
      criteria,
      projection
    );
    return countAppVersionDetails;
    }
    catch(err) {
      console.log("-----", err);
      throw Response.error_msg.implementationError;
    }
  },
  appVersionDetails: async (data) => {
    try{
      let criteria = { appname: data.appname };
    console.log(criteria);
    let projection = ["appname", "platform", "version"];
    let versionData = await Services.versionServices.appVersionDetails(
      criteria,
      projection
    );
    return versionData;
    }
  catch(err) {
    console.log("-----", err);
    throw Response.error_msg.implementationError;
  }
  },
  deleteAppVersion: async (data) => {
    try
    {
      let criteria = {
      id: data.id,
    };
    console.log(criteria);
    objectToSave = {
      isdeleted: true,
    };
    let updateWith = await Services.versionServices.updateIsDeleted(
      criteria,
      objectToSave
    );
    console.log(updateWith);
    let DeletedData = await Services.versionServices.deleteAppVersion(criteria);
    return DeletedData;
  }
  catch(err) {
    console.log("-----", err);
    throw Response.error_msg.implementationError;
  }
  },
  editDetails: async (data) => {
   try{ let dataToUpdate = {};
    if (data && data.appname) dataToUpdate.appname = data.appname;
    if (data && data.platform) dataToUpdate.platform = data.platform;
    if (data && data.version) dataToUpdate.version = data.version;
    let criteria = {
      id: data.id,
    };
    let saveEditDeatils = await Services.versionServices.editDetails(
      criteria,
      dataToUpdate
    );
    console.log(saveEditDeatils);
    return saveEditDeatils;
  }
  catch(err) {
    console.log("-----", err);
    throw Response.error_msg.implementationError;
  }
  },
};
