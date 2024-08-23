export class Message {
    constructor(public data: JSON) {
        this.data = data;
    }
}

export class LoginMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class ReadyMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class AmountReadyMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class StartGameMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class QuestionMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class AttackQuestionMessage extends QuestionMessage {
    constructor(public data: JSON) {
        super(data);
    }
}

export class AnswerMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

/**
 * Message to send to the user when they answer a question correctly
 * Will either be 0 for incorrect or 1 for correct
 */
export class ResultMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class UserInfoMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

export class GameInfoMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}

//To be broadcasted to all users
export class DeathUserMessage extends Message {
    constructor(public data: JSON) {
        super(data);
    }
}