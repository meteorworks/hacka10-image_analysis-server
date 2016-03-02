/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res){

    //console.log(req.body);
    var cardId = req.body.cardId;
    var answer = req.body.answer;

    if(cardId == null) return res.json({
      match: false,
      score: 0
    });

    //ここ問い合わせ
    (async function(){

      try{
        var labellioService = LavellioService();
        var env = await labellioService.loadCaffeSource();
        var data = await labellioService.saveImageBase64(cardId, answer);
        var result = await labellioService.getSearchResult(cardId);

        console.log("result",result);

        if(result == null){
          result ={
            target: "不明",
            score: 0,
            match: false
          };
        }

        //
        //ここに更新
        Score.findOne({cardId: cardId}).then(async function(userScore){

          // 存在しない
          if(userScore == null){

            console.log("create");

            var created = await (function(){
              return new Promise(async function(resolve,reject){
                try {
                  Score.create({
                    cardId: cardId,
                    score: result.score,
                    match: result.match,
                    image: answer,
                    binary: data
                  }).exec(function(error, created){
                    if(error) return reject(error);
                    return resolve(created);
                  });
                }catch(e){
                  reject(e);
                }
              });
            })();

            console.log('Created Data', created);

            // 結果返却
            res.json({
              cardId: cardId,
              score: result.score,
              match: result.match,
              target: result.target
            });

          }else{

            // 存在する
            console.log("update");
            var updated = await (function(){
              return new Promise( async function(resolve, reject){
                try{
                // 更新内容
                userScore.score = result.score;
                userScore.match = result.match;
                userScore.image = answer;
                userScore.binary = data;

                //更新
                userScore.save(function(error, updated){
                  if(error) return reject(error);
                  return resolve(updated);
                });
                }
                catch(e){
                  reject(e);
                }
              });

            })().catch(function(error){
              console.error(error);
            });

            console.log("Update Date", updated);

            // 結果返却
            res.json({
              cardId: cardId,
              score: result.score,
              match: result.match,
              target: result.target
            });
          }
        });

      }catch(e){
        console.error(e);
        res.json({});
      }

      //var result = await (function(){
      //  return new Promise(async function(resolve, reject){
      //
      //
      //
      //      resolve(result);

      //  })
      //
      //})().catch(function(error){
      //  console.error(error);
      //});
      //
      //console.log(result);


    })();
  }
};

