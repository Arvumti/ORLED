/**
 * TazonesController
 *
 * @description :: Server-side logic for managing tazones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Tazones);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Tazones, true);
	},
};

