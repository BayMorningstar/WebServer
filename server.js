const http = require('http');
var express = require('express');
var fs = require('fs');
const path = require('path');   
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
app = express();
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();
var https = require("https");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');
require('dotenv').config();
function reposData(req,res){
    octokit
    .paginate("GET /users/{owner}/repos", {
        owner: "HalimACeylan",
      })
      .then((repos) => {
        // issues is an array of all issue objects. It is not wrapped in a { data, headers, status, url } object
        // like results from `octokit.request()` or any of the endpoint methods such as `octokit.rest.issues.listForRepo()`
        var path = __dirname + '/public/markdown/resume.md';
        var file = fs.readFileSync(path, 'utf8');
        var result = md.render(file);
        res.render(__dirname + "/public/index", {my_repos : JSON.stringify(repos),resume :result});
      })}
app.get('/',reposData);
const server = http.createServer(app);
const port = process.env.PORT || 80;
server.listen(port);
console.debug('Server listening on port ' + port);
