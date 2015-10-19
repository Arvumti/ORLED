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
					titulo: '[m2 por día]',
					datos: Object(),
				},
				salidaDia: {
					color: '#007EC7',
					titulo: '[m2/h]',
					datos: Object(),
				},
			};
		},
		/*------------------------- Base -----------------------------*/
		render: function(totalModulo, cargaDinamica, idLocalidad) {
			viewsBase.abc.prototype.render.call(this);
			this.llenarGrafica(totalModulo, cargaDinamica, idLocalidad);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
		crear_GraficaMes: function(jDatos) {
			var that = this;
			var datos = _.values(jDatos.datos);
			var total = _.reduce(datos, function(memo, num) { return memo + num; }, 0) / datos.length;
			total = parseFloat(total.toFixed(2));

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
					name: 'Total anual: ' + total,
					color: jDatos.color,
					//data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]	
					data: datos
				}]
			});
		},
		crear_GraficaHora: function(jDatos){
			var that = this;
			var datos = _.values(jDatos.datos);
			var total = _.reduce(datos, function(memo, num) { return memo + num; }, 0) / datos.length;
			total = parseFloat(total.toFixed(2));

			that.PnlGraficaDia.highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: ''
				},
				xAxis:{
					categories:[
						'5:00',
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
						'18:00'
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

			switch(valor) {
				case "1":
					this.crear_GraficaMes(this.optionsGraficas.irradianciaMes);
					this.crear_GraficaHora(this.optionsGraficas.irradianciaDia);
					break;
				case "2":
					this.crear_GraficaMes(this.optionsGraficas.energiaMes);
					this.crear_GraficaHora(this.optionsGraficas.energiaDia);
					break;
				case "3": 
					this.crear_GraficaMes(this.optionsGraficas.salidaMes);
					this.crear_GraficaHora(this.optionsGraficas.salidaDia);
					break;
			}

			//this.crear_GraficaMes(datos);
		},
		llenarGrafica: function(totalModulo, cargaDinamica, idLocalidad){
			var that = this;

			/*-------------------------------Datos por mes----------------------------------*/

			app.ut.request({url:'/irradianciasDias', data:{where:{idLocalidad:idLocalidad}},done:doneI});
			function doneI (data) {
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

					delete data[i].idIrradianciaDia;
					delete data[i].createdAt;
					delete data[i].idLocalidad;
					delete data[i].updatedAt;
					delete data[i].hora;

					for(var key in data[i]) {
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
						promedio = _.reduce(rows, function(memo, num) { return memo + num; }, 0) / rows.length;

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

				that.crear_GraficaMes(that.optionsGraficas.irradianciaMes);
				that.crear_GraficaHora(that.optionsGraficas.irradianciaDia);

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

				for(var key in promMes) {
					var subEnergiaMes =  areaModulo * eficiencia * perdidas * constante * Math.ceil(totalModulo) * promMes[key];
					var subOutputMes = 0;

					energiaMes[key] = parseFloat(subEnergiaMes.toFixed(2));
					outputMes[key] = parseFloat(subOutputMes.toFixed(2));
				}

				for(var key in promHora) {
					var subEnergiaDia = areaModulo * eficiencia * perdidas * Math.ceil(totalModulo) * promHora[key];
					var subOutputDia = 0;

					energiaDia[key] = parseFloat(subEnergiaDia.toFixed(2));
					outputDia[key] = parseFloat(subOutputDia.toFixed(2));
				}

				that.optionsGraficas.energiaMes.datos = energiaMes;
				that.optionsGraficas.salidaMes.datos = outputMes;

				that.optionsGraficas.energiaDia.datos = energiaDia;
				that.optionsGraficas.salidaDia.datos = outputDia;
			}
		},
	});
	return {view: ViGraficas, html:html};
});