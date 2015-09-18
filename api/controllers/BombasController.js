/**
 * BombasController
 *
 * @description :: Server-side logic for managing Bombas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Bombas);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Bombas, true);
	},
};

