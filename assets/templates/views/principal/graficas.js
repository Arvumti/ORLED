var deps = [
	'/js/base/viewsBase.js',
	'/js/graficas/highcharts.js',
	'text!/templates/views/principal/graficas.html',
];

define(deps, function (viewsBase, highcharts, html) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViGraficas = Backbone.View.extend({
		el: '#graficas',
		events: {
			//'click .btn-calcular' :'click_llenarGrafica',
			'click .tipo-grafica' :'click_tipoGrafica',
		},
		initialize: function() {
			this.PnlGraficaMes = this.$el.find('.pnl-grafica-mes');
			this.PnlGraficaDia = this.$el.find('.pnl-grafica-dia');
			this.chkIrracion = this.$el.find('.irracion');

			this.optionsGraficas = {
				irradianciaMes: {
					color: '#FDD400',
					titulo: '[kWh/m2 por día]',
					datos: Object(),
				},
				irradianciaDia: {
					color: '#FDD400',
					titulo: '[kWh/m2 h]',
					datos: Object(),
				},
				energiaMes: {
					color: '#E50000',
					titulo: '[kWh por día]',
					datos: Object(),
				},
				energiaDia: {
					color: '#E50000',
					titulo: '[kWh]',
					datos: Object(),
				},
				salidaMes: {
					color: '#007EC7',
					titulo: '[m3 por día]',
					datos: Object(),
				},
				salidaDia: {
					color: '#007EC7',
					titulo: '[m3/h]',
					datos: Object(),
				},
			};

			this.tipo_grafica = "1";

			this.isFirst = false;
		},
		/*------------------------- Base -----------------------------*/
		render: function(totalModulo, cargaDinamica, rendimientoDiario, idLocalidad, gasto, bomba, dfd) {
			viewsBase.abc.prototype.render.call(this);
			this.llenarGrafica(totalModulo, cargaDinamica, rendimientoDiario, idLocalidad, gasto, bomba, dfd);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		clear: function() {
			this.crear_GraficaMes([]);
			this.crear_GraficaHora([]);
		},
		execute_graf: function() {
			this.$el.find('.tipo-grafica[value="' + this.tipo_grafica + '"]').click();
			this.isFirst = false;
		},
		/*------------------------- Eventos -----------------------------*/
		crear_GraficaMes: function(jDatos) {
			var that = this;
			var datos = _.values(jDatos.datos);
			var total = _.reduce(datos, function(memo, num) { return memo + num; }, 0) / datos.length;
			total = parseFloat(total.toFixed(2));

			var totalAnual = _.reduce(datos, function(memo, num) { return memo + (num * 30); }, 0);
			totalAnual = parseFloat(totalAnual.toFixed(2));

			datos.push(total);
			that.PnlGraficaMes.highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: ''
				},
				xAxis:{
					categories:[
						'Enero',
						'',
						'',
						'Abril',
						'',
						'',
						'Julio',
						'',
						'',
						'Octubre',
						'',
						'',
						'Promedio'
					],
				},
				yAxis: {
					min: 0,
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						}
					},
					title: {
						text: jDatos.titulo
					}
				},
				tooltip: {
					enabled: false
				},
				plotOptions: {
					column: {
					stacking: 'normal',
					}
				},
				series: [{
					name: 'Total anual: ' + totalAnual,
					color: jDatos.color,
					//data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]	
					data: datos
				}]
			});
		},
		crear_GraficaHora: function(jDatos){
			var that = this;
			var datos = _.values(jDatos.datos);
			var total = _.reduce(datos, function(memo, num) { return memo + num; }, 0);// / datos.length;
			total = parseFloat(total.toFixed(1));

			that.PnlGraficaDia.highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: ''
				},
				xAxis:{
					categories:[
						'6:00',
						'',
						'',
						'9:00',
						'',
						'',
						'12:00',
						'',
						'',
						'15:00',
						'',
						'',
						'18:00',
						'',
					],
				},
				yAxis: {
					min: 0,
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						}
					},
					title: {
						text: jDatos.titulo
					}
				},
				tooltip: {
					enabled: false
				},
				plotOptions: {
					column: {
					stacking: 'normal',
					}
				},	
				series: [{
					name: 'Total diario: ' + total,
					color: jDatos.color,
					//data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]	
					data: datos
				}]
			});
		},
		click_tipoGrafica: function(e) {
			var valor = $(e.currentTarget).val();
			var datos = Object();

			this.tipo_grafica = valor;

			switch(this.tipo_grafica) {
				case "1":
					this.crear_GraficaMes(this.optionsGraficas.salidaMes);
					this.crear_GraficaHora(this.optionsGraficas.salidaDia);
					break;
				case "2":
					this.crear_GraficaMes(this.optionsGraficas.energiaMes);
					this.crear_GraficaHora(this.optionsGraficas.energiaDia);
					break;
				case "3": 
					this.crear_GraficaMes(this.optionsGraficas.irradianciaMes);
					this.crear_GraficaHora(this.optionsGraficas.irradianciaDia);
					break;
			}

			//this.crear_GraficaMes(datos);
		},
		llenarGrafica: function(totalModulo, cargaDinamica, rendimientoDiario, idLocalidad, gasto, bomba, dfd) {
			var that = this;

			/*-------------------------------Datos por mes----------------------------------*/

			app.ut.request({url:'/irradianciasDias', data:{where:{idLocalidad:idLocalidad}},done:doneI});
			function doneI (data) {
				var allData = _.clone(data);
				var concentradoMes = {
					'enero': Array(),
					'febrero': Array(),
					'marzo': Array(),
					'abril': Array(),
					'mayo': Array(),
					'junio': Array(),
					'julio': Array(),
					'agosto': Array(),
					'septiembre': Array(),
					'octubre': Array(),
					'noviembre': Array(),
					'diciembre': Array(),
				};
				var concentradoHora = {
					'6': Array(),
					'7': Array(),
					'8': Array(),
					'9': Array(),
					'10': Array(),
					'11': Array(),
					'12': Array(),
					'13': Array(),
					'14': Array(),
					'15': Array(),
					'16': Array(),
					'17': Array(),
					'18': Array(),
					'19': Array(),
				};

				var promMes = Object();
				var promHora = Object();

				for (var i = 0; i < data.length; i++) {
					var hora = data[i].hora;

					// delete data[i].idIrradianciaDia;
					// delete data[i].createdAt;
					// delete data[i].idLocalidad;
					// delete data[i].updatedAt;
					// delete data[i].hora;

					for(var key in data[i]) {
						if(key == 'idIrradianciaDia' || key == 'createdAt' || key == 'idLocalidad' || key == 'updatedAt' || key == 'hora')
							continue;

						if(data[i][key] > 0) {
							concentradoHora[hora].push(data[i][key]);
							concentradoMes[key].push(data[i][key]);
						}
					}
				}

				for(var key in concentradoMes) {
					var rows = concentradoMes[key];
					var promedio = 0;

					if(rows.length > 0)
						promedio = _.reduce(rows, function(memo, num) { return memo + num; }, 0);// / rows.length;

					promMes[key] = parseFloat(promedio.toFixed(2));
				}

				for(var key in concentradoHora) {
					var rows = concentradoHora[key];
					var promedio = 0;
					
					if(rows.length > 0)
						promedio = _.reduce(rows, function(memo, num) { return memo + num; }, 0) / rows.length;

					promHora[key] = parseFloat(promedio.toFixed(2));
				}

				that.optionsGraficas.irradianciaMes.datos = promMes;
				that.optionsGraficas.irradianciaDia.datos = promHora;

				// that.crear_GraficaMes(that.optionsGraficas.irradianciaMes);
				// that.crear_GraficaHora(that.optionsGraficas.irradianciaDia);

				that.chkIrracion.prop("checked", true);
				var energiaMes = Object(),
					outputMes = Object(),
					energiaDia = Object(),
					outputDia = Object();

				/* produccion de energia */
				var areaModulo = 1.65;
				var waths = 250;
				var eficiencia = (waths/areaModulo)/1000;
				var perdidas = 0.9;
				var constante = 1000;

				/* produccion de output */
				var eficienciaBomba = 0.58;
				var factorConversion = 367;

				var frecuencia = bomba.idGenerador.frecuencia,
					potencia = bomba.idGenerador.potencia,
					alturaMaxima = bomba.alturaTope;

				for(var key in promMes) {
					var subEnergiaMes =  areaModulo * eficiencia * perdidas * Math.ceil(totalModulo) * promMes[key];/*constante **/ 
					
					var f1 = frecuencia / Math.pow((potencia / (subEnergiaMes * 1000)), (1/3));
					var h1 = alturaMaxima / (Math.pow(frecuencia, 2)/Math.pow(f1, 2));
					var q1 = 0;

					if(h1 > cargaDinamica)
						q1 = gasto / (frecuencia / f1);

					var subOutputMes = q1;

					energiaMes[key] = parseFloat(subEnergiaMes.toFixed(2));
					outputMes[key] = 0;//parseFloat(subOutputMes.toFixed(2));
				}

				for(var key in promHora) {
					var subEnergiaDia = areaModulo * eficiencia * perdidas * Math.ceil(totalModulo) * promHora[key];

					var f1 = frecuencia / Math.pow((potencia / (subEnergiaDia * 1000)), (1/3));
					var h1 = alturaMaxima / (Math.pow(frecuencia, 2)/Math.pow(f1, 2));
					var q1 = 0;

					if(h1 > cargaDinamica)
						q1 = gasto / (frecuencia / f1);

					if(q1 > gasto)
						q1 = gasto;

					var subOutputDia = q1;

					energiaDia[key] = parseFloat(subEnergiaDia.toFixed(2));
					outputDia[key] = parseFloat(subOutputDia.toFixed(2));
				}
				
				var horaAll = {
					'6': 0,
					'7': 0,
					'8': 0,
					'9': 0,
					'10': 0,
					'11': 0,
					'12': 0,
					'13': 0,
					'14': 0,
					'15': 0,
					'16': 0,
					'17': 0,
					'18': 0,
					'19': 0,
				};
				
				for (var i = 0; i < allData.length; i++) {
					var row = allData[i];

					var hora = row.hora;

					delete row.idIrradianciaDia;
					delete row.createdAt;
					delete row.idLocalidad;
					delete row.updatedAt;
					delete row.hora;

					var sumOut = 0, sumEne = 0;

					for(var key in row) {
						var subEnergiaDia = areaModulo * eficiencia * perdidas * Math.ceil(totalModulo) * row[key];

						var f1 = frecuencia / Math.pow((potencia / (subEnergiaDia * 1000)), (1/3));
						var h1 = alturaMaxima / (Math.pow(frecuencia, 2)/Math.pow(f1, 2));
						var q1 = 0;

						if(h1 > cargaDinamica)
							q1 = gasto / (frecuencia / f1);

						if(q1 > gasto)
							q1 = gasto;

						var subOutputDia = q1;

						var datos = {
							energia: parseFloat(subEnergiaDia.toFixed(2)),
							output: parseFloat(subOutputDia.toFixed(2)),
						};
						row[key] = datos;

						//energiaMes[key] += datos.energia;
						outputMes[key] += datos.output;

						sumEne += datos.energia
						sumOut += datos.output;
					}

					sumOut = sumOut / 12;
					sumEne = sumEne / 12;
					horaAll[hora] = sumOut;

					energiaDia[hora] = parseFloat(sumEne.toFixed(2));
					outputDia[hora] = parseFloat(sumOut.toFixed(2));
				}

				var sum = 0;
				for (var i = 0; i < allData.length; i++) {
					var row = allData[i];
					sum += (row.enero.output + row.febrero.output + row.marzo.output + row.abril.output + 
					row.mayo.output + row.junio.output + row.julio.output + row.agosto.output + 
					row.septiembre.output + row.octubre.output + row.noviembre.output + row.diciembre.output ) / 12;
				}

				if(dfd && typeof dfd === 'object' && typeof dfd.resolve === 'function') {
					if(sum < (rendimientoDiario / 1000) || that.isFirst)
						dfd.resolve(sum);
					else {
						that.isFirst = true;

						that.optionsGraficas.energiaMes.datos = energiaMes;
						that.optionsGraficas.salidaMes.datos = outputMes;

						that.optionsGraficas.energiaDia.datos = energiaDia;
						that.optionsGraficas.salidaDia.datos = outputDia;

						that.$el.find('.tipo-grafica[value="' + that.tipo_grafica + '"]').click();
						dfd.resolve(sum);
					}
				}
				else {
					that.optionsGraficas.energiaMes.datos = energiaMes;
					that.optionsGraficas.salidaMes.datos = outputMes;

					that.optionsGraficas.energiaDia.datos = energiaDia;
					that.optionsGraficas.salidaDia.datos = outputDia;

					that.$el.find('.tipo-grafica[value="' + that.tipo_grafica + '"]').click();
				}
			}
		},
	});
	return {view: ViGraficas, html:html};
});