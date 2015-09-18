var deps = [
	'/js/base/viewsBase.js',
	'text!/templates/views/mapaElementos.html',
];

define(deps, function (viewsBase, html) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var viMapaElementos = Backbone.View.extend({
		el: '#mapaElementos',
		events: {
		},
		initialize: function() {
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		/*------------------------- Eventos -----------------------------*/
	});
	return {view: viMapaElementos, html:html};
});