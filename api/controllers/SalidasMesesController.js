/**
 * SalidasMesesController
 *
 * @description :: Server-side logic for managing Salidasmeses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, SalidasMeses);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, SalidasMeses, true);
	},
};

