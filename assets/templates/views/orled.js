var deps = [
	'/js/base/viewsBase.js',
	'/templates/views/mapaElementos.js',
];

define(deps, function (viewsBase, mapaElementos) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {
		},
		initialize: function() {
			var that = this;
			this.fks = {
			};

			this.gvBombas = this.$el.find('.gvBombas');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			that.bombas();

			this.subContent = this.$el.find('.sub-content');

			this.subViews = {
				mapaElementos: {
					elem: $(mapaElementos.html).appendTo(this.subContent),
					view: new mapaElementos.view({parentView:this}),
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
		bombas: function() {
			app.ut.request({url:'/bombas', done:done});
			function done(data) {
				debugger
				console.log(data);
				if(data) {
					var that = this;
					var info= data.data;
					var tr = that.tmp_bombas(info);
					that.gvBombas.html(tr);
				}
			}
		},
		/*------------------------- Eventos -----------------------------*/
		click_buscar: function() {
			this.form.submit();
		},	
	});
	return {view:ViOrled};
});