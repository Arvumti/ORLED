var ViBody = Backbone.View.extend({ 
	el:'body',
	events: {
		'click nav ul.menu-n1 > li > a': 'click_menun1',
		'click nav ul.menu-n2 > li > a': 'click_menun2',
		'click .profile, .wrap-layer': 'click_open_menu',
		'keyup .txtBusqueda': 'keyup_txtBusqueda',
		'click .login': 'click_open_login',
		'click .help': 'click_help',
		'click .btn-login': 'click_login',
		'click .info-plantel': 'click_plantel',
		'click .tituloChat': 'click_chatOpenClose',
		'click .chat-user': 'click_chats',
		'click .closeVentana': 'click_closeChat',
		'click .closetitulo': 'click_closeChatTitulo',
		'click div .inactive': 'click_OpenNewChat',
		'click div .tituloChat-custom label': 'click_ChangeChat',
		'click .chatButonShowHide': 'showHideChatComplete',
		'keyup .chatOpen textarea': 'keyup_message',
		'keyup .buscarChat': 'keyup_search',
	},
	initialize: function() {
		// this.user = null;
		this.txtBusqueda = this.$el.find('.txtBusqueda');		
		this.hojita = this.$el.find('.hojita');		
		// this.infoUser = this.$el.find('section.info-user');

		// this.lblUsuario = this.$el.find('.lblUsuario');
		// this.infoPlantel = this.infoUser.find('.info-plantel');
		// this.infoPeriodo = this.infoUser.find('.info-periodo');
		// this.ventanas=0;

		// this.popLogin = this.$el.find('#popLogin.popLogin');
		// this.popPlanteles = new ViPlantelesUs({parentView:this});

		// this.txtUsuario = this.popLogin.find('.txtUsuario');
		// this.txtPassword = this.popLogin.find('.txtPassword');

		// this.joyrIndex = this.$el.find('.joyride-index');
		// this.ventanaChat=this.$el.find('.chatOpen');
		// this.buscarChat=this.$el.find('.buscarChat');
		// this.messageNotMatch=this.$el.find('.userNotMatch');

		// this.checkLogin();
		// this.gvChat = this.$el.find('.gvChat');
		// this.fullChat = this.$el.find('.chat');
		// this.gvChatExtra = this.$el.find('.chatOpenHide');
		// this.gvChatZone = this.$el.find('.gvChatZone');
		// this.gvNumChat = this.$el.find('.numChat');
		// this.chatOpenHide = this.$el.find('.chatHiddenTitulo');
		// this.tmp_div_chat = Handlebars.compile(this.$el.find('.tmp_div_chat').html());
		// this.tmp_div_chatuser = Handlebars.compile(this.$el.find('.tmp_div_chatuser').html());
		// this.tmp_div_chatuserHide = Handlebars.compile(this.$el.find('.tmp_div_chatuserHide').html());
		// this.tmp_frm_noaccess = Handlebars.compile(this.$el.find('.tmp_frm_noaccess').html());

		// this.$el.find('.date').fdatepicker({format: 'dd-mm-yyyy'});
	},
	/*-------------------------- Base --------------------------*/
	logout: function (argument) {
		window.location.href = '/sesiones/logout';
	},
	login: function(user, pass) {
		var that = this;
		var login = {"user":user || "admin", "pass": pass || "admin"};
		app.ut.request({url:'/sesiones/login', data:login, done:done});

		function done(data) {
			//debugger
			if(data.errmsg && data.errmsg.length > 0) {
				app.ut.message({text:'El usuario y/o la contraseña no son correctos'});
			}
			else {
				that.user = data;
				app.router.navigate('#', {trigger: true, replace: true});
				that.lblUsuario.text(data.usuario);
				that.infoPlantel.text(data.clave + ' - ' + data.nombrePlantel);
				that.render_menu(data);
				that.popLogin.foundation('reveal', 'close');
			}
		}
	},
	getCurrPlantel: function() {
		var plantel = _.findWhere(this.user.planteles, {idPlantel:this.user.idPlantel.toString()});
		return plantel;
	},
	getIdPlantel: function() {
		return this.user.idPlantel;
	},
	checkLogin: function() {
		var that = this;
		
		var elem = this.$el.find('.is-used-user');
		this.user = elem.data('info');
		elem.remove();

		app.ut.request({url:'/sesiones/getUser', done:function(data) {
			if(!data)
				window.location.href = '/sesiones/logout';
			// 	that.render_menu(data)
		}});
	},
	render_menu: function(data) {
		//console.log(data);
		//this.user = data;
		//this.infoPlantel.text(data.clave);
		//this.infoPeriodo.text(data.periodo);
		//$('.lblUsuario').text(data.nombre);
		var ulmenus = Handlebars.compile($('.tmp_ul_menus_bs').html())(data);
		ulmenus = $('ul.menu-n1').html(ulmenus);
		$('ul.search-n1').addClass('isHidden').html(ulmenus.find('.menu-n2 li').clone());

		/*var that = this;
		app.ut.request({url:'/usuarios/Chat', data:{idPlantel:data.idPlantel}, done:done});
		function done(res) {
			if(res.data != 0) {
				that.usersChat(res);
			}			
		}*/
	},
	usersChat: function(data) {
		if(data) {		
			var chat = this.tmp_div_chat({usuarios:data.data});
			this.gvChat.html(chat);
			this.gvChat.append('<div class="chat-user isHidden userNotMatch"><i class="icon-search"></i><label> No existen resultados</label></div>');
			//app.socket.emit('onLogin');
		}
	},
	messageChat: function(data) {
		var chat = this.gvChatZone.find('[data-idusuario="' + data.from + '"]');
		if(chat.length == 0) {
			uschat = this.gvChat.find('[data-idusuario="' + data.from + '"]');
			if(uschat.length == 0)
				return;
			
			uschat.click();

			if(this.gvChatZone.find('.chatOpen').length > 2)
				chat = this.gvChatZone.find('[data-idusuario="' + data.from + '"]')
		}
		
		if(chat.hasClass('tituloChat-custom')) {
			chat.find('label').click();			
		}
		chat = this.gvChatZone.find('[data-idusuario="' + data.from + '"]').parent('.chatOpen').find('.message');

		chat
			.append('<p class="partner"><label class="mensaje">' + data.message + '</label><label class="triangulo"></label></p>')
			.animate({ scrollTop: chat[0].scrollHeight });
	},
	onlineUserChat: function(data) {
		if(data) {
			var that = this;
			for (var i = data.users.length - 1; i >= 0; i--) {
				var item = data.users[i];
				if(item == that.user.idUsuario)
					continue;

				var user = this.gvChat.find('[data-idusuario="' + item + '"]');
				user.find('i.icon-punto').removeClass('offline').addClass('online');
			}
		}
	},
	offlineUserChat: function(idUsuario) {
		var user = this.gvChat.find('[data-idusuario="' + idUsuario + '"]');
		user.find('i.icon-punto').removeClass('online').addClass('offline');
	},
	export: function(options) {
		//<link rel="stylesheet" href="http://localhost:1337/styles/importer.css">
		var clon = options.elem.clone();
		//clon.prepend('<link rel="stylesheet" href="http://localhost:1337/styles/importer.css">');
		/*var elems = clon.find('*');
		for (var i = 0; i < elems.length; i++) {
			//var css = this.css(elems.eq(i));
			var css = elems.eq(i).getStyleObject();
			elems.eq(i).css(css);
		}*/

		var html = clon.html();

		app.ut.request({url:'/impresion/prepare', data:{html:html}, done:done, type:'POST'});

		function done(data) {
            window.open('/impresion/imprimir', 'Documento', 'menubar=No,resizable=No,width=500,height=30');
		}
	},
	print: function(options) {
		this.$el.find('.pnl-print').html(options.elem.html());
		window.print();
	},	
	css: function(a) {
		var sheets = document.styleSheets, o = {};
		for (var i in sheets) {
			var rules = sheets[i].rules || sheets[i].cssRules;
				for (var r in rules) {
					if (a.is(rules[r].selectorText)) {
						o = $.extend(o, this.css2json(rules[r].style), this.css2json(a.attr('style')));
				}
			}
		}
		return o;
	},
	css2json: function(css) {
		var s = {};
		if (!css) return s;
		
		if (css instanceof CSSStyleDeclaration) {
			for (var i in css) {
				if ((css[i]).toLowerCase) {
					s[(css[i]).toLowerCase()] = (css[css[i]]);
				}
			}
		} 
		else if (typeof css == "string") {
			css = css.split("; ");
			for (var i in css) {
				var l = css[i].split(": ");
				s[l[0].toLowerCase()] = (l[1]);
			}
		}

		return s;
	},
	/*-------------------------- Eventos --------------------------*/
	click_plantel: function(e) {
		e.preventDefault();
		this.popPlanteles.render(this.user.planteles);
	},
	resetInput: function() {
		this.buscarChat.val('');
		this.gvChat.find('label').parents('.chat-user').removeClass('isHidden');
		this.gvChat.find('label').parents('.userNotMatch').addClass('isHidden');
	},
	keyup_search: function(e) {
		var elem=this.buscarChat.val();
		if(elem){
			this.gvChat.find('label:not(:contains(' + elem + '))').parents('.chat-user').addClass('isHidden');
			var res=this.gvChat.find('label:contains(' + elem + ')').parents('.chat-user');

			if(res.length==0){
				this.gvChat.find('label').parents('.userNotMatch').removeClass('isHidden');
			}
		}
		else{
			this.gvChat.find('label').parents('.chat-user').removeClass('isHidden');
			this.gvChat.find('label').parents('.userNotMatch').addClass('isHidden');
		}
	},
	keyup_message: function (e) {
		if(e.which == 13) {
			var txa = $(e.currentTarget),
				message = txa.val();
			var idUsuario = txa.parents('.chatOpen').find('.tituloChat').data('idusuario');
			//app.socket.emit('chat_message', {from:this.user.idUsuario, idUsuario:idUsuario, message:message});

			var chat = txa.parents('.chatOpen').find('.message');
			if(message.trim().length>0){
				chat
				.append('<p class="me"><label class="triangulo"></label><label class="mensaje">' + String(message).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '</label></p>')
				.animate({ scrollTop: chat[0].scrollHeight });
				txa.val('');
			}
			txa.val('');
		}
	},
	click_chatOpenClose: function(e) {
		var elem=$(e.currentTarget).parents('div .chatOpen');
		elem.toggleClass("close");
	},
	showHideChatComplete: function(e) {
		var that=this;
		var elem=$(e.currentTarget);
		elem.toggleClass('active');
		that.fullChat.toggleClass('isHidden');
		that.gvChatZone.toggleClass('isHidden');
	},
	click_closeChat: function(e) {
		var that = this;
		var elem = $(e.currentTarget).parents('div .chatOpen');
		var data= $(e.currentTarget).parents('div .tituloChat');
		elem.remove();
		var num_chats = that.chatOpenHide.find('.tituloChat-custom').length;
		that.ventanas--;
		if(num_chats>0){

			if(that.ventanas<3){
				var chatHideToOpen = that.gvChatExtra.find('.tituloChat-custom:first').remove();
				num_chats = that.chatOpenHide.find('.tituloChat-custom').length;
				that.gvNumChat.text('('+ num_chats + ')');
				var idUsuario= chatHideToOpen.data('idusuario');
				var nombre= chatHideToOpen.data('nombre');
				var chat = this.tmp_div_chatuser({idUsuario:idUsuario, nombre:nombre});
				that.ventanas++;
				that.gvChatZone.prepend(chat);
			}
		}
		that.gvNumChat.text('('+ num_chats + ')');
		if(num_chats==0){
			that.gvChatExtra.addClass('isHidden');

		}
	},
	click_closeChatTitulo: function(e) {
		var that = this;
		var elem = $(e.currentTarget).parents('div .tituloChat-custom');
		elem.remove();
		var num_chats = that.chatOpenHide.find('.tituloChat-custom').length;
		that.gvNumChat.text('('+ num_chats + ')');
		//that.chatOpenHide.find('[data-idusuario="' + idUsuario + '"]').length == 0;
		if(num_chats==0){
			that.gvChatExtra.addClass('isHidden');

		}
	},
	click_ChangeChat: function(e) {
		var that=this;
		var chatOpenToHide = that.gvChatZone.find('.tituloChat:first');
		that.gvChatZone.find('.chatOpen:first').remove();
		var idUsuario= chatOpenToHide.data('idusuario');
		var nombre= chatOpenToHide.data('nombre');
		var chat = this.tmp_div_chatuserHide({idUsuario:idUsuario, nombre:nombre});
		that.chatOpenHide.append(chat);


		var chatHideToOpen = $(e.currentTarget).parent('div').remove();
		var idUsuario= chatHideToOpen.data('idusuario');
		var nombre= chatHideToOpen.data('nombre');
		var chat = this.tmp_div_chatuser({idUsuario:idUsuario, nombre:nombre});
		that.gvChatZone.prepend(chat);
	},
	click_OpenNewChat: function(e) {
		var that =this;
		//var userSelected=$(e.currentTarget).toggleClass('inactive');
		var idUsuario= $(e.currentTarget).data('idusuario');
		var nombre= $(e.currentTarget).data('nombre');	
		if(that.gvChatZone.find('[data-idusuario="' + idUsuario + '"]').length == 0 && that.ventanas <3) {
			var chat = this.tmp_div_chatuser({idUsuario:idUsuario, nombre:nombre});
			that.ventanas++;
			that.gvChatZone.prepend(chat);
		}
		else if(that.chatOpenHide.find('[data-idusuario="' + idUsuario + '"]').length == 0 && that.ventanas >2 && that.gvChatZone.find('[data-idusuario="' + idUsuario + '"]').length == 0){
			var chat = this.tmp_div_chatuserHide({idUsuario:idUsuario, nombre:nombre});
			that.chatOpenHide.append(chat);
			var num_chats = that.chatOpenHide.find('.tituloChat-custom').length;
			that.gvNumChat.text('('+ num_chats + ')');
			that.gvChatExtra.removeClass('isHidden');
		}
	},
	click_open_login: function(e) {
		e.preventDefault();
		this.popLogin.foundation('reveal', 'open');
	},
	click_help: function(e) {
		e.preventDefault();
		this.joyrIndex.foundation('joyride', 'start');
	},
	click_login: function(e) {
		this.login(this.txtUsuario.val(), this.txtPassword.val());
	},
	click_menun1: function(e) {
		var elem = $(e.currentTarget).parents('li');

		elem.siblings('li.isActive').removeClass('isActive').children('ul.menu-n2').slideToggle().children('li.isActive').removeClass('isActive');

		if(elem.hasClass('has-submenu')) {
			e.preventDefault();

			if(elem.hasClass('isActive'))
				return;
		}
		
		elem.addClass('isActive').children('ul.menu-n2').slideToggle();
	},
	click_menun2: function(e) {
		var elem = $(e.currentTarget).parents('li');

		elem.siblings('li.isActive').removeClass('isActive');        
		elem.addClass('isActive');
	},
	click_open_menu: function(e) {
		var that=this;

		$('nav, main, .wrap-layer').toggleClass('is-menu-open');
		that.hojita.toggleClass('menuOpen');
		debugger

		if($('nav, main, .wrap-layer').hasClass('is-menu-open')) {
			this.txtBusqueda.val('');
			this.keyup_txtBusqueda({currentTarget:this.txtBusqueda});
		}
	},
	keyup_txtBusqueda: function(e) {
		var busqueda = $(e.currentTarget).val();

		if(busqueda.length > 0) {
			$('ul.menu-n1').addClass('isHidden');
			$('ul.search-n1').removeClass('isHidden');

			var lis = $('ul.search-n1 li:not(:contains("' + busqueda + '"))');

			$('ul.search-n1 li').removeClass('isHidden');
			lis.addClass('isHidden');
		}
		else {
			$('ul.menu-n1').removeClass('isHidden');
			$('ul.search-n1').addClass('isHidden');
		}
	},
});

var ViPlantelesUs = Backbone.View.extend({ 
	el:'#popPlanteles',
	events: {
		'click .blk-grupo': 'click_plantel',
	},
	initialize: function(data) {
		this.plateles = Handlebars.compile($('.tmp_plateles_bs').html());
		this.body = this.$el.find('.modal-body');
	},
	/*-------------------------- Base --------------------------*/
	close: function() {
		this.$el.foundation('reveal', 'close');
	},
	render: function(data) {
		var blk = this.plateles({planteles:data});
		this.body.html(blk);
		this.$el.foundation('reveal', 'open');
	},
	/*-------------------------- Eventos --------------------------*/
	click_plantel: function(e) {
		var id = $(e.currentTarget).data('id');
		var clave = $(e.currentTarget).data('clave');
		var nombrePlantel = $(e.currentTarget).data('nombre');

		var that = this;
		app.ut.request({url:'/sesiones/setPlantel', data:{idPlantel:id, clave:clave, nombrePlantel:nombrePlantel}, done:function(data) {
			that.options.parentView.infoPlantel.text(clave + ' - ' + nombrePlantel);
			that.options.parentView.user = data;
			that.close();
			location.reload();
		}});
	},
});

define([], function () {
	$(document).foundation({
		reveal: {
			close_on_background_click: false,
			multiple_opened: true,
		},
		abide : {
			patterns: {
				curp: /^[a-zA-Z]{4}[0-9]{6}[m|h|M|H][a-zA-Z]{2}[a-zA-Z]{3}[a-zA-Z0-9][0-9]$/,
				decimales: /^[0-9]+(\.[0-9][0-9]?)?$/,
				numeros: /^[0-9]+$/,
				horas: /^[0-9]{2}\:[0-9]{2}$/,
				string: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
				clave: /^[A-Z\d]+$/,
				email: /^[\w\-\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2,3})?$/,
				rfc: /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
			}
		},
	});
	$(document).foundation('reflow');
	
	app.views['main'] = new ViBody();
	////app.loadAsync('municipios');
	/*app.socket = io.connect();

	app.socket.on('connect', function socketConnected() {
		app.views['main'] = new ViBody();

		app.socket.on('onLogin', function messageReceived(user) {
			app.views.main.onlineUserChat(user);
		});

		app.socket.on('onLogout', function messageReceived(data) {
			app.views.main.offlineUserChat(data.idUsuario);
		});

		// Listen for Comet messages from Sails
		app.socket.on('chat_message', function messageReceived(message) {
			///////////////////////////////////////////////////////////
			// Replace the following with your own custom logic
			// to run when a new message arrives from the Sails.js
			// server.
			///////////////////////////////////////////////////////////
			app.views.main.messageChat(message);
			//////////////////////////////////////////////////////

		});

	});*/

	var dateIni = new Date();
	var dateFin = new Date();

	var rango = 15 * 60 * 1000;
	setTimeout(timerIncrement, rango);

	$(document).mousemove(function (e) {
		dateFin = new Date();
	});
	$(document).keypress(function (e) {
		dateFin = new Date();
	});

	function timerIncrement() {
		var dateDiff = dateFin - dateIni;
		console.log('dateDiff: ', dateDiff);
		if(dateDiff == 0) {
			window.location.href = '/sesiones/logout';
			return;
		}

	    dateIni = new Date();
	    dateFin = new Date();
	    setTimeout(timerIncrement, rango);
	}

	window.onbeforeunload = function(e) {
		console.log('logout before');
		//window.location.href = '/sesiones/logout';
		//app.ut.request({url:'/sesiones/logOut'});
	}

	window.onunload = function(e) {
		console.log('logout unload');
		// window.location.href = '/sesiones/logout';
		// app.ut.request({url:'/sesiones/logOut'});
	}
	
	return app;
}); 
