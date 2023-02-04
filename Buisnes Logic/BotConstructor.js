

//dev
let doNotLogDebug = false;
let doNotLogBotSending = false;
let doNotLog = false;

let BotName = "MONEYLANDschool_bot";
let BotTitle = "MONEYLAND";

let TutorChatId = table.getSheetByName("BotValues").getRange("A4").getValue();

// Bot Commands
let BotCommands = {
  // start: "/start",
  rules: "/rules",
  return: "/return"
}


let BotTextCommands = {
  rules: "📘 Правила",
  return: "🎓 Вернуться к обучению",
  getReplyKeyboard(){
    return replyKeyboard = {
      keyboard: [[this.rules,this.return]],
      resize_keyboard: true
    };
  }
}

//User roles
let UserRoles = {
  without_role: "",
  admin: "admin",

}

// User tariff
let UserTariff = {
  premium: "Премиум",
  basic: "Базовый"
}

//User Current Actions (use cases)
let UserActions = {
  without_action: "",
  read_story: "read_story",
  ask_question: "ask_question",
}

let AdminActions = {
  input_story: "input_story",
  input_button_title: "input_button_title",
  input_rules: "input_rules",
  input_return: "input_return"
}
let AdminCommands = {
  add_story: "/addstory",
  stop_input: "/stop_input",
  set_rules: "/setrules",
  set_return: "/setreturn",
  leave_story: "/leave",
  set_admin_chat: "/set_admin_chat",
  SET_ADMIN_CHAT(command,whithParam=false){
    return this.isThisCommand(this.set_admin_chat,command,whithParam);
  },
  ADD_STORY(command,whithParam=false){
    return this.isThisCommand(this.add_story,command,whithParam);
  },
  STOP_INPUT(command,whithParam=false){
    return this.isThisCommand(this.stop_input,command,whithParam);
  },
  SET_RULES(command,whithParam=false){
    return this.isThisCommand(this.set_rules,command,whithParam);
  },
  SET_RETURN(command,whithParam=false){
    return this.isThisCommand(this.set_return,command,whithParam);
  },
  LEAVE_STORY(command,whithParam=false){
    return this.isThisCommand(this.leave_story,command,whithParam);
  },
  
  isThisCommand(thisCommand,command,whithParam=false){
    if(whithParam){
      if(String(command).startsWith(thisCommand+" ")||String(command).startsWith(thisCommand+"\n")) return true;   
      if(String(command).startsWith(thisCommand+"@"+BotName+" ")||String(command).startsWith(thisCommand+"@"+BotName+"\n")) return true;
    }
    else{
      if(command==thisCommand) return true;
      if(command==thisCommand+"@"+BotName) return true;
    }
    return false;
  }
}

let ButtonsCallbacks = {
  rules: "rules",
  lesson_examples: "lesson_examples",
  need_tutor: "need_tutor",
  ask_question: "ask_question"
}

let BotStrings = {
  bot_start_message: "Привет! Это бот <b>"+BotTitle+"</b>",
  // start_message: {
  //   text: "Бот "+BotName+" *Главное меню*",
  //   reply_markup: {inline_keyboard:[
  //     [{
  //       text: "Правила",
  //       callback_data: ButtonsCallbacks.rules
  //     },{
  //       text: "Примеры из курса",
  //       callback_data: ButtonsCallbacks.lesson_examples
  //     }],[{
  //       text: "Задать куратору вопрос",
  //       callback_data: ButtonsCallbacks.ask_question
  //     }]
  //   ]},
  //   parse_mode: "MarkdownV2"
  // },
  start_message_admin: {
    text: "Админские возможности:"+
    "\n/addstory - добавить новый сценарий"+
    "\n\n/setrules - изменить сообщение ПРАВИЛА"+
    "\n/setreturn - изменить сообщение ВЕРНУТЬСЯ на геткурс"
    // "\n/set_admin_chat - чат в который отправлена эта команда будет установлен как чат для пересылки вопросов"
  },
  addStory_instruction: {
    text:"<b>Для добавления сценария пришли сообщение в формате команда и название сценария на второй строчке.</b> Пример:\n\n"
  +AdminCommands.add_story+"\nВведение в курс",
    parse_mode: "HTML"
  },
  question_instruction: {
    text: "Ты можешь отправить в бота любой вопрос по курсу и получить на него ответ!\nВсе детали связанные с вопросом указывай в том же сообщении."
    +"\nВ сообщении обязательно должен быть вопросительный знак '?' 😊\n",
  }
}


// Story sheet structure
let tStories = {
  sheetName: "Воронки",
  message_adres_Title: "Адрес сообщения",
  preview_Title: "Предпросмотр (не используется ботом)",
  tableWidth: 1,
  firstContentRow: 5,
  use(){
    return table.getSheetByName(this.sheetName);
  }
}

// Questions binding sheet structure
let tQuestions = {
  sheetName: "Вопросы",
  user_id_Title: "ID пользователя",
  original_message_Title: "Оригинал",
  forwarded_message_Title: "Пересланное",
  text_Title: "Текст вопроса",
  allRange: "A:C",
  getColumnsOrder(){
    return [
      this.user_id_Title,
      this.original_message_Title,	
      this.forwarded_message_Title,
      this.text_Title,
    ];
  },
  getCol(columnTitle){
    return this.getColumnsOrder().indexOf(columnTitle);
  },
  use(){
    let sheet = table.getSheetByName(this.sheetName);
    if(!sheet){
      sheet = table.insertSheet(this.sheetName);
      let style = SpreadsheetApp.newTextStyle().setBold(true).setItalic(true).build();
      sheet.getRange(1,1,1,this.getColumnsOrder().length).setValues([this.getColumnsOrder()])
      .setTextStyle(style)
      .setHorizontalAlignment("center");
    }
    return sheet;
  }
}


// Users sheet structure
let tUsers = {
  sheetName: "Users",
  reg_date_Title: "дата регистрации",
  id_Title: "id",
  nick_Title: "ник",
  name_Title: "имя",
  current_action_Title: "текущее действие",
  role_Title: "роль",
  tariff_Title: "тариф",
  allRange: "A:G",
  getColumnsOrder(){
    return [
      this.reg_date_Title,	
      this.id_Title,	
      this.nick_Title,	
      this.name_Title,	
      this.current_action_Title, 
      this.role_Title,
      this.tariff_Title
    ];
  },
  getCol(columnTitle){
    return this.getColumnsOrder().indexOf(columnTitle);
  },
  use(){
    return table.getSheetByName(this.sheetName);
  }
}

// Logs sheet structure
let LogSheet = {
  SheetName: "Log",
  time_Title: "время",
  id_Title: "id",
  nick_Title: "ник",
  name_Title: "имя",
  message_id_Title: "message id",
  action_Title: "действие",
  what_was_sent_Title: "что прислал",
  bot_answer_Title: "ответ бота",
  getColumnsOrder(){
    return [this.time_Title,	this.id_Title,	this.nick_Title,	this.name_Title,	this.message_id_Title, this.action_Title,this.what_was_sent_Title,this.bot_answer_Title];
  },
  getCol(columnTitle){
    return this.getColumnsOrder().indexOf(columnTitle);
  }
}

// Debug sheet structure
let DebugSheet = {
  SheetName: "Debug",
}
