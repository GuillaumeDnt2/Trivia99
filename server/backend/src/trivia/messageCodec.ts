import {
    Message,
    LoginMessage,
    ReadyMessage,
    AmountReadyMessage,
    StartGameMessage,
    QuestionMessage,
    AttackQuestionMessage,
    AnswerMessage,
    ResultMessage,
    UserInfoMessage,
    GameInfoMessage,
    DeathUserMessage
} from './message';

/**
 * Codec for encoding and decoding messages.
 */
export class MessageCodec {
    static types = {
        Message,
        LoginMessage,
        ReadyMessage,
        AmountReadyMessage,
        StartGameMessage,
        SendQuestionMessage: QuestionMessage,
        SendAttackQuestionMessage: AttackQuestionMessage,
        SendAnswerMessage: AnswerMessage,
        SendResultMessage: ResultMessage,
        SendUserInfoMessage: UserInfoMessage,
        GameInfoMessage: GameInfoMessage,
        SendDeathUserMessage: DeathUserMessage
    };

    /**
     * Encodes a message into a string in JSON format.
     */
    static encode(message) {
        return JSON.stringify({
            type: message.constructor.name,
            data: message.message
        });
    }

    /**
     * Decodes a message from a string in JSON format into an instance of the corresponding message class.
     * @param {String} string The string to be decoded.
     * @returns {Message} An instance of the corresponding message class.
     */
    static decode(string) {
        const obj = JSON.parse(string);
        const messageType = this.types[obj.type];
        return new messageType(obj.data);
    }
}