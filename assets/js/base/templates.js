function templates(){
	Handlebars.registerHelper('StringToElment', function(p_cadena, p_relleno, p_repeticiones, p_direccion) {
		var relleno = p_relleno || ' ';
		var pad = '';
		var dir = p_direccion || 'l';
		var cadena = '';

		var tmp_cadena = p_cadena || '';

		for (var i = 0; i < p_repeticiones; i++)
			pad += relleno.toString();

		if(dir == 'l')
			cadena = pad.substring(0, pad.length - tmp_cadena.length) + tmp_cadena;
		else
			cadena = tmp_cadena + pad.substring(0, pad.length - tmp_cadena.length);

		var cadelem = '';
		for (var i = 0; i < cadena.length; i++)
			cadelem += '<div>' + cadena[i] + '</div>';

		return new Handlebars.SafeString(cadelem);
	});

	Handlebars.registerHelper('GetGenero', function(tipo) {
		var Genero = '';
		var cond = tipo ? tipo.toString() : '';
		switch (cond) {
			case '1':
				Genero = "Hombre";
				break;
			case '2':
				Genero = "Mujer";
				break;
		}
		return new Handlebars.SafeString(Genero);
	});
	
	Handlebars.registerHelper('GetTipoSangre', function(tipo) {
		var tipoSangre = '';
		switch (tipo) {
			case 1:
				tipoSangre = "A+";
				break;
			case 2:
				tipoSangre = "A-";
				break;
			case 3:
				tipoSangre = "B+";
				break;
			case 4:
				tipoSangre = "B-";
				break;
			case 5:
				tipoSangre = "AB+";
				break;
			case 6:
				tipoSangre = "AB-";
				break;
			case 7:
				tipoSangre = "O+";
				break;
			case 8:
				tipoSangre = "O-";
				break;
		}
		return new Handlebars.SafeString(tipoSangre);
	});

	Handlebars.registerHelper('GetStatusBanco', function(tipo) {
		var status = '';
		switch (tipo) {
			case "1":
				status = "Pendiente";
				break;
			case "2":
				status = "Cerrado";
				break;
			default:
				status = "Cancelado";
				break;
		}
		return new Handlebars.SafeString(status);
	});

	Handlebars.registerHelper('GetFecha', function(fecha) {
		if(!fecha)
			return '';

		var tmpFecha = new Date(fecha);

		var dia = tmpFecha.getDate().toString(),
			mes = tmpFecha.getMonth().toString(),
			anio = tmpFecha.getFullYear().toString();

		var strFecha = (dia.length == 1 ? '0' + dia : dia) + '-' + (mes.length == 1 ? '0' + mes : mes) + '-' + anio;
		return strFecha;
	});

	Handlebars.registerHelper('GetParentesco', function(id) {
		var parentesco = '';
		var cond = id ? id.toString() : '';
		switch(cond) {
			case '1':
				parentesco = 'Padre';
				break;
			case '2':
				parentesco = 'Madre';
				break;
			case '3':
				parentesco = 'Hermano';
				break;
			case '4':
				parentesco = 'Otro';
				break;
		}
		return new Handlebars.SafeString(parentesco);
	});

	Handlebars.registerHelper('first', function(ds, seccion, attr) {
		var dataset = ds[seccion];
		var res = '';
		if(dataset) {
			if (dataset.length > 0)
				res = dataset[0][attr];
			else
				res = dataset[attr];
		}
		return new Handlebars.SafeString(res);
	});

	Handlebars.registerHelper('GetTotal', function(ds, attr, seccion) {
		var dataset = ds[seccion] || ds;
		var res = _.reduce(_.pluck(dataset, attr), function(memo, num){ return memo + (num || '0').toString().toInt(); }, 0);
		return new Handlebars.SafeString(res);
	});

	Handlebars.registerHelper('SetTya', function(data, dField, dKey) {
		var current = JSON.stringify(data).replace(/\"/g, '\'');
		if(data[dField])
			str = 'data-current="' + current + '" value="' + data[dKey] + '"';
		else
			str = '';

		var tya = '<input type="text" data-field="' + dField + '" data-dKey="' + dKey + '" ' + str + ' class="tya" placeholder="Nombre del registro"/>';

		return new Handlebars.SafeString(tya);
	});

	Handlebars.registerHelper('GetSuma', function(val1, val2) {
		return val1 + val2;
	});

	Handlebars.registerHelper('ifCond', function(val1, val2, options) {
		if(val1 === val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('unlessCond', function(val1, val2, options) {
		if(val1 !== val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	
	var alerta = Handlebars.compile('<div class="alert-box {{tipo}} special altMenssage pop-alert" data-alert="data-alert"><span class="spnTexto">{{texto}}<a class="close" href="#">×</a></span></div>'),
		cbo = Handlebars.compile('{{#data}} <option value="{{_id}}">{{nombre}}</option> {{/data}}'),
		tyaBase = Handlebars.compile('NT-{{sku}} - {{nombre}}'),
		tyaTmp = Handlebars.compile('{{dKey}}'),
		upload = Handlebars.compile('	<input type="file" class="isHidden" name="{{field}}" accept="image/*" />	\
										<i class="th content-image">						\
											<img data-old="" />								\
										</i>')
		;
	
	return {        
		alerta: alerta,
		tyaBase: tyaBase,
		tyaTmp: tyaTmp,
		upload: upload,
	}
}

define([], function () {
	app.templates = new templates();
});