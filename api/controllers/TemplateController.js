/**
 * TemplateController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var definition = {
	access: {
		idUsuario: {type:'int'}, 
		idPlantel: {type:'int'}, 
		menu: {type:'string'}, 
	}
};


module.exports = {

	/**
	* Action blueprints:
	*    `/template/index`
	*    `/template`
	*/
	index: function (req, res) {
		// Send a JSON response
		return res.json({
			hello: 'world'
		});
	},

	/**
	* Action blueprints:
	*    `/template/find`
	*/
	find: function (req, res)  {
		console.log('-------------------------- begin find template --------------------------');

		var tpl = req.param('id');//.toLowerCase();
		
		var menus = req.session.user.menus;
		//var findMenu = true;
		var findMenu = false;

		// for (var i = 0; i < menus.length; i++) {
		// 	var menu = _.findWhere(menus[i].menus, {pagina:tpl});
		// 	if(menu) {
		// 		findMenu = true;
		// 		break;
		// 	}
		// }

		var params = {
			menu: tpl,
			idUsuario: req.session.user.idUsuario,
			idPlantel: req.session.user.idPlantel,
		};
		console.log(params);

		WsService.wsCustomGetData(definition.access, params, 'GetCtmComprobarMenus', function(data) {
			console.log('GetCtmComprobarMenus: ', data);
			if(data.data.length > 0 && data.data[0] && data.data[0].res == 1)
				findMenu = true;

			console.log('Access: ' + findMenu);

			if(!findMenu) {
				res.contentType('text/html');
				res.send('-1');
			}
			else {
				console.log('id: ' + tpl);
				var url = 'assets/templates/views/' + tpl + '.html';

				console.log('looking for template: ' + url);
				console.log('-------------------------- end find template --------------------------');
				require('fs').readFile(url, function (err, contents) {
					if (err){
						console.log(err);
						res.contentType('text/html');
						res.send('');
					}
					else {
						res.contentType('text/html');
						res.send(contents);
					}
				});
			}
		});
	},

	getTemplate: function(req, res) {
		console.log('get ----------------');

		var tpl = req.param('id'),
		layout = '../assets/templates/views/' + tpl;
		console.log('=============== id: ' + tpl);

		console.log('=====================================');
		console.log(layout);
		console.log('=====================================');
		//res.send(1);
		res.view('layout.ejs', {message: 'Login failed!', layout: layout});
	},

	acess: function(req, res, next) {
		var params = _.merge({}, req.params.all(), req.body);
		console.log(params);

		params.idUsuario = req.session.user.idUsuario;
		params.idPlantel = req.session.user.idPlantel;

		WsService.wsCustomGetData(definition.access, params, 'GetCtmComprobarMenus', function(data) {
			res.json(data);
		});
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to TemplateController)
	*/
	_config: {}

  
};

