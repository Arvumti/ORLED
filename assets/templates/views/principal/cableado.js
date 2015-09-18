var deps = [
	'/js/base/viewsBase.js',
	'text!/templates/views/principal/cableado.html',
];
define(deps, function (viewsBase, html) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var viCableado = Backbone.View.extend({
		el: '#cableado',
		events: {
		},
		initialize: function() {
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			debugger
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos --------------------------*/
	});
	return {view: viCableado, html:html};
});