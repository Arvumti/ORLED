/**
 * IrradianciasMesesController
 *
 * @description :: Server-side logic for managing Irradianciasmeses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, IrradianciasMeses);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, IrradianciasMeses, true);
	},
};

