const Response = require("../config/response");

exports.count = (model, criteria) => {
	return new Promise((resolve, reject) => {
		let where = criteria;
		where.isDeleted = 0;
		model
			.count({
				where: where,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.getSingleRecord = (model, criteria, projection) => {
	console.log(criteria,"baseService");
	return new Promise((resolve, reject) => {
		model
			.findOne({
				where: criteria,
				attributes: projection,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.saveData = (model, objToSave) => {
	return new Promise((resolve, reject) => {
		model
			.create(objToSave)
			.then((result) => {
				console.log("data is saved successfully",result)
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.updateData = (model, criteria, objToSave) => {
	console.log('updateData---=====', model, objToSave,criteria);
	return new Promise((resolve, reject) => {
		model.update(objToSave, { where: criteria})
			.then(result => {
				console.log('updateData---',result)
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.delete = (model, criteria) => {
	return new Promise((resolve, reject) => {
		model
			.destroy({ where: criteria })
			.then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};


// exports.listUsers = (model,criteria, projection, limit, offset) => {
// 	return new Promise((resolve, reject) => {
	
// 		model
// 			.findAndCountAll({
// 				limit,
// 				offset,
// 				where: criteria,
// 				attributes: projection,
// 				// include: [{
// 				// 	model: Models.UserSocialAccounts,
// 				// 	attributes: ["id", "loginType"],
// 				// 	where: whereSocialId,
// 				// 	as: "userSocialAccounts",
// 				// 	required: includeSocialIdModel
// 				// }],
// 				order: order,
// 			}).then(result => {
// 				resolve(result);
// 			}).catch((err) => {
// 				console.log(err);
// 				reject(Response.error_msg.implementationError);
// 			});
// 	});
// };