/**
 * LocalidadesController
 *
 * @description :: Server-side logic for managing Localidades
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Localidades);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Localidades, true);
	},
};

