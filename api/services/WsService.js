/**
 * SaveService
 *
 * @description :: servicio para guardar datos
 * @help        :: See http://links.sailsjs.org/docs/services
 */

var oraconf = sails.config.globals.oracle,
	testOrak = sails.config.globals.testOrak;

module.exports = {
	JSONize: function (str) {
		var tipo = this.toType(str);
		console.log('jsonnize');
		console.log(str);
		console.log(tipo);
		if(tipo == 'object' || tipo == 'array')
			return str;

		var res = str
		// wrap keys without quote with valid double quote
		.replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'})    
		// replacing single quote wrapped ones to double quote 
		.replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"'});

		return JSON.parse(res);
	},
	toCapitalizeFL: function (str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
	},
	codex: function(criteria) {
		var params = {
			'P_XML-CLOB-OUT': '',
			'P_WHERE-VARCHAR2-IN': '',
			'P_SORT-VARCHAR2-IN': '',
		};
		var where = criteria.where;
		console.log(criteria);
		if (where) {
			var wArr = [];
			for(var key in where) {
				console.log(key);
				console.log(where[key]);
				wArr.push("\"" + key + "\" = '" + where[key] + "'");
			}
			params['P_WHERE-VARCHAR2-IN'] = ' WHERE ' + wArr.join(' AND ');
		}

		return params;
	},
	/*
		modelo: ''
		sp_params: {}
		done: fn
	*/
	codexP: function(criteria){
		var params = '';
		var where = criteria.where;
		console.log(criteria);
		if (where) {
			var wArr = [];
			for(var key in where) {
				console.log(key);
				console.log(where[key]);
				wArr.push("\"" + key + "\" = ''" + where[key] + "''");
			}
			params = '&p_where= WHERE ' + wArr.join(' AND ');
		}

		return params;
	},
	wsGetData: function(modelo, psp_params, fn, customp) {
		var sp_params = '';
		console.log('codexP');
		console.log(psp_params);
		
		if(customp)
			sp_params = psp_params;
		else if(psp_params != null)
			sp_params = this.codexP(psp_params);

		var capmod = this.toCapitalizeFL(modelo),
			sp = 'GetWs' + this.toCapitalizeFL(modelo),
			wsUrl = sails.config.ora.get + 'GetSp?p_sp=' + sp + sp_params;
		console.log('=== begin wsUrl ===');
		console.log(wsUrl);
		console.log('=== end wsUrl ===');
		console.log(sp_params);
		console.log(psp_params);

		sails.config.globals.request(wsUrl, function(err, response, body) {
			console.log(err);
			console.log('=== body ===');
			//console.log(body);
			
			var result = sails.config.globals.xml2json.toJson(body, {object:true, sanitize:false});
			
			console.log(err);
			console.log('=== RES ===');
			//console.log(result);
			//console.log(result.ROWSET.ROW.length);
			//console.log(result.ROWSET.ROW);

			var resJson = {
				data: [],
				errnum: 0,
				errmsg: '',
			};

			if(result.ROWSET.ROW.length === undefined) {
				if(result.ROWSET.ROW.errnum) {
					console.log(parseInt(result.ROWSET.ROW.errnum, 10) == -6502);
					if(parseInt(result.ROWSET.ROW.errnum, 10) == -6502) {
						resJson.data = [];
						//console.log(resJson);
					}
					else {
						console.log('============ Error ============');
						console.log(parseInt(result.ROWSET.ROW.errnum, 10));

						resJson.errnum = parseInt(result.ROWSET.ROW.errnum, 10);
						resJson.errmsg = result.ROWSET.ROW.errmsg;
					}
				}
				else
					resJson.data = [result.ROWSET.ROW];
			}
			else
				resJson.data = result.ROWSET.ROW;

			fn(resJson);
		});
	},
	toType: function(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	},
	capitalize: function(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},
	wsGetDataTmp: function(res, modelo) {
		var capmod = modelo.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		console.log('capmod: ' + capmod);
		var args = {
		  //p_params: JSON.stringify({p_where:where}),
		  p_stored: 'Get' + capmod
		};
		soap.createClient(url, function(err, client) {
			client.GetData(args, function(err, result) {
				console.log(err);
				console.log(JSON.parse(result.GetDataResult));

				var arr = JSON.parse(result.GetDataResult)[modelo];
				console.log(arr);

				res.json(arr);
			});
		});
	},
	getPk: function(modelo) {
		var model = sails.models[modelo.toLowerCase()],
			definition = model.definition,
			pk = null;

		/*for(var key in definition) {
			if(key == 'id' || key == 'createdAt' || key == 'updatedAt' || key.indexOf('dKey') != -1)
				continue;

			if(definition[key].primaryKey) {
				pk = key;
				break;
			}
		}*/

		return model.primaryKey;
	},
	getModelData: function(definition, params, tipo) {
		var pk = null,
			sp_params = {};

		console.log(definition);
		if(tipo == 1)
			sp_params['P_OUT-VARCHAR2-OUT'] = '';
		else
			sp_params['P_XML-CLOB-OUT'] = '';

		for(var key in definition) {
			if(key == 'id' || key == 'createdAt' || key == 'updatedAt' || key.indexOf('dKey') != -1)
				continue;

			console.log('=== Params ===');
			console.log(key);
			console.log(params[key]);
			console.log('=== Params ===');
			if(definition[key].primaryKey)
				pk = key;
			
			var type = definition[key].type;
			console.log(type);
			var sp_key = 'P_' + key.toUpperCase() + '-' + this.ConvertType(type).toUpperCase() + '-IN';

			var value = '';
			switch(type) {
				case 'array':
					value = sails.config.globals.js2xmlparser("rows", {row:params[key]});
					break;
				default:
					var value = params[key] === undefined || params[key] == null ? '' : params[key];
					break;
			}
			sp_params[sp_key] = value; 
		}

		return {sp_params:sp_params, pk:pk};
	},
	getModelDataRest: function(definition, params, tipo) {
		var sp_params = [];

		console.log(definition);

		for(var key in definition) {
			if(key == 'id' || key == 'createdAt' || key == 'updatedAt' || key.indexOf('dKey') != -1)
				continue;

			console.log('=== Params ===');
			console.log(key);
			console.log(params[key]);
			console.log('=== Params ===');
			
			var type = definition[key].type;
			console.log(type);
			
			var sp_key = 'p_' + key;

			var value = params[key] === undefined || params[key] == null ? '' : params[key];
			if(type == 'array')
				value = sails.config.globals.js2xmlparser("rows", {row:value});
			else if(type == 'int' && typeof value === 'string')
				value = parseInt(value.replace(/'/g, ''), 10);

			console.log(value);
			sp_params.push(sp_key + '=' + value.toString()); 
		}

		var jres = '';
		if(sp_params.length > 0)
			jres = '?' + sp_params.join('&');

		return jres;
	},
	ConvertType: function(tipo) {
		switch(tipo) {
			case 'int': return 'number';
			case 'integer': return 'number';
			case 'string': return 'varchar2';
			case 'date': return 'varchar2';
			case 'file': return 'varchar2';
			case 'files': return 'varchar2';
			case 'float': return 'number';
			case 'array': return 'clob';
			case 'aun_por_defnir': return 'blob';
			default: return tipo;
		}
	},
	spSaveData: function(params, modelo, crud, fn) {
		var capmod = this.capitalize(modelo);

		params.crud = crud;
		var model = sails.models[modelo.toLowerCase()],
			definition = model.definition;
			
		params.crud = crud;
		definition.crud = {type: 'int'};
		console.log('=== DEFINICION ===');
		console.log(definition);		

		var dataModel = this.getModelData(definition, params, 1);
		var capmod = this.toCapitalizeFL(modelo),
			sp = 'Save' + capmod,
			wsUrl = sails.config.ora.save + sp + '?wsdl';

		console.log('=== BEGIN PRE PARAMS ===');
		console.log(params);
		console.log(dataModel);	
		console.log(wsUrl);
		console.log('=== END PRE PARAMS ===');

		oraconf.soap.createClient(wsUrl, function(err, client) {
			//console.log(err);
			//console.log(client);

			client.setSecurity(new oraconf.soap.BasicAuthSecurity(sails.config.ora.user, sails.config.ora.pass));
			client[sp](dataModel.sp_params, function(err, result) {
				console.log('============== END [spSaveData] ================');
				//console.log(err);
				//console.log(result);
				var errnum = '';
				var errmsg = '';
				if(err) {
					console.log('============== BEGIN ERROR ================');
					errnum = 9600;
					errmsg = err.body;
					console.log('============== END ERROR ================');
				}
				else if(result.P_OUT.indexOf('::ORA-') > -1) {
					var errs = result.P_OUT.split('::');
					errnum = errs[0];
					errmsg = errs[1];
					result = '';
				}

				console.log('=== BEGIN POST PARAMS ===');
				console.log(params);
				console.log(dataModel);
				console.log(wsUrl);
				console.log('=== END POST PARAMS ===');

				fn({result:result, errnum:errnum, errmsg:errmsg, pk:dataModel.pk});
			});
		});
	},
	wsCustomGetData: function(definition, params, sp, fn) {
		var sp_params = this.getModelDataRest(definition, params, 2);
		console.log(sp_params);
		var wsUrl = sails.config.ora.get + sp + sp_params;
		console.log(wsUrl);

		sails.config.globals.request(wsUrl, function(err, response, body) {
			console.log(err);
			//console.log(body);
			
			var result = sails.config.globals.xml2json.toJson(body, {object:true, sanitize:false});     
			
			console.log(err);
			console.log('=== RES ===');
			//console.log(result);
			//console.log(result.ROWSET.ROW.length);
			//console.log(result.ROWSET.ROW);

			var resJson = {
				data: [],
				errnum: 0,
				errmsg: '',
			};

			if(result.ROWSET.ROW.length === undefined) {
				if(result.ROWSET.ROW.errnum) {
					//console.log(parseInt(result.ROWSET.ROW.errnum, 10) == -6502);
					if(parseInt(result.ROWSET.ROW.errnum, 10) == -6502) {
						resJson.data = [];
						//console.log(resJson);
					}
					else {
						console.log('============ Error ============');
						//console.log(parseInt(result.ROWSET.ROW.errnum, 10));

						resJson.errnum = parseInt(result.ROWSET.ROW.errnum, 10);
						resJson.errmsg = result.ROWSET.ROW.errmsg;
					}
				}
				else
					resJson.data = [result.ROWSET.ROW];
			}
			else
				resJson.data = result.ROWSET.ROW;

			fn(resJson);
		});
	},
	spCustomSaveData: function(res, definition, params, sp, files, fn){
		var dataModel = this.getModelData(definition, params, 1);
		console.log(dataModel);

		var wsUrl = sails.config.ora.save + sp + '?wsdl';
		console.log(wsUrl);
		
		oraconf.soap.createClient(wsUrl, function(err, client) {
			//console.log(err);
			//console.log(client);

			client.setSecurity(new oraconf.soap.BasicAuthSecurity(sails.config.ora.user, sails.config.ora.pass));
			client[sp](dataModel.sp_params, function(err, result) {
				console.log('============== RES ================');
				//console.log(err);
				//console.log(result);

				var errnum = '';
				var errmsg = '';
				if(err) {
					console.log('============== BEGIN CTM ERROR ================');
					errnum = 9500;
					errmsg = err.body;
					console.log('============== END CTM ERROR ================');
				}
				else if(result.P_OUT.indexOf('::ORA-') > -1) {
					var errs = result.P_OUT.split('::');
					errnum = errs[0];
					errmsg = errs[1];
					result = '';
				}

				console.log('=== BEGIN POST PARAMS ===');
				console.log(params);
				console.log(dataModel);
				console.log(wsUrl);
				console.log('=== END POST PARAMS ===');

				var data_res = {result:result, errnum:errnum, errmsg:errmsg, files:files};
				if(fn)
					fn(data_res);
				else
					res.json(data_res);
			});
		});
	},
	spSaveDataTmp: function(req, res, modelo, pk, crud, id) {
		var capmod = modelo.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		var params = _.merge({}, req.params.all(), req.body),
			nums = [],
			data = [];

		if(crud == 3)
			params = params.model;

		data.push(new oraconf.conf.OutParam(oraconf.conf.OCCIINT));
		data.push(id);
		for(var key in params) {
			if(key.indexOf('dKey') != -1 || key == 'id' || key == 'crud' || key == pk)
				continue;

			console.log('======================= begin param =======================');
			console.log(key);
			console.log(params[key]);
			console.log('======================= end param =======================');
			data.push(params[key]);
		}
		data.push(crud);


		for (var i = 1; i < data.length + 1; i++)
			nums.push(i);

		var query = 'call "Save' + capmod + '"(:' + nums.join(', :') + ')';

		console.log('======================= query - data =======================');
		console.log(query);
		console.log(data);
		console.log(pk);

		oraconf.exec(query, data, function(results) {
			if(data.crud == 1)
				res.status(201);

			params.id = results.returnParam;
			params[pk] = results.returnParam;

			console.log('======================= params =======================');
			console.log(params);
			res.json(params);
		});
	},
	getParamsWU: function(req, params, modelo) {
		// var definition = sails.models[modelo.toLowerCase()].definition;

		// if(definition.idInstitucion)
		// 	params.idInstitucion = req.session.user.idInstitucion;

		// if(definition.activo)
		// 	params.activo = 1;
	},
};