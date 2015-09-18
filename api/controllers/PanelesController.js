/**
 * PanelesController
 *
 * @description :: Server-side logic for managing Paneles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Paneles);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Paneles, true);
	},
};

