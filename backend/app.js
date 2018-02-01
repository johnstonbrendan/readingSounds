var gluten_info;
var gluten_link;
var chapterGiven;
var book_wanted;
var chapter_wanted_minus_1 = 11;//put input here
var text_link;
var toneID;
var scan_chapter = 0;
var fs = require('fs')
var data = '';
//below reads  in the json and ouputs the link to text file.
//below did not word due to the json file having 'text/plain; charset=us-ascii'

function gluten_to_text (name){
  var fs = require('fs');
    var contents = fs.readFileSync('http://gutendex.com/books/?search=' + name)//may jhave to change the file name
    var jsonContent = JSON.parse(contents);
    text_link = jsonContent.results[0].formats['text/plain; charset=us-ascii'];
  };


//below takes the link and downloads it to directory
function link_to_file(){
  var http = require('http');
  var fs = require('fs');

  var file = fs.createWriteStream("gluten_info.txt");
  var request = http.get(text_link, function(response) {
    var stream = response.pipe(file);
    stream.on('finish',function () {read_to_desired()});
  });
};

link_to_file();

//below reads in chunk by chunk and only the desired chapter
function read_to_desired(){

  var string_chapter = fs.readFileSync('gluten_info.txt', "utf8");
  string_chapter = string_chapter.replace(/Chapter/g, "CHAPTER");
  var index = string_chapter.indexOf("CHAPTER");
  var start;
  var end;
  while (string_chapter.indexOf("CHAPTER") >= 0 && scan_chapter <= chapter_wanted_minus_1)
  {
    start = string_chapter.indexOf("CHAPTER");
    string_chapter = string_chapter.replace(/CHAPTER/, "");
    end = string_chapter.indexOf("CHAPTER");
    scan_

chapter++;
  }
  if (end < 0)
  {
    var ending = string_chapter.length;
    data = string_chapter.substring(start, ending)
  }
  else
  {
    data = string_chapter.substring(start, end);
  }
  write_to_file();
};
//below takes in the data of the chapter and makes it into a text read
//to later be  converted into a  json
function write_to_file(){
  var fs = require('fs');
  var input = fs.writeFileSync('input_chapter.txt', data,'utf-8');
  console.log("Done!!");
};

var done;
JSONify();

function JSONify(){
	var data = fs.readFileSync('input_chapter.txt','utf-8');
	var dataNew = data.replace(/"/g,'\\"');
 dataNew = dataNew.replace(/[^\x00-\x7F]/g,'');
dataNew = dataNew.replace(/\x2F/g,"");
 dataNew = dataNew.replace(/\n/g,'');
  newdata = '{\n  \"text\": \" ' + dataNew + '\"\n}';
  fs.writeFileSync('output.json',newdata,'utf-8');
  done = fs.readFileSync('output.json','utf-8');
  console.log("JSONIFY DONE");
}

console.log(done);
var response;
function amazingAI(){
  var ToneAnalyserV3 = require('watson-developer-cloud/tone-analyzer/v3');
  var tone_analyser = new ToneAnalyserV3({
    username: '859b35a5-f631-4683-9ba3-52add7d63165',
          password: 'hpHkNrMGSeOe',//remove before git (maybe)
          version_date: '2017-09-21'
        });

  var params = {
    'tone_input' : require('./output.json'),
    'content_type' : 'application/json',
    'sentences' : false
  };


  tone_analyser.tone(params, function(error, response){
    if (error)
      console.log('error:', error);
    else
    {
      console.log(JSON.stringify(response,null,2));
      saveJSON(response);
      get_values();
    }
  });
};

function saveJSON(resp)
{
	var jsonfile = require('jsonfile');
	var file = './response.json';
	jsonfile.writeFileSync(file,resp)
//	get_values();
};

function get_values()
{
  var fs = require("fs");
  var contents = fs.readFileSync("response.json");
  var jsonContent = JSON.parse(contents);
  var max = 0;
  var max_index = -1;
  for(iterator = 0; iterator < jsonContent.document_tone.tones.length; iterator++)
  {
    console.log("this is the something value", jsonContent.document_tone.tones[iterator].score);
    if (max < jsonContent.document_tone.tones[iterator].score)
      max = jsonContent.document_tone.tones[iterator].score;
    max_index = iterator;
  }
  console.log("The type of music I want is", jsonContent.document_tone.tones[max_index].tone_id)
  toneID = jsonContent.document_tone.tones[max_index].tone_id;
};

amazingAI();
var http = require('http');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/data/search/:name-:chapter', function(req, res) {
  gluten_to_text(name);
  chapter_wanted_minus_1 = chapter - 1;
  res.send({"url": sendURL(req.params.name),"tone" : toneID});
});

app.listen(32401, function() {
  console.log('Example app listening on port 1337!');
});



function sendURL(bookName)
{
	if(bookName === "Alice in Wonderland")
	{
   return 'http:\/\/www.gutenberg.org\/ebooks\/11.epub.noimages';
 }
 else if(bookName === "My Man Jeeves")
 {
   return 'http:\/\/www.gutenberg.org\/ebooks\/8164.epub.images';
 }
 else
 {
   return 'google.com';
 }
}


http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    response.end(body);
  });
}).listen(1337);


