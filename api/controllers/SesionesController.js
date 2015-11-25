/**
 * SesionesController
 *
 * @description :: Server-side logic for managing sesiones
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');

module.exports = {
	logOut: function(req, res) {
        console.log('logOut');
        req.logout();
        req.session.destroy();
		
		return res.redirect('/');
	},
    logIn: function(req, res) {
        console.log(req.params.all());
        console.log(req.body);

        passport.authenticate('local', function(err, user, info) {
            //console.log('authenticate: ');
            if ((err) || (!user)) {
                return res.json(user);
            }
            req.logIn(user, function(err) {
                //console.log('res user', user);
                req.session.user = req.session.passport.user;
                return res.json(user);
            });

        })(req, res);
    },
    getSesion: function(req, res) {
        res.send(req.session);
    },
	getUser: function(req, res) {
		res.send(req.session.user);
	},
    checklogin: function(req, res) {
        //console.log('checklogin: ', req.session);
        var usuario = {
        	usuario: null,
        	loged: false,
        };
        if(req.session && req.session.user) {
        	usuario.usuario = req.session.user;
        	usuario.loged = true;
        }
        
        console.log('usuario: ', usuario);
        res.view('homepage', usuario);
    },	
};

