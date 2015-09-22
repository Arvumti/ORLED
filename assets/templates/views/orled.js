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
			'click .btn-calcular-grafica' :'click_calcular',
			'click .openItemModal' :'click_openItems',
			'click table tbody tr.selectCell' :'rowSelected',
			'change [data-field="idLongitudTuberia"]': 'change_idLongitudTuberia',
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
					onSelected: function (data) {						
						var latitud = data.latitud;											
						var txtAnguloInclinacion = that.$el.find('.anguloIncli');
						txtAnguloInclinacion.val(latitud)

					}
				},
			};
			debugger
			var tyas = this.$el.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);
			this.gvBombas = this.$el.find('.gvBombas');
			this.idBombaInicial=0;
			this.idGeneradorInicial=0;
			this.longTube = this.$el.find('.longTube');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			this.formData = this.$el.find('.form-data');
			this.tmp_items = Handlebars.compile(this.$el.find('.tmp_items').html());		
			this.subContentEntradas = this.$el.find('.sub-content.pnl-entradas');
			this.subContentCableado = this.$el.find('.sub-content.pnl-cableado');
			this.txtAlturaDinamica = this.$el.find('[data-field="alturaDinamica"]');
			this.txtLongitud = this.$el.find('[data-field="longitudTuberia"]');

			this.$el.append(calculadorAltura.html);
			this.popCalculadora = this.$el.find('.modal-calculador');
			this.popFormCalcular = new calculadorAltura.view({parentView:this, el:this.popCalculadora});

			this.popArreglo = this.$el.find('.modal-arreglo');
			this.popFormArreglo = new ViPopArreglo({parentView:this, el:this.popArreglo});

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
			this.modalItems = this.$el.find('.modal-items');
			this.popItems = new ViPopItems({el:this.modalItems, parentView:this, tmp_items:this.tmp_items});
			//this.subViews.graficas.close();
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
		click_openItems: function(e) {
			var valor = $(e.currentTarget).data("valor");
			debugger
			this.popItems.render(valor);
		},
		change_idLongitudTuberia: function(e) {
			var that=this;
			var valor = $(e.currentTarget).prop("checked");
			if(valor)
				that.longTube.attr('disabled', false);
			else
				that.longTube.attr('disabled', true).val('');
		},
		bombas: function(totalAltura) {
			var that = this;
			var alturaDinamica = parseFloat(totalAltura) + .001;
			var where = {
				alturaMaxima: {
					'>=': alturaDinamica
				},
				// alturaMinima: {
				// 	'<=': alturaDinamica
				// },
			};

			app.ut.request({url:'/bombas/populate', data:{where:where}, done:done});
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
							idBomba: info[i].idBomba,
							generador: info[i].idGenerador.nombre,
							idGenerador: info[i].idGenerador.idGenerador,
							alturaMinima: info[i].alturaMinima,
							alturaMaxima: info[i].alturaMaxima,
							eficiencia: info[i].eficiencia,
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
		},
		rowSelected: function(e) {
			debugger
			var that  = this;
			var rows = that.$el.find('tr').removeClass('isActive');
			var row =$(e.currentTarget).addClass('isActive');
			var nombreBomba =$(e.currentTarget).data("nombrebomba");
			var idNombreBomba =$(e.currentTarget).data("idbomba");
			var generador =$(e.currentTarget).data("generador");
			var idGenerador =$(e.currentTarget).data("idgenerador");
			var cable =$(e.currentTarget).data("cable");
			debugger
			var inputBomba = that.$el.find('.nombreBombaTabla');
			inputBomba.attr('data-idbomba',idNombreBomba);
			that.idBombaInicial = inputBomba.data('idbomba');
			var inputGenerador =that.$el.find('.nombreGenerador');
			inputGenerador.attr('data-idgenerador',idGenerador);
			that.idGeneradorInicial=inputGenerador.data('idgenerador');
			var inputCable =that.$el.find('.nombreCable');
			inputBomba.val(nombreBomba);
			inputGenerador.val(generador);
			inputCable.val(cable);
			debugger
			that.dimencionar(idGenerador, idNombreBomba);
		},
		rowSelectedCustom: function(tipoItem,idItem,nombreItem) {
			debugger
			var that  = this;
			var tipoItem = tipoItem;
			var idItem = idItem;
			var nombreItem = nombreItem;
			var inputGenerador = that.$el.find('.nombreGenerador');
			var inputBomba = that.$el.find('.nombreBombaTabla');
			
			if (tipoItem==1) {
				inputBomba.data('idbomba', idItem);
				inputBomba.val(nombreItem);
				debugger
				var idGenerador = inputGenerador.data('idgenerador');
				this.dimencionar(idGenerador, idItem);
				this.popItems.close()
			}
			else if (tipoItem==2) {
				inputGenerador.data('idgenerador', idItem);
				inputGenerador.val(nombreItem);
				debugger
				var idBomba = inputBomba.data('idbomba');
				this.dimencionar(idItem, idBomba);
				this.popItems.close()
			}
		},		
		click_buscar: function() {
			this.form.submit();
		},	
		click_calcular: function(){
			var that = this;
			debugger
			this.subViews.graficas.view.render();
			var total = that.txtAlturaDinamica.val();
			debugger
			that.bombas(total);
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
		click_CalcularAltura: function(txtLongitud){
			debugger
			longitud = this.txtLongitud.val();
			this.popFormCalcular.render(longitud);
		},
		dimencionar: function(idGenerador, idBomba){
			var that =  this;
			debugger
			//var idGenerador = this.$el.find('.nombreGenerador').data('idgenerador');
			var datos = viewsBase.base.prototype.getData.call(this, this.formData);

			var volumen,
			voltajeModulo =  30.3,
			corrienteModulo = 8.26,
			factorConversion = 367,
			factorFricción = 0,
			cargaFriccion = .3,
			//eficienciaBomba = .35,	
			eficienciaBomba,
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
			insolacion,
			rendimientoDiario =  (datos.rendimientoDiario*1000);
			debugger

			//app.ut.request({url:'/rendimientos/eficiencia', data:{idBomba:1, altura:39},done:doneA});
			app.ut.request({url:'/rendimientos/eficiencia', data:{idBomba:idBomba, altura:datos.alturaDinamica},done:doneA});
			function doneA(data){
				debugger
				eficienciaBomba = (data.eficiencia)/100;
				//app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneB});
				app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:datos.idLocalidad}},done:doneB});
				function doneB (data) {
					debugger
					if (data && data.length > 0){
						insolacion = data[0].promedio;
						var regimenBombeo = parseFloat(rendimientoDiario/insolacion);
						var cargaEstatica = parseFloat(datos.alturaDinamica);
						var cargaDinamicaTotal = parseFloat(cargaEstatica+datos.perdida);
						debugger
						app.ut.request({url:'/generadores', data:{where:{idGenerador:idGenerador}},done:doneC})
						function doneC (data){
							if (data && data.length > 0){
								debugger
								voltajeOperacion =  data[0].voltaje;
								var inputGenerador =that.$el.find('.nombreGenerador');
								var inputBomba = that.$el.find('.nombreBombaTabla');
								var energiaHidraulica = (rendimientoDiario * cargaDinamicaTotal)/factorConversion;
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
								debugger
								if(aguaBombeada < rendimientoDiario || !aguaBombeada || !rendimientoDiario){
									console.log('No valida')
									inputGenerador.addClass('noValida');
									inputBomba.addClass('noValida');
								}
								else {
									console.log('Valida')
									inputGenerador.removeClass('noValida');
									inputBomba.removeClass('noValida');
								}
								app.ut.hide();
								debugger
								that.popFormArreglo.render(modulosParalelo, modulosSerie, totalModulo, arregloFotovoltaico);		
							}else{
								app.ut.message({text:'No exiten datos'});
							}
						}
					}else{
						app.ut.message({text:'No exiten datos'});
						app.ut.hide();
					}
				}	
			}
		},
	});
	var ViPopItems = Backbone.View.extend({
		events: {
			'click .aceptar-btn' :'click_datoSeleccionado',
			'click .btn-cancelar' :'click_btnCancelar',
			'click table tbody tr.selectCell' :'popRowSelected',
		},
		initialize: function(options) {
			var that = this;
			this.tmp_items = options.tmp_items;
			this.parentView = options.parentView;
			this.gvItems = this.$el.find('.gvItems');
			this.form = this.$el.find('.form-data');
		},
		/*------------------- Base -------------------*/
		render: function(val) {
			var that=this;
			var valor = parseInt(val);
			app.ut.request({url:'/bombas/populate', done:done});
			function done(data) {
				console.log(data);
				var arrDatosBombas=Array();
				if(data) {
					var info = data;
					debugger
					for (var i = 0; i < info.length; i++) {	
						switch (valor) {
							case 1:
								var bomba = {
									item: info[i].nombre,
									idBomba: info[i].idBomba,
									descripcion: "Bombas",
									tipoElemento:1,
								}
								debugger
								arrDatosBombas.push(bomba);
								break;
							case 2:
								var generador = {
									item: info[i].idGenerador.nombre,
									idGenerador: info[i].idGenerador.idGenerador,
									descripcion: "Generadores",
									tipoElemento:2,
								}
								arrDatosBombas.push(generador);
								break;
						}

					};
					debugger
					var tr = that.tmp_items({items:arrDatosBombas});
					that.gvItems.html(tr);
					that.$el.foundation('reveal', 'open');
				}
			}
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		/*------------------- Eventos -------------------*/
		click_btnCancelar: function () {
			this.close();
		},
		popRowSelected: function(e) {
			debugger
			var that  = this;
			var rows = that.$el.find('tr').removeClass('isActive');
			var row =$(e.currentTarget).addClass('isActive');
		},
		click_datoSeleccionado: function(options) {
			debugger
			var that  = this;
			var row = that.$el.find('tr.isActive');
			debugger
			if (row.length>0) {
				var popNombre = row.data("item");
				var tipoItem = row.data("tipoitem");

				if (tipoItem==1) {
					var idbomba=row.data("idbomba");
					this.parentView.rowSelectedCustom(tipoItem,idbomba,popNombre);
				}
				if (tipoItem==2) {
					var idgenerador=row.data("idgenerador");
					this.parentView.rowSelectedCustom(tipoItem,idgenerador,popNombre);
				}
			}
			else {
				app.ut.message({text:'No hay ningun elemento seleccionado', tipo:'primary'});
			}
			
		},
	});
	var ViPopArreglo = viewsBase.popAbc.extend({
		events: {
			'click .btn-cancelar': 'click_cancelar',
		},
		initialize: function(options) {
			//viewsBase.popAbc.prototype.linkFks.call(this);
			this.formData = this.$el.find('.form-data');
			this.txtModulosSerie =  this.$el.find('.modulo-serie');
			this.txtModulosParalelo = this.$el.find('.modulo-paralelo');
			this.txtTotalModulos = this.$el.find('.total-modulos');
			this.txtTamanoArreglo = this.$el.find('.tamano-areglo');
		},
		/*------------------------- Base -----------------------------*/
		render: function(modulosParalelo, modulosSerie, totalModulo, arregloFotovoltaico) {
			debugger
			viewsBase.base.prototype.render.call(this);
			this.txtModulosSerie.text(modulosSerie || 0);
			this.txtModulosParalelo.text(modulosParalelo || 0);
			this.txtTotalModulos.text(totalModulo || 0);
			this.txtTamanoArreglo.text(arregloFotovoltaico || 0);
			this.$el.foundation('reveal', 'open');
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
			this.clear();
		},
		clear: function() {
			debugger
			this.formData[0].reset();
		},
		/*------------------------- Eventos -----------------------------*/

	});
	return {view:ViOrled};
});
