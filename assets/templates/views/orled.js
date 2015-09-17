define(['/js/base/viewsBase.js'], function (viewsBase) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {			
		},
		initialize: function() {
			var that = this;			
			this.fks = {				
			};						

			//this.gvCredencial = this.$el.find('.gvCredencial');
			//this.tmp_Credencial = Handlebars.compile(this.$el.find('.tmp_Credencial').html());						
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		buscar: function() {
			var that = this;
		},
		/*------------------------- Eventos -----------------------------*/
		click_buscar: function() {
			this.form.submit();
		},	
	});
    return {view:ViOrled};
});