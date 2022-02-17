const http = require('http');
var express = require('express');
const path = require('path');
app = express();
app.use(express.json());
var https = require("https");
app.use(express.static("18.217.70.29"));
app.set('view engine', 'ejs');
app.get('/', function(req,res){
  var userName='BayMorningstar';
  var options = {
    host :"api.github.com",
    path: "/users/" +userName+ "/repos",
    method : 'GET',
    headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
  }
  var request = https.request(options, function(response){
    var body = '';
    response.on('data',function(chunk){
        body+=chunk;
    });
    response.on('end',function(){
        var json = JSON.parse(body);
        var repos =[];
        json.forEach(function(repo){
            console.log(repo.name)
            console.log(repo.description)
            console.log(repo.created_at)
            console.log(repo.html_url)
            console.log(repo.language)
            repos.push({
                name : repo.name,
                description : repo.description,
                date : repo.created_at,
                url : repo.html_url,
                lang : repo.language
            });
        });
        res.render(__dirname + "/express/index", {my_repos : JSON.stringify(repos)});
    });
   
});
request.on('error', function(e) {
    console.error('and the error is '+e);
});
request.end();


});
const server = http.createServer(app);
const port = 80;
server.listen(port);
console.debug('Server listening on port ' + port);


