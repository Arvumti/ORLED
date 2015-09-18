/**
 * EnergiasDiasController
 *
 * @description :: Server-side logic for managing Energiasdias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, EnergiasDias);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, EnergiasDias, true);
	},
};

