/**
 * CrudService
 *
 * @description :: servicio para guardar datos
 * @help        :: See http://links.sailsjs.org/docs/services
 */

module.exports = {
    find: function(req, res, next, modelo, populate) {
		var id = req.param('id');
		var idShortCut = isShortcut(id);
		console.log("This is the idShortCut", idShortCut);

		if (idShortCut === true) {
			return next();
		}

		if (id) {
			modelo.findOne(id, function(err, row) {
				if(row === undefined) return res.notFound();
				if (err) return next(err);
				res.json(row);
			});
		} 
		else {
			var where = req.param('where');

			if (_.isString(where)) {
				where = JSON.parse(where);
			}

			var options = {};
			if(req.param('limit'))
				options.limit = req.param('limit');
			if(req.param('skip'))
				options.skip = req.param('skip');
			if(req.param('sort'))
				options.sort = req.param('sort');
			if(where)
				options.where = where;

			console.log("This is the options", options);

			var find = modelo.find(options);
			if(populate) {
				find.populateAll();
			}
					  
			find.exec(function(err, row) {
				//if(row === undefined) return res.notFound();
				//if (err) return next(err);
				//console.log(err, row);
				res.json(row);
			});
		}

		function isShortcut(id) {
			if (id === 'find'   ||  id === 'update' ||  id === 'create' ||  id === 'destroy') {
				return true;
			}
		}
	},

	create: function(req, res, next, modelo) {
		console.log('==== create ====');
	    var params = req.params.all();
	    console.log(params);

	    console.log('============ BEGIN GET PARAMS TO US NML =============');
		if(params)
			for(var key in params) {
				console.log(params[key]);
				if(params[key] && params[key].to && params[key].to == 'u') {
					params[key] = req.session.user[key];
				}
			}
		console.log('============ END GET PARAMS TO US NML =============');

		WsService.getParamsWU(req, params, modelo);
		WsService.spSaveData(params, modelo, 1, function(data) {
			console.log('data');
			console.log(data);
			if(data.errmsg.length > 0)
				res.json({errnum:data.errnum, errmsg:data.errmsg});
			else {
				res.status(201);

				params.id = data.result.P_OUT;
				params[data.pk] = data.result.P_OUT;

				console.log('======================= params =======================');
				console.log(params);
				res.json(params);
			}
		});
	},
    
	update: function (req, res, next, modelo) {
		console.log('==== update ====');
        var criteria = {};
        criteria = _.merge({}, req.params.all(), req.body);
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

	    console.log(criteria);
	    console.log('============ BEGIN GET PARAMS TO US NML =============');
		if(criteria)
			for(var key in criteria) {
				console.log(key + ' :: ' + criteria[key]);
				if(criteria[key] && criteria[key].to && criteria[key].to == 'u') {
					criteria[key] = req.session.user[key];
				}
			}
		console.log('============ END GET PARAMS TO US NML =============');

    	WsService.getParamsWU(req, criteria, modelo);
		criteria[WsService.getPk(modelo)] = id;

        console.log('======================= criteria =======================');
        console.log(criteria);

		WsService.spSaveData(criteria, modelo, 2, function(data) {
			console.log('======================= params =======================');
			console.log(criteria);
			res.json(criteria);
		});
    },
    
    destroy: function (req, res, next, modelo) {
    	console.log('==== destroy ====');
        var id = req.param('id'),
        	criteria = _.merge({}, req.params.all(), req.body).model;

        console.log('criteria');
        console.log(criteria);

        console.log('============ BEGIN GET PARAMS TO US NML =============');
		if(criteria)
			for(var key in criteria) {
				console.log(criteria[key]);
				if(criteria[key] && criteria[key].to && criteria[key].to == 'u') {
					criteria[key] = req.session.user[key];
				}
			}
		console.log('============ END GET PARAMS TO US NML =============');

        if (!id) {
            return res.badRequest('No id provided.');
        }

		WsService.getParamsWU(req, criteria, modelo);
        criteria[WsService.getPk(modelo)] = id;

        console.log('======================= criteria =======================');
		console.log(criteria);

		WsService.spSaveData(criteria, modelo, 3, function(data) {
			console.log('======================= params =======================');
			console.log(criteria);
			res.json(criteria);
		});
    },
};