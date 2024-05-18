const express= require('express');
const exphbs=require('express-handlebars');
const cors=require('cors');
const app= express();
const port=3000;
const presentation = require("./routes/presentation_router");
const business=require("./routes/business_router");
const dataaccess = require("./routes/dataaccess_router");
const database = require("./routes/database_router");
const application = require("./routes/application_router");
const bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
app.use(flash());
require('dotenv').config()
const cookieParser = require("cookie-parser");
const session = require('express-session');
// const expressSession = require('express-session');
const https = require('https');
const secret = 'mysecretkey';
const passport = require('passport');

// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()) // parse application/json

var hbs = exphbs.create({});
hbs.handlebars.registerHelper('switch', function(value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
  });
  
  hbs.handlebars.registerHelper('case', function(value, options) {
    if (value == this.switch_value || (value == 'default' && this.switch_break == false)) {
       this.switch_break = true;
       return options.fn(this);
    }
  })
hbs.handlebars.registerHelper('getValue', function (value, options) {
  
    if (options.fn(this).indexOf(value) >= 1) {
        return `selected='selected'`;
    }
});
hbs.handlebars.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    });
    hbs.handlebars.or = function() {
        var len = arguments.length - 1;
        var options = arguments[len];
        var val = false;
      
        for (var i = 0; i < len; i++) {
          if (arguments[i]) {
            val = true;
            break;
          }
        }
        return util.value(val, this, options);
      };
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use('/application',express.static(__dirname+'/public'));
app.use('/business',express.static(__dirname+'/public'));
app.use('/dataaccess',express.static(__dirname+'/public'));
app.use('/database',express.static(__dirname+'/public'));
app.use(session({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 10000},
    resave: false
    }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(secret));
app.set('views', path.join(__dirname, '/Presentation/WebBrowserInterface'));
app.engine('hbs',exphbs.engine({
    extname:'.hbs',
    defaultLayout:'homepage.hbs',
    layoutsDir:"Presentation/WebBrowserInterface/layouts",
}));
app.set('view engine','hbs');
app.use('/',presentation);
app.use('/application',application);
app.use('/business',business);
app.use('/dataaccess',dataaccess);
app.use('/database',database);

// app.use(passport.initialize());
// app.use(passport.session());
app.listen(port,()=> console.log(`Server listening on port ${port}  : localhost:3000`));
