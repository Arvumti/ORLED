/**
 * CablesController
 *
 * @description :: Server-side logic for managing Cables
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Cables);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Cables, true);
	},
};

