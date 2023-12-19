const { on } = require('events')
const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const { urlToHttpOptions } = require('url')
const token = '6659708904:AAEedAateNqR64Pb0dGFZle_1UQPFKipGBI'

const bot = new TelegramApi(token, {polling: true})


const chats = {}
bot.setMyCommands([
    {command: '/start', description: 'Приветствие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Играть!'},
])


 const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Давай сыграем, сейчас я загадаю цифру от 0 до 9, а ты попробуй её отгадать');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
 }
 

const start = () => {

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
           await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/s/siegbaum_digital_lab/siegbaum_digital_lab_001.webp?v=1702456804');
           return bot.sendMessage(chatId, 'Добро пожаловать чат-бот корпоративного обучения новых сотрудников');
        }
    
        if (text === '/info') {
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }  

        if (text === '/game') {
           return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');  
    })
    bot.on ('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
         
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал ${chats[chatId]}!`, againOptions);
        } else {
           return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру  ${chats[chatId]}`, againOptions); 
        }

       /*bot.sendMessage(chatId, `Твой выбор цифра ${data}`);*/


        console.log(msg)
    })
}

start()  