var MoEstados = Backbone.Model.extend({
	defaults: {
		idEstado	:0,
		nombre		:'',
		idPais		:0,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViEstados = viewsBase.abc.extend({
		el: '#estados',
		events: {
			'click .btn-aceptar' :'click_aceptar'
		},
		initialize: function() {
			this.pk = 'idEstado';
			this.url = '/estados';
			this.model = MoEstados;

			this.fks = {
				idPais: {
					url: 'paises',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['nombre','idPais'],
			};

			var columns = [
				{nombre:'Estado', field:'nombre', width:500},
				{nombre:'País', field:'idPais.nombre', width:500},
			];
			viewsBase.abc.prototype.initialize.call(this, columns, null);
		},
	});
	return {view: ViEstados};
});