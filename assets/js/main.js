var bust = (new Date()).getTime();//'150905';//

// requirejs.onError = function (err) {
//     try {
//         throw err;
//     }
//     catch(ex) {
//         if(Rollbar)
//             Rollbar.error(err);
//     }
//     console.log('error de require js', err);
//     location.reload();
// };

require.config({
    //urlArgs: "bust="+bust,
    waitSeconds: 600,
    paths: {
        //'jquery'        : 'ddependencies/jquery-2.0.3.min',
        //'jqueryui'      : 'dependencies/jquery-ui.min',
        //'handlebars'    : 'dependencies/handlebars',
        'jquery'        : 'https://code.jquery.com/jquery-2.1.4.min',
        'jqueryui'      : 'https://code.jquery.com/ui/1.10.4/jquery-ui.min',
        'handlebars'    : 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min',
        'foundation'    : 'http://cdn.jsdelivr.net/foundation/5.2.2/js/foundation.min',
        
        'fdatepicker'   : 'dependencies/jquery.datetimepicker',
        //'foundation'    : 'dependencies/foundation.min',
        'faccordeon'    : 'dependencies/foundation/foundation.accordion',
        'fabide'        : 'dependencies/foundation/foundation.abide',
        'ftab'          : 'dependencies/foundation/foundation.tab',
        'lodash'        : 'dependencies/lodash.underscore.min',
        'backbone'      : 'dependencies/backbone-min',
        'bblocalStorage': 'dependencies/backbone.localStorage',
        'typeahead'     : 'dependencies/typeahead',      
        'rollbar'       : 'dependencies/rollbar',        
        /*'socket.io'     : 'dependencies/socket.io',
        'sails.io'      : 'dependencies/sails.io',*/
        'base'          : 'base/base.js?bust='+bust,
        'controles'     : 'base/controles',
        'app'           : 'app.js?bust='+bust,
        
        // 'base'          : 'base/min/base.min.js?bust='+bust,
        // 'controles'     : 'base/min/controles.min.js?bust='+bust,
        // 'app'           : 'base/min/app.min.js?bust='+bust,
    },
    shim: {
        'lodash'        : { exports:'_' },
        'typeahead'     : { deps:['jquery'] },
        'foundation'    : { deps:['jquery'] },
        'jqueryui'      : { deps:['jquery'] },
        'backbone'      : { deps:['lodash', 'jquery'] },
        'fdatepicker'   : { deps:['foundation'] },
        'faccordeon'    : { deps:['foundation'] },
        'fabide'        : { deps:['foundation'] },
        'ftab'          : { deps:['foundation'] },
        'bblocalStorage': { deps:['backbone'] },
        /*'socket.io'     : { deps:['jquery'] },
        'sails.io'      : { deps:['socket.io'] },*/
        'base'          : { deps:['handlebars', 'backbone', 'rollbar', 'foundation', 'jquery'] },
        'controles'     : { deps:['base'] },
        'app'           : { deps:['base'/*, 'sails.io'*/] },
    }
});

require(['jquery', /*'socket.io', 'socket.io'*/, 'rollbar', 'base', 'lodash', 'backbone', 'bblocalStorage', 'controles', 'handlebars', 'foundation', 'jqueryui', 'faccordeon', 'fabide', 'ftab', 'typeahead', 'fdatepicker', 'app'], function () {
    console.log('ok');
    app.ut.hide();
});