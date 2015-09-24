var MoGenerador = Backbone.Model.extend({
	defaults: {
		idCompuesto 	: 0,
		idArreglo 		: 0,
		idGenerador 	: 0,
		idBomba 		: 0,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViGeneradores = viewsBase.abc.extend({
		el: '#compuestos',
		events: {},
		initialize: function() {
			this.pk = 'idCompuesto';
			this.url = '/compuestos';
			this.model = MoGenerador;

			this.fks = {
				idArreglo: {
					url: 'arreglos',
					filters: [{filter:'paralelo'}, {filter:'serie'}, {filter:'potencia'}, {filter:'voltaje'}, {filter:'corriente'}],
					dKey: 'dKey',
					done: function (data, process, displayKey) {
						for (var i = 0; i < data.length; i++)
							data[i].dKey = data[i].serie + 'x' + data[i].paralelo + ' ' + data[i].potencia + 'W ' +  + data[i].voltaje + 'V '  + data[i].corriente + 'amp' ;

						process(data);
					},
				},
				idGenerador: {
					url: 'generadores',
					filters: [{filter:'nombre'}],
				},
				idBomba: {
					url: 'bombas',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['idArreglo'],
			};

			var columns = [
				{nombre:'Bomba', field:'idBomba.nombre', width:300},
				{nombre:'Generador', field:'idGenerador.nombre', width:300},
				{nombre:'Arreglo', field:'idArreglo', width:300, tmp:'{{serie}}x{{paralelo}} {{potencia}}W {{voltaje}}V {{corriente}}amp'},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViGeneradores};
});