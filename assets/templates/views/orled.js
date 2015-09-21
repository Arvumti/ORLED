var deps = [
	'/js/base/viewsBase.js',
	'/templates/views/mapaElementos.js',
	'/templates/views/principal/graficas.js',
	'/templates/views/principal/cableado.js',
	'/templates/views/principal/calculadorAltura.js'
];

define(deps, function (viewsBase, mapaElementos, graficas, cableado, calculadorAltura) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {
			'click .btn-calcular' :'click_calcular',
			//'click .tab-cableado' : 'click_tabCableado',
			'click .tabs a' : 'click_tabs',
			'click .btn-calcular-altura': 'click_CalcularAltura',
			'change [data-field="idLongitudTuberia"]': 'change_idLongitudTuberia',
		},
		initialize: function() {
			var that = this;
			this.fks = {
				idPais: {
					url: 'paises',
					filters: [{filter:'nombre'}],
				},
				idLocalidad: {
					url: 'localidades',
					filters: [{filter:'nombre'}],
				},
			};
			debugger
			var tyas = this.$el.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);
			this.gvBombas = this.$el.find('.gvBombas');
			this.longTube = this.$el.find('.longTube');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			//that.bombas();
			//this.tmp_resultado= Handlebars.compile(this.$el.find('.tmp_resultado').html());
			this.formData = this.$el.find('.form-data');

			this.subContentEntradas = this.$el.find('.sub-content.pnl-entradas');
			this.subContentCableado = this.$el.find('.sub-content.pnl-cableado');

			this.$el.append(calculadorAltura.html);
			this.popCalculadora = this.$el.find('.modal-calculador');
			this.popFormCalcular = new calculadorAltura.view({parentView:this, el:this.popCalculadora});

			this.subViews = {
				mapaElementos: {
					elem: $(mapaElementos.html).appendTo(this.subContentEntradas),
					view: new mapaElementos.view({parentView:this}),
				},
				graficas: {
					elem: $(graficas.html).appendTo(this.subContentEntradas),
					view: new graficas.view({parentView:this}),
				},
				cableado: {
					elem: $(cableado.html).appendTo(this.subContentCableado),
					view: new cableado.view({parentView:this}),
				},
			};	
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*bombas: function() {
			var that = this;
			app.ut.request({url:'/bombas/populate', done:done});
			function done(data) {
				console.log(data);
				var arrDatosBombas=Array();
				if(data) {
					var info = data;
					debugger
					for (var i = 0; i < info.length; i++) {
						info[i]
						var bomba = {
							nombreBomba: info[i].nombre,
							alturaMinima: info[i].alturaMinima,
							alturaMaxima: info[i].alturaMaxima,							
							eficiencia: info[i].eficiencia,							
							generador: info[i].idGenerador.nombre,
							etatrack: '',
							accesorios:'',
							cable: info[i].idCable.nombre,
							tubo: info[i].idTubo.nombre,
							salida: info[i].idSalida.nombre,

						}
						arrDatosBombas.push(bomba);

					};
					var tr = that.tmp_bombas({bombas:arrDatosBombas});
					that.gvBombas.html(tr);
				}
			}
		},*/
		/*------------------------- Eventos -----------------------------*/
		change_idLongitudTuberia: function(e) {
			var that=this;
			var valor = $(e.currentTarget).prop("checked");
			if(valor)
				that.longTube.attr('disabled', false);
			else
				that.longTube.attr('disabled', true).val('');
		},
		click_buscar: function() {
			this.form.submit();
		},	
		click_calcular: function(){
			debugger
			this.subViews.graficas.view.render();
			debugger
			this.subViews.mapaElementos.view.close();
		},
		click_tabs: function(e) {
			debugger
			var href = $(e.currentTarget).attr('href');
			switch(href) {
			/*	case '#entradas':
					this.subViews.mapaElementos.view.close();
					this.subViews.graficas.view.render();
					break;*/
				case '#cableado':
					//this.subViews.graficas.view.close();
					//this.subViews.mapaElementos.view.close();
					this.subViews.cableado.view.render();
					break;
			}
		},
		click_CalcularAltura: function(){
			this.popFormCalcular.render();
			this.dimencionar();
		},
		dimencionar: function(){
			var that =  this;
			var datos = viewsBase.base.prototype.getData.call(this, this.formData);

			var volumen,
			voltajeModulo =  30.3,
			corrienteModulo = 8.26,
			factorConversion = 367,
			factorFricción = 0,
			cargaFriccion = .3,
			eficienciaBomba = .35,	
			factorReduccionModulo = .90,
			factorRendimiento = .95,
			alturaEstatica,
			alturaDescarga,
			cargaEstatica,
			longitudTuberia,
			recorridoTotal,
			voltajeOperacion,
			modulosSerie,
			modulosParalelo,
			voltaje,
			insolacion;

			//app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:datos.idLocalidad}},done:done});
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneA});
			function doneA (data) {
				debugger
				insolacion = data[0].promedio;
				var regimenBombeo = parseFloat(datos.rendimientoDiario/insolacion);
				var cargaEstatica = parseFloat(datos.alturaDinamica);
				var cargaDinamicaTotal = parseFloat(cargaEstatica+datos.perdida);
				app.ut.request({url:'/generadores', data:{where:{idGenerador:1}},done:doneB})
				function doneB (data){
					debugger
					voltajeOperacion =  data[0].voltaje;
					//modulosParalelo = data[0].paralelo;
					//modulosSerie = data[0].serie;
					var energiaHidraulica = (datos.rendimientoDiario * cargaDinamicaTotal)/factorConversion;
					var energiaArregloFV = energiaHidraulica/eficienciaBomba;
					var cargaElectrica = energiaArregloFV/voltajeOperacion
					var cargaElectricaCorregida = cargaElectrica/factorRendimiento;
					var corrienteProyecto = cargaElectricaCorregida/insolacion;
					var corrienteAjustadaProyecto = corrienteProyecto/factorReduccionModulo;
					var modulosParalelo = corrienteAjustadaProyecto/corrienteModulo;
					var modulosSerie = voltajeOperacion / voltajeModulo;
					var totalModulo = modulosSerie * modulosParalelo;
					var arregloFotovoltaico = totalModulo * corrienteModulo * voltajeModulo;

					var aguaBombeada = (modulosParalelo * corrienteModulo * voltajeOperacion * eficienciaBomba * factorConversion * insolacion * .90) / cargaDinamicaTotal;
					var regimenBombeo2 = aguaBombeada/insolacion;
					console.log(regimenBombeo2);	
				}
			}
		},
		

	});
	return {view:ViOrled};
});
