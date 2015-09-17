
var MoRow = Backbone.Model.extend();
var CoGridList = Backbone.Collection.extend({
    //model: MoRow,
    url: '',
    initialize:function () {
        this.paginate = {
            page: 1,
            total: 0,
            pageSize: 10,
        };
    },
    getMax: function() {
        return Math.ceil(this.paginate.total/this.paginate.pageSize);
    },
    init: function(aggregation) {
        var that = this;
        
        var dfd = $.Deferred();
        
        console.log('Envio: ');
        console.log({data: this.paginate, aggregation:aggregation});

        var __specials = [];
        var _specials = aggregation.specials;
        if(_specials)
            for (var i = 0; i < _specials.length; i++) {
                var w = {field:_specials[i].field, to:'v'};
                if(_specials[i].to == 'u')
                    w.to = 'u';
                else if(_specials[i].value && typeof _specials[i].value === 'function')
                    w.value = _specials[i].value();
                
                __specials.push(w);
            }
        else
            __specials = null;

        var aggrs = {
            selRow: aggregation.selRow,
            selRows: aggregation.selRows,
            dselRows: aggregation.dselRows,
            tipo: aggregation.tipo,
            order: aggregation.order,
            filter: aggregation.filter,
            specials: __specials,
        };
        
        var initTime = new Date();
        
        $.getJSON(this.url, {data: this.paginate, aggregation:aggrs}, function(data) {
            var endTime = new Date();
            console.log('Tiempo de espuesta: ' + (endTime - initTime));
            console.log('Recibo: ');
            console.log(data);
            
            if(that.pageSize == -1)
                that.paginate.total = data.data.length;
            else
                that.paginate.total = data.total;
            _.each(data.data, function(row) {
                row[that.pk] = row[that.pk];//.toString();
                that.add(new MoRow(row));
            });
            
            dfd.resolve(data);
        }).fail(function(xhr) {
            console.log(xhr);
        });
        
        return dfd;
    },
    prev: function(aggregation) {
        var res = {
                perform: false,
                promise: null
            };
        this.paginate.page --;
        if(this.paginate.page == 0)
            this.paginate.page = 1;
        else {
            this.reset();
            res.perform = true;
            res.promise = this.init(aggregation);
        }
        return res;
    },
    next: function(aggregation) {
        var max = this.getMax(),
            res = {
                perform: false,
                promise: null
            };
        
        this.paginate.page ++;
        if(this.paginate.page > max)
            this.paginate.page = max;
        else {
            this.reset();
            res.perform = true;
            res.promise = this.init(aggregation);
        }
        return res;
    },
    begin: function(aggregation) {
        var res = {
                perform: false,
                promise: null
            };
        if(this.paginate.page > 1) {
            this.paginate.page = 1;
            this.reset();
            res.perform = true;
            res.promise = this.init(aggregation);
        }
        return res;
    },
    end: function(aggregation) {
        var max = this.getMax(),
            res = {
                perform: false,
                promise: null
            };
        if(this.paginate.page < max) {
            this.paginate.page = max;
            this.reset();
            res.perform = true;
            res.promise = this.init(aggregation);
        }
        return res;
    }
});
var ViGrid = Backbone.View.extend({
    className: 'bb-grid',
    events: {
        /* eventos de paginacion */
        'click tfoot .gv-begin': 'click_onBeing',
        'click tfoot .gv-prev': 'click_onPrev',
        'click tfoot .gv-next': 'click_onNext',
        'click tfoot .gv-end': 'click_onEnd',
        'click tfoot .gv-all': 'click_onAll',
        'click tfoot .gv-none': 'click_onNone',
        'keypress tfoot .gv-pages': 'keypress_onPages',
        'keyup tfoot .gv-pages': 'keyup_onPages',
        
        /* eventos de ordenacion y busqueda */
        'click thead .gv-order': 'click_onOrder',
        'click thead .gv-filter': 'fake_event',
        'keypress thead .gv-filter': 'keypress_onFilter',
        'keyup thead .gv-filter': 'keyup_onFilter'
    },
    initialize: function(options) {
        var that = this;
        
        var cols = [];
        this.totalWidth = 0;
        _.each((options.columns || []), function(col) {
            var colExt = _.defaults(col, {width:100});
            that.totalWidth += colExt.width;
            cols.push(colExt);
        });
        this.totalWidth = (options.width || this.totalWidth) + 20;
        this.$el.css({width:this.totalWidth});
        
        var command = _.defaults((options.command || {}), {select:false, filter:false});
        this.config = {
            columns: cols,
            command: command,
            isComAct: command.select,
            extras: _.defaults((options.extras || {}), {select:false, primaryKey:null})
        };
        this.aggregates = {
            selRow: null,
            selRows: [],
            dselRows: [],
            tipo: 'none',
            order: [],
            filter: [],
            specials: options.specials || [],
        };
        this.fnTimeout = null;
        
        if(options.el)
            this.setElement(options.el);
        this.$el.addClass(this.className);
        
        var totalCols = this.config.columns.length + (this.config.isComAct ? 1 : 0);
        
        this.tagName = options.elem || 'table';
        var allnone = '';
        if(command.select)
            allnone = '<div class="small-8 columns"> \
                            <a class="gv-none" href="#"> Ninguno</a> \
                            <a class="gv-all" href="#"> Todos</a> \
                        </div>';
                        
        if(this.tagName == 'div') {
            this.className = 'ui-grid';
            this.$el.html('<section class="thead"></section><section class="tbody"></section><section class="tfoot"><article><div></div></article></section>');
            this.head = this.$el.children('.thead');
            this.body = this.$el.children('.tbody');
            this.tfoot = this.$el.children('.tfoot');
            this.tfoot.css({width:this.totalWidth-20});

            this.tmpHead = Handlebars.compile('<article>{{#columns}}<div style="width:{{width}}px">{{nombre}}</div>{{/columns}}</article>');
            this.tmpBody = Handlebars.compile('{{#rows}}<article>{{#.}}<div style="width:{{width}}px">{{GetValue .}}</div>{{/.}}</article>{{/rows}}');
        }
        else {
            this.$el.html('<thead></thead><tbody></tbody><tfoot><tr><td colspan="' + totalCols + '" class="gv-pager row"> \
                            <div class="small-4 columns"> \
                                <a class="gv-begin" href="#"></a>\
                                <a class="gv-prev" href="#"></a>\
                                <input type="text" class="gv-pages" value="1" /> <strong><span>/</span> <span class="gv-max">1</span></strong> \
                                <a class="gv-next" href="#"></a>\
                                <a class="gv-end" href="#"></a>\
                            </div> ' + allnone +
                            '\
                            \
                            \
                            </td></tr></tfoot>');
            this.head = this.$el.children('thead');
            this.body = this.$el.children('tbody');
            this.tfoot = this.$el.children('tfoot');

            this.tmpHead = Handlebars.compile('<tr>{{#if isComAct}}<th class="gv-col-command"></i></th>{{/if}}{{#columns}}<th style="width:{{width}}px" data-field="{{field}}" class="gv-order"><strong><span>{{nombre}} </span><input type="text" class="gv-filter"/></strong></th>{{/columns}}</tr>');
            this.tmpBody = Handlebars.compile('{{#rows}}<tr data-pkey="{{key}}" data-cid="{{cid}}"> \
                                                    {{#if command.select}}<td class="col-command"><input type="checkbox"/></td>{{/if}} \
                                                    {{#data}}<td>{{GetValue .}}</td>{{/data}} \
                                                </tr>{{/rows}}');
        }
        
        Handlebars.registerHelper('GetValue', function(item){
            if(item.type == 'date') {
                if(!item.value)
                    return '';

                if(item.value.search(/[a-zA-Z]+/) == -1)
                    return item.value;

                var fecha = new Date(item.value.toString());

                var dia = fecha.getDate().toString(),
                    mes = (parseInt(fecha.getMonth().toString()) + 1).toString(),
                    anio = fecha.getFullYear().toString();

                item.value = (dia.length == 1 ? '0' + dia : dia) + '-' + (mes.length == 1 ? '0' + mes : mes) + '-' + anio;
            }
            else if(item.ref && item.ref != 'none') {
                item.value = Handlebars.helpers.GetRef(item.value, item.ref);
            }
            else if(typeof item.value === "string") {
                item.value = item.value.replace(/&amp;/g, "&");
                item.value = item.value.replace(/&gt;/g, ">");
                item.value = item.value.replace(/&lt;/g, "<");
                item.value = item.value.replace(/&quot;/g, "\"");
                item.value = item.value.replace(/&apos;/g, "'");
                item.value = item.value.replace(/#35;/g, "#");
            }
            return item.value;
        });
        
        if(!this.config.extras.primaryKey) {
           this.config.isComAct = false;
           this.config.command.select = false;
        }
        
        if(this.config.command.select)
            this.events['click tbody tr .col-command input[type="checkbox"]'] = 'click_onSelect';
        
        if(this.config.extras.select)
            this.events['click tbody tr'] = 'click_onTr';
        
        this.collection = new CoGridList();
        this.collection.model = options.model;
        this.collection.url = options.url || '/';
        this.collection.pk = this.config.extras.primaryKey || null;
        var prom = this.collection.init(this.aggregates);
        
        prom.then(function(data) {
            that.render(data);
        });
        
        this.head.html(this.tmpHead(this.config));
    },
    getDataRow: function(model) {
        var cols = _.extend([], this.config.columns);
        var row = {
            key: model.get(this.config.extras.primaryKey),
            cid: model.cid,
            data: [],
            command: this.config.command
        };
        for(var j=0; j<cols.length; j++) {
            var valor = null;
            if(cols[j].field.indexOf('.') == -1)
                valor = model.get(cols[j].field);
            else {
                var subcontent = cols[j].field.split('.');
                var part = model.get(subcontent[0]);
                if(part)
                    valor = part[subcontent[1]];
                else
                    valor = '-';
            }
                                  
            row.data.push({
                value: valor,
                type: this.config.columns[j].type || 'none',
                ref: this.config.columns[j].ref || 'none',
                width: this.config.columns[j].width,
            });
        }
        
        return [row];
    },
    /*-------------------------- Base --------------------------*/
    render: function(data){
        if(this.collection.paginate.pageSize == -1)
            this.tfoot.addClass('isHidden');

        var rows = [];
        var cols = _.extend([], this.config.columns);
        
        for(var i=0; i<this.collection.length; i++) {
            var r = this.collection.at(i);
            var row = {
                key: r.get(this.config.extras.primaryKey),
                cid: r.cid,
                data: [],
                command: this.config.command
            };
            for(var j=0; j<cols.length; j++) {
                var valor = null;
                if(cols[j].field.indexOf('.') == -1)
                    valor = r.get(cols[j].field);
                else {
                    var subcontent = cols[j].field.split('.');
                    var part = r.get(subcontent[0]);
                    if(part)
                        valor = part[subcontent[1]];
                    else
                        valor = '-';
                }
                
                row.data.push({
                    value: valor,
                    type: this.config.columns[j].type || 'none',
                    ref: this.config.columns[j].ref || 'none',
                    width: this.config.columns[j].width,
                });
            }
            rows.push(row);
        }
        
        var body = this.body.html(this.tmpBody({rows:rows}));
        this.tfoot.find('.gv-max').text(this.collection.getMax());
        this.tfoot.find('.gv-pages').val(this.collection.paginate.page);
        
        this.aggregates.selRows = [];
        this.aggregates.dselRows = [];
        if(data.aggregation) {
            this.aggregates.selRow = data.aggregation.selRow;
            
            if(this.aggregates.tipo == 'all') {
                _.each(body.find('tr input[type="checkbox"]'), function(tr) {
                    tr.click();
                });
                
                _.each(_.unique(data.aggregation.dselRows), function(row) { 
                    body.find('tr[data-pkey="'+row+'"] input[type="checkbox"]').click();
                });
            }
            else {
                _.each(_.unique(data.aggregation.selRows), function(row) { 
                    body.find('tr[data-pkey="'+row+'"] input[type="checkbox"]').click();
                });
            }
        }
        
        return this;
    },
    fake_event: function(e) {
        e.stopPropagation();
    },
    addTR: function(model) {
        this.collection.add(model);
        var row = this.getDataRow(model);
        
        var rowHTML = this.tmpBody({rows:row});     
        this.body.prepend(rowHTML);
    },
    modifyTR: function(data) {
        var that = this;
        var primaryKey = this.config.extras.primaryKey;
        var busqueda = {};
        busqueda[primaryKey] = data[primaryKey].toString();

        var model = this.collection.find(function(item){ 
            try {
                return item.get(primaryKey).toString() == data[primaryKey].toString(); 
            }
            catch(ex) {
                return false;
            }
        });
        model.set(data);
        var row = this.getDataRow(model);
        
        var rowHTML = this.tmpBody({rows:row});
        var tr = this.body.find('[data-cid="' + model.cid + '"]');
        tr.html($(rowHTML).html());
    },
    focus: function(elem) {
        this.body.children('.isSelected').removeClass('isSelected');
                
        var currSelect = elem;
        currSelect.addClass('isSelected');
        var bRow = this.collection.get(currSelect.data('cid'));
        this.aggregates.selRow = bRow.toJSON();
    },
    filter: function(filtro, value) {
        var that = this;
        var res = _.findWhere(this.aggregates.filter, filtro);
        if(res === undefined) {
            filtro.query = value;
            this.aggregates.filter.push(filtro);
        }
        else {
            res.query = value;
        }

        this.collection.reset();
        this.collection.paginate.page = 1;
        var res = this.collection.init(this.aggregates);

        res.then(function(data) {
            that.render(data);
        });
    },
    /*-------------------------- Eventos Pasivos --------------------------*/
    doSearch: function(search) {
        var model = app.currView.gvGrid.collection.find(search);
        var tr = null;
        if(model) {
            tr = app.currView.gvGrid.body.find('[data-cid="' + model.cid + '"]');
            this.focus(tr);
        }

        return {model:model, tr:tr};
    },
    doFilter: function(jArr) {
        var that = this;
        that.collection.reset();
        that.collection.paginate.page = 1;
        
        this.aggregates.filter.splice(0);
        this.aggregates.filter = jArr;
        var res = this.collection.init(this.aggregates);

        res.then(function(data) {
            that.render(data);
        });
    },
    doResetFilter: function() {
        var that = this;
        this.aggregates.filter.splice(0);
        var res = this.collection.init(this.aggregates);

        res.then(function(data) {
            that.render(data);
        });
    },
    /*-------------------------- Eventos --------------------------*/
    click_onSelect: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var row = $(e.currentTarget).parents('tr');
        row.toggleClass('isMultiSelected');
        
        var cid = row.data('cid'),
            bRow = this.collection.get(cid),
            key = bRow.get(this.config.extras.primaryKey).toString();
        if(e.currentTarget.checked) {
            var index = this.aggregates.dselRows.indexOf(key);
            if (index > -1)
                this.aggregates.dselRows.splice(index, 1);
            this.aggregates.selRows.push(key);
        }
        else {
            var index = this.aggregates.selRows.indexOf(key);
            if (index > -1) {
                this.aggregates.selRows.splice(index, 1);
                this.aggregates.dselRows.push(key);
            }
        }
    },
    click_onTr: function(e) {
        e.preventDefault();
        e.stopPropagation();
                
        var currSelect = $(e.currentTarget);
        this.focus(currSelect);
    },
    click_onTrDown: function() {
        if(this.body.children('tr').length == 0)
            return;

        var old_tr = this.body.children('.isSelected');
        var new_tr = old_tr.next();

        if(new_tr.length == 0)
            new_tr = this.body.children('tr:first-child');

        old_tr.removeClass('isSelected');
        new_tr.addClass('isSelected');
        var scroll = new_tr.height() * new_tr.prevAll().length;
        console.log(scroll);
        this.body.scrollTop(scroll);

        var bRow = this.collection.get(new_tr.data('cid'));
        this.aggregates.selRow = bRow.toJSON();
    },
    click_onTrUp: function() {
        if(this.body.children('tr').length == 0)
            return;

        var old_tr = this.body.children('.isSelected');
        var new_tr = old_tr.prev();

        if(new_tr.length == 0)
            new_tr = this.body.children('tr:last-child');

        old_tr.removeClass('isSelected');
        new_tr.addClass('isSelected');
        var scroll = new_tr.height() * new_tr.prevAll().length;
        console.log(scroll);
        this.body.scrollTop(scroll);

        var bRow = this.collection.get(new_tr.data('cid'));
        this.aggregates.selRow = bRow.toJSON();
    },
    click_onBeing: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var that = this,
            res = this.collection.begin(this.aggregates);
        if(res.perform)
            res.promise.then(function(data) {
                that.render(data);
            });
    },
    click_onPrev: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var that = this,
            res = this.collection.prev(this.aggregates);
        if(res.perform)
            res.promise.then(function(data) {
                that.render(data);
            });
    },
    click_onNext: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var that = this,
            res = this.collection.next(this.aggregates);
        if(res.perform)
            res.promise.then(function(data) {
                that.render(data);
            });
    },
    click_onEnd: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var that = this,
            res = this.collection.end(this.aggregates);
        if(res.perform)
            res.promise.then(function(data) {
                that.render(data);
            });
    },
    click_onAll: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.aggregates.tipo = 'all';
        _.each(this.body.find('tr input[type="checkbox"]'), function(tr) {
            if(!tr.checked)
                $(tr).click();
        });
        //this.aggregates.selRows = [];
        this.aggregates.dselRows = [];
    },
    click_onNone: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.aggregates.tipo = 'none';
        _.each(this.body.find('tr input[type="checkbox"]'), function(tr) {
            if(tr.checked)
                $(tr).click();
        });
        this.aggregates.selRows = [];
        //this.aggregates.dselRows = [];
    },
    keypress_onPages: function(e) {
        var that = this;
        var key = e.which || e.keyCode || e.charCode;
        
        var time = 1000;
        if(key == 13)
            time = 0;
        
        if( key == 13 ||
            key >= 48 && key <= 57) {
            clearTimeout(this.fnTimeout);
            this.fnTimeout = setTimeout(function () {
                console.log('launch');
                var pagina = $(e.currentTarget).val().toInt(1),
                    max = that.collection.getMax(),
                    currPage = that.collection.paginate.page;
                if(pagina > max)
                    pagina = max;
                else if(pagina <= 0)
                    pagina = 1;
                else if(pagina == currPage) {
                    $(e.currentTarget).val(pagina);
                    return;
                }

                that.collection.reset();
                that.collection.paginate.page = pagina;
                var res = that.collection.init(that.aggregates);
                res.then(function(data) {
                    that.render(data);
                });
            }, time);
        }
        else
            e.preventDefault();
    },
    keyup_onPages: function(e) {
        var that = this;
        var key = e.which || e.keyCode || e.charCode;
        console.log(key);
        
        if(key == 8 || key == 48) {
            e.which = 48;
            this.keypress_onPages(e);
        }
    },
    click_onOrder: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(e.currentTarget),
            field = elem.data('field'),
            orden = {field:field};
        
        elem.parents('tr').find('th').removeClass('gv-desc gv-asc');
        
        if(this.aggregates.order.field == field) {
            var res = this.aggregates.order;
            switch(res.orden) {
                case 1:
                    res.orden = -1;
                    elem.addClass('gv-asc');
                    break;
                case -1:
                    res.orden = 0;
                    break;
                default:
                    res.orden = 1;
                    elem.addClass('gv-desc');
                    break;
            }
        }
        else {
            orden.orden = 1;
            this.aggregates.order = orden;
            elem.addClass('gv-desc');
        }
        
        this.collection.reset();
        this.collection.paginate.page = 1;
        var that = this,
            res = this.collection.init(this.aggregates);
        res.then(function(data) {
            that.render(data);
        });
    },
    keypress_onFilter: function(e) {
        var that = this;
        var key = e.which || e.keyCode || e.charCode;
        console.log(key); 
        
        var time = 1000;
        if(key == 13)
            time = 0;
        
        if( key == 13 ||
            (key >= 32 && key <= 122) || key == 209 || key == 241
            || key == 193 || key == 201 || key == 205 || key == 211 || key == 218
            || key == 225 || key == 233 || key == 237 || key == 243 || key == 250) {
            clearTimeout(this.fnTimeout);
            this.fnTimeout = setTimeout(function () {
                console.log('laun filtro');

                var elem = $(e.currentTarget);
                var field = elem.parents('th').data('field');
                var filtro = {field:field};
                var res = _.findWhere(that.aggregates.filter, filtro);
                if(res === undefined) {
                    filtro.query = elem.val();
                    that.aggregates.filter.push(filtro);
                }
                else {
                    res.query = elem.val();
                }

                that.collection.reset();
                that.collection.paginate.page = 1;
                var res = that.collection.init(that.aggregates);
                res.then(function(data) {
                    that.render(data);
                });
            }, time);
        }
        else
            e.preventDefault();
    },
    keyup_onFilter: function(e) {
        var that = this;
        var key = e.which || e.keyCode || e.charCode;
        console.log(key);
        
        if(key == 8 || key == 48) {
            e.which = 48;
            this.keypress_onFilter(e);
        }
    },
});
/*
    CLIENTE:
    var columns = [
        {nombre:'nombre', field:'nombre', width:500},
    ];
    var command = {select: false},
        extras = {
            select: true,
            primaryKey: '_id'
        };
            
    this.gvGrid = new app.controles.grid({columns:columns, command:command, extras:extras, url:'/alumnos/grid', el:$('#gvDatos')});

    SERVIDOR:
    grid: function(req, res) {
        //sails.session.set('mi param', 1);
        console.log(req.param('data'));
        console.log(req.params.all());
        Alumnos.find({}, function(err, docs) {
            console.log(sails.controllers.controles.getData(req, res, docs));
        });
    },
*/

define([], function () {
    app.models.moRow = MoRow;
    app.collections.coGrid = CoGridList;
    app.controles.grid = ViGrid;
});