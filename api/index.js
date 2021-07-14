var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1776976042:AAHyR8gRC_hXZKG-RRI3iWFPV4pOWR_kJBE'
const bot = new TelegramBot(token, {polling: true});


// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `UAS JARINGAN SYARAF TIRUAN\n
	 NAMA : Adythia Rizky Taufik \n
	 NIM  : 41419120052 \n 
         click /predict`
    );   
});

state =0;
// input requires i and r 
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `Masukan nilai X1|X2|X3 contohnya 52|20|102 \n`
    );   
	state = 1;
});

bot.on('message',(msg) => {
    if(state == 1){
        s =msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
	x3 = s[2]
	model.predict(
	   [
             parseFloat(s[0]), // string to float
             parseFloat(s[1]),
	     parseFloat(s[2])
	   ]
	).then((jres)=>{
	    bot.sendMessage(
	       msg.chat.id,
		`nilai Y1 yang diprediksi adalah ${jres[0]} `
	        
	    );  
            bot.sendMessage(
		msg.chat.id,
		`nilai Y2 yang diprediksi adalah ${jres[1]} `
	    );
	    bot.sendMessage(
		msg.chat.id,
		`nilai Y3 yang diprediksi adalah ${jres[2]} `
	    );
	    state = 0;
      })               
    }else{
        state = 0
    }
});

// routers
r.get('/prediction/:x1/:x2:x3', function(req, res, next) {    
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
