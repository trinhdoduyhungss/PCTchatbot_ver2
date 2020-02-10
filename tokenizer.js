const translate = require('@vitalets/google-translate-api');
translate('chào mừng bạn đến với thành phố Đà Nẵng', {to: 'en'}).then(res_t => {
    let text = res_t.text.split(" ")
    for(let i in text){
        translate(text[i], {to: 'vi'}).then(res_ts => {
            let sen = res_ts.text
            sen = sen.split(" ")
            if(sen.length > 1){
                
            }
        })
    }
})