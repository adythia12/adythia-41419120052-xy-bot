var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1816981987:AAFp5TJoK4RGCPpBFfH53ke15EGfINpPkBk'
const bot = new TelegramBot(token, {polling: true});

state =0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello Adythia Rizky Taufik (41419120052), welcome...\n
        click /predict`
    );   
	state = 0;
});

// input requires i and r 
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `Masukan nilai X1|X2|X3 contohnya 9|9|9`
    );   
	state = 1;
});

bot.on('message', (msg) => {
	if(state == 1){
		s = msg.text.split("|");
		model.predict(
			[
				parseFloat(s[0]),
				parseFloat(s[1]),
				parseFloat(s[2])
			]
		).then((jres1)=>{
				bot.sendMessage(
					msg.chat.id,
					`nilai Y1 yang diprediksi adalah  ${jres1[0]} `
				);										
				bot.sendMessage(
					msg.chat.id,
					`nilai Y2 yang diprediksi adalah  ${jres1[1]} `
				);
				bot.sendMessage(
					msg.chat.id,
					`nilai Y3 yang diprediksi adalah  ${jres1[2]} `
				);

				state = 0;
			})
		})
	}else{
		bot.sendMessage(
		msg.chat.id,
			`Please Click /start`
		);
		state = 0;
	}
})

// routers
r.get('/predict/:x1/:x2:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
	    parseFloat(req.params.x3)	
        ]
	).then((jres)=>{
		res.json(jres);
	})
});
	

module.exports = r;
