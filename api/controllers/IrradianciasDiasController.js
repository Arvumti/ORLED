/**
 * IrradianciasDiasController
 *
 * @description :: Server-side logic for managing Irradianciasdias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, IrradianciasDias);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, IrradianciasDias, true);
	},
	PromedioDia: function (req, res, next) {
		var idLocalidad = req.param('idLocalidad') || 0;
		var query = ' \
			SELECT 	ROUND((enero+febrero+marzo+abril+mayo+junio+julio+agosto+septiembre+octubre+noviembre+diciembre)/12, 3) promedio,  \
					hora \
			FROM IrradianciasDias \
			WHERE hora < 19 \
			AND idLocalidad = ' + idLocalidad;

		IrradianciasDias.query(query, function(err, rows) { 
			res.json(rows);
		});
	},
	meses: function(req, res, next) {
		var idLocalidad = req.param('idLocalidad') || 0;
		var query = ' \
			SELECT 	SUM(ROUND(enero, 2)) enero, SUM(ROUND(febrero, 2)) febrero, SUM(ROUND(marzo, 2)) marzo, 	\
					SUM(ROUND(abril, 2)) abril, SUM(ROUND(mayo, 2)) mayo, SUM(ROUND(junio, 2)) junio, 	\
					SUM(ROUND(julio, 2)) julio, SUM(ROUND(agosto, 2)) agosto, SUM(ROUND(septiembre, 2)) septiembre, 	\
					SUM(ROUND(octubre, 2)) octubre, SUM(ROUND(noviembre, 2)) noviembre, SUM(ROUND(diciembre, 2)) diciembre,	\
					ROUND(SUM(enero+febrero+marzo+abril+mayo+junio+julio+agosto+septiembre+octubre+noviembre+diciembre)/12, 2) promedio,	\
					idLocalidad	\
			FROM irradianciasdias	\
			WHERE idLocalidad = ' + idLocalidad + '	\
			GROUP BY idLocalidad	\
		';

		IrradianciasDias.query(query, function(err, rows) { 
			res.json(rows);
		});
	},
};

