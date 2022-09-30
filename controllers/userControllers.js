const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
const moment = require("moment");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services/userServices");
const privateKey = config.APP_URLS.PRIVATE_KEY;
let TokenManager = require("../Helper/userTokenManager");
//const UploadFiles = require("../Helper/upload");
const emailsender = require("../mail");
const _ = require("underscore");
let UserProjection = [
  "id",
  "firstName",
  "lastName",
  "email",
  "countryCode",
  "phoneNumber",
  "isBlocked",
  "createdAt",
];

module.exports = {
  addUser: async (payloadData) => {
    try {
      const schema = Joi.object().keys({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().optional(),
        countryCode: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        platformType: Joi.string().valid("ANDROID", "IOS", "WEB"),
      });
      console.log("user Data",payloadData)
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      let generatedString = commonHelper.generateRandomString(6, "numeric");
      let condition = {
        email: payload.email,
        isDeleted: 0,
      };
      let checkUser = await Services.getUser(condition, [
        "id",
        "email",
        "isBlocked",
      ]);
      if (checkUser && checkUser.isBlocked === 1)
        throw Response.error_msg.blockUser;
      if (checkUser) throw Response.error_msg.alreadyExist;
      let objToSave = {};

      if (_.has(payload, "email") && payload.email != "")
        objToSave.email = payload.email;
      if (_.has(payload, "firstName") && payload.firstName != "")
        objToSave.firstName = payload.firstName;
      if (_.has(payload, "lastName") && payload.lastName != "")
        objToSave.lastName = payload.lastName;
      if (_.has(payload, "countryCode") && payload.countryCode != "")
        objToSave.countryCode = payload.countryCode;
      if (_.has(payload, "platformType") && payload.platformType != "")
        objToSave.platformType = payload.platformType;

      let criteria2 = {};
      let userDataPhone = null;
      if (payload.phoneNumber && payload.phoneNumber != "") {
        criteria2 = {
          phoneNumber: payload.phoneNumber,
          countryCode: payload.countryCode,
          isDeleted: 0,
        };
        userDataPhone = await Services.getUser(criteria2, UserProjection);
        if (userDataPhone && userDataPhone.isBlocked === 1)
          throw Response.error_msg.blockUser;
        if (userDataPhone) throw Response.error_msg.numberAlreadyExist;
        objToSave.passwordResetToken = generatedString;
        objToSave.createdAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
        console.log(
          "passwordResetToken------->>",
          objToSave.passwordResetToken
        );
        let addUser = await Services.addUser(objToSave);
        let path = `http://localhost:3001/reset-password?email=`+ payload.email+"&token="+generatedString;
     
      await emailsender(payload.email,generatedString,path);
      
        return addUser;
      }
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  },
  login: async (payloadData) => {
    // try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log(payload);
    let emailCriteria = {
      email: payload.email,
      isDeleted: 0,
    };
    let projection = [...UserProjection];
    projection.push("password");
    let checkEmailExist = await Services.getUser(emailCriteria, projection);
    console.log(checkEmailExist);
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
          // type: checkEmailExist.platformType,
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
          UserDetails: checkEmailExist,
        };
        return response;
      }
    } else throw Response.error_msg.emailNotFound;
    // } catch (err) {
    //   console.log("err----", err);
    //   throw err;
    // }
  },
  resetNewPassword: async (payloadData) => {
    const schema = Joi.object().keys({
      email: Joi.string().optional(),
      token: Joi.string().optional().required(),
      newPassword: Joi.string().min(5).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);

    let UserObj = null;
    let criteria = {
      isDeleted: 0,
      passwordResetToken: payload.token,
    };
    let User = await Services.getUser(
      criteria,
      ["id", "email", "firstName", "password"],
      false
    );
    if (User) {
      UserObj = User.dataValues;
      if (UserObj && UserObj.id) {
        let criteria = {
          id: UserObj.id,
        };
        let objToSave = {
          password: await commonHelper.generateNewPassword(payload.newPassword),
          forgotPasswordGeneratedAt: null,
          passwordResetToken: null,
        };
        let update = await Services.updateUsers(criteria, objToSave);
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
  resetPassword: async (req, res) => {
    const { new_password, password_confirmation } = req.body;
    const { id, token } = req.params;
    let criteria1 = { id: id };
    const User = await Services.getUser(criteria1);
    try {
      const { id, name, email, password, profilepic } = User;

      const new_secret = id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, new_secret);
      console.log("my-password", password_confirmation, new_password);
      if (new_password && password_confirmation) {
        if (new_password !== password_confirmation) {
          return null;
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(new_password, salt);
          const objtosave = {
            password: newHashPassword,
          };

          let criteria = { email: email };

          let User = await Services.UserServices.updatePassword(
            criteria,
            objtosave
          );

          return message.success.FORGOT;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
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
  getAllUsers: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      isBlocked: Joi.number().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let users = await Services.getAllUsers(
      payload,
      UserProjection,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );

    let criteria1 = {
      isBlocked: 0,
    };
    console.log("criteria1",criteria1)
    let active_user = await Services.getAllUsers(criteria1);

    let criteria2 = {
      isBlocked: 1,
    };
    let blocked_user = await Services.getAllUsers(criteria2);

    if (users && active_user && blocked_user) {
      return {
        users: users,
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
  getUser: async (payloadData) => {
    let projection = [...UserProjection];
    projection.push("isBlocked");
    let users = await Services.getUser(payloadData, projection);
    if (users) {
      delete users.dataValues["isBlocked"];
      return users;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },

  updateUser: async (payloadData,path) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.number().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
				id:Joi.string().optional(),
				isBlocked: Joi.number().valid(0, 1).optional(),
			    isDeleted: Joi.number().valid(0, 1).optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			console.log("payload data",payload)
			let criteria = {
				id: payload.id
			};
			let objToSave = {};
			// if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.lastName = payload.lastName;
			if (_.has(payload, "isBlocked")) objToSave.isBlocked = payload.isBlocked;

      objToSave.image = path;
			let isUpdated = await Services.updateUsers(criteria, objToSave);
			console.log("isupdated",isUpdated);
			if (isUpdated) {
				
				let projection = [...UserProjection]
				let userData = await Services.getUser(criteria, projection);
				// let data = userData.dataValues;
			
				return userData;
			} else {
				throw Response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
  

  deleteUserDetails: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };

    let deleteData = Services.deleteUserDetails(criteria);
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
};
