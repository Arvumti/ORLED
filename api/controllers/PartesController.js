/**
 * PartesController
 *
 * @description :: Server-side logic for managing Partes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Partes);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Partes, true);
	},
};

