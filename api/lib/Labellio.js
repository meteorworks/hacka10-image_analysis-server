"use strict";

var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var source = require('shell-source');

class LavellioUtil {
  constructor(){

  }
  saveImageBase64(id, data){
    console.log(id,data);
    return new Promise(async function(resolve, reject){

      try{
        // データを受け取って格納。
        // data:image/jpeg;base64,というデータはBase64ではなくゴミなので排除する。
        //      var data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA...省略...KKKKAP/2Q=='.split( ',' );
        data = data.split( ',' );

        // Base64のデータのみが入っている。
        var b64img = data[ 1 ];

        // npm i urlsafe-base64 でインストールしたモジュール。
        var base64 = require('urlsafe-base64');

        // これでBase64デコードするとimgにバイナリデータが格納される。
        var img = base64.decode( b64img );
        console.log(img);
        var fs = require('fs');

        var dir = __dirname + '/../../learning/search/'+ id + "/";
        mkdirp.sync(dir)

        // 試しにファイルをsample.jpgにして保存。Canvasではjpeg指定でBase64エンコードしている。
        fs.writeFile( dir +'sample.jpg', img, function (err) {
          if(err) return reject(err);
          else return resolve(img)
        });

      }catch(e){
        reject(e);
      }
    });
  }
  loadCaffeSource(){
    return new Promise(function(resolve, reject){
      source('/opt/caffe/caffe.bashrc', function(err) {
        if (err){
          console.error(err);
          return reject(err)
        }

        resolve(process.env);

      });
    })
  }
  getSearchResult(id){
    return new Promise(function(resolve, reject){
      var procId = null;
      var command = "labellio_classify " + __dirname + '/../../learning/model ' + __dirname + '/../../learning/search/'+ id;

      console.log(command);

      var connect = exec(command, function (error, stdout, stderr){
        try{
          if (error !== null){
            console.error(error);
            return resolve(null);
          }
          var result = stdout.split("\n")[0].split("\t");

          var file = result[0] || "";
          var target = result[1] || "";
          var scores = result[2] || "";

          scores = scores.replace( /\[ /g , "").replace( /]/g , "").split("  ");
          if(scores.length == 0){
            scores = [0];
          }

          // スコア計上
          var score = Math.max.apply(null, scores);

          // 単位取得
          var match = ("spinetail mobula" == target) && (score >= 0.6);
          if(score < 0.6){
            target = "";
          }

          // pitted stingray,ホシエイ
          // spinetail mobula,イトマキエイ
          // whale shark,ジンベイザメ
          // spotted eagle ray,マダラトビエイ
          if(target == "pitted stingray"){
            target = "ホシエイ";
          }else if("spinetail mobula"){
            target = "イトマキエイ";
          }else if("whale shark"){
            target = "ジンベイザメ";
          }else if("spotted eagle ray"){
            target = "マダラトビエイ"
          }else{
            target = "不明";
          }

          return resolve({
            target: target,
            score: score,
            match: match
          });
        }catch(e){
          console.error(e);
          return reject(e);
        }finally{
          if(procId) clearTimeout(procId);
          //console.log("finally");
        }
      });

      // send SIGHUP to process
      procId = setTimeout(function(){
        connect.kill('SIGHUP');
      },5*1000);

    });
  }
}
module.exports=LavellioUtil;
