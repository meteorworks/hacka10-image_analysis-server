/**
 * ResourceController
 *
 * @description :: Server-side logic for managing resources
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req,res){
    var cardId = req.params["card_id"];

    if(cardId == null) return res.notFound();

    Score.findOne({cardId: cardId}).then(async function(userScore){

      if(userScore == null || userScore.binary == null || userScore.binary.data == null ) return res.notFound();

      var outFile = userScore.binary;
      if(userScore.binary.data != null){
        outFile = userScore.binary.data;
      }

      var buf = new Buffer(outFile, 'binary');

      // ダウンロードした内容をそのまま、ファイル書き出し。

      res.send(buf, { 'Content-Type': 'image/jpeg' }, 200);
    })
  }
};

