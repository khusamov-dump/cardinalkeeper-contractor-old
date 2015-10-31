
"use strict";

/* global CardinalKeeper */

/**
 * @class CardinalKeeper.module.contractor.resource.businessman.Index
 */

module.exports = class extends CardinalKeeper.module.resource.Action {
	
	constructor(resource) {
		super(resource, "index");
	}
	
	action(request, response) {
		let me = this;
		
		let offset = Number(request.query.start || 0);
		let limit = Number(request.query.limit || 25);
		
		let sql = {
			count: `select count(*) as total from businessman_view`,
			select: `select * from individual_view offset ${offset} limit ${limit}`
		};
		
		me.database
			.one(sql.count)
			.then(function(data) {
				let total = Number(data.total);
				let promise = me.database
					.query(sql.select)
					.then(function(data) {
						response.send({
							success: true,
							start: offset,
							limit: limit,
							total: total,
							data: data
						});
					});
				return promise;
			})
			.catch(function(error) {
				let message = "Ошибка при запросе списка индивидуальных предпринимателей";
				console.error(message, error);
				response.send({
					success: false,
					message: message,
					error: error
				});
			});
	}
	
};