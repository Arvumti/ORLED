/**
 * PaisesController
 *
 * @description :: Server-side logic for managing Paises
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Paises);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Paises, true);
	},
};

