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
		console.log(datosBase)
		console.log('============================== INIT REQUEST ==============================');
		var initTime = new Date();
		if(datosBase.errnum > 0 || datosBase.errnum < 0) {
			console.log('============================== ERROR ==============================');
			res.json({data:null, errnum:datosBase.errnum, errmsg:datosBase.errmsg, proc:datosBase.proc});
			return;
		}
		datosBase = datosBase.data;
		//console.log(req.query);
		//console.log(req.body);
		
		var data = req.param('data');
		
		var aggregation = req.param('aggregation');// [{'selRow':'', 'selRows':[]}];//
		//console.log(data);
		console.log(aggregation);

		if(req.session['aggregation'] === undefined)
			req.session['aggregation'] = _.defaults({}, {selRow: null, selRows: [], dselRows: [], tipo: 'none', oreder: {}, filter: []});;
		
		var ses_aggr = req.session['aggregation'];
		ses_aggr['filter'] = aggregation['filter'] || [];
		var filtro = ses_aggr['filter'] || [];

		var fil = false;
		// if(filtro.length > 0)
		// 	fil = true;

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
					
					//console.log(valor['field'])
					//console.log(valor['field'].indexOf('.') == -1)
					if(valor['field'].indexOf('.') == -1)
						field_filter = row[valor['field']].toString();
					else {
						var ffileds = valor['field'].split('.');
						field_filter = row;
						//console.log(ffileds)
						
						for(var fi=0; fi < ffileds.length ;fi++) {
							//console.log(ffileds[fi])
							field_filter = field_filter[ffileds[fi]];
						}
						
						field_filter = field_filter.toString();
					}
					
					filOk = field_filter.indexOf(valor['query']) >= 0;
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
		
		for(var i = (page-1)*pageSize; i < (((page-1)*pageSize)+pageSize) && i < datos.length; i++) {
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
		res.json({data: jRes, total: datos.length, aggregation: aggregation, session: req.session['aggregation']});
	},
	grid: function(req, res) {
		var model = req.param('model');

		console.log("======================= busqueda GRID =========================");
		console.log(req.param('model'));

		var modelo = req.param('model'),
			params = _.merge({}, req.params.all(), req.body),
			criteria = {};

		console.log(params);
		console.log('================ has user =====================');
		var specials = {};
		if(params.aggregation.specials) {
			console.log(params.aggregation.specials[0])
			for (var i = 0; i < params.aggregation.specials.length; i++) {
				var agsp = params.aggregation.specials[i];
				if(agsp.to == 'u'/* && req.session.user.tipo != 7*/)
					specials[agsp.field] = req.session.user[agsp.field];
				else
					specials[agsp.field] = agsp.value;
			}
		}

		console.log("======================= especiales =========================");
		console.log(specials);

		criteria.where = _.defaults({}, specials);
		WsService.getParamsWU(req, criteria.where, modelo, 'grid');

		if(criteria.where)
			criteria.where = WsService.JSONize(criteria.where);
		else
			criteria = null;

		var filtroOr = [];
		var filtroAnd = [];
		var orderby = [];
		var likeArr = [];
		var like = '';
		var sort = '';

		for (var key in criteria.where)
			filtroAnd.push("\"" + key + "\" = '" + criteria.where[key] + "'");

		console.log('================ Order by =====================');
		if(params.aggregation.order && params.aggregation.order.orden != 0) {
			var order = '';

			if(params.aggregation.order.orden == -1)
				order = 'DESC';

			orderby.push("\"" + params.aggregation.order.field + "\" " + order);
		}

		if(params.aggregation.filter)
			for (var i = 0; i < params.aggregation.filter.length; i++) {
				var row = params.aggregation.filter[i];
				filtroOr.push("UPPER(\"" + row.field + "\") LIKE UPPER('%" + row.query + "%')");
			}

		if(filtroOr.length > 0)
			likeArr.push(filtroOr.join(' OR '));
		if(filtroAnd.length > 0)
			likeArr.push(filtroAnd.join(' AND '));

		var params = {
			'P_XML-XMLTYPE-OUT': '',
			'P_WHERE-VARCHAR2-IN': '',
			'P_SORT-VARCHAR2-IN': '',
		};

		console.log('likeArr: ', likeArr);
		if(likeArr.length > 0)
			params['P_WHERE-VARCHAR2-IN'] = ' WHERE ' + likeArr.join(' AND ');

		if(orderby.length > 0)
			params['P_SORT-VARCHAR2-IN'] = ' ORDER BY ' + orderby.join(', ');

		console.log('================ Like =====================');
		console.log(like);
		console.log(sort);

		console.log('================ Criteria =====================');
		console.log(criteria);

		WsService.wsGetData(model, params, function(data) {
			console.log(data);
			sails.controllers.controles.getData(req, res, data);
		}, true);
	},
	tya: function(req, res) {
		var model = req.param('model'),
			query = req.param('query'),
			def = req.param('def'),
			filters = JSON.parse(JSON.stringify(req.param('filters'))),
			where = JSON.parse(JSON.stringify(req.param('where'))),
			sorts = JSON.parse(JSON.stringify(req.param('sorts'))),
			custom = req.param('custom') || '',
			displayKey = JSON.parse(JSON.stringify(req.param('displayKey')));

		console.log('====')
		console.log(query);
		console.log(filters);
		console.log(def);
		console.log(model.toLowerCase());
		console.log(where);
		console.log(custom);
		console.log(sorts);
		console.log('====')

		if(testOrak) {
			if(custom) {
				var definition = sails.controllers[model.toLowerCase()].getDefinicion(def);
				var params = {};
				for (var i = 0; i < where.length; i++)
					params[where[i].field] = where[i].value;

				params.idUsuario = req.session.user.idUsuario;
				params.idPlantel = req.session.user.idPlantel;

				WsService.wsCustomGetData(definition, params, custom, function(data) {
					res.json(data);
				});
			}
			else {
				var xml = js2xmlparser("filters", {filters:filters});
				//console.log(xml);

				/*var where = '', sort = '';
				ora.exec('call "Get' + toCapitalize(model) + '"(:1, :2, :3)', [new ora.conf.OutParam(ora.conf.OCCICURSOR), where, sort], function(results) {
					res.json(results.returnParam);
				});*/
				var filtroOr = [],
					filtroAnd = [],
					orderby = [];

				if(filters.length > 0) {
					for (var i = 0; i < filters.length; i++)
						filtroOr.push("UPPER(\"" + filters[i].filter + "\") LIKE UPPER('%" + query + "%')");

					filtroOr[0] = '( ' + filtroOr[0];
					filtroOr[filtroOr.length - 1] += ' )';
				}

				for (var i = 0; i < where.length; i++) {
					var val_where = where[i].value;
					if(where[i].to == 'u')
						val_where = req.session.user[where[i].field];
					
					filtroAnd.push("\"" + where[i].field + "\" = '" + val_where + "'");
				}

				for (var i = 0; i < sorts.length; i++) {
					var order = '';

					if(sorts[i].order == -1)
						order = 'DESC';

					orderby.push("\"" + sorts[i].field + "\" " + order);
				}

				var like = '',
					sort = '',
					whereIns = '',
					whereAct = '';

				var params = {
					'P_XML-XMLTYPE-OUT': '',
					'P_WHERE-VARCHAR2-IN': '',
					'P_SORT-VARCHAR2-IN': '',
				};

				if(orderby.length > 0)
					params['P_SORT-VARCHAR2-IN'] = ' ORDER BY ' + orderby.join(', ')

				var definition = sails.models[model.toLowerCase()].definition;

				if(definition.idInstitucion)
					filtroAnd.push('\"idInstitucion\" = ' + req.session.user.idInstitucion);

				if(definition.activo)
					filtroAnd.push('\"activo\" = 1');

				var likeArr = Array();
				if(filtroOr.length > 0)
					likeArr.push(filtroOr.join(' OR '));

				if(filtroAnd.length > 0)
					likeArr.push(filtroAnd.join(' AND '));
				
				if(filtroOr.length > 0 || filtroAnd.length > 0)
					params['P_WHERE-VARCHAR2-IN'] = ' WHERE ' + likeArr.join(' AND ');

				//console.log('likeArr: ', filtroAnd);

				console.log('=== begin like & sort ===');
				console.log(like);
				console.log(sort);
				console.log('=== end like & sort ===');
				WsService.wsGetData(model, params, function(data) {
					res.json(data);
				}, true);
			}			
		}
		else {
			model = req.param('model').toLowerCase();
			var filtroOr = {
				or: [],
			};
			for (var i = 0; i < filters.length; i++) {
				var xxx = {};
				xxx[filters[i].filter] = {contains:query};
				filtroOr.or.push(xxx);
			};
			console.log(filtroOr);
			sails.models[model].find().where(filtroOr).exec(function(err, docs) {
				for (var i = 0; i < docs.length; i++) {
					docs[i].dKey = docs[i][displayKey];
				}
				console.log(docs);
				res.json(docs);
			});
		}
	},
};

