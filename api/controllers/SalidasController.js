/**
 * SalidasController
 *
 * @description :: Server-side logic for managing Salidas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Salidas);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Salidas, true);
	},
};

