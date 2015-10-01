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
			//'click .tab-cableado' : 'click_tabCableado',
			'click .tabs a' : 'click_tabs',
			'click .btn-calcular-altura': 'click_CalcularAltura',
			'change [data-field="idLongitudTuberia"]': 'change_idLongitudTuberia',

			'change [data-filed="bomba"]':'change_cbobomba',
			'change [data-filed="generador"]':'change_cbogenerador',
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
			var tyas = this.$el.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);
			this.gvBombas = this.$el.find('.gvBombas');
			this.idBombaInicial=0;
			this.idGeneradorInicial=0;
			this.longTube = this.$el.find('.longTube');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			this.formData = this.$el.find('.form-data');
			
			this.tmp_items = Handlebars.compile(this.$el.find('.tmp_items').html());
			this.tmp_bombas_options = Handlebars.compile(this.$el.find('.tmp_bombas_options').html());
			this.tmp_componente_options = Handlebars.compile(this.$el.find('.tmp_componente_options').html());

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

			this.cboBomba;
			this.cboGenerador;

			this.jBombas = Array();
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
		change_cbobomba: function(e) {
			var idBomba = $(e.currentTarget).find('option:selected').val();
			var bomba = _.find(this.jBombas, {idBomba:parseInt(idBomba)});
			var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.voltaje; })

			bomba.CompuestoActivo = compuestos[0];

			var htmlComponente = this.tmp_componente_options({data:compuestos});
			this.cboGenerador.html(htmlComponente);

			this.dimencionar(bomba);
		},
		change_cbogenerador: function(e) {
			var idCompuesto = $(e.currentTarget).find('option:selected').val();
			var idBomba = this.cboBomba.find('option:selected').val();		

			var bomba = _.find(this.jBombas, {idBomba:parseInt(idBomba)});
			var compuesto = _.find(bomba.Compuestos, {idCompuesto:parseInt(idCompuesto)});

			var td = this.gvBombas.find('[data-idbomba="' + idBomba + '"] .compuesto');
			td.text(compuesto.idGenerador.nombre + ' ' + compuesto.idArreglo.potencia + ' Wp (' + compuesto.idArreglo.serie + 'x' + compuesto.idArreglo.paralelo + ')');
			
			bomba.CompuestoActivo = compuesto;
			this.dimencionar(bomba);
		},
		click_openItems: function(e) {
			var valor = $(e.currentTarget).data("valor");
			var bomba = this.$el.find('.nombreBombaTabla').data();
			var generador = this.$el.find('.nombreGenerador').data();

			this.popItems.render(valor, bomba, generador);
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
			function done(bombas) {
				var arrBombas = Array();
				for (var i = 0; i < bombas.length; i++)
					arrBombas.push(bombas.idBomba);

				app.ut.request({url:'/compuestos/populate', data:{where:{idBomba:arrBombas}}, done:doneCom});
				function doneCom(compuestos) {
					for (var i = 0; i < bombas.length; i++) {
						var comps = _.filter(compuestos, function(item) {
							return item.idBomba.idBomba == bombas[i].idBomba;
						});
						comps = _.sortBy(comps, function(item) { return item.idArreglo.voltaje; });

						bombas[i].Compuestos = comps;
						bombas[i].CompuestoActivo = comps[0];
					}

					that.jBombas = bombas;
					var tr = that.tmp_bombas({bombas:bombas});
					that.gvBombas.html(tr);

					that.cboBomba = that.gvBombas.find('[data-filed="bomba"]');
					that.cboGenerador = that.gvBombas.find('[data-filed="generador"]');

					var htmlBomba = that.tmp_bombas_options({data:bombas});
					var htmlComponente = that.tmp_componente_options({});

					that.cboBomba.html(htmlBomba);
					that.cboGenerador.html(htmlComponente);
				}
			}
		},
		rowSelected: function(e) {
			this.$el.find('tr').removeClass('isActive');
			var row = $(e.currentTarget).addClass('isActive');
			var idBomba = row.data("idbomba");

			var bomba = _.findWhere(this.jBombas, {idBomba:idBomba});
			var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.voltaje; })

			bomba.CompuestoActivo = compuestos[0];

			var htmlComponente = this.tmp_componente_options({data:compuestos});
			this.cboGenerador.html(htmlComponente);
			
			this.dimencionar(bomba);
		},
		rowSelectedCustom: function(tipoItem, idItem, nombreItem, idArreglo) {
			var that  = this;
			var tipoItem = tipoItem;
			var idItem = idItem;
			var nombreItem = nombreItem;
			var inputGenerador = that.$el.find('.nombreGenerador');
			var inputBomba = that.$el.find('.nombreBombaTabla');
			
			if (tipoItem==1) {
				inputBomba.data('idbomba', idItem);
				inputBomba.val(nombreItem);

				var idGenerador = inputGenerador.data('idgenerador');
				var idArreglo = inputGenerador.data('idarreglo');
				this.dimencionar(idGenerador, idItem, idArreglo);
			}
			else if (tipoItem==2) {
				inputGenerador.data('idgenerador', idItem);
				inputGenerador.data('idarreglo', idArreglo);
				inputGenerador.val(nombreItem);

				var idBomba = inputBomba.data('idbomba');
				this.dimencionar(idItem, idBomba, idArreglo);
			}
		},		
		click_buscar: function() {
			this.form.submit();
		},	
		click_calcular: function(){
			debugger
			var that = this;
			var idLocalidad = this.tyas.tyaidLocalidad.data('fn').current('idLocalidad');
			var total = that.txtAlturaDinamica.val();
			that.subViews.graficas.view.render(0, 0, idLocalidad);
			that.bombas(total);
			this.subViews.mapaElementos.view.close();
		},
		click_tabs: function(e) {
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
			longitud = this.txtLongitud.val();
			this.popFormCalcular.render(longitud);
		},
		dimencionar: function(bomba){
			var idBomba = bomba.idBomba, 
				idGenerador = bomba.CompuestoActivo.idGenerador.idGenerador, 				
				idArreglo = bomba.CompuestoActivo.idArreglo.idArreglo;

			var that =  this;
			var datos = viewsBase.base.prototype.getData.call(this, this.formData);

			var volumen,
				voltajeModulo =  30.3,
				corrienteModulo = 8.26,
				factorConversion = 367,
				factorFricción = 0,
				cargaFriccion = .3,
				//eficienciaBomba = .35,	
				eficienciaBomba = 0,
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
				rendimientoDiario = datos.rendimientoDiario * 1000;

			var alturaDinamica = datos.alturaDinamica;
			app.ut.request({url:'/rendimientos/eficiencia', data:{idBomba:idBomba, altura:alturaDinamica},done:doneA});
			function doneA(data){
				eficienciaBomba = (data.eficiencia)/100;
				//app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneB});
				var idLocalidad = datos.idLocalidad;
				app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:idLocalidad}},done:doneB});
				function doneB (data) {					
					if (data && data.length > 0){
						insolacion = data[0].promedio;
						var regimenBombeo = parseFloat(rendimientoDiario/insolacion);
						var cargaEstatica = parseFloat(alturaDinamica);
						var cargaDinamicaTotal = parseFloat(cargaEstatica+datos.perdida);						
						//app.ut.request({url:'/generadores', data:{where:{idGenerador:idGenerador}},done:doneC});
						app.ut.request({url:'/compuestos/populate', data:{where:{idGenerador:idGenerador, idBomba:idBomba, idArreglo:idArreglo}}, done:doneC});
						function doneC (data){
							if (data && data.length > 0) {
								var arreglo = data[0].idArreglo;

								voltajeOperacion =  arreglo.voltaje;

								var energiaHidraulica = (rendimientoDiario * cargaDinamicaTotal)/factorConversion;
								var currentBombaNombre = bomba.nombre;
								var currentMotorNombre = bomba.CompuestoActivo.idGenerador.nombre;

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

								that.cboGenerador.find('option[value="' + bomba.CompuestoActivo.idCompuesto + '"]').prop('selected', true);
								that.cboBomba.find('option[value="' + idBomba + '"]').prop('selected', true);
								
								if(aguaBombeada < rendimientoDiario || !aguaBombeada || !rendimientoDiario){
									console.log('No valida')
									that.cboGenerador.addClass('noValida');
									that.cboBomba.addClass('noValida');
								}
								else {
									console.log('Valida')
									that.cboGenerador.removeClass('noValida');
									that.cboBomba.removeClass('noValida');
								}
								app.ut.hide();								
								that.popFormArreglo.render(modulosParalelo, modulosSerie, totalModulo, arregloFotovoltaico,aguaBombeada, currentBombaNombre, currentMotorNombre);
								debugger
								that.subViews.graficas.view.render(totalModulo, alturaDinamica, idLocalidad);
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
		render: function(val, jBomba, jGenerador) {
			var that=this;
			var valor = parseInt(val);
			//app.ut.request({url:'/bombas/populate', done:done});
			app.ut.request({url:'/compuestos/populate', done:done});
			function done(data) {
				console.log(data);
				var arrDatosBombas=Array();
				if(data) {
					var info = data;

					if(valor == 2) {
						var compuesto = _.where(info, function(item) {
							return item.idGenerador.idGenerador == jGenerador.idgenerador;
						});

						for (var i = 0; i < compuesto.length; i++) {
							var row = {
								item: compuesto[i].idGenerador.nombre + ' ' + compuesto[i].idArreglo.serie + 'x' + compuesto[i].idArreglo.paralelo,
								idGenerador: compuesto[i].idGenerador.idGenerador,
								idArreglo: compuesto[i].idArreglo.idArreglo,
								descripcion: "Generadores",
								tipoElemento:2,
							}

							arrDatosBombas.push(row);
						}
					}
					else {
						for (var i = 0; i < info.length; i++) {
							var row = {
								item: info[i].idBomba.nombre,
								idBomba: info[i].idBomba.idBomba,
								descripcion: "Bombas",
								tipoElemento:1,
							}
							var existe = _.findWhere(arrDatosBombas, {idBomba:row.idBomba});
							if(existe)
								continue;

							arrDatosBombas.push(row);
						}
					}
	
					// for (var i = 0; i < info.length; i++) {	
					// 	switch (valor) {
					// 		case 1:
					// 			var bomba = {
					// 				item: info[i].nombre,
					// 				idBomba: info[i].idBomba,
					// 				descripcion: "Bombas",
					// 				tipoElemento:1,
					// 			}
				
					// 			arrDatosBombas.push(bomba);
					// 			break;
					// 		case 2:
					// 			var generador = {
					// 				item: info[i].idGenerador.nombre,
					// 				idGenerador: info[i].idGenerador.idGenerador,
					// 				descripcion: "Generadores",
					// 				tipoElemento:2,
					// 			}
					// 			arrDatosBombas.push(generador);
					// 			break;
					// 	}
					// };
	
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
			var that  = this;
			var rows = that.$el.find('tr').removeClass('isActive');
			var row =$(e.currentTarget).addClass('isActive');
		},
		click_datoSeleccionado: function(options) {
			var that  = this;
			var row = that.$el.find('tr.isActive');
			if (row.length>0) {
				var popNombre = row.data("item");
				var tipoItem = row.data("tipoitem");

				if (tipoItem==1) {
					var idbomba=row.data("idbomba");
					this.parentView.rowSelectedCustom(tipoItem,idbomba,popNombre, 0);
				}
				if (tipoItem==2) {
					var idgenerador=row.data("idgenerador");
					var idArreglo=row.data("idarreglo");
					this.parentView.rowSelectedCustom(tipoItem,idgenerador,popNombre, idArreglo);
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
			this.txtNombreMotor = this.$el.find('.nombre-motor');
			this.txtNombreBomba = this.$el.find('.nombre-bomba');
			this.txtAguaBombeada = this.$el.find('.agua-bombeada');
		},
		/*------------------------- Base -----------------------------*/
		render: function(modulosParalelo, modulosSerie, totalModulo, arregloFotovoltaico,aguaBombeada,currentBombaNombre,currentMotorNombre) {
			this.txtModulosSerie.text(Math.round(modulosSerie) || 0);
			this.txtModulosParalelo.text(Math.round(modulosParalelo) || 0);
			this.txtTotalModulos.text(Math.ceil(totalModulo) || 0);
			this.txtTamanoArreglo.text(Math.round(arregloFotovoltaico) || 0);
			this.txtNombreMotor.text(currentMotorNombre || "");
			this.txtNombreBomba.text(currentBombaNombre || "");
			this.txtAguaBombeada.text(Math.round(aguaBombeada) || 0);
			this.$el.foundation('reveal', 'open');
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
			this.clear();
		},
		clear: function() {
			this.formData[0].reset();
		},
		/*------------------------- Eventos -----------------------------*/
	});
	return {view:ViOrled};
});
