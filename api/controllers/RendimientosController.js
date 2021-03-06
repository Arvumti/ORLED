/**
 * RendimientosController
 *
 * @description :: Server-side logic for managing Rendimientos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next) {
		SaveService.find(req, res, next, Rendimientos);
	},
	populate: function(req, res, next) {
		SaveService.find(req, res, next, Rendimientos, true);
	},
	eficiencia: function(req, res, next) {
		var idBomba = req.param('idBomba') || 0,
			altura = parseFloat(req.param('altura') || 0) + 0.001;

		console.log('idBomba: ', idBomba, ' altura: ', altura);

		var query = ' \
			SELECT a.bombeo, a.altura, c.eficiencia	\
			FROM	(	\
							SELECT idBomba, bombeo, altura		\
							FROM	(		\
											SELECT idBomba, bombeo, altura		\
											FROM rendimientos		\
											WHERE idBomba = ' + idBomba + '		\
											AND altura <= ' + altura + '	\
											ORDER BY altura DESC		\
											LIMIT 1		\
										) a		\
							UNION ALL		\
							SELECT idBomba, bombeo, altura		\
							FROM	(		\
											SELECT idBomba, bombeo, altura		\
											FROM rendimientos		\
											WHERE idBomba = ' + idBomba + '	\
											AND altura >= ' + altura + '	\
											ORDER BY altura		\
											LIMIT 1		\
										) b	\
						) a	\
			INNER JOIN bombas b	\
			ON a.idBomba = b.idBomba	\
			INNER JOIN eficiencias c	\
			ON b.idTazon = c.idTazon	\
			AND a.bombeo = c.bombeo	\
		';

		Rendimientos.query(query, function(err, rows) { 
			console.log('row: ', rows);

			var yr = altura;
			var xr = 0;

			var x1 = 0, x2 = 0, y1 = 0, y2 = 0, y = 0, m = 0,
				xe1 = 0, xe2 = 0, ye1 = 0, ye2 = 0, ye, me = 0;

			if(rows[0]) {
				y2 = rows[0].altura;
				x2 = rows[0].bombeo;

				ye1 = rows[0].eficiencia;
				xe2 = rows[0].bombeo;
			}
			else
				return res.json({eficiencia:0, gasto:0});

			if(rows[1]) {
				y1 = rows[1].altura;
				x1 = rows[1].bombeo;

				ye2 = rows[1].eficiencia;
				xe1 = rows[1].bombeo;
			}
			else
				return res.json({eficiencia:0, gasto:0});

			m = (y2 - y1) / (x2 - x1);
			xr = ((yr - y1) / m) + x1;

			console.log('m= (', y2, '-', y1, ') / (', x2, '-', x1, ')');
			console.log('m= ', m);
			console.log('xr= ((', yr, '-', y1, ') /', m, ') +', x1);
			console.log('xr= ', xr);

			me = (ye1 - ye2) / (xe2 - xe1);
			ye = ye2 + (me * (xe2 - xr));

			console.log('me= (', ye1, '-', ye2, ') / (', xe2, '-', xe1, ')');
			console.log('me= ', me);
			console.log('ye= ', ye2, '+ (', me, '* (', xe2, '-', xr, '))');
			console.log('ye= ', ye);

			res.json({eficiencia:ye, gasto:xr});
		});
	},
};

