/**
 * GeneradoresController
 *
 * @description :: Server-side logic for managing Generadores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Generadores);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Generadores, true);
	},
};

