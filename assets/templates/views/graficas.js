var deps = [
	'/js/base/viewsBase.js',
	'/js/graficas/highcharts.js',
];

define(deps, function (viewsBase, highcharts) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViGraficas = Backbone.View.extend({
		el: '#graficas',
		events: {
			'click .btn-calcular' :'click_llenarGrafica',
			'click .tipo-grafica' :'click_tipoGrafica',
		},
		initialize: function() {
			debugger
			this.PnlGraficaMes = this.$el.find('.pnl-grafica-mes');
			this.PnlGraficaDia = this.$el.find('.pnl-grafica-dia');
			this.ChkIrracion = this.$el.find('.irracion');

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
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
		crear_GraficaMes: function(jDatos){
			debugger
			var that = this;
			var datos = _.values(_.pick(jDatos.datos, 'enero', 'febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre', 'promedio'));
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
					name: 'Total anual: ',
					color: jDatos.color,
					//data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]	
					data: datos
				}]
			});
		},
		crear_GraficaHora: function(jDatos){
			debugger
			var that = this;
			var datos = _.values(_.pick(jDatos.datos, 'enero', 'febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre', 'promedio'));
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
					name: 'Total diario: ',
					color: jDatos.color,
					//data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]	
					data: datos
				}]
			});
		},
		click_tipoGrafica: function(e) {
			debugger
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
		click_llenarGrafica: function(e){
			var that = this;
			debugger

			/*-------------------------------Datos por mes----------------------------------*/

			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneI});
			function doneI (data) {
				that.optionsGraficas.irradianciaMes.datos = data[0] || Object();
				that.crear_GraficaMes(that.optionsGraficas.irradianciaMes);
				that.ChkIrracion.prop("checked", true);
			}
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneE});
			function doneE (data) {
				that.optionsGraficas.energiaMes.datos = data[0] || Object();
			}
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneO});
			function doneO (data) {
				that.optionsGraficas.salidaMes.datos = data[0] || Object();
			}

			/*-------------------------------Datos por hora----------------------------------*/
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneIH});
			function doneIH (data) {
				that.optionsGraficas.irradianciaDia.datos = data[0] || Object();
				that.crear_GraficaHora(that.optionsGraficas.irradianciaDia);
			}
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneEH});
			function doneEH (data) {
				that.optionsGraficas.energiaDia.datos = data[0] || Object();
			}
			app.ut.request({url:'/irradianciasMeses', data:{where:{idLocalidad:1}},done:doneOH});
			function doneOH (data) {
				that.optionsGraficas.salidaDia.datos = data[0] || Object();
			}
		},
	});
	return {view: ViGraficas};
});