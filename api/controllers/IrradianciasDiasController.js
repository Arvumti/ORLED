/**
 * IrradianciasDiasController
 *
 * @description :: Server-side logic for managing Irradianciasdias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	PromedioDia: function (req, res, next) {
		var idLocalidad = req.param('idLocalidad') || 0;
		var query = ' \
			SELECT 	ROUND((enero+febrero+marzo+abril+mayo+junio+julio+agosto+septiembre+octubre+noviembre+diciembre)/12, 3) promedio,  \
					hora \
			FROM IrradianciasDias \
			WHERE idLocalidad = ' + idLocalidad;

		IrradianciasDias.query(query, function(err, rows) { 
			res.json(rows);
		});
	}
};

