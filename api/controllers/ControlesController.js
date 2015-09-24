/**
 * ControlesController
 *
 * @description :: Server-side logic for managing controles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ora = sails.config.globals.oracle,
	js2xmlparser = sails.config.globals.js2xmlparser,
	testOrak = sails.config.globals.testOrak;

function toCapitalize(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function toCapitalizeFL(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
}

module.exports = {
	getData: function (req, res, datosBase){
		console.log('============================== DATOS BASE ==============================');
		//console.log(datosBase)
		console.log('============================== INIT REQUEST ==============================');
		var initTime = new Date();
		if(datosBase.errnum > 0) {
			console.log('============================== ERROR ==============================');
			res.json({errnum:datosBase.errnum, errmsg:datosBase.errmsg});
		}
		var total = datosBase.total;
		datosBase = datosBase.data;
		if(!datosBase)
			datosBase = Array();
		//console.log(req.query);
		//console.log(req.body);
		
		var data = req.param('data');
		
		var aggregation = req.param('aggregation');// [{'selRow':'', 'selRows':[]}];//
		//console.log(data);
		console.log(aggregation);
		console.log('filter: ', aggregation['filter']);

		if(req.session['aggregation'] === undefined)
			req.session['aggregation'] = _.defaults({}, {selRow: null, selRows: [], dselRows: [], tipo: 'none', oreder: {}, filter: []});;
		
		var ses_aggr = req.session['aggregation'];
		ses_aggr['filter'] = aggregation['filter'] || [];
		var filtro = ses_aggr['filter'] || [];

		var fil = false;
		if(filtro.length > 0)
			fil = true;

		var jRes = [],
			page = parseInt(data['page']),
			pageSize = parseInt(data['pageSize']),
			datos = [];
		
		if(fil) {
			datos = _.filter(datosBase, function(row) {
				var filOk = false;
				for(var index in filtro) {
					var valor = filtro[index],
						field_filter = '';
					
					console.log(valor['field'])
					//console.log(valor['field'].indexOf('.') == -1)
					if(valor['field'].indexOf('.') == -1)
						field_filter = row[valor['field']].toString();
					else {
						var ffileds = valor['field'].split('.');
						field_filter = row;
						//console.log(ffileds)
						
						for(var fi=0; fi < ffileds.length; fi++) {
							//console.log(ffileds[fi])
							field_filter = field_filter[ffileds[fi]];
						}
						
						field_filter = field_filter.toString();
					}
					
					var query = valor['query'];
					console.log('=== typeof query == object ===');
					console.log(typeof query);
					console.log(typeof query == 'object');
					if(typeof query == 'object') {
						console.log('op: ', query.op);
						try {
							switch(query.op) {
								case '>':
									filOk = parseFloat(field_filter) > parseFloat(query.val);
									break;
								case '<':
									filOk = parseFloat(field_filter) < parseFloat(query.val);
									break;
								case '>=':
									filOk = parseFloat(field_filter) >= parseFloat(query.val);
									break;
								case '<=':
									filOk = parseFloat(field_filter) <= parseFloat(query.val);
								case '=':
									filOk = field_filter == query.val;
									break;
								default:
									filOk = false;
									break;
							}
							console.log(field_filter, ' :: ', query.val, ' :: ', filOk);
						}
						catch(err) {
							console.log('Err: ', err);
							filOk = false;
						}
					}
					else 
						filOk = field_filter.indexOf(query) >= 0;
					if(!filOk)
						break;
				}
				
				return filOk;
			});
		}
		else
			datos = datosBase;
		
		ses_aggr['order'] = aggregation['order'];
		if(ses_aggr['order'] !== undefined && ses_aggr['order']['field'] !== undefined) {
			//console.log('Orden por: ' + ses_aggr['order']['field'] + ' :: ' + ses_aggr['order']['orden']);
			var orden = ses_aggr['order']['orden'];
			if(orden == 1 || orden == -1) {
				datos.sort(function (a, b) {
					if (a[ses_aggr['order']['field']] < b[ses_aggr['order']['field']]) return 1;
					if (b[ses_aggr['order']['field']] < a[ses_aggr['order']['field']]) return -1;
					return 0;
				});
				
				if(orden == -1)
					datos.reverse();
			}      
		}

		if(!datos)
			datos = Array();

		for(var i = 0; i < datos.length; i++) {
			jRes.push(datos[i]);
		}
		
		var tipoSel = 'dselRows',
			tipoDeSel = 'selRows';

		if(aggregation['tipo'] == 'all') {
			tipoSel = 'selRows';
			tipoDeSel = 'dselRows';
		}
		ses_aggr[tipoSel] = [];

		if(aggregation[tipoSel] !== undefined && aggregation[tipoSel].length > 0)
			ses_aggr[tipoDeSel] = _.difference(ses_aggr[tipoDeSel], aggregation[tipoSel]);

		if(aggregation[tipoDeSel] !== undefined && aggregation[tipoDeSel].length > 0) {
			arrDiff = _.difference(aggregation[tipoDeSel], ses_aggr[tipoDeSel]);
			for(var index in arrDiff) {
				var valor = arrDiff[index];
				ses_aggr[tipoDeSel].push(valor);
			}
		}

		ses_aggr['selRow'] = aggregation['selRow'];

		req.session['aggregation'] = ses_aggr;

		aggregation[tipoDeSel] = [];
		aggregation[tipoSel] = [];
		for(var i=0; i<jRes.length; i++) {
			for(var index in ses_aggr[tipoDeSel]) {
				var valor = ses_aggr[tipoDeSel][index];
				if(jRes[i]['idCiudad'] == valor) {
					aggregation[tipoDeSel].push(valor);
				}
			}
		}
		
		var endTime = new Date();
		console.log('============================== SEND RESPONSE:: Tiempo de espuesta: ' + (endTime-initTime) + ' Datos: ' + datos.length + ' - DatosBase: ' + datosBase.length + ' ==============================');
		//console.log(datos);
		res.json({data: jRes, total: total, aggregation: aggregation, session: req.session['aggregation']});
	},
	grid: function(req, res) {
		var model = req.param('model').toLowerCase();

		console.log("======================= busqueda GRID =========================");
		console.log(req.param('model'));

		var modelo = req.param('model'),
			params = _.merge({}, req.params.all(), req.body),
			criteria = {};

		console.log(params);
		console.log(params.aggregation);
		if(params.data.pageSize == -1) {
			var fn = sails.models[model].find();
			var associations = sails.models[model].associations;
			for(var i=0; i<associations.length; i++) {
				fn.populate(associations[i].alias);
			}

			fn.exec(function(err, docs) {
				//console.log(docs);
				sails.controllers.controles.getData(req, res, {data:docs, total:0});
			});
		}
		else {
			sails.models[model].count(function(err, conunt) {
				console.log('count: ', conunt);

				var fn = sails.models[model].find().skip((params.data.page-1)*params.data.pageSize).limit(parseInt(params.data.pageSize, 10));
				var associations = sails.models[model].associations;
				for(var i=0; i<associations.length; i++) {
					fn.populate(associations[i].alias);
				}

				fn.exec(function(err, docs) {
					//console.log(docs);
					sails.controllers.controles.getData(req, res, {data:docs, total:conunt});
				});
			});
		}
	},
	tya: function(req, res) {
		var criteria = _.merge({}, req.params.all(), req.body);

		var model = criteria.model.toLowerCase(),
			query = criteria.query,
			filters = criteria.filters || {},
			where = criteria.where || {},
			sorts = criteria.sorts || {},
			displayKey = criteria.displayKey || {};

		console.log('====')
		console.log(query);
		console.log(filters);
		console.log(where);
		console.log(sorts);
		console.log(model);
		console.log('====')

		var filtroOr = {
			or: [],
		};
		for (var i = 0; i < filters.length; i++) {
			var filter = {};
			filter[filters[i].filter] = {contains:query};
			filtroOr.or.push(filter);
		}

		console.log(filtroOr);
		console.log(model);
		sails.models[model].find()/*.populateAll()*/.where(filtroOr).exec(function(err, docs) {
			console.log('err: ', err);
			if(displayKey != 'dKey')
				for (var i = 0; i < docs.length; i++)
					docs[i].dKey = docs[i][displayKey];
				
			console.log(docs);
			res.json({data:docs});
		});
	},
};

