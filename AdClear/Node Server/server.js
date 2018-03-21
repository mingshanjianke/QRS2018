const url=require("url");
const http=require("http");
const https=require("https");
const fs=require("fs");

var flag=0;

function httpRequest(path,picName,res){
    var httpReq= http.get(path,(resp)=>{
        let data="";
        resp.setEncoding("binary");
        resp.on("data",function(chunk){
            data+=chunk;
        });
        resp.on("end",function(){
            var imgPath="../img/"+flag+"."+picName;
            flag++;
            fs.writeFile(imgPath,data,"binary",function(err){
                if(err){
                    console.log("down fail");
                }
                res.writeHead(200,{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'text/plain;charset=utf-8'
                });
                var adDetect=require('D:/AdDetect');
                var feedbackRes=adDetect.detect(imgPath);
                var sendResult="false";
                if(feedbackRes=='y'){
                    sendResult='true';
                }else{
                    sendResult='false';
                }
                console.log(imgPath);
                console.log(sendResult);
                res.end(sendResult);
            });
        });
    });
    httpReq.on('error',function(err){

    });
}

function httpsRequest(path,picName,res){
    var httpsReq= https.get(path,(resp)=>{
        let data="";
        resp.setEncoding("binary");
        resp.on("data",function(chunk){
            data+=chunk;
        });
        resp.on("end",function(){
            flag++;
            var imgPath="../img/"+flag+"."+picName;
            fs.writeFile(imgPath,data,"binary",function(err){
                if(err){
                    console.log("down fail");
                }
                res.writeHead(200,{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'text/plain;charset=utf-8'
                });
                var adDetect=require('D:/AdDetect');
                var feedbackRes=adDetect.detect(imgPath);
                var sendResult="false";
                if(feedbackRes=='y'){
                    sendResult='true';
                }else{
                    sendResult='false';
                }
                console.log(imgPath);
                console.log(sendResult);
                res.end(sendResult);
            });
        });
    });
    httpsReq.on('error',function(err){

    });
}

const server=http.createServer((req,res)=>{
        var path=url.parse(req.url).path.slice(1); 
if(path.indexOf('about:blank')!=-1){
    return;
}
const pathArr=path.split("/");
var picName=pathArr[pathArr.length-1];
if(picName.length>100){
    picName='long';
}
var protocol=path.split("//")[0];
if(protocol){
    if(protocol.indexOf('https')!=-1){
        httpsRequest(path,picName,res);
    }else{
        httpRequest(path,picName,res);
    }
}else{
    path="http:"+path;
    httpRequest(path,picName,res);
}
}).listen(3000,'127.0.0.1');

console.log("start server,listening 127.0.0.1:3000");