const http = require('http');
var express = require('express');
var fs = require('fs');
const path = require('path');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
app = express();
var https = require("https");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');
require('dotenv').config();
function page(req,res){
    var userName='BayMorningstar';
    var options = {
      host :"api.github.com",
      path: "/users/" +userName+ "/repos",
      method : 'GET',
      headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'},
      auth: process.env.AUTH || "",
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
              repos.push({
                  name : repo.name,
                  description : repo.description,
                  date : repo.created_at,
                  url : repo.html_url,
                  lang : repo.language
              });
          });
          var path = __dirname + '/public/markdown/resume.md';
          var file = fs.readFileSync(path, 'utf8');
          var result = md.render(file);
          res.render(__dirname + "/public/index", {my_repos : JSON.stringify(repos),resume :result});
      });
  });
  request.on('error', function(e) {
      console.error('and the error is '+e);
  });
  request.end();
  }
app.get('/',page);
const server = http.createServer(app);
const port = process.env.PORT || 80;
server.listen(port);
console.debug('Server listening on port ' + port);
