/**
 * RendimientosController
 *
 * @description :: Server-side logic for managing Rendimientos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Rendimientos);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Rendimientos, true);
	},
};

