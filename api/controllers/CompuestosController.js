/**
 * CompuestosController
 *
 * @description :: Server-side logic for managing Compuestos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Compuestos);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Compuestos, true);
	},
};

