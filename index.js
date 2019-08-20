#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express')
var app = express();
var path = require('path')
var my_path = path.join(__dirname,'..','private','states.js')
var states = require(my_path)

var hbs = require('handlebars');

var visitorCount = 0; 
var cookieSession = require('cookie-session')
var simpleoauth2 = require("simple-oauth2");
var request = require('request');
const fs = require('fs');
var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  user            : 'site_2020mgupta',
  password        : '76hfP598u7yh7Shsgd4UhWBL',
  host            : 'mysql1.csl.tjhsst.edu',
  port            : 3306,
  database        : 'site_2020mgupta'
});

// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM

app.set('port', process.env.PORT || 8080 );
app.set('trust proxy', 1) // trust first proxy 

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/fonts', express.static(path.join(__dirname, 'fonts')))
app.use('/lib', express.static(path.join(__dirname, 'lib')))
app.use('/examples', express.static(path.join(__dirname, 'examples')))
app.use('/docs', express.static(path.join(__dirname, 'docs')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/contactform', express.static(path.join(__dirname, 'contactform')))
app.use(cookieSession({
  name: 'chocolatechip',
  keys: ['ARandomKeyThat345', 'IJustRandomlyThoughtOf678']
}))

var ion_client_id = 'DJf4G8ipKUhAApaefUZgSPftSpD28IRYyAFgnc3W';
var ion_client_secret = 'VzTmOt0rqoXKeSYQnGI9qdi1N4bk7uI6PwlOhIYFL04n8E85yO9KqEIlLcDrXhNjav8a79gMHnuAERtRNnCsVPy2QJxppis48PUtwWIRrXWwQox96H6oCLP4rgZUlvxu';
var ion_redirect_uri = 'https://user.tjhsst.edu/2020mgupta/login';
var ion_redirect_uriScrabble = 'https://user.tjhsst.edu/2020mgupta/scrabblelogin';
var ion_redirect_uriCookie = 'https://user.tjhsst.edu/2020mgupta/cookieclickerlogin';
var ion_redirect_uriFinal = 'https://user.tjhsst.edu/2020mgupta/finalprojectlogin';

var oauth2 = simpleoauth2.create({
  client: {
    id: ion_client_id,
    secret: ion_client_secret,
  },
  auth: {
    tokenHost: 'https://ion.tjhsst.edu/oauth/',
    authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
    tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
  }
});

var authorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});


var scrabbleauthorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uriScrabble
});

var cookieauthorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uriCookie
});

var finalprojauthorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uriFinal
});

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    res.sendFile(__dirname+ '/index.html');
});

app.get('/about', function(req, res){
    res.sendFile(__dirname+ '/about.html');
});

app.get('/timer', function(req, res){
    res.sendFile(
        path.join(__dirname, 'timer.html')
    );
})

app.get('/precedence', function(req, res){
    res.sendFile(
        path.join(__dirname, 'precedence.html')
    );
})

app.get('/manual', function(req, res){
    res.sendFile(
        path.join(__dirname, 'manual.html')
    );
})

app.get('/sqltest', function(req, res){
    res.sendFile(
        path.join(__dirname, 'sqltest.html')
    );
})

app.get('/get_ids', function(req, res){
        pool.query('SELECT id FROM students', function (error, results, fields) {
     if (error) throw error;
    res.send(results);   
    });
})

app.get('/get_id', function(req, res){
        var i = req.query.ls;
        pool.query('SELECT s_name FROM students WHERE id=?',[i], function (error, results, fields) {
     if (error) throw error;
    res.send(results[0].s_name);   
    });
})

app.get('/replace_value', function(req, res){
        var i = req.query.ls;
        var val = req.query.replace;
        console.log(val)
        pool.query('UPDATE students SET s_name = ? WHERE id = ?',[val, i], function (error, results, fields) {
     if (error) console.log('error');
    res.send("replaced");   
    });
})

app.get('/add_table', function(req, res){
        var i = req.query.aid;
        var val = req.query.avalue;

        pool.query('INSERT INTO students(id, s_name) VALUE(?, ?)',[i, val], function (error, results, fields) {

     if (error)
     {
         res.send(["Error: ID is already present", -1]);
     }
    res.send(["success!", id]);   
    });
})


app.get('/update_table', function(req, res){
    
        var i = parseInt(req.query.user);
        var sc = parseInt(req.query.count);
        var s = parseInt(req.query.sold);
        var a = parseInt(req.query.amount);

        pool.query('INSERT INTO cookieclicks (id, score, sold, amount) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, sold = ?, amount = ?',[i, sc, s, a, sc,s,a], function (error, results, fields)
        {
            console.log("error", error);
            if(error) {
             res.send(error);   
            }
            res.send("success");

        });
});

app.get('/add_name', function(req, res){
    var student = req.query.names;

    pool.query('INSERT INTO prerec(name, lastspeech, side) VALUE(?, 0, "none")',[student], function (error, results, fields) {

        if (error)
        {
            res.send(error);
        }
        res.send(["success!", results.insertId, student]);
    });
})

app.get('/get_names', function(req, res){
        pool.query('SELECT * FROM prerec', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
})

app.get('/get_speech_count', function(req, res){
    pool.query('SELECT countnum FROM countspeeches', function(error, results, fields){
        res.send(results[0]);
    });
});

app.get('/update_speech_count', function(req, res){
    
    var speech_count = req.query.speech_count;
    
    pool.query('UPDATE countspeeches SET countnum = ? WHERE countnum = ?', [speech_count, speech_count-1], function(error, results, fields){
        
        res.send(results);
        
    });
    
});

app.get('/update_student', function(req, res){
    var studentid = req.query.ls;
    var stside = req.query.stside;
    var speech_count = req.query.speech_count;

    pool.query('UPDATE prerec SET lastspeech = ?, side = ? WHERE id = ?',[speech_count, stside, studentid], function (error, results, fields) {
                
        if (error) res.send(error);
        res.send([studentid, stside, speech_count]);
        
    });
    
})


app.get('/get_initial_cookie_score', function(req, res){
    
        var i = parseInt(req.query.user);
        console.log(i);

        pool.query('SELECT score, sold, amount FROM cookieclicks WHERE id = ?',[i], function (error, results, fields)
        {
            console.log("error" + error);
            if(error) throw error;
            res.send(results[0]);

        });
});



var dict = {};
var resu = [];
var states = [];
app.get('/ajax_endpoint', function(req, res){
    var val = String(req.query.color);
    var state = String(req.query.state);
    if (!states.includes(state.toLowerCase()))
    {
        states.push(state.toLowerCase())
    }
    resu.push(val);
    dict[val] = (dict[val] ||0) + 1;
    var r = "The survey results are: ";
    if(resu.length > 6)
    {
        if (r == "The survey results are: not enough people have taken the survey to display results")
        {
            r = ""
        }
        for (var k in dict)
        {
            r = r + k + " : " + dict[k] + " ";
        }
    }
    else
    {
        r = r + "not enough people have taken the survey to display results"
    }
    r = r + " and the number of different states are: " + states;
    
    var response = {
        r : r,
    }
    res.send(response);
});

app.get('/value_endpoint', function(req, res){
    var error = []
    var length = req.query.quantity;
    var pref = req.query.pref.toLowerCase();
    var word = String(req.query.letters).toLowerCase();
    if (length > 7 || length < 2)
    {
        error.push("please keep your requested word length to be between 2 - 7 letters");
    }
    if(word.length > 7)
    {
        error.push("too many letters; please only enter up to 7 letters");
    }
    
    numberWild = 0;
    var given = [];
    var state = word;
    for (i = 0; i < word.length; i++)
    {
        if (word[i] == "?")
        {
            numberWild++;
        }
        else
        {
            given.push(state[i])
        }
    }
    if(numberWild > 2)
    {
        error.push("too many wildcards; please only enter up to 2 wildcards");
    }
    if (error.length > 0)
    {
        res.send(error);
    }
    
    chars = fs.readFileSync(__dirname + '//enable1.txt').toString();
    lines = chars.split('\n');
    var result = lines.filter(function(line)
    {
        if (line.length == length)
        {
            var newgiven = given;
            var wildcount = 0;
            for (var j = 0; j < line.length; j++)
            {
                char = line[j]
                if (newgiven.includes(char))
                {
                    var ind = newgiven.indexOf(char);
                    newgiven = newgiven.slice(0,ind) + newgiven.slice(ind+1,newgiven.length);
                }
                else
                {
                    wildcount++;
                }
            }
            if (wildcount <= numberWild)
            {
                return line;
            }
        }
    });
    
    if (parseInt(pref) != -1)
    {
        var ret = result.filter(function(preference){
            if(preference[0] == String(pref))
            {
                return preference;
            }
        });
        result = ret;
    }
    if(result.length == 0)
    {
        result.push("There are no results to display with those parameters.")
    }
    for(var i = 1; i < result.length; i++)
    {
        if (i == result.length - 1)
        {
            result[i] = " and " + result[i];
        }
        else
        {
            result[i] = " " + result[i];
        }
    }
    res.send(result);
});

app.get('/finalprojectlogin', async function (req, res) {
    if (typeof req.query.code != 'undefined') {
        var theCode = req.query.code 

        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uriFinal,
            scope: 'read'
         };

        result = await oauth2.authorizationCode.getToken(options);
        token = oauth2.accessToken.create(result);

        req.session.token = token;
        
        res.redirect('https://user.tjhsst.edu/2020mgupta/finalproject');

    } else {
        res.send('no code attached')
    }
});

app.get('/finalproject', function(req, res){
    if (typeof req.session.token == 'undefined') {
        // ...if the token does not exist, this means that the user has not logged in
    
        // if the user has not logged in, we'll send them to a page asking them to log in
        var output_string = "<a href="+finalprojauthorizationUri+">"+finalprojauthorizationUri+"</a>"
        // send away the output
        res.render('finalprojectredirect', {outputlink: output_string});
     }
     else{
            var access_token = req.session.token.token.access_token;
            var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
            
            console.log(my_ion_request);
            
            request.get( {url:my_ion_request}, function (e, r, body) {
                var res_object = JSON.parse(body);
                res.locals.user_name = res_object['short_name'];
                id = res_object['id'];
                
                console.log(id);
                
                res.render('finalproject', {name: res.locals.user_name, userid: id});
            });
     }
});

app.get('/picture', function(req, res){
    res.sendFile(__dirname+ '/me.jpg');
});

app.get('/oreo', function(req, res){
    res.sendFile(__dirname+ '/oreo.png');
});

app.get('/presidingguide', function(req, res){
    res.sendFile(__dirname+ '/presidingguide.pdf');
});

app.get('/statesgame', function(req, res){
    res.sendFile(__dirname+ '/statesgame.html');
});

app.get('/aboutstates', function(req, res){
    res.sendFile(__dirname+ '/aboutstates.html');
});

app.get('/settingsstates', function(req, res){
    res.sendFile(__dirname+ '/settingsstates.html');
});

app.get('/cookieclickerlogin', async function (req, res) {
    if (typeof req.query.code != 'undefined') {
        var theCode = req.query.code 

        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uriCookie,
            scope: 'read'
         };

        result = await oauth2.authorizationCode.getToken(options);
        token = oauth2.accessToken.create(result);

        req.session.token = token;
        
        res.redirect('https://user.tjhsst.edu/2020mgupta/cookieclicker');

    } else {
        res.send('no code attached')
    }
});


app.get('/cookieclicker', function(req,res){
    
     if (typeof req.session.token == 'undefined') {
        // ...if the token does not exist, this means that the user has not logged in
    
        // if the user has not logged in, we'll send them to a page asking them to log in
        var output_string = "";
        output_string += "<!doctype html>\n";
        output_string += "<html><head></head><body>\n";
        output_string += "<a href="+cookieauthorizationUri+">"+cookieauthorizationUri+"</a>"
        output_string += "</body></html>";
        console.log(output_string);
        // send away the output
        res.send(output_string);
     }
     else{
            var access_token = req.session.token.token.access_token;
            var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
            
            console.log(my_ion_request);
            
            request.get( {url:my_ion_request}, function (e, r, body) {
                var res_object = JSON.parse(body);
                res.locals.user_name = res_object['short_name'];
                id = res_object['id'];
                
                console.log(id);
                
                res.render('cookieclicker', {name: res.locals.user_name, userid: id});
            });
     }
});




var scrabblecount = 0;
app.get('/scrabble', function(req,res){
    
     if (typeof req.session.token == 'undefined') {
        // ...if the token does not exist, this means that the user has not logged in
    
        // if the user has not logged in, we'll send them to a page asking them to log in
        var output_string = "";
        output_string += "<!doctype html>\n";
        output_string += "<html><head></head><body>\n";
        output_string += "<a href="+scrabbleauthorizationUri+">"+scrabbleauthorizationUri+"</a>"
        output_string += "</body></html>";
        // send away the output
        res.send(output_string);
     }
     else{
         scrabblecount++;
          var access_token = req.session.token.token.access_token;
        var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
        request.get( {url:my_ion_request}, function (e, r, body) {
            var res_object = JSON.parse(body);
            res.locals.user_name = res_object['short_name'];
            res.render('scrabble', {name: res.locals.user_name, visits: scrabblecount});
        });
     }
});

app.get('/oauth', function (req, res) {


    // Here we ask if the token key has been attached to the session...
    if (typeof req.session.token == 'undefined') {
        // ...if the token does not exist, this means that the user has not logged in
    
        // if the user has not logged in, we'll send them to a page asking them to log in
        var output_string = "";
        output_string += "<!doctype html>\n";
        output_string += "<html><head></head><body>\n";
        output_string += "<a href="+authorizationUri+">"+authorizationUri+"</a>"
        output_string += "</body></html>";
        // send away the output
        res.send(output_string);


    } else {
        // ... if the user HAS logged in, we'll send them to a creepy page that knows their name

        // Now, we create a personalized greeting page. Step 1 is to 
        // ask ION for your name, which means conducting a request in the
        // background before the user's page is even rendered.

        // To start the process of creating an authenticated request, 
        // I take out the string 'permission slip' from 
        // the token. This will be used to make an ION request with your
        // credentials
        var access_token = req.session.token.token.access_token;
        
        // Next, construct an ION api request that queries the profile using the 
        // individual who has logged in's credentials (it will return) their
        // profile
        var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;

        // Perform the asyncrounous request ...
        request.get( {url:my_ion_request}, function (e, r, body) {
            // and here, at some later (indeterminite point) we land.
            // Note that this is occurring in the future, when ION has responded
            // with our profile.

            // The response from ION was a JSON string, so we have to turn it
            // back into a javascript object
            var res_object = JSON.parse(body);
            // from this javascript object, extract the user's name
            res.locals.user_name = res_object['short_name'];
            res.locals.picoauth = res_object['picture'];
            res.locals.counselor = "username is: " + res_object['counselor']['username'] + " full name is: " + res_object['counselor']['full_name'];
            res.locals.email = "TJ Email: " + res_object['tj_email'] + " Other available emails: " + res_object['emails'];
            res.render('mainOauth', {name: res.locals.user_name});
        });
    }
});

checkLoggedIn = [isLoggedIn];

function isLoggedIn(req,res,next){
    if (typeof req.session.token == 'undefined') 
    {
        var output_string = "";
        output_string += "<!doctype html>\n";
        output_string += "<html><head></head><body>\n";
        output_string += "<a href="+authorizationUri+">"+authorizationUri+"</a>"
        output_string += "</body></html>";
        res.send(output_string)
    
    }
    else{
        var access_token = req.session.token.token.access_token;
        var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
        request.get( {url:my_ion_request}, function (e, r, body) {
            var res_object = JSON.parse(body);
            res.locals.user_name = res_object['short_name'];
            res.locals.picoauth = res_object['picture'];
            res.locals.counselor = "username is: " + res_object['counselor']['username'] + " full name is: " + res_object['counselor']['full_name'];
            res.locals.email = "TJ Email: " + res_object['tj_email'] + " Other available emails: " + res_object['emails']
        next();
        });
    }
};

app.get('/logout', checkLoggedIn, function(req,res){
    req.session = null;
    res.redirect('https://user.tjhsst.edu/2020mgupta/oauth');
});

app.get('/counselor', checkLoggedIn, function(req,res){
    res.render('counselorInfo', {couns: res.locals.counselor})
});

app.get('/pictureOauth', checkLoggedIn, function(req,res){
    res.render('picturePage', {pic: res.locals.picoauth});
});

app.get('/emailList', checkLoggedIn, function(req,res){
    res.render('emailPage', {em: res.locals.email});
});

app.get('/login', async function (req, res) {
    if (typeof req.query.code != 'undefined') {
        var theCode = req.query.code 

        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uri,
            scope: 'read'
         };

        result = await oauth2.authorizationCode.getToken(options);
        token = oauth2.accessToken.create(result);

        req.session.token = token;
        
        res.redirect('https://user.tjhsst.edu/2020mgupta/oauth');

    } else {
        res.send('no code attached')
    }
});

app.get('/scrabblelogin', async function (req, res) {
    if (typeof req.query.code != 'undefined') {
        var theCode = req.query.code 

        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uriScrabble,
            scope: 'read'
         };

        result = await oauth2.authorizationCode.getToken(options);
        token = oauth2.accessToken.create(result);

        req.session.token = token;
        
        res.redirect('https://user.tjhsst.edu/2020mgupta/scrabble');

    } else {
        res.send('no code attached')
    }
});


app.get('/instructions', function(req, res){
    visitorCount++;     
    res.render('instructions', { numVisitors : visitorCount} );

});

app.get('/ajaxsurvey', function(req, res){
    res.sendFile(__dirname+ '/ajaxsurvey.html');
});


app.get('/not_a_search', function(req, res){
    var theQuery = req.query.q;
    res.send('query parameter:' + theQuery);
});

app.get('/b', function(req, res){
    var theQuery = req.query.q;
    var theQuery1 = req.query.r;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") 
    {
        ip = ip.substr(7)
    }

    r = 'ip address' + ip + 'function accessed: doStatesBorder' + 'state1 = ' + theQuery + 'state2 = ' + theQuery1
    var result = states.doStatesBorder(theQuery,theQuery1);
    if (result == "Error: Bad Input")
    {
        result = 'invalid input enter the query followed by the parameters (in either all caps postal code or state name) queries: b is doStatesBorder (q = state1 & r = state2), s is getStateBorders (q = state), c is getCloseStates (q = state), n is statesWithBorders (q = number of borders).'
    }
    
    res.render('template', { IPAdd : ip, requestMade: "You asked whether" + theQuery + "borders" + theQuery1, answer:result} );
    
});

app.get('/s', function(req, res){
    var theQuery = req.query.q;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") 
    {
        ip = ip.substr(7)
    }

    r = 'ip address' + ip + 'function accessed: getStateBorders' + 'state1 = ' + theQuery
    
    var result = getStateBorders(theQuery)
    if (result == "Error: Bad Input")
    {
        result = 'invalid input enter the query followed by the parameters (in either all caps postal code or state name) queries: b is doStatesBorder (q = state1 & r = state2), s is getStateBorders (q = state), c is getCloseStates (q = state), n is statesWithBorders (q = number of borders).'
    }
        res.render('template', {IPAdd : ip, requestMade: "You asked what states" + theQuery + "borders", answer:result} );

});

app.get('/c', function(req, res){
    var theQuery = req.query.q;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") 
    {
        ip = ip.substr(7)
    }

    r = 'ip address' + ip + 'function accessed: getCloseStates' + 'state1 = ' + theQuery
    
    var result = getCloseStates(theQuery)
    if (result == "Error: Bad Input")
    {
        result = 'invalid input enter the query followed by the parameters (in either all caps postal code or state name) queries: b is doStatesBorder (q = state1 & r = state2), s is getStateBorders (q = state), c is getCloseStates (q = state), n is statesWithBorders (q = number of borders).'
    }
    
    res.render('template', {IPAdd : ip, requestMade: "You asked what states are close to" + theQuery, answer:result} );

});

app.get('/n', function(req, res){
    var theQuery = req.query.q;
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") 
    {
        ip = ip.substr(7)
    }

    r = 'ip address' + ip + 'function accessed: statesWithBorders' + 'state1 = ' + theQuery
    
    var result = statesWithBorders(theQuery)
    if (result == "Error: Bad Input")
    {
        result = 'invalid input enter the query followed by the parameters (in either all caps postal code or state name) queries: b is doStatesBorder (q = state1 & r = state2), s is getStateBorders (q = state), c is getCloseStates (q = state), n is statesWithBorders (q = number of borders).';
    }
    res.render('template', {IPAdd : ip, requestMade: "You asked which states have" + theQuery + "borders", answer:result} );

});

app.get('/:page', function(req, res){
    res.sendFile(__dirname+ '/error.html');
});


// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});