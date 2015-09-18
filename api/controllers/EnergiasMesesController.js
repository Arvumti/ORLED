/**
 * EnergiasMesesController
 *
 * @description :: Server-side logic for managing Energiasmeses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, EnergiasMeses);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, EnergiasMeses, true);
	},
};

