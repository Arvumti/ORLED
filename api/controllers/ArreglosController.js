/**
 * ArreglosController
 *
 * @description :: Server-side logic for managing Arreglos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Arreglos);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Arreglos, true);
	},
};

