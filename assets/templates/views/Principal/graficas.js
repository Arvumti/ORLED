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
			'click .tipo-grafica' :'click_tipoGrafica',
		},
		initialize: function() {
			debugger
			this.PnlGrafica = this.$el.find('.pnl-grafica');
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
		crear_Grafica: function(){
			$(function (){
				$(this.PnlGrafica).highcharts({
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
							'Diciembre'
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
							text: '[kWh/m2 por día]'
						}
					},
					plotOptions: {
						column: {
						stacking: 'normal',
						}
					},	
					series: [{
						name: 'Irradiancia',
						color: '#FDD400',
						data: [4.8, 5.3, 6.1, 5.9, 5.6, 5.1, 5.3, 5.4, 4.9, 5.2, 5, 4.7, 5.275]
					}]
				});
			});
		},
		click_tipoGrafica: function(e){
			// debugger
			// var tipo =  $(e.currentTarget);
			// switch(this.tipo){
			// 	case "1":
			// 	break;
			// 	case "2":
			// 	break;
			// 	case "3":
			// 	break;
			// }
			this.crear_Grafica();
		},
	});
	return {view: ViGraficas};
});