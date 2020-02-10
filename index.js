const KNN = require('./KNN');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const randomItem = require('random-item');
const translate = require('@vitalets/google-translate-api');
const fetch = require("node-fetch");
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/classification', (req, res) => {
    res.json(KNN.KNN(req.body.text, 5))
});


app.get('/slove', (req, res) => {
    let response = {
        "hello": [
            "Xin chào bạn.",
            "Chào bạn, tôi có thể giúp gì cho bạn",
            "Chào bạn, ngày mới tốt lành.",
            "Xin chào.",
            "Bạn là ai, mình không biết, bạn out ra đi :V",
            "Để mình yên, hỏi gì mà hỏi, google đâu mà đéo hỏi, làm phiền tui :V"
          ],
        "goodbye":[
            "Tạm biêt.",
            "Hẹn gặp lại",
            "Chào tạm biệt",
            "Hẹn gặp lại bạn lần sau",
            "Tạm biệt, hẹn gặp lại"
          ],
        "thanks": [
            "Hân hạnh",
            "Luôn sẵn lòng :)",
            "Cảm ơn bạn, giúp được bạn là vinh dự của tôi",
            "Cảm ơn bạn, Rất vui khi được giúp đỡ bạn"
          ],
        "introduction": [
            "Tôi là chat bot có khả năng giúp bạn giải những vấn đề cơ bản trong cuộc sống",
            "Tôi là chat bot, hi vọng có thể giúp bạn một ít",
            "Là một chatbot tôi có thể giúp bạn trong vài lĩnh vực như toán, hóa, lịch sử ...",
            "Tôi có thể giúp bạn vài bài tập đơn giản như cân bằng hóa học, giải phương trình, ...",
            "Tôi là chatbot, rất hân hạnh làm quen với bạn"
          ],
        "cant":[
            "Thế bạn nói xem vì sao mình phải trả lời bạn :) ?",
            "Rất tiếc bạn không có thứ mình cần và bạn hỏi không lịch sự nên mình không cần trả lời bạn :)))",
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn",
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn",
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn",
            "Tôi nghĩ vấn đề này ngoài khả năng của tôi.",
            "Xin lỗi bạn, tôi chưa được học về vấn đề này",
            "Tôi chưa thể giúp bạn ngay bây giờ, tôi sẽ cải thiện sau",
            "Xin lỗi, tôi chưa hiểu câu hỏi của bạn",
            "Xin lỗi, hiện tại tôi chưa thể giúp bạn",
            "Xin lỗi, hiện tại tôi chưa thể giúp bạn",
            "Vấn đề này khá mới với tôi, tôi có thể học sau, xin lỗi bạn",
          ],
        "general_asking": [
            "Đây là kết quả của tôi, bạn có thể tham khảo: ",
            "Tôi đã có kết quả: "
          ],
        "calculator": [
            "Đây là kết quả của tôi, bạn có thể tham khảo: ",
            "Đây là kết quả: ",
            "Kết quả nè: ",
            "Kết quả: "
          ]
    }
    let label = KNN.KNN(req.body.text, 5)
    if(label == 'math' || label == 'chemistry'){
        translate(req.body.text, {to: 'en'}).then(res_t => {
            fetch(`http://api.wolframalpha.com/v2/query?appid=VYVG5K-3PJRV24UU5&input=`+res_t.text+'&output=json', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body:{}
            }).then((res) => res.json())
              .then((data) =>{
                  let answer = ''
                  for(let i in data['queryresult']["pods"]){
                    if(data['queryresult']["pods"][i]["subpods"][0]["plaintext"] != ''){
                        if(data['queryresult']["pods"][i]["subpods"].length > 1){
                            for(let j in data['queryresult']["pods"][i]["subpods"]){
                                answer += data['queryresult']["pods"][i]["subpods"][j]["plaintext"]+" "
                            }
                        }else{
                            answer += data['queryresult']["pods"][i]["subpods"][0]["plaintext"]+" "
                        }
                    }
                    else{
                        answer += ' --> '
                    }
                  }
                  if(answer != ''){
                      res.json({answer_question: randomItem(response[randomItem(['calculator'],['general_asking'])])+answer})
                  }
              })
        })
        // try{
        // }catch{
        //     res.json({answer_question: randomItem(response['cant'])})
        // }
    }
    else{
        res.json({answer_question: randomItem(response[label])})
    }
});

app.listen(app.get('port'), function () {
    console.log("running: port")
});