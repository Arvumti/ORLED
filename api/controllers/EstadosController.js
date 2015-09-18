/**
 * EstadosController
 *
 * @description :: Server-side logic for managing Estados
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Estados);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Estados, true);
	},
};

