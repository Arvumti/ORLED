/**
 * SalidasDiasController
 *
 * @description :: Server-side logic for managing Salidasdias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, SalidasDias);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, SalidasDias, true);
	},
};

