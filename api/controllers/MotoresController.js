/**
 * MotoresController
 *
 * @description :: Server-side logic for managing Motores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Motores);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Motores, true);
	},
};

