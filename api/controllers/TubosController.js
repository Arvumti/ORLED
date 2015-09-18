/**
 * TubosController
 *
 * @description :: Server-side logic for managing Tubos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Tubos);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Tubos, true);
	},
};

