const _ = require("underscore");
const moment = require("moment");
const Joi = require("joi");
const appConstants = require("./../config/appConstants");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
let config = require("../config/env")();
let message = require("../config/messages");
let Services = require("../services");
const privateKey = config.APP_URLS.PRIVATE_KEY_ADMIN;
let TokenManager = require("../Helper/adminTokenManager");
// let NotificationManager = require("../Helper/mailer");
//  const emailsender = require("../Helper/mailer");
const emailsender = require("../mail");
let adminProjection = [
  "id",
  "firstName",
  "lastName",
  "email",
  "countryCode",
  "phoneNumber",
  "adminType",
  "image",
  "isBlocked",
  "createdAt",
 
];

module.exports = {
  getAllAdmins: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      adminType: Joi.string().optional().allow(""),
      isBlocked: Joi.number().optional(),
      isActive: Joi.number().optional(),
      accessPermissions: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
  //   let criteria ={
     
  // }
    let admins = await Services.adminServices.getAllAdmins(
      
      payload,
      adminProjection,
      // parseInt(payload.limit, 10) || 10,
      // parseInt(payload.skip, 10) || 0
    );
    // if (admins) {
		// 	return admins;
		// } 
    // else {
		// 	return {
		// 		rows: [],
		// 		count: 0,
		// 	};
    // }
    let criteria1 = {
      isBlocked: 0,
    };
    
    let active_user = await Services.adminServices.getAllAdmins(criteria1);

    let criteria2 = {
      isBlocked: 1,
    };
    let blocked_user = await Services.adminServices.getAllAdmins(criteria2);

    if (admins && active_user && blocked_user) {
      return {
        admins: admins,
        user_blocked: blocked_user,
        user_active: active_user,
      };
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  addAdmin: async (payloadData) => {
    console.log(payloadData)
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      countryCode: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      adminType: Joi.any()
        .valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES)
        .optional(),
        
        accessPermissions: Joi.array().items({
      module: Joi.string().optional(),
        permission: Joi.boolean().optional()
        //  Joi.boolean()Joi.number().valid(0, 1).optional(),
      }),
    });

    
    let generatedString = commonHelper.generateRandomString(6, "numeric");
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("Payload Data",payload)
    let condition = {
      email: payload.email,
      isDeleted: 0,
    };
    let checkAdmin = await Services.adminServices.getAdmin(
      condition,
      ["id", "email"],
      false
    );
    if (checkAdmin) throw Response.error_msg.alreadyExist;
    let objToSave = {};
    if (_.has(payload, "email") && payload.email != "")
      objToSave.email = payload.email;
    if (_.has(payload, "firstName") && payload.firstName != "")
      objToSave.firstName = payload.firstName;
    if (_.has(payload, "lastName") && payload.lastName != "")
      objToSave.lastName = payload.lastName;
    if (_.has(payload, "adminType") && payload.adminType != "")
      objToSave.adminType = payload.adminType;
    if (_.has(payload, "countryCode") && payload.countryCode != "")
      objToSave.countryCode = payload.countryCode;
    if (_.has(payload, "phoneNumber") && payload.phoneNumber != "")
      objToSave.phoneNumber = payload.phoneNumber;
    objToSave.passwordResetToken = generatedString;
	objToSave.createdAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    let addAdmin = await Services.adminServices.addAdmin(objToSave);
    let permissions = {};
    if (addAdmin) {
      if (payload.accessPermissions) {
        payload.accessPermissions.forEach((accessPermission) => {
          permissions[accessPermission.module] = accessPermission.permission;
        });
      }
      permissions.adminId = addAdmin.dataValues.id;
      await Services.adminPermissionServices.createAdminPermission(permissions);
      let path = `http://localhost:3001/reset-password?email=`+ payload.email+"&token="+generatedString;
      await emailsender(payload.email,generatedString,path);
      // let path =
      //   "/admin/generatePassword?email=" + payload.email + "&token=";
      // var variableDetails = {
      //   user_name: payload.firstName + payload.lastName || "Admin User",
      //   ip: config.APP_URLS.API_URL,
      //   baseUrl: config.APP_URLS.API_URL,
      //   s3Url: config.AWS.S3.s3Url,
      //   resetPasswordToken: config.APP_URLS.API_URL + path + generatedString,
      // };
      // await NotificationManager.sendMail("ADD_ADMIN", payload.email, variableDetails);
    } else throw Response.error_msg.implementationError;
  },
  resetPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			id: Joi.string().guid({ version: "uuidv4" }).required(),
			password: Joi.string().min(5).required(),
			oldPassword: Joi.string().min(5).required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

		let adminObj = null;
		if (!payload || !payload.password) {
			throw Response.error_msg.implementationError;
		} else {
			let criteria = {
				id: payload.id,
				isDeleted: 0
			};
			let admin = await Services.adminServices.getAdmin(criteria, ["id", "email", "firstName", "password"],false);
			
			if (admin) {
				let comparePass = await commonHelper.comparePassword(payload.oldPassword, admin.password);
				if (!comparePass) {
					throw Response.error_msg.oldPasswordNotMatch;
				} else {
					adminObj = admin.dataValues;
				
					if (adminObj && adminObj.id) {
						let objToSave = {
							password: await commonHelper.generateNewPassword(payload.password),
							forgotPasswordGeneratedAt: null,
							passwordResetToken: null
						};
						await Services.adminServices.updateAdmins(criteria, objToSave);
					} else {
						throw Response.error_msg.implementationError;
					}
				}
			} else throw Response.error_msg.InvalidPasswordToken;
		}
	},
  login: async (payloadData) => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let emailCriteria = {
      email: payload.email,
      isDeleted: 0,
    };
    let projection = [...adminProjection];
    projection.push("password");
    let checkEmailExist = await Services.adminServices.getAdmin(
      emailCriteria,
      projection,
      true
    );
    if (checkEmailExist && checkEmailExist.id) {
      let comparePass = await commonHelper.comparePassword(
        payload.password,
        checkEmailExist.password
      );
      let tokenGenerated;
      if (checkEmailExist.isBlocked === 1) throw Response.error_msg.blockUser;
      else if (!comparePass) {
        throw Response.error_msg.passwordNotMatch;
      } else {
        let tokenData = {
          email: checkEmailExist.email,
          id: checkEmailExist.id,
          type: checkEmailExist.adminType,
        };
        TokenManager.setToken(tokenData, privateKey, (err, output) => {
          if (err) {
            throw Response.error_msg.implementationError;
          } else {
            if (output && output.accessToken) {
              tokenGenerated = output.accessToken;
            } else {
              throw Response.error_msg.implementationError;
            }
          }
        });
        delete checkEmailExist.dataValues["password"];
        let response = {
          accessToken: tokenGenerated,
          adminDetails: checkEmailExist,
        };
        return response;
      }
    } else throw Response.error_msg.emailNotFound;
  },
  resetNewPassword: async (payloadData) => {
    const schema = Joi.object().keys({
      email: Joi.string().optional(),
      token: Joi.string().optional().required(),
      newPassword: Joi.string().min(5).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

    let adminObj = null;
    let criteria = {
      isDeleted: 0,
      passwordResetToken: payload.token,
    };
    let admin = await Services.adminServices.getAdmin(
      criteria,
      ["id", "email", "firstName", "password"],
      false
    );
    if (admin) {
      adminObj = admin.dataValues;
      if (adminObj && adminObj.id) {
        let criteria = {
          id: adminObj.id,
        };
        let objToSave = {
          password: await commonHelper.generateNewPassword(payload.newPassword),
          forgotPasswordGeneratedAt: null,
          passwordResetToken: null,
        };
        let update = await Services.adminServices.updateAdmins(
          criteria,
          objToSave
        );
        if (update) {
          return {};
        } else throw Response.error_msg.implementationError;
      } else {
        throw Response.error_msg.implementationError;
      }
    } else {
      throw Response.error_msg.InvalidPasswordToken;
    }
  },
  logout: async (token) => {
    await TokenManager.expireToken(token, (err, output) => {
      if (err) {
        console.log("err ==>>", err);
        throw Response.error_msg.implementationError;
      } else {
        return output;
      }
    });
  },
  updateAdmin: async (payloadData,path) => {
    console.log("updateAdmin+++++++++>>>>>>>",payloadData)
		try {
			const schema = Joi.object().keys({
        id: Joi.string().guid({ version: "uuidv4" }).required(),
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.number().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
        adminType: Joi.any()
        .valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES)
        .optional(),
        isBlocked: Joi.number().valid(0, 1).optional(),
        accessPermissions: Joi.array().items({
          module: Joi.string().required(),
          permission: Joi.boolean().optional()
        }).optional(),
				
			});
      console.log("----------------",payloadData)
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id
			};
			let objToSave = {};
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.lastName = payload.lastName;
		  if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
      if (_.has(payload, "adminType")) objToSave.adminType = payload.adminType;
      objToSave.image = path;

      // ....
      let permissionObject = payload.accessPermissions;
		if (payload.accessPermissions) {payload.accessPermissions.forEach((accessPermission) => {
				permissionObject[accessPermission.module] = accessPermission.permission;
			});
			await Services.adminPermissionServices.updateAdminPermissions({ adminId: payload.id }, permissionObject);
		}
     
			let isUpdated = await Services.adminServices.updateAdmins(criteria, objToSave);
			if (isUpdated) {
				let projection = [...adminProjection]
        // projection.push("accessPermissions");
				let AdminData = await Services.adminServices.getAdmin(criteria, projection);
				let data = AdminData.dataValues;
			
				return data;
			} else {
				throw Response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
  updateAdmin1: async (payloadData) => {
    console.log("updateAdmin+++++++++>>>>>>>",payloadData)
		try {
			const schema = Joi.object().keys({
        id: Joi.string().guid({ version: "uuidv4" }).required(),
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.number().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
        adminType: Joi.any()
        .valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES)
        .optional(),
        isBlocked: Joi.number().valid(0, 1).optional(),
        accessPermissions: Joi.array().items({
          module: Joi.string().required(),
          permission: Joi.boolean().optional()
        }).optional(),
				
			});
      console.log("----------------",payloadData)
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id
			};
			let objToSave = {};
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.lastName = payload.lastName;
		  if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
      if (_.has(payload, "adminType")) objToSave.adminType = payload.adminType;
      // objToSave.image = path;

      // ....
      let permissionObject = payload.accessPermissions;
		if (payload.accessPermissions) {payload.accessPermissions.forEach((accessPermission) => {
				permissionObject[accessPermission.module] = accessPermission.permission;
			});
			await Services.adminPermissionServices.updateAdminPermissions({ adminId: payload.id }, permissionObject);
		}
     
			let isUpdated = await Services.adminServices.updateAdmins(criteria, objToSave);
			if (isUpdated) {
				let projection = [...adminProjection]

				let AdminData = await Services.adminServices.getAdmin(criteria, projection);
				let data = AdminData.dataValues;
			
				return data;
			} else {
				throw Response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
  BlockedAdmin:async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
      isBlocked: Joi.number().valid(0, 1).optional(),
      
    });
    console.log(payloadData)
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id
    };
    let objToSave = {};
    if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;
  
    let isUpdated = await Services.adminServices.updateAdmins(criteria, objToSave);
    if (isUpdated) {
      let projection = [...adminProjection]
      let AdminData = await Services.adminServices.getAdmin(criteria, projection);
      let data = AdminData.dataValues;
    
      return data;
    } else {
      throw Response.error_msg.implementationError;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
},
  forgotPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().email().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let generatedString = commonHelper.generateRandomString(6, "numeric");
		var adminObj = null;
		var criteria = {
			email: payload.email,
			isDeleted: 0
		};
		let adminData = await Services.adminServices.getAdmin(criteria, ["email", "firstName", "lastName", "id", "forgotPasswordGeneratedAt", "isBlocked"], false);
		adminObj = adminData;
		if (!adminObj) {
			throw Response.error_msg.emailNotFound;
		} else if (adminObj && adminObj.isBlocked === 1) {
			throw Response.error_msg.blockUser;
		} else if (adminObj && adminObj.forgotPasswordGeneratedAt && (moment(new Date(Date.now())).diff(adminObj.forgotPasswordGeneratedAt, "minutes") <= 1)) {
			throw Response.error_msg.tryAfterSomeTime;
		}
		let objToSave = {
			forgotPasswordGeneratedAt: moment(new Date(Date.now())).format("YYYY-MM-DD HH:mm:ss"),
			passwordResetToken: generatedString
		};

		await Services.adminServices.updateAdmins(criteria, objToSave);
		//  let path = "/admin/v1/admin/generatePassword?email=" + payload.email + "&token=";
     let path = `http://localhost:3001/reset-password?email=`+ payload.email+"&token="+generatedString;
     await emailsender(payload.email,generatedString,path);
		
		// var variableDetails = {
		// 	user_name: (adminData.firstName + adminData.lastName || "Admin User"),
		// 	ip: config.APP_URLS.API_URL,
		// 	baseUrl: config.APP_URLS.API_URL,
		// 	s3Url: config.AWS.S3.s3Url,
    //   // token:passwordResetToken,
		// 	resetPasswordToken:  path 
		// };
    
  //  console.log(variableDetails)
    
      //  await NotificationManager.sendMail("FORGOT_PASSWORD_ADMIN", payload.email, variableDetails);
	},
	getAdminProfile: async(id) => {
		let criteria = {
			id: id
		};
		console.log("step 1", criteria);
		let admin = await Services.adminServices.getAdmin(criteria, adminProjection, false);
		console.log("step 2", admin);
		return admin;
	},

  getAdminDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id,
    };

   
    let AdminDetail = Services.adminServices.getAdmin(
      criteria,
      adminProjection,
      true
    );
    if (AdminDetail) {
      return AdminDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },
  deleteAdmin:async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let deleteData = Services.adminServices.deleteAdmin(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
}