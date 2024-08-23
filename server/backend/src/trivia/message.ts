class Message {
    constructor(public message: string) {
        this.message = message;
    }
}

class LoginMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

class SendQuestionMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

class SendAttackQuestionMessage extends SendQuestionMessage {
    constructor(public message: string) {
        super(message);
    }
}

class SendAnswerMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

/**
 * Message to send to the user when they answer a question correctly
 * Will either be 0 for incorrect or 1 for correct
 */
class SendResultMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

class SendUserInfoMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

class SendGameInfoMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}

//To be broadcasted to all users
class SendDeathUserMessage extends Message {
    constructor(public message: string) {
        super(message);
    }
}


export default Message;