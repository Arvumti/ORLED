/**
 * UsuariosController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		//SaveService.find(req, res, next, Usuarios);
		res.json({ok:1});
	},
	populate: function(req, res, next) {
		//SaveService.find(req, res, next, Usuarios, true);
		res.json({ok:1});
	},
	create: function(req, res, next) {
		res.json({ok:1});
	},
	update: function(req, res, next) {
		res.json({ok:1});
	},
	delete: function(req, res, next) {
		res.json({ok:1});
	},
};

