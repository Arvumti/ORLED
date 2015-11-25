var bust = (new Date()).getTime(),//'150905';//
	load_content = null,
	url_imgs = 'images/db_imgs/',
	url_assets = 'images/';

function readURL(input, image) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			if(e.total > 60000)
				app.ut.message({text:'La imagen no puede ser mayor a 60 KB' ,tipo:'warning',});
			else
				image.data('old', 'old').attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function fueraDeServicio() {
	app.ut.message({text:'El sistema esta siendo actualizado, puede que algunas areas del sistema esten fallando.' ,tipo:'warning',});
}

function bases(){
	jQuery.expr[':'].contains = function(a, i, m) {
		var query = m[3] === undefined ? '' : m[3];
		return jQuery(a).text().toUpperCase().indexOf(query.toUpperCase()) >= 0;
	};

	jQuery.fn.extend({
		doFocus: function() {
			var that = this;
			setTimeout(function() { 
				that.focus();
			}, 1000);
		}
	});
	
	if (typeof Number.prototype.getDecimals != 'function') {
		// see below for better implementation!
		Number.prototype.round = function (value){
			var num = this || 0,
				decimales = value || 0;
		
			var tmp = this.toString().split('.');
			var p1 = tmp[0],
				p2 = '';
			if(tmp[1] && decimales > 0)
				p2 = '.' + tmp[1].substr(0, decimales);
		
			return parseFloat(p1 + p2);
		};
	}
	
	if (typeof String.prototype.startsWith != 'function') {
		// see below for better implementation!
		String.prototype.startsWith = function (str){
			return this.indexOf(str) == 0;
		};
	}
	
	if (typeof Number.prototype.round != 'function') {
		// see below for better implementation!
		Number.prototype.round = function (value){
			var num = this || 0,
				decimales = '1',
				tope = value || 0;
			for (var i = 0; i < tope; i++)
				decimales += '0';
			decimales = parseInt(decimales);
		
			return Math.round(parseFloat(num) * decimales) / decimales;
		};
	}

	if (typeof String.prototype.toFloat != 'function') {
		// see below for better implementation!
		String.prototype.toFloat = function (value){
			var val = parseFloat(this);
			return val || value || 0;
		};
	}
	
	if (typeof String.prototype.toInt != 'function') {
		// see below for better implementation!
		String.prototype.toInt = function (value){
			var val = parseInt(this);
			return val || value || 0;
		};
	}
	
	if (typeof String.prototype.toShortDate != 'function') {
		// see below for better implementation!
		String.prototype.toShortDate = function () {
			var fecha = new Date(this.toString() + 'T06:00:00'),
				anio = fecha.getFullYear(),
				mes = fecha.getMonth()+1,
				dia = fecha.getDate();        
			dia = dia.toString().length == 1 ? '0' + dia : dia;
			mes = mes.toString().length == 1 ? '0' + mes : mes;
			
			return dia + '-' + mes + '-' + anio;
		};
	}

	if (typeof Date.prototype.toShortDate != 'function') {
		// see below for better implementation!
		Date.prototype.toShortDate = function () {            
			return this.toString().toShortDate();
		};
	}
}

function utilerias() {
	var __loading = $('.loading'),
		__isLoading = false,
		__petXHR = 0,
		__foreverLoad = false;

	function _WatchLoad() {
		__petXHR--;
		if(__petXHR <= 0) {
			__petXHR = 0;
			Hide();
		}
	}
	
	return {
		alerta  	: Alerta,
		confirm 	: Confirm,
		datediff	: DateMeasure,
		get     	: Get,
		getJson 	: GetJson,
		hide    	: Hide,
		handleErr 	: HandleError,
		logging		: logging,
		meses   	: GetMeses(),
		message 	: Message,
		print   	: Print,
		request 	: Request,
		search  	: Search,
		show    	: Show,
		stringToCss	: StringToCss,
		toWords 	: ToWords,
		tyAhead 	: Typeahead,
		upload		: Upload,
		uploadRemote: UploadRemote,
	};

	function logging(json) {
		try {
			var tipo_proc = json.tipo_proc || 'error';

			if(json.info == null)
				json.info = Object();

			var user = Object();
			if(app.views.main !== undefined)
				user = _.pick(app.views.main.user, 'clave', 'idPlantel', 'idUsuario', 'nombre', 'tipo', 'usuario');

	        var jErr = {
	            errmsg:json.info.errmsg,
	            errnum:json.info.errnum,
	            user:user,
	            url:json.url,
	            hash:window.location.hash,
	            data:json.info.data,
	            proc:json.info.proc,
	            tipo:json.tipo,
	            xhrErr:json.xhr ? json.xhr.statusText : '',
	        };

			Rollbar[tipo_proc](jErr);
		}
		catch(ex) {}
	}

	function StringToCss(css) {
		var subCss = css.split('}');
		var jCss = Object();

		for (var i = 0; i < subCss.length; i++) {
			if(subCss[i].length == 0)
				continue;

			var keyvalue = subCss[i].split('{');
			if(keyvalue.length == 2)
				jCss[keyvalue[0].trim()] = '-webkit-print-color-adjust: exact;' + keyvalue[1].replace(/\s/gi, "");
		}

		// var index = css.indexOf('}');
		// var tmpCss = css;
		// var newCss = '';
		// var arrCss = Array();

		// while(index >= 0) {
		// 	var cssx = tmpCss.substr(0, index + 1);
		// 	arrCss.push(cssx);

		// 	newCss += '.pnl-preview ' + cssx;
		// 	tmpCss = tmpCss.substr(index + 1);

		// 	index = tmpCss.indexOf('}');
		// }

		// var jqHtml = $('<div>' + template(json) + '</div>');

		// var jCss = app.ut.stringToCss(arrCss);

		// var arr = Array();

		// var output = {};
		// for(var k in arr)
		// {
		// 	var value = arr[k].replace(/\s/gi, ""), key, tag;
		// 	// Get key
		// 	value.replace(/(\.|#)*([a-z0-9\s]+){/gi, function($1, $2, $3){
		// 		tag = ($2 || '') + $3.trim();
		// 		key = $3.trim();
		// 	});
		// 	// Make object
		// 	output[key] = {
		// 		tag: tag,
		// 		css: Object(),
		// 	};

		// 	// Replace First part
		// 	value = value.replace(/(\.|#)*([a-z0-9\s]+){/gi, "");
		// 	value = value.replace("}", "");

		// 	output[key].css = '-webkit-print-color-adjust: exact;' + value;

		// 	// value.replace(/([a-z\-]+)([^:]+)?:([^0-9a-z]+)?([^;]+)/g, function($1, $2, $3, $4, $5){             
		// 	// 	output[key].css[$2] = $5;
		// 	// });
		// }

		return jCss;
	}

	function UploadRemote(options) {
		var _idPk = options.idPk,
			_elem = options.elem,
			_xpath = options.xpath,
			_custom = options.custom == true ? 1 : 0,
			_done = options.done || done,
			_auto = options.auto || false,
			_type = options.type || 'image';

		function done(data) {
			console.log(data);
		}
		var _field = _elem.data('upField');

		var template = app.templates.upload({field: _field, type: _type});
		_elem.html(template);

		var _img = _elem.find('img'),
			_remote = _elem.find('input[type="file"]');

		var accept = _type;
		_img.attr('src', url_assets + 'file.png');

		switch(options.type) {
			case 'excel':
				accept = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
				break;
			case 'text':
				accept = '.txt';
				break;
			default:
				accept = 'image/*';
				_img.attr('src', url_assets + 'usuario_annon.jpg');
				break;
		}
		_remote.attr('accept', accept);

		if(_auto)
			_img.off('click').on('click', function(e) {
				e.stopPropagation();
				_remote.click();
			});

		_remote.off('click').on('click', function(e) {
			e.stopPropagation();
		});

		_remote.off('change').on('change', function(){
			var tmppath = URL.createObjectURL(this.files[0]);

			var idPk = 0;
			if(typeof _idPk === 'function')
				idPk = _idPk();
			else
				idPk = _idPk;

			var url = '/configuraciones/upload/' + _xpath + idPk + '/' + _custom;
			var clone = _remote.clone(true);
			var form = $('<form enctype="multipart/form-data"></form>').append(_remote);
			jData = new FormData(form[0]);

			_remote = clone;

			var xhr = null;
			xhr = $.ajax({
				url: url,  //Server script to process data
				type: 'POST',
				data: jData,
				success: function(data) {
					if(_type == 'image')
						_img.attr('src', tmppath);
					else
						app.ut.message({text:'Archivo subido correctamente.',tipo:'success',});
					_done(data);
				},
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false
			});

			xhr.always(function() {
				//_remote[0].reset();
			});
		});

		function upload(url) {
			_remote.click();
		}

		function setUrl(url) {
			if(url)
				_img.attr('src', url_imgs + url);
		}

		var _fn = {
			upload: upload,
			setUrl: setUrl,
		};

		_elem.data('fn', _fn);
	}

	function Upload(options) {
		var _elem = options.elem,
			_field = _elem.data('field');

		var upload = app.templates.upload({field:_field});
		_elem.html(upload);

		var _img = _elem.find('img'),
			_file = _elem.find('input[type="file"]');

		_file.on('change', function(){
			//var tmppath = URL.createObjectURL(this.files[0]);
			readURL(this, _img);
		});

		function updateUrl(data) {
			
			var ulr = data[_field];
			if(ulr)
				_img.data('old', '');
		}

		function clean() {
			_img.attr('src', '').data('old', '');
		}

		function getUrl() {
			return _img.data('old');
		}

		function setUrl(url) {
			if(!_img.data('old'))
				_img.data('old', _img.attr('src'));

			_img.attr('src', url_imgs + url);
		}

		var _fn = {
			clean: clean,
			getUrl: getUrl,
			setUrl: setUrl,
			updateUrl: updateUrl,
		};

		_elem.data('fn', _fn);
	}

	function HandleError(data, alert) {
		var _alert = alert == null ? true : alert;
		var tipo = 'alert';
		if(data.errmsg && data.errmsg.length > 0) {
			try {
				if(Rollbar) {
					logging({info:data, tipo:'handleErr', url:app.currView.url});
				}
			}
			catch(ex) {}

			var _inErr = '';
			switch(data.errmsg) {
				case 'ORA-01403: no data found':
					_inErr = 'No hay datos que mostrar';
					tipo = 'primary';
					break;
				default:
					_inErr = data.errmsg;
					break;
			}
		
			app.ut.message({text:_inErr, tipo:tipo});
            return false;
		}
        
        if(!alert)
        	app.ut.message({text:'Registro guardado correctamente', tipo:'success'});
        return true;
	}
	
	function Request(options) {
		var url = options.url,
			type = options.type || 'GET',
			data = options.data || {},
			done = options.done || fnDone,
			err = options.err || fnErr,
			dataType = options.dataType || 'json',
			loading = options.loading || false,
			async = options.async === undefined ? true : options.async,
			form = options.form || null;

		if (loading) {
			__foreverLoad = true;
			Show();
		}
		else if(!__foreverLoad) {
			__petXHR++;
			if(!__isLoading)
				Show();
		}

        var jInfoData = data;

		var contentType = 'application/json';
		var jData = null;
		if(form) {
			jData = new FormData(form[0]);
	        jData.append("data", JSON.stringify(data));
	        contentType = false;
		}
		else
			jData = JSON.stringify(data);

		var xhr = null;
		if(type == 'GET')
			xhr = $.get(url, data);
		else
			xhr = $.ajax({
				async: async,
				url: url,  //Server script to process data
				type: type,
				data: jData,
				//Options to tell jQuery not to process data or worry about content-type.
				dataType: dataType,
				cache: false,
				contentType: contentType,//'application/json',
				processData: false
			});

		xhr.done(fnNext).fail(err).always(always);

		function fnNext(data) {
			try {
				if(Rollbar && data.errmsg && data.errmsg.length > 0) {
					data.data = jInfoData;
					logging({info:data, tipo:'ajax', url:app.currView.url});
				}
			}
			catch(ex) {}
			done(data);
		}

		function fnDone(data){
			console.log(data);
		}

		function fnErr(xhr, err, x) {
			try {
				if(Rollbar && data.errmsg && data.errmsg.length > 0) {
					data.data = jInfoData;
					logging({info:data, tipo:'ajax', url:app.currView.url});
				}
			}
			catch(ex) {}
			console.log(xhr);
			fueraDeServicio();
		}

		function always(){
			console.log('finish');
			if(!__foreverLoad)
				_WatchLoad();
		}
	}

	/*
	 * p_url        : url a la cual se va a hacer la peticion
	 * p_data       : objeto tipo JSON que contiene la informacion a mandas
	 * p_done       : funcion que se ejecutara si todo sale bien
	 * p_err        : funcion que se ejecutara si ocurrio algun error
	 * p_type       : tipo de dato que se espera recibir [json, html, text]
	 * p_loading    : true/false para activar o no el loading panel
	 */
	function post(p_params) {
		var url = p_params.url || '/',
			done = p_params.done || fnDone,
			err = p_params.err || fnErr,
			type = p_params.type || 'text',
			data = p_params.data || {},
			loading = p_params.loading === undefined ? true : p_params.loading;
			_ajax = p_params.get ? $.get : $.post;

		if (loading)
			show();
		_ajax(url, data).done(fnNext).fail(err);

		function fnNext(data){
			var cbkData = data;

			switch(type) {
				case 'json':
					console.log(data);
					cbkData = data.length == 0 ? {res:-1} : JSON.parse(data);
					break;
				default://text
					cbkData = data;
					break;
			}

			done(cbkData, hide);

			if (loading)
				hide();
		}

		function fnDone(data, fnHide){
			console.log(data);
			fnHide();
		}

		function fnErr(xhr, err, x){
			console.log(xhr);
			if (loading)
				hide();
		}
	}

	function hide() {
		__petXHR = 0;
		__foreverLoad = false;
		$('#loading').fadeOut(function(){
			$(this).addClass('isHidden')
		});
	}

	// { header, body, dataID, fnA, fnC }
	function Message (json) {
		
		var message = json.text || '',
			auto_close = json.auto_close === undefined ? false : json.auto_close,
			time = json.time || 2000,
			tipo = json.tipo || 'alert',
		alerta = $(app.templates.alerta({texto:message, tipo:tipo}));

		$.fx.speeds.slow = time;
		
		$('.pnlAlert').prepend(alerta).foundation();

		if(auto_close)
			alerta.fadeOut('slow', function() {
				alerta.find('.close').click();
			});
	}

	// { header, body, dataID, fnA, fnC }
	function MessagePop (json) {
		var modal = json.el || $('#popAdvertencia')
			texto = json.text || '';

		modal.find('.mensaje').text(texto);

		modal.find('.btn-aceptar').off('click').on('click', fnDone);

		modal.foundation('reveal', 'open');

		function fnDone() {
			modal.foundation('reveal', 'close');
		}
	}

	// { header, body, dataID, done, cancel }
	function Confirm (json) {
		var modal = json.el || $('#popConfirmacion'),
			validacion = false,
			valores = json || {},
			header = valores.header || 'Confirmar',
			body = valores.body || '/',
			dataID = valores.dataID || 0;

		modal.data('close', true);
		modal.find('.pop-head label').text(header);
		modal.find('.pop-body').html(body);

		modal.find('.btn-aceptar').removeData().data('idKey', dataID).off('click').on('click', fnDone);
		modal.find('.btn-cancelar').off('click').on('click', fnHide);
		modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
			modal.off('close');
			if(valores.done && typeof valores.done === "function")
				valores.done(modal);
			
			if(modal.data('close'))
				modal.foundation('reveal', 'close');
		}

		function fnHide(e) {            
			if(valores.cancel && typeof valores.cancel === "function") {
				valores.cancel();
				modal.off('close');
			}
			if(e.type != 'close')
				modal.foundation('reveal', 'close');
		}
	}
	
	function DateMeasure(ms) {
		var d, h, m, s;
		s = Math.floor(ms / 1000);
		m = Math.floor(s / 60);
		s = s % 60;
		h = Math.floor(m / 60);
		m = m % 60;
		d = Math.floor(h / 24);
		h = h % 24;

		this.days = d;
		this.hours = h;
		this.minutes = m;
		this.seconds = s;
	}
	
	/*
	 * p_url        : url a la cual se va a hacer la peticion
	 * p_data       : objeto tipo JSON que contiene la informacion a mandas
	 * p_done       : funcion que se ejecutara si todo sale bien
	 * p_err        : funcion que se ejecutara si ocurrio algun error
	 * p_type       : tipo de dato que se espera recibir [json, html, text]
	 * p_loading    : true/false para activar o no el loading panel
	 */
	function Get(p_params) {
		var url = p_params.url || '/PVenta',
			done = p_params.done || fnDone,
			err = p_params.err || fnErr,
			type = p_params.type || 'text',
			data = p_params.data || {},
			loading = p_params.loading === undefined ? true : p_params.loading;

		if (loading)
			show();
		$.get(url, data, type).done(fnNext).fail(err);

		function fnNext(data){
			done(data, hide);
		}

		function fnDone(data, fnHide){
			console.log(data);
			fnHide();
		}

		function fnErr(xhr, err, x){
			console.log(xhr);
			if (loading)
				hide();
		}
	}
	
	function GetJson(json) {
		__petXHR++;        
		if(!__isLoading)
			Show();
		
		var _Done = json.done || __Fake,
			_Fail = json.fail || __Fake;
		
		function _WrapDone(data) {
			_Done(data);
			_WatchLoad();
		}
		
		function _WrapFail(xrh, err) {
			_Fail(xrh, err);
			_WatchLoad();
		}
		
		function _WatchLoad() {
			__petXHR--;
			if(__petXHR == 0)
				Hide();
		}
		
		var xrh = $.getJSON(json.url);
		xrh.done(_WrapDone)
		.fail(_WrapFail);
		
		return xrh;
	}
	
	function GetMeses() {
		var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		return meses;
	}
	
	function Hide(fn, p_arrs) {
		__foreverLoad = false;
		__isLoading = false;
		__loading.fadeOut();
	}

	function Alerta(json) {
		var message = json.text || '',
			time = json.time || 2000,
			tipo = json.tipo || 'alert',
			alerta = $(app.templates.alerta({texto:message, tipo:tipo}));
		
		$.fx.speeds.slow = time;
		$('.pnlAlert').prepend(alerta);
		alerta.fadeOut('slow', function() {
			alerta.find('.close').click();
		});
	}
	
	function Print(json) {
		var modal = json.el || $('#popImprimir'),
			body = json.body || '/',
			clase = json.class || '';
		
		$('#print-area').removeClass().addClass(clase).html(body);
		modal.find('#modal-body').removeClass().addClass(clase).html(body);

		modal.find('#btnImprimir').off('click').on('click', fnDone);
		modal.find('#btnCancelar').off('click').on('click', fnHide);
		modal.off('close').on('close', fnHide);

		modal.foundation('reveal', 'open');

		function fnDone() {
			modal.off('close');
			window.print();
			modal.foundation('reveal', 'close');
		}

		function fnHide(e) {
			modal.off('close');
			if(e.type != 'close')
				modal.foundation('reveal', 'close');
		}
	}
	
	function Search(json) {
		var elem = json.elem,
			_done = json.done,
			_timeout = json.timeout || 1000,
			search = '',
			currSearch = '',
			callback = null;
		
		elem.on('keyup', keyup_search);
		function keyup_search(e) {
			search = e.currentTarget.value;
			
			if(currSearch == search) {
				clearTimeout(callback);
			}
			else if(e.keyCode == 13) {
				clearTimeout(callback);
				ExecSearch();
				return;
			}
			else {            
				if(callback != null)
					clearTimeout(callback);
				
				callback = setTimeout(ExecSearch, _timeout);
			}
		}
		
		function ExecSearch() {
			currSearch = search;
			_done(search);
			callback = null;
		}
	}
	
	function Show() {
		var h1 = $(document).height();
		var h2 = $('body').height();
		var h3 = $('html').height();
		var max = 0;
		
		if(h1 > h2 && h1 > h3)
			max = h1;
		else if (h2 > h3)
			max = h2;
		else
			max = h3;
		
		// console.log($(document).height());
		// console.log($('body').height());
		// console.log($('html').height());
		// console.log(max);
		var top = $(document).scrollTop() + 250;
		
		__isLoading = true;
		__loading.css({height:max + 'px'}).fadeIn().children('#topLoader').css({top:top + 'px'});
	}
	
	function ToWords(value) {
		
		function Unidades(num) {
			switch(num)
			{
				case 1: return 'UN';
				case 2: return 'DOS';
				case 3: return 'TRES';
				case 4: return 'CUATRO';
				case 5: return 'CINCO';
				case 6: return 'SEIS';
				case 7: return 'SIETE';
				case 8: return 'OCHO';
				case 9: return 'NUEVE';
			}    
			return '';
		}
		
		function Decenas(num) {
			decena = Math.floor(num/10);
			unidad = num - (decena * 10);
		
			switch(decena)
			{
				case 1:   
					switch(unidad)
					{
						case 0: return 'DIEZ';
						case 1: return 'ONCE';
						case 2: return 'DOCE';
						case 3: return 'TRECE';
						case 4: return 'CATORCE';
						case 5: return 'QUINCE';
						default: return 'DIECI' + Unidades(unidad);
					}
				case 2:
					switch(unidad)
					{
						case 0: return 'VEINTE';
						default: return 'VEINTI' + Unidades(unidad);
					}
				case 3: return DecenasY('TREINTA', unidad);
				case 4: return DecenasY('CUARENTA', unidad);
				case 5: return DecenasY('CINCUENTA', unidad);
				case 6: return DecenasY('SESENTA', unidad);
				case 7: return DecenasY('SETENTA', unidad);
				case 8: return DecenasY('OCHENTA', unidad);
				case 9: return DecenasY('NOVENTA', unidad);
				case 0: return Unidades(unidad);
			}
		}//Unidades()
		
		function DecenasY(strSin, numUnidades) {
			if (numUnidades > 0)
			return strSin + ' Y ' + Unidades(numUnidades)
			
			return strSin;
		}//DecenasY()
		
		function Centenas(num) {
			centenas = Math.floor(num / 100);
			decenas = num - (centenas * 100);
			
			switch(centenas)
			{
				case 1:
					if (decenas > 0)
						return 'CIENTO ' + Decenas(decenas);
					return 'CIEN';
				case 2: return 'DOSCIENTOS ' + Decenas(decenas);
				case 3: return 'TRESCIENTOS ' + Decenas(decenas);
				case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
				case 5: return 'QUINIENTOS ' + Decenas(decenas);
				case 6: return 'SEISCIENTOS ' + Decenas(decenas);
				case 7: return 'SETECIENTOS ' + Decenas(decenas);
				case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
				case 9: return 'NOVECIENTOS ' + Decenas(decenas);
			}
			
			return Decenas(decenas);
		}//Centenas()
		
		function Seccion(num, divisor, strSingular, strPlural) {
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			letras = '';
			
			if (cientos > 0)
				if (cientos > 1)
					letras = Centenas(cientos) + ' ' + strPlural;
			else
				letras = strSingular;
			
			if (resto > 0)
				letras += '';
			
			return letras;
		}//Seccion()
		
		function Miles(num) {
			divisor = 1000;
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			strMiles = Seccion(num, divisor, 'MIL', 'MIL');
			strCentenas = Centenas(resto);
			
			if(strMiles == '')
				return strCentenas;
			
			return strMiles + ' ' + strCentenas;
			
			//return Seccion(num, divisor, 'UN MIL', 'MIL') + ' ' + Centenas(resto);
		}//Miles()
		
		function Millones(num) {
			divisor = 1000000;
			cientos = Math.floor(num / divisor)
			resto = num - (cientos * divisor)
			
			strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
			strMiles = Miles(resto);
			
			if(strMillones == '')
				return strMiles;
			
			return strMillones + ' ' + strMiles;
			
			//return Seccion(num, divisor, 'UN MILLON', 'MILLONES') + ' ' + Miles(resto);
		}//Millones()
		
		function NumeroALetras(num) {
			var data = {
				numero: num,
				enteros: Math.floor(num),
				centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
				letrasCentavos: '',
				letrasMonedaPlural: 'PESOS',
				letrasMonedaSingular: 'PESO'
			};
		
			if (data.centavos > 0)
				data.letrasCentavos = 'CON ' + data.centavos + '/100 M.N.';
			else
				data.letrasCentavos = 'CON 00/100 M.N.';
				
		
			if(data.enteros == 0)
				return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
			if (data.enteros == 1)
				return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
			else
				return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
		}
		
		return NumeroALetras(value);
	}
	
	function Typeahead(json) {
		var arr = json.arr || [],
			elem = json.elem,
			url = json.url || '',
			displayKey = json.dKey || 'nombre',
			def = json.def || 'select',
			template = json.tmp || app.templates.tyaTmp,
			fail = json.fail || __Fake,
			done = json.done || _FakeAhead,
			_filters = json.filters || [{filter:'nombre'}],
			_where = json.where || null,
			_sorts = json.sorts || null,
			_custom = json.custom || null,
			_onSelected = json.onSelected || onSelected,
			_onClean = json.onClean || onClean,
			_callSearch = null,
			_query = null,
			_process = null,
			_timeout = 1000,
			_metodo = url.length > 0 ? searchQuery : prepareCollection();

		elem = elem.typeahead(null, {
			name: 'familias',
			displayKey: displayKey,
			source: _metodo,
			templates: {
				suggestion: template
			}
		})
		.data('dKey', displayKey)
		.on('typeahead:selected typeahead:autocompleted', function(e, datum) {
			var curElem = $(e.currentTarget);
			curElem.data('current', datum).val(datum[curElem.data('dKey')]);
			console.log(datum)
			_onSelected(datum);
		})
		.on('blur', function(e) {
			var elem = $(e.currentTarget);
			if(elem.data('current')) {
				if(elem.data('current').nombre != elem.val()) {
					var datum = elem.data('current');
					elem.val(datum.dKey);
				}
				parent.find('.tya-clear').css({display:'inline-block'});
			}
			else {
				elem.val('');
				parent.find('.tya-clear').css({display:'none'});
			}
		});
		
		if(elem.parents('label').length == 1 && elem.parents('label').next('small').length == 1)
			elem.parents('.twitter-typeahead').append(elem.parents('label').next('small'));

		var parent = elem.parents('.twitter-typeahead');
		parent.find('.tt-hint').attr('readonly', 'readonly').remove();
		parent.append('<i class="icon-cross tya-clear"></i>');
		parent.append('<i class="icon-spinner tya-loading icon-spin"></i>');
		
		parent.on('click', '.tya-clear', function() {
			_clean();
		});

		function _clean() {
			elem.data('current', null).val('');
			parent.find('.tya-clear').css({display:'none'});
			_onClean();
		}

		function _current(option) {
			var res = null;
			if(option && elem.data('current'))
				res = elem.data('current')[option] || null;
			else if(!option)
				res = elem.data('current') || null;
			return res;
		}

		function onSelected(data) {
			console.log('on selected');
		}

		function onClean(data) {
			console.log('on clean');
		}
		
		function execQuery() {
			if(_callSearch)
				clearTimeout(_callSearch);
			
			fSeacrh();
		}
		
		function fSeacrh() {
			parent.find('.tya-loading').css({display:'inline-block'});
			console.log('init');
			var __where = [];
			if(_where)
				for (var i = 0; i < _where.length; i++) {
					var w = {field:_where[i].field, to:'v'};
	                if(_where[i].to == 'u')
	                    w.to = 'u';
					else if(typeof _where[i].value === 'function')
						w.value = _where[i].value(elem);
					else
						w.value = _where[i].value;
					
					__where.push(w);
				}
			else
				__where = null;

			$.get('/controles/tya/' + url, {query:_query, filters:_filters, where:__where, sorts:_sorts, custom:_custom, displayKey: displayKey, def: def}).done(wrapDone).fail(wrapFail).always(always);
			
			function always() {
				parent.find('.tya-loading').css({display:'none'});
				console.log('fin');
				_query = null;
				_callSearch = null;
			}
			function wrapFail(xhr, err) {
				fail(xhr, err);
			}
			function wrapDone(data) {
				if(data.data.length == 0)
					app.ut.message({text:'No se encontraron datos en la busqueda', tipo:'primary'});
				
				done(data.data, _process, displayKey);
			}
		}
		
		function prepareCollection() {
			var nombres = new Bloodhound({
			  datumTokenizer: function(datum) {
				  return Bloodhound.tokenizers.whitespace(datum.dKey); 
			  },
			  queryTokenizer: Bloodhound.tokenizers.whitespace,
			  local: arr
			});
			
			nombres.initialize();
			
			return nombres.ttAdapter();
		}
		
		function searchQuery(query, process) {
			_query = query;
			_process = process;
			
			console.log(query);
			if(_callSearch)
				clearTimeout(_callSearch);
			
			_callSearch = setTimeout(fSeacrh, _timeout);
		}
		
		function selectSource() {
			return url.length > 0 ? searchQuery : prepareCollection();
		}
		
		function _FakeAhead(data, process, displayKey) {
			for (var i = 0; i < data.length; i++) {
				data[i].dKey = data[i][displayKey];
			}

			process(data);
		}

		var __exports = {
			execQuery: execQuery,
			clean: _clean,
			current: _current,
		};
		elem.data('fn', __exports);
		
		return __exports;
	}
	
	function __Fake(xhr) {
		console.log(xhr);
	}
}

/*function getServices(servs) {
	var dfd = $.Deferred();

	if(!app.servicios[servs]) {
		$.get('/template/service/' + servs).done(function(data) {
			load_content.append(data);

			require('/js/servicios/' + servs + '.js', function (async) {
				app.servicios[servs] = new async.view();
				dfd.resolve(app.servicios[servs]);
			});
			
		}).fail(function(xhr) {
			dfd.reject();
		});
	}
	else
		dfd.resolve(app.servicios[servs]);
	

	dfd.then(function(async) {
		debugger
	});
	
	return dfd.promise;
}*/

function loadAsync(modulo, deps) {
	app.ut.show();
	app.currView.close();
	
	var dependencias = deps || [];
	var dirsJS = ['/templates/views/' + modulo + '.js?bust='+bust];

	for(var i=0; i<dependencias.length; i++) {
		dirsJS.push('/templates/views/' + dependencias[i] + '.js?bust='+bust);
	}

	var dfd = $.Deferred();

	if(!app.views[modulo]) {
		$.get('/template/find/' + modulo).done(function(data) {
			if(app.views.noAccess && data == '-1') {
				app.currView = app.views.noAccess;
				app.currView.render();
			}
			else {
				if(data.length == 0)
					fueraDeServicio();

				if(data == '-1') {
					modulo = 'noAccess';
					dirsJS = ['/templates/views/noAccess.js'];

					load_content.append(app.views.main.tmp_frm_noaccess({}));
				}
				else {
					//load_content.append(data);
					var html = $(data).appendTo(load_content);
					html.find('.datetime').datetimepicker({
						timepicker: true,
						format: 'Y-m-d'
					});
				}

				require(dirsJS, function (async) {
					app.currView = app.views[modulo] || (app.views[modulo] = new async.view());
					app.currView.render();
					//load foundation
					app.currView.$el.foundation();

					dfd.resolve(app.currView);
				});
			}
		}).fail(function(xhr) {
			dfd.reject();
		}).always(function() {
			app.ut.hide();
		});
	}
	else {
		app.currView = app.views[modulo];
		app.currView.render();

		dfd.resolve(app.currView);
		app.ut.hide();
	}
	

	dfd.then(function(async) {
	});
	
	return dfd.promise;
}

var app = {
	views: {},
	loadAsync: loadAsync,
	ut: new utilerias(),
	templates: {},
	controles: {},
	models: {},
	collections: {},
	servicios: {},
	currView: {
		close: function() {},
		$el: $('div'),
	},
	socket: {},
};

define(['js/base/router.js', 'js/base/templates.js'], function (router, templates) {
	app.templates = new templates();
	bases();

	Handlebars.registerHelper('GetGlFecha', function(fecha) {
		if(!fecha)
			return '';

		if(fecha.search(/[a-zA-Z]+/) == -1) {
			var fecha_part = fecha.split('-');
			fecha = fecha_part[2] + '-' + fecha_part[1] + '-' + fecha_part[0];
		}

		var fecha = new Date(fecha.toString());

		var dia = fecha.getDate().toString(),
			mes = (parseInt(fecha.getMonth().toString()) + 1).toString(),
			anio = fecha.getFullYear().toString();

		fecha = (dia.length == 1 ? '0' + dia : dia) + '-' + (mes.length == 1 ? '0' + mes : mes) + '-' + anio;
		return fecha;
	});

	$.ajaxSetup({ cache: false });
	load_content = $('#load_content');

	app.router = new router;

	
	Backbone.history.start({
		root: '/',
	});

	window.app = app;
	return app;
});