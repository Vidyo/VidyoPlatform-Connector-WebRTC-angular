import { Settings } from "./settings";

export class Base extends Settings {

    /**
     * Show home page
     */
    goHome(): void {

        this.vidyoConnector.SetCameraPrivacy({
            privacy: true
        }).then(function () {
            console.log("SetCameraPrivacy Success");
        }).catch(function () {
            console.error("SetCameraPrivacy Failed");
        });

        this.vidyoConnector.SetMicrophonePrivacy({
            privacy: true
        }).then(function () {
            console.log("SetMicrophonePrivacy Success");
        }).catch(function () {
            console.error("SetMicrophonePrivacy Failed");
        });

        let routerLink = '';
        this.rtr.navigate([routerLink]);
    }
    /**
     * Update state of the local participant
     */
    updateLocalParticipantState(): void {
        let all: any = this.participantsList;
        this.participantsList = [];
        all.forEach((participant: any) => {
            if (participant.local) {
                participant.cameraOff = this.cameraPrivacy;
                participant.micOff = this.microphonePrivacy;
            }
            this.participantsList.push(participant);
        });
    }
    /**
     * Toggle web camera
     * 
     * @param cameraPrivacy Boolean
     */
    toggleCamera(cameraPrivacy?: boolean): void {

        // save current dimensions
        let node = document.getElementById("renderer") as HTMLDivElement;
        let width = getComputedStyle(node).width;
        let height = getComputedStyle(node).height;

        cameraPrivacy = cameraPrivacy === undefined ? !this.cameraPrivacy : cameraPrivacy;
        this.cameraPrivacy = cameraPrivacy;
        setTimeout(() => {
            this.vidyoConnector.SetCameraPrivacy({
                privacy: cameraPrivacy
            }).then(function () {
                console.log("SetCameraPrivacy Success");
            }).catch(function () {
                console.error("SetCameraPrivacy Failed");
            });

        }, 1000);


        if (!cameraPrivacy) {
            this.cameraIcon = "icon-camera";
            this.cameraTooltip = "Camera Privacy";
            this.showCameraFrame = "p-3 mb-5";
            // set dimensions to auto and enable frame resize / window resize
            setTimeout(() => {
                node.style.width = "auto";
                node.style.height = "auto";
            }, 2000);
        }
        else {
            this.showCameraFrame = "hide-box";
            this.cameraIcon = "icon-camera-off";
            this.cameraTooltip = "Camera Privacy";
            // Apply current dimensions or the frame will be shrunk.
            node.style.width = width;
            node.style.height = height;
        }

        this.updateLocalParticipantState();
    }
    /**
     * Toggle microphone
     * 
     * @param microphonePrivacy Boolean
     */
    toggleMic(microphonePrivacy?: boolean): void {

        microphonePrivacy = microphonePrivacy === undefined ? !this.microphonePrivacy : microphonePrivacy;
        this.microphonePrivacy = microphonePrivacy;

        this.vidyoConnector.SetMicrophonePrivacy({
            privacy: microphonePrivacy
        }).then(function () {
            console.log("SetMicrophonePrivacy Success");
        }).catch(function () {
            console.error("SetMicrophonePrivacy Failed");
        });

        if (!microphonePrivacy) {
            this.micIcon = "icon-mic";
            this.micTooltip = "Microphone Privacy";
        }
        else {
            this.micIcon = "icon-mic-off";
            this.micTooltip = "Microphone Privacy";
        }

        this.updateLocalParticipantState();
    }
    /**
     * Toggle chat/participant pane
     */
    toggleChat(): void {
        if (this.chatOn) {
            this.chatIcon = "icon-chat-off";
            this.chatOn = false;
            this.chatTooltip = "Hide chat";
            this.rightPaneExpanded = true;
            if (this.rightPaneExpanded && this.chatData.chatOpen) {
                this.chatData.numMissedMessages = 0;
            }
            this.updateScroll();
        }
        else {
            this.chatIcon = "icon-chat";
            this.chatOn = true;
            this.chatTooltip = "Show chat";
            this.rightPaneExpanded = false;
        }
    }

    /**
     * Webcam change
     * 
     * @param event Object
     */
    onCameraChange(event: any) {
        let id = event.target.value;
        let scope: any = this;
        setTimeout(() => {
            this.vidyoConnector.SelectLocalCamera({
                localCamera: scope.cameras[id]
            }).then(function () {
                console.log("SelectCamera Success");
            }).catch(function () {
                console.error("SelectCamera Failed");
            });
        }, 1000);
        if (scope.cameras[id] == null) {
            this.showCameraFrame = "hide-box";
        }
        else {
            this.showCameraFrame = "p-3 mb-5";
        }
    }
    /**
     * Microphone chage
     * @param event Object
     */
    onMicChange(event: any) {

        let id = event.target.value;
        let scope: any = this;
        this.vidyoConnector.SelectLocalMicrophone({
            localMicrophone: scope.microphones[id]
        }).then(function () {
            console.log("SelectMicrophone Success");
        }).catch(function () {
            console.error("SelectMicrophone Failed");
        });
    }
    /**
     * Speaker change
     * @param event Object
     */
    onSpeakerChange(event: any) {
        let id = event.target.value;
        let scope: any = this;

        this.vidyoConnector.SelectLocalSpeaker({
            localSpeaker: scope.speakers[id]
        }).then(function () {
            console.log("SelectSpeaker Success");
        }).catch(function () {
            console.error("SelectSpeaker Failed");
        });
    }
    /**
     * Select control - currently disable - replaced by switch control
     * @param event Object
     */
    onMonitorChange(event?: any) {

        // let id = event.target.value;
        let id = this.monitorDevices[1].value;
        let scope: any = this;
        let share = this.monitorShares[id];

        this.vidyoConnector.SelectLocalMonitor({
            localMonitor: share
        }).then(function (isSelected: boolean) {
            if (!isSelected) {
                //    $("#monitorShares option[value='0']").prop('selected', true);
            }
            console.log("SelectLocalMonitor Success", isSelected);
        }).catch(function (error: any) {
            // This API will be rejected in case any error occurred including:
            // - permission is not given on the OS level (macOS).
            //  $("#monitorShares option[value='0']").prop('selected', true);
            console.error("SelectLocalMonitor Failed:", error);
        });

    }
    /**
     * Monitor switch
     * @param event Object
     */
    onMonitorSwitchChange(event: any) {
        this.showMonitorSwitch = !this.showMonitorSwitch;
        this.monitorShare.setValue("0");
    }

    /**
     * Sharing
     */
    onShare() {
        this.onMonitorChange();
    }
    /**
     * Connect/Disconnect
     * 
     * @param callback Function
     */
    toggleCall(callback: any): void {
        // call start
        if (this.phoneOn) {
            callback.call(this);
            this.phoneIcon = "icon-phone-off";
            this.phoneOn = false;
            this.phoneTooltip = "Leave Conference";
            this.vcStatus = "Connecting...";
            this.connected = true;
            this.chatSubmitButtonLabel = this.chatSubmitButtonLabelTexts[1];
            this.chat.enable();
            this.chatMessages.length ? false : this.allChats.push(this.chatMessages);
            this.chatMessages = [];
            //        this.correctVideoHeight();
        }
        else {
            // call end
            this.vidyoConnector.Disconnect().then(function () {
                // TODO - remove local participant from HTML
                //  $("#localParticipant").remove();
                console.log("Disconnect Success");
            }).catch(function () {
                console.error("Disconnect Failure");
            });
            this.chatSubmitButtonLabel = this.chatSubmitButtonLabelTexts[0];
            this.phoneIcon = "icon-phone";
            this.phoneOn = true;
            this.phoneTooltip = "Join Conference";
            this.vcStatus = "Disconnecting...";
            this.connected = false;
            this.participantsList = [];
            this.chat.disable();
            //       clearInterval(this.videoNodeDetectorInterval);
        }
    }

    /**
     * Speaker on/off
     * 
     * @param speakerPrivacy 
     */
    toggleSpeaker(speakerPrivacy?: any): void {

        speakerPrivacy = speakerPrivacy === undefined ? !this.speakerPrivacy : speakerPrivacy;
        this.speakerPrivacy = speakerPrivacy;
        console.log(this.speakerPrivacy, speakerPrivacy)
        let scope = this;

        this.vidyoConnector.SetSpeakerPrivacy({
            privacy: speakerPrivacy
        }).then(function () {
            if (scope.speakerOn) {
                scope.speakerIcon = "icon-speaker-off";
                scope.speakerOn = false;
                scope.speakerTooltip = "Speaker Privacy";
            }
            else {
                scope.speakerIcon = "icon-speaker";
                scope.speakerOn = true;
                scope.speakerTooltip = "Speaker Privacy";
            }
            console.log("SetSpeakerPrivacy Success");
        }).catch(function () {
            console.error("SetSpeakerPrivacy Failed");
        });



    }
    /**
     * Show error message
     */
    showErrMessages(): void {
        this.showErrorMessage = !this.showErrorMessage;
    }
    /**
     * Show system message
     */
    showSysMessages(): void {
        this.showSystemMessage = !this.showSystemMessage;
    }

    /**
     * Temporary solution for video height detection - not used
     */
    correctVideoHeight(): void {

        this.videoNodeDetectorInterval = setInterval(() => {
            let nodes: any = document.querySelectorAll(".connected .remote-track video");
            let tmp: any = [];
            nodes.forEach((node: HTMLVideoElement) => {
                tmp.push(node.videoHeight);
                console.warn(node)
            });

            console.log(tmp);
            let max = Math.max(...tmp);
            nodes.forEach((node: HTMLVideoElement) => {
                node.style.maxHeight = max + 10 + "px";
            });

        }, 500);
    }
    /**
     * Update participant mic state
     * 
     * @param remoteMicrophone Object
     * @param participant Object
     * @param state String
     */
    updateParticipantMic(remoteMicrophone: any, participant: any, state: boolean): void {
        let participants: any = this.participantsList;
        this.participantsList = [];
        participants.forEach((p: any) => {
            if (p.id == participant.id) {
                p.micOff = state;
            }
        });
        this.participantsList = participants;
    }
    /**
     * Update participant camera state
     * 
     * @param localCamera Object
     * @param participant Object
     * @param state Object
     */
    updateParticipantCamera(localCamera: any, participant: any, state: boolean): void {
        let participants: any = this.participantsList;
        this.participantsList = [];
        participants.forEach((p: any) => {
            if (p.id == participant.id) {
                p.cameraOff = state;
            }
        });
        this.participantsList = participants;
    }
    /**
     * Scrolls to the bottom of the message box
     */
    updateScroll() {
        setTimeout(function () {
            let msgBox = document.getElementById("messageBox") as HTMLDivElement;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 200);
    }

    /**
     * Show/hide advanced sidebar options
     */
    showAdvanced(): void {
        this.advancedContent = !this.advancedContent;
    }

    /**
     * Show left sidebar
     */
    onSidebarShow(): void {
        this.leftPaneExpanded = true;
        setTimeout(() => {
            this.expandIcon = true; // icon change
        }, 600);

    }
    /**
     * Hide left sidebar
     */
    onSidebarHide(): void {
        this.leftPaneExpanded = false;
        setTimeout(() => {
            this.expandIcon = false; // icon change
        }, 600);

    }

    /**
     * save vidyoconnector
     * 
     * @param VC Object
     */
    setVC(VC: any) {
        this.vc = VC;
    }
    /**
     * get vidyoconnector
     * 
     * @returns Object
     */
    getVC() {
        return this.vc;
    }

    /**
     * Hide status message in the list of participants
     *
     * Optional feature - turned off now, needs update
     *
     */
    hideLastParticipantStatus(): void {
        this.participantsStatus = "";
    }

    /**
     * Get initials from the name
     * 
     * @param name String
     * @returns String
     */
    getInitials(name: string = ''): string {
        return name.toUpperCase().split(/\W/).filter(w => w.length).slice(0, 2).reduce((acc, str) => {
            return acc += str[0];
        }, '');
    }
}
