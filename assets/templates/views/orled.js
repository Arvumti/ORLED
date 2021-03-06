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
			'change [data-field="idLongitudTuberia"]': 'change_idLongitudTuberia',

			'change [data-filed="bomba"]':'change_cbobomba',
			'change [data-filed="generador"]':'change_cbogenerador',
			
			'change [data-field="diametroTuberiaTh"]':'change_cboDiametroTuberiaTh',
		},
		initialize: function() {
			var that = this;
			this.bombasFinish = Array();
			this.localidad = Object();

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
						txtAnguloInclinacion.val(latitud);

						that.localidad = data;

						app.ut.request({url:'/irradianciasDias/meses', data:{idLocalidad:that.localidad.idLocalidad},done:doneB});
						function doneB (data) {
							if (data && data.length > 0){
								that.localidad.promedio = data[0].promedio;
							}
						}
					}
				},
			};
			this.spinners = this.$el.find('.linker-spinner:not(.spinner-decimal)');
			this.spinners.spinner();

			this.$el.find('.linker-spinner:not(.spinner-decimal)~.ui-button').on('click', function(e) {
				//$(this).siblings('input').change();
				//$(e.currentTarget).select();
				var input = $(e.currentTarget).siblings('input');
				var value = parseInt(input.val());
				var isDown = $(e.currentTarget).hasClass('ui-spinner-down') ? -1 : 1;

				if(value < 5)
					value = value;
				else {
					if(value >= 5 && value < 50)
						value += isDown * 5;
					else if(value >= 50 && value < 100)
						value += isDown * 10;
					else if(value >= 100 && value < 500)
						value += isDown * 100;
					else if(value >= 500 && value < 1000)
						value += isDown * 200;
					else if(value >= 1000 && value < 10000)
						value += isDown * 1000;
					else if(value >= 10000)
						value += isDown * 10000;

					value += isDown * -1 * 1;
				}

				input.val(value).select();
			});

			this.spinnersDec = this.$el.find('.linker-spinner.spinner-decimal');
			this.spinnersDec.spinner({step:0.1, numberFormat:'n'});

			this.$el.find('.linker-spinner.spinner-decimal~.ui-button').on('click', function(e) {
				$(e.currentTarget).siblings('input').select();
			});

			var tyas = this.$el.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);
			this.gvBombas = this.$el.find('.gvBombas');
			this.idBombaInicial=0;
			this.idGeneradorInicial=0;
			this.longTube = this.$el.find('.longTube');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			this.formData = this.$el.find('.form-data');
			this.spnAltcarDinamica = this.$el.find('.spn-altcar-dinamica');
			
			this.tmp_items = Handlebars.compile(this.$el.find('.tmp_items').html());
			this.tmp_bombas_options = Handlebars.compile(this.$el.find('.tmp_bombas_options').html());
			this.tmp_componente_options = Handlebars.compile(this.$el.find('.tmp_componente_options').html());

			this.subContentEntradas = this.$el.find('.sub-content.pnl-entradas');
			this.subContentCableado = this.$el.find('.sub-content.pnl-cableado');
			this.txtAlturaDinamica = this.$el.find('[data-field="alturaDinamica"]');
			this.txtLongitud = this.$el.find('[data-field="longitudTuberia"]');
			this.txtRendimientoDiario = this.$el.find('[data-field="rendimientoDiario"]');

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
		william: function(longitud, coeficiente, alturaDes, diametroPulgadas, rendimiento, horas_pico) {
			var Q = rendimiento/horas_pico/3600;
			var diametroMm = parseFloat((diametroPulgadas*25.4));
			var diametroMetros = parseFloat((diametroMm/1000));
			var V = parseFloat(0.004*Q/Math.PI/Math.pow(diametroMetros,2));
			var H = parseFloat(((6.83*Math.pow((V/coeficiente),1.852))*longitud)/(Math.pow(diametroMetros,1.17)));
			var total = parseFloat(H+alturaDes);
			V = V.toFixed(2);
			H = H.toFixed(2);
			total = total.toFixed(2);
			var resultados = { Q:Q, V:V, H:H, total:total };

			return resultados;		
		},
		manning: function(longitud, coeficiente, alturaDes, diametroPulgadas, rendimiento, horas_pico) {
			var Q = (rendimiento*1000)/horas_pico/3600/1000;
			var diametroMm = parseFloat((diametroPulgadas*25.4));
			var diametroMetros = parseFloat((diametroMm/1000));
			
			//10.3*(H12^2)*((G16^2)/(H14^5.33))*H11
			var V = 0;
			var H = parseFloat(10.3*Math.pow(coeficiente, 2)*(Math.pow(Q, 2)/Math.pow(diametroMetros, 5.33))*parseFloat(longitud));
			var total = parseFloat(H+alturaDes);
			H = H.toFixed(2);
			total = total.toFixed(2);
			var resultados = { Q:Q, V:V, H:H, total:total };

			return resultados;
		},
		cargaTotal: function() {
			var that = this;
			var value = this.$el.find('[data-field="idLongitudTuberia"]').prop('checked');

			var total = 0;
			if(value) {
				var longitud = this.txtLongitud.val() || 0;
				var rendimiento = this.txtRendimientoDiario.val() || 0;
				var horas_pico = this.localidad.promedio || 0;
				//this.popFormCalcular.render(longitud, rendimiento, horas_pico);

				var alturaDes = parseFloat(that.txtAlturaDinamica.val());
				var coeficiente = parseFloat(this.$el.find('[data-field="coeficienteTuberia"] option:selected').val());
				var diametroPulgadas = parseFloat((this.$el.find('[data-field="diametroTuberia"] option:selected').val()));
				
				var resultados = this.manning(longitud, coeficiente, alturaDes, diametroPulgadas, rendimiento, horas_pico);
		 		total = resultados.total;
			}
			else
				total = that.txtAlturaDinamica.val();

			return total;
		},
		/*------------------------- Eventos -----------------------------*/
		change_cbobomba: function(e) {
			var idBomba = $(e.currentTarget).find('option:selected').val();
			var bomba = _.find(this.jBombas, {idBomba:parseInt(idBomba)});
			var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.paralelo + '.' + item.idArreglo.serie; })

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

			//var td = this.gvBombas.find('[data-idbomba="' + idBomba + '"] .compuesto');
			//td.text(compuesto.idArreglo.potencia + ' Wp Arreglo (' + compuesto.idArreglo.serie + 'x' + compuesto.idArreglo.paralelo + ') Mod. 250');
			
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
			var value = $(e.currentTarget).prop('checked');
			this.longTube.attr('disabled', !value);

			if(value) 
				this.spnAltcarDinamica.text('Nivel estatico');
			else
				this.spnAltcarDinamica.text('Carga dinamica');
		},
		bombas: function(joptions) {
			var totalAltura = joptions.total;

			var that = this;
			var rendimiento = this.txtRendimientoDiario.val();

			var alturaDinamica = parseFloat(totalAltura) + .001;
			var where = {
				alturaMaxima: {
					'>=': parseFloat(totalAltura) - .001
				},
				alturaMinima: {
					'<=': parseFloat(totalAltura) + .001
				},
			};

			debugger

			if(joptions.recalculate)
				app.ut.request({url:'/bombas/populate', /*data:{where:where},*/ loading:true, done:done});
			else
				done([]);

			function done(res_bombas) {
				var bombas = Array();
				var arrGeneradres = Array(),
					diametro = that.$el.find('[data-field="diametroTuberia"]').val();

				for (var i = 0; i < res_bombas.length; i++) {
					if(res_bombas[i].alturaMaxima >= where.alturaMaxima['>='] && res_bombas[i].alturaMinima <= where.alturaMinima['<=']) 
						bombas.push(res_bombas[i]);
					
					arrGeneradres.push(res_bombas[i].idGenerador.idGenerador);
				}
				arrGeneradres = _.unique(arrGeneradres);

				if(joptions.recalculate)
					app.ut.request({url:'/compuestos/populate', data:{where:{idGenerador:arrGeneradres}}, done:doneCom});
				else
					doneCom();

				function doneCom(compuestos) {
					compuestos = _.unique(compuestos, function(item) { return item.idArreglo.idArreglo + '_' + item.idGenerador.idGenerador });

					for (var i = 0; i < res_bombas.length; i++) {
						var comps = _.filter(compuestos, function(item) {
							return item.idGenerador.idGenerador == res_bombas[i].idGenerador.idGenerador;
						});
						comps = _.sortBy(comps, function(item) { return item.idArreglo.paralelo + '.' + item.idArreglo.serie; });

						res_bombas[i].Compuestos = comps;
						res_bombas[i].CompuestoActivo = comps[0];
					}

					var idBombaPreActive = 0;
					if(!joptions.recalculate) {
						bombas = res_bombas = that.bombasFinish;
						that.bombasFinish = [];

						idBombaPreActive = that.gvBombas.find('tr.isActive').data('idbomba');
					}
					else
						that.bombasFinish = [];

					that.jBombas = res_bombas;
					var value = that.$el.find('[data-field="idLongitudTuberia"]').prop('checked');

					var tr = that.tmp_bombas({bombas:bombas, diametro:value});
					that.gvBombas.html(tr);
					//diametro = that.$el.find('[data-field="diametroTuberia"]').val();
					that.gvBombas.find('[data-field="diametroTuberiaTh"]').val(diametro);

					that.cboBomba = that.gvBombas.find('[data-filed="bomba"]');
					that.cboGenerador = that.gvBombas.find('[data-filed="generador"]');

					var htmlBomba = that.tmp_bombas_options({data:res_bombas});
					var htmlComponente = that.tmp_componente_options({});

					that.cboBomba.html(htmlBomba);
					that.cboGenerador.html(htmlComponente);

					var tr = that.gvBombas.find('tbody tr:first-child');
					if(tr.length > 0) {
						//tr.click();

						that.$el.find('tr').removeClass('isActive');
						var row = tr.addClass('isActive');
						var idBomba = row.data("idbomba");

						var bomba = _.findWhere(bombas, {idBomba:idBomba});
						var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.paralelo + '.' + item.idArreglo.serie; });

						var init = 0,
							finit = compuestos.length;

						bomba.CompuestoActivo = compuestos[init];

						var htmlComponente = that.tmp_componente_options({data:compuestos});
						that.cboGenerador.html(htmlComponente);

						var	firstCompuestos = Array(),
							firstidCompuesto = null,
							firstidBomba = null,
							find = false;

						var dfdBombas = Array();
						for (var i = 0; i < bombas.length; i++) {
							var dfdBomba = $.Deferred();
							dfdBombas.push({dfd:dfdBomba, bomba:bombas[i] });

							dfdBomba.then(function(bomba) {
								var dfdCompuesto = Array();
								//var find = false;

								var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.paralelo + '.' + item.idArreglo.serie; });
								var init = 0,
									finit = compuestos.length;

								var htmlComponente = that.tmp_componente_options({data:compuestos});
								that.cboGenerador.html(htmlComponente);

								for (var j = 0; j < compuestos.length; j++) {
									var dfd = $.Deferred();
									dfdCompuesto.push(dfd);

									dfd.then(function(diario) {
										init++;
										if(diario >= rendimiento) {
											if(!find) {
												firstidCompuesto = compuestos[init-1].idCompuesto;
												firstidBomba = bomba.idBomba;

												firstCompuestos = compuestos;
												find = true;
												that.$el.find('tr').removeClass('isActive');
												that.$el.find('tr[data-idbomba="' + bomba.idBomba + '"]').addClass('isActive');
											}

											bomba.diario = diario;
											that.bombasFinish.push(bomba);
											for (var k = init; k < finit; k++)
												dfdCompuesto[k].reject();
											init = finit;
										}
										else
											bomba.Compuestos.shift(init-1, 1);

										if(init < finit) {
											var dfdInn = dfdCompuesto[init];
											bomba.CompuestoActivo = compuestos[init];
											that.dimencionar(bomba, dfdInn);
										}
										else {//if(!find) {
											if(dfdBombas.length == 0) {
												debugger
												if(that.bombasFinish.length == 0)
													return;

												if(joptions.recalculate)
													that.bombasFinish = _.take(_.sortBy(that.bombasFinish, 'diario'), 4);

												firstidCompuesto = that.bombasFinish[0].Compuestos[0].idCompuesto;
												firstidBomba = that.bombasFinish[0].idBomba;

												firstCompuestos = that.bombasFinish[0].Compuestos;
												find = true;
												that.$el.find('tr').removeClass('isActive');
												that.$el.find('tr[data-idbomba="' + that.bombasFinish[0].idBomba + '"]').addClass('isActive');


												var tr = that.tmp_bombas({bombas:that.bombasFinish, diametro:value});
												that.gvBombas.html(tr);
												that.gvBombas.find('[data-field="diametroTuberiaTh"]').val(diametro);

												that.cboBomba = that.gvBombas.find('[data-filed="bomba"]');
												that.cboGenerador = that.gvBombas.find('[data-filed="generador"]');

												var htmlBomba = that.tmp_bombas_options({data:res_bombas});
												that.cboBomba.html(htmlBomba);

												var htmlComponente = that.tmp_componente_options({data:firstCompuestos});
												that.cboGenerador.html(htmlComponente);

												that.cboBomba.val(firstidBomba);
												that.cboGenerador.val(firstidCompuesto);

												that.$el.find('tr').removeClass('isActive');
												that.$el.find('tr[data-idbomba="' + firstidBomba + '"]').addClass('isActive');

												//that.subViews.graficas.view.execute_graf();
												var tr = that.gvBombas.find('tbody tr:first-child');
												if(!joptions.recalculate)
													tr = that.gvBombas.find('tbody tr[data-idbomba="' + idBombaPreActive + '"]');

												tr.click();
												app.ut.hide();
											}
											else {
												var popBomba = dfdBombas.shift();
												popBomba.dfd.resolve(popBomba.bomba);
											}
										}
										// else {
										// 	for (var k = 0; k < dfdBombas.length; k++)
										// 		dfdBombas[k].dfd.reject();

										// 	app.ut.hide();
										// }
									});
								}

								that.dimencionar(bomba, dfdCompuesto[0]);
							});
						}

						that.$el.find('tr').removeClass('isActive');
						var popBomba = dfdBombas.shift();
						popBomba.dfd.resolve(popBomba.bomba);
						//that.dimencionar(bomba, null);
					}
					else
						that.subViews.graficas.view.clear();
				}
			}
		},
		rowSelected: function(e) {
			this.$el.find('tr').removeClass('isActive');
			var row = $(e.currentTarget).addClass('isActive');
			var idBomba = row.data("idbomba");

			var bomba = _.findWhere(this.jBombas, {idBomba:idBomba});
			var compuestos = _.sortBy(bomba.Compuestos, function(item) { return item.idArreglo.paralelo + '.' + item.idArreglo.serie; })

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
		click_calcular: function(options){
			var that = this;
			this.subViews.graficas.view.isFirst = false;
			var value = this.$el.find('[data-field="idLongitudTuberia"]').prop('checked');

			debugger
			var total = this.cargaTotal();

			var idLocalidad = this.tyas.tyaidLocalidad.data('fn').current('idLocalidad');
			//that.subViews.graficas.view.render(0, 0, idLocalidad);
			var joptions = {
				total: total,
				recalculate: options.recalculate === undefined ? true : options.recalculate
			}

			that.bombas(joptions);
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
		dimencionar: function(bomba, dfd) {
			var idBomba = 0, 
				idGenerador = 0,
				idArreglo = 0;

			try {
				idBomba = bomba.idBomba;
				idGenerador = bomba.CompuestoActivo.idGenerador.idGenerador;
				idArreglo = bomba.CompuestoActivo.idArreglo.idArreglo;
			}
			catch(ex) {
				if(dfd && typeof dfd === 'object' && typeof dfd.resolve === 'function')
					dfd.resolve(0);
				else
					return 0;
			}

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
				insolacion = this.localidad.promedio,
				rendimientoDiario = datos.rendimientoDiario * 1000;

			var alturaDinamica = this.cargaTotal();
			app.ut.request({url:'/rendimientos/eficiencia', data:{idBomba:idBomba, altura:alturaDinamica},done:doneA});
			function doneA(data){
				eficienciaBomba = (data.eficiencia)/100;
				var idLocalidad = datos.idLocalidad;

				var regimenBombeo = parseFloat(rendimientoDiario/insolacion);
				var cargaEstatica = parseFloat(alturaDinamica);
				var cargaDinamicaTotal = parseFloat(cargaEstatica) + parseFloat(datos.perdida);						

				var arreglo = bomba.CompuestoActivo.idArreglo;
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
				var panelesInstalados = arreglo.serie * arreglo.paralelo;
				var arregloFotovoltaico = totalModulo * corrienteModulo * voltajeModulo;

				var aguaBombeada = (modulosParalelo * corrienteModulo * voltajeOperacion * eficienciaBomba * factorConversion * insolacion * .90) / cargaDinamicaTotal;								
				var regimenBombeo2 = aguaBombeada/insolacion;
				console.log(regimenBombeo2);

				that.cboGenerador.find('option[value="' + bomba.CompuestoActivo.idCompuesto + '"]').prop('selected', true);
				that.cboBomba.find('option[value="' + idBomba + '"]').prop('selected', true);
				
				if(aguaBombeada < rendimientoDiario || !aguaBombeada || !rendimientoDiario || arregloFotovoltaico < 0){
					console.log('No valida')
					// that.cboGenerador.addClass('noValida');
					// that.cboBomba.addClass('noValida');
				}
				else {
					console.log('Valida')
					// that.cboGenerador.removeClass('noValida');
					// that.cboBomba.removeClass('noValida');
				}

				if(dfd === undefined)
					app.ut.hide();
				
				//that.popFormArreglo.render(modulosParalelo, modulosSerie, totalModulo, arregloFotovoltaico,aguaBombeada, currentBombaNombre, currentMotorNombre);
				that.subViews.graficas.view.render(panelesInstalados, alturaDinamica, rendimientoDiario, idLocalidad, data.gasto, bomba, dfd);
			}
		},
		change_cboDiametroTuberiaTh: function(e) {
			var diametro = $(e.currentTarget).find('option:selected').val();
			this.$el.find('[data-field="diametroTuberia"]').val(diametro);

			this.click_calcular();
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
			var row = $(e.currentTarget).addClass('isActive');
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
