import { Base } from "./base";

export class Chat extends Base {

    constructor() {
        super();
    }

    /**
     * Send message
     * 
     * @param data Object - form data
     */
    sendMessage(data: any) {
        this.sendChatMessage(data.chat);
    }

    /**
     * Handle keys
     * 
     * @param e Object - event
     * @param data Object - form data
     */
    onChatKeyDown(e: any, data: any): void {
        // Ctrl + Enter sends message
        // Enter allows write a new line
        if (e.which == 13 && e.ctrlKey) {
            setTimeout(() => { this.sendMessage(data) }, 0);
        }
    }

    /**
     * Handle Vidyo's group text chat
     */
    handleChat() {

        let thisClass = this;

        // Register for message/chat events
        this.vidyoConnector.RegisterMessageEventListener({
            /**
             * Local Message
             * @param message Object
             */
            onChatMessageAcknowledged: function (message: any) {

                let timestamp: string = thisClass.getTimeStamp();

                // Expand the bubble if you were the last one to send a message and the message was sent within the last minute
                if (thisClass.chatData.lastChatTime == timestamp && thisClass.chatData.lastChatParticipant == 'You') {
                    let msg = thisClass.chatMessages[thisClass.chatMessages.length - 1].message;
                    thisClass.chatMessages[thisClass.chatMessages.length - 1].message = msg + "\n" + message.body
                } else {
                    // Create a new chat bubble and append the chat bubble to the message-box
                    thisClass.chatMessages.push({ name: 'You', time: timestamp, message: message.body, local: true });
                }

                thisClass.chatData.lastChatParticipant = 'You';
                thisClass.chatData.lastChatParticipantId = thisClass.chatData.localParticipantId;
                thisClass.chatData.lastChatTime = timestamp;
                thisClass.updateScroll();
            },
            /**
             * Remote message
             * 
             * @param participant Object
             * @param message Object
             */
            onChatMessageReceived: function (participant: any, message: any) {
                // If it's the same participant and last message was within the last minute append new message text to the same bubble
                let timestamp: string = thisClass.getTimeStamp();

                if (participant.id == thisClass.chatData.lastChatParticipantId && timestamp == thisClass.chatData.lastChatTime) {
                    let msg = thisClass.chatMessages[thisClass.chatMessages.length - 1].message;
                    thisClass.chatMessages[thisClass.chatMessages.length - 1].message = msg + "\n" + message.body
                } else {
                    // Create a new chat bubble with new message text
                    thisClass.chatMessages.push({ name: participant.name, time: timestamp, message: message.body, local: false });
                }
                thisClass.chatData.lastChatTime = timestamp;
                thisClass.chatData.lastChatParticipant = participant.name;
                thisClass.chatData.lastChatParticipantId = participant.id;

                if (!thisClass.rightPaneExpanded || (thisClass.rightPaneExpanded && !thisClass.chatData.chatOpen)) {
                    thisClass.chatData.numMissedMessages += 1;
                }
                thisClass.updateScroll();
            }
        });
    }

    /**
     * Get's a new timestamp format HH:MM on a 12 hour clock
     * 
     * @returns String
     */
    getTimeStamp(): string {
        let time = new Date();
        let hour = time.getHours() % 12;
        let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        let meridies = Math.floor(time.getHours() / 12) == 1 ? "PM" : "AM";
        return hour + ":" + minutes + ' ' + meridies;
    }

    /**
     * Send chat message to other participants
     * 
     * @param msg String
     */
    sendChatMessage(msg: string) {
        // Send the chat message through the vidyoConnector
        this.vidyoConnector.SendChatMessage({ message: msg });
        // Clear the message box
        this.chat.setValue('');
        // Scroll to bottom of message box
        this.updateScroll();
    }

    /**
     * Set the local participant ID
     * 
     * @param participantId 
     */
    setLocalParticipantId(participantId: any) {
        this.chatData.localParticipantId = participantId;
    }

    /**
     * Reset the chat data
     */
    resetChatData() {
        this.chatData.lastChatParticipant = '';
        this.chatData.lastChatParticipantId = '';
        this.chatData.chatOpen = false;
        this.chatData.numMissedMessages = 0;
        this.chatData.lastChatTime = '';
    }

    /**
     * Reset unread messages
     */
    onChatTabClick(): void {
        this.chatData.chatOpen = true;
        this.chatData.numMissedMessages = 0;
        this.updateScroll();
    }
    /**
     * Save info that participant tab is open
     * It serves for unread messages gfx notification
     */
    onParticipantTabClick(): void {
        this.chatData.chatOpen = false;
    }
    /**
     * Optional feature - turned off now, needs update
     * 
     * @param e Object - Event
     */
    hideChatMessage(e: any): void {
        e.currentTarget.parentElement.parentElement.classList.remove("show")
    }
}
