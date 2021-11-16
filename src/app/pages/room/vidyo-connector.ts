import { Chat } from './chat';

// declare var getUrlParameterByName: any;

export class VidyoConnector extends Chat {
    constructor() {
        super();
    }

    /**
     * Get form control value
     *
     * @param item String - form control name
     * @returns
     */
    getFormValue(item: string): any {
        let val = this.sideBarForm.controls[item].value;
        return val == null ? '' : val;
    }

    /**
     * Reset data
     *
     * @param connectionStatus String
     * @param message String
     */
    connectorDisconnected(connectionStatus: string, message: string) {
        this.vcStatus = connectionStatus;
        this.message = message;
        this.resetChatData();
    }

    /**
     * Connect/Disconnet
     */
    joinLeave() {
        let callback: any = this.connectToConference;
        this.toggleCall(callback);
    }

    /**
     * Toggle local camera
     * @param cameraPrivacy Boolean
     */
    setLocalParticipantCameraPrivacy(cameraPrivacy: boolean) {
        if (this.localParticipant) {
            this.toggleCamera(cameraPrivacy);
        }
    }

    /**
     * Toggle local microphone
     * @param microphonePrivacy Boolean
     */
    setLocalParticipantMicrophonePrivacy(microphonePrivacy: boolean) {
        if (this.localParticipant) {
            this.toggleMic(microphonePrivacy);
        }
    }
    /**
     * Get Participant name - not sure if it is needed, participant has name property
     * @param participant - Object
     * @param cb - function
     * @returns undefined
     */
    getParticipantName(participant: any, cb: any): void {
        if (!participant) {
            cb('Undefined');
            return;
        }

        if (participant.name) {
            cb(participant.name);
            return;
        }

        participant
            .GetName()
            .then(function (name: any) {
                cb(name);
            })
            .catch(function () {
                cb('GetNameFailed');
            });
    }

    /**
     * Extract the desired parameter from the browser's location bar
     *
     * @param name String
     * @returns String
     */
    getUrlParameterByName(name: string): any {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    /**
     * Use parameters from URL
     */
    parseUrlParameters() {
        // Fill in the form parameters from the URI
        let host = this.getUrlParameterByName('host');
        if (host) {
            this.host.setValue(host);
        }

        let roomKey = this.getUrlParameterByName('roomKey');

        if (roomKey) {
            this.roomKey.setValue(roomKey);
        }
        let roomPin = this.getUrlParameterByName('roomPin');

        if (roomPin) {
            this.roomPin.setValue(roomPin);
        }

        let displayName = this.getUrlParameterByName('displayName');

        if (displayName) {
            this.displayName.setValue(displayName);
        }

        let resourceId = this.getUrlParameterByName('resourceId');

        if (resourceId) {
            // not used / implemented
            /* This is the "room" or "space" to which you're connecting
                        the user.Other users who join this same Resource will be able to see and hear each other.
                        */
        }

        const extData = this.getUrlParameterByName('extData');

        if (extData) {
            this.extData.setValue(extData);
        }

        const extDataType = this.getUrlParameterByName('extDataType');

        if (extDataType) {
            this.extDataType.setValue(extDataType);
        }

        this.configParams.disableAudioLevelMonitor = this.getUrlParameterByName(
            'disableAudioLevelMonitor'
        );
        this.configParams.dynamicAudioSources = this.getUrlParameterByName(
            'dynamicAudioSources'
        );
        this.configParams.enableAudioOnlyMode = this.getUrlParameterByName(
            'enableAudioOnlyMode'
        );
        this.configParams.enableLoki =
            this.getUrlParameterByName('enableLoki') === 'true';
        this.configParams.lokiBaseUrl = this.getUrlParameterByName('lokiBaseUrl');

        this.configParams.autoJoin = this.getUrlParameterByName('autoJoin');
        this.configParams.enableDebug = this.getUrlParameterByName('enableDebug');
        let hideConfig = this.getUrlParameterByName('hideConfig');

        let showAdvancedSettings = this.getUrlParameterByName(
            'showAdvancedSettings'
        );
        const enableAutoReconnect = this.getUrlParameterByName(
            'enableAutoReconnect'
        );
        const maxReconnectAttempts = this.getUrlParameterByName(
            'maxReconnectAttempts'
        );
        const reconnectBackoff = this.getUrlParameterByName('reconnectBackoff');

        if (enableAutoReconnect) {
            this.configParams.enableAutoReconnect = ['true', '1'].includes(
                enableAutoReconnect
            );
        }
        if (maxReconnectAttempts) {
            this.configParams.maxReconnectAttempts = maxReconnectAttempts;
        }
        if (reconnectBackoff) {
            this.configParams.reconnectBackoff = reconnectBackoff;
        }

        let locationTag = this.getUrlParameterByName('locationTag');
        if (locationTag && locationTag !== '') {
            this.vidyoConnector.SetPool({
                name: locationTag,
            });
        }

        if (hideConfig == '1') {
            this.onSidebarHide();
            /*
                        $("#options").addClass("hiddenPermanent");
                        $("#optionsVisibilityButton").addClass("hiddenPermanent");
                        $("#renderer").addClass("rendererFullScreenPermanent");
                        */
        }
        /*  TODO - not implemented
                if (showAdvancedSettings === 'true') {
                    $("#advancedSettings").removeClass("hiddenPermanent");
                }
                */
        return;
    }

    /**
     * Register device listeners
     */
    registerDeviceListeners() {
        // Map the "None" option (whose value is 0) in the camera, microphone, and speaker drop-down menus to null since
        // a null argument to SelectLocalCamera, SelectLocalMicrophone, and SelectLocalSpeaker releases the resource.
        let cameras: any = this.cameras;
        let microphones: any = this.microphones;
        let speakers: any = this.speakers;

        cameras[0] = null;
        microphones[0] = null;
        speakers[0] = null;
        let thisClass = this;
        let vidyoConnector = this.vidyoConnector;

        // Handle appearance and disappearance of camera devices in the system
        vidyoConnector
            .RegisterLocalCameraEventListener({
                /**
                 * New camera is available - camerashare is not implemented
                 *
                 * @param localCamera Object
                 */
                onAdded: function (localCamera: any) {
                    thisClass.videoDevices.push({
                        value: window.btoa(localCamera.id),
                        label: localCamera.name,
                    });
                    cameras[window.btoa(localCamera.id)] = localCamera;
                },
                /**
                 * Existing camera became unavailable - camerashare is not implemented
                 *
                 * @param localCamera Object
                 */
                onRemoved: function (localCamera: any) {
                    //
                    let tmp: any = [];
                    thisClass.videoDevices.forEach((item) => {
                        if (item.value != window.btoa(localCamera.id)) {
                            tmp.push(item);
                        }
                    });

                    thisClass.videoDevices = []; // reset
                    thisClass.videoDevices = tmp; // add new devices

                    if (thisClass.localParticipant) {
                        thisClass.setLocalParticipantCameraPrivacy(true);
                    }
                    delete cameras[window.btoa(localCamera.id)];
                },
                /**
                 * Camera was selected/unselected by you or automatically
                 *
                 * @param localCamera Object
                 */
                onSelected: function (localCamera: any) {
                    if (localCamera) {
                        let tmp: any = [];
                        let notFound = true;
                        thisClass.videoDevices.forEach((item) => {
                            if (item.selected) {
                                delete item.selected;
                            }
                            if (item.value != window.btoa(localCamera.id)) {
                                tmp.push(item);
                            } else {
                                tmp.push({
                                    value: window.btoa(localCamera.id),
                                    label: localCamera.name,
                                    selected: true,
                                });
                                notFound = false;
                            }
                        });

                        if (notFound) {
                            tmp.push({
                                value: window.btoa(localCamera.id),
                                label: localCamera.name,
                                selected: true,
                            });
                        }
                        thisClass.videoDevices = []; // reset
                        thisClass.videoDevices = tmp; // add new devices
                    }
                },
                /**
                 * Camera state
                 *
                 * @param localCamera Object
                 * @param state String
                 */
                onStateUpdated: function (localCamera: any, state: any) {
                    thisClass.cameraPrivacy = state === 'VIDYO_DEVICESTATE_Stopped';

                    thisClass.toggleCamera(thisClass.cameraPrivacy);

                    if (thisClass.localParticipant) {
                        thisClass.setLocalParticipantCameraPrivacy(thisClass.cameraPrivacy);
                    }
                },
            })
            .then(function () {
                console.log('RegisterLocalCameraEventListener Success');
            })
            .catch(function () {
                console.error('RegisterLocalCameraEventListener Failed');
            });

        // Handle appearance and disappearance of microphone devices in the system
        vidyoConnector
            .RegisterLocalMicrophoneEventListener({
                /**
                 * New microphone is available
                 *
                 * @param localMicrophone Object
                 */
                onAdded: function (localMicrophone: any) {
                    thisClass.micDevices.push({
                        value: window.btoa(localMicrophone.id),
                        label: localMicrophone.name,
                    });
                    microphones[window.btoa(localMicrophone.id)] = localMicrophone;
                },
                /**
                 * Existing microphone became unavailable
                 *
                 * @param localMicrophone Object
                 */
                onRemoved: function (localMicrophone: any) {
                    //

                    let tmp: any = [];
                    thisClass.micDevices.forEach((item) => {
                        if (item.value != window.btoa(localMicrophone.id)) {
                            tmp.push(item);
                        }
                    });

                    thisClass.micDevices = []; // reset
                    thisClass.micDevices = tmp; // add new devices

                    if (thisClass.localParticipant) {
                        thisClass.setLocalParticipantCameraPrivacy(true);
                    }

                    delete microphones[window.btoa(localMicrophone.id)];
                },
                /**
                 * Microphone was selected/unselected by you or automatically
                 *
                 * @param localMicrophone
                 */
                onSelected: function (localMicrophone: any) {
                    if (thisClass.localParticipant) {
                        thisClass.setLocalParticipantMicrophonePrivacy(
                            thisClass.microphonePrivacy
                        );
                    }
                    if (localMicrophone) {
                        let tmp: any = [];
                        let notFound = true;
                        thisClass.micDevices.forEach((item) => {
                            if (item.selected) {
                                delete item.selected;
                            }
                            if (item.value != window.btoa(localMicrophone.id)) {
                                tmp.push(item);
                            } else {
                                tmp.push({
                                    value: window.btoa(localMicrophone.id),
                                    label: localMicrophone.name,
                                    selected: true,
                                });
                                notFound = false;
                            }
                        });

                        if (notFound) {
                            tmp.push({
                                value: window.btoa(localMicrophone.id),
                                label: localMicrophone.name,
                                selected: true,
                            });
                        }
                        thisClass.micDevices = []; // reset
                        thisClass.micDevices = tmp; // add new devices
                    }
                },
                /**
                 * Microphone state was updated
                 *
                 * @param localMicrophone Object
                 * @param state String
                 */
                onStateUpdated: function (localMicrophone: any, state: any) {
                    thisClass.microphonePrivacy = state === 'VIDYO_DEVICESTATE_Stopped';
                    thisClass.toggleMic(thisClass.microphonePrivacy);
                    if (thisClass.localParticipant) {
                        this.setLocalParticipantMicrophonePrivacy(
                            thisClass.microphonePrivacy
                        );
                    }
                },
            })
            .then(function () {
                console.log('RegisterLocalMicrophoneEventListener Success');
            })
            .catch(function () {
                console.error('RegisterLocalMicrophoneEventListener Failed');
            });

        // Handle appearance and disappearance of speaker devices in the system
        vidyoConnector
            .RegisterLocalSpeakerEventListener({
                /**
                 * New speaker is available
                 *
                 * @param localSpeaker Object
                 */
                onAdded: function (localSpeaker: any) {
                    thisClass.speakerDevices.push({
                        value: window.btoa(localSpeaker.id),
                        label: localSpeaker.name,
                    });
                    speakers[window.btoa(localSpeaker.id)] = localSpeaker;
                },
                /**
                 * Existing speaker became unavailable
                 *
                 * @param localSpeaker Object
                 */
                onRemoved: function (localSpeaker: any) {
                    let tmp: any = [];
                    thisClass.speakerDevices.forEach((item) => {
                        if (item.value != window.btoa(localSpeaker.id)) {
                            tmp.push(item);
                        }
                    });

                    thisClass.speakerDevices = []; // reset
                    thisClass.speakerDevices = tmp; // add new devices

                    delete speakers[window.btoa(localSpeaker.id)];
                },
                /**
                 * Speaker was selected/unselected by you or automatically
                 *
                 * @param localSpeaker Object
                 */
                onSelected: function (localSpeaker: any) {
                    if (localSpeaker) {
                        let tmp: any = [];
                        let notFound = true;
                        thisClass.speakerDevices.forEach((item) => {
                            if (item.selected) {
                                delete item.selected;
                            }
                            if (item.value != window.btoa(localSpeaker.id)) {
                                tmp.push(item);
                            } else {
                                tmp.push({
                                    value: window.btoa(localSpeaker.id),
                                    label: localSpeaker.name,
                                    selected: true,
                                });
                                notFound = false;
                            }
                        });

                        if (notFound) {
                            tmp.push({
                                value: window.btoa(localSpeaker.id),
                                label: localSpeaker.name,
                                selected: true,
                            });
                        }
                        thisClass.speakerDevices = []; // reset
                        thisClass.speakerDevices = tmp; // add new devices
                    }
                },
                /**
                 * Speaker state was updated
                 *
                 * @param localSpeaker Object
                 * @param state String
                 */
                onStateUpdated: function (localSpeaker: any, state: any) { },
            })
            .then(function () {
                console.log('RegisterLocalSpeakerEventListener Success');
            })
            .catch(function () {
                console.error('RegisterLocalSpeakerEventListener Failed');
            });

        // Handle remote cameras
        vidyoConnector
            .RegisterRemoteCameraEventListener({
                /**
                 * New remote camera is available
                 *
                 * @param localCamera Object
                 * @param participant Object
                 */
                onAdded: function (localCamera: any, participant: any) {
                    thisClass.updateParticipantCamera(localCamera, participant, false);
                },
                /**
                 * Remote camera became unavailable
                 *
                 * @param localCamera Object
                 * @param participant Object
                 */
                onRemoved: function (localCamera: any, participant: any) {
                    thisClass.updateParticipantCamera(localCamera, participant, true);
                },
                /**
                 * Remote camera state was updated
                 *
                 * @param localCamera Object
                 * @param participant Object
                 */
                onStateUpdated: function (localCamera: any, participant: any) {
                    console.warn(arguments);
                },
            })
            .then(function () {
                console.log('RegisterRemoteCameraEventListener Success');
            })
            .catch(function () {
                console.error('RegisterRemoteCameraEventListener Failed');
            });

        vidyoConnector
            .RegisterRemoteMicrophoneEventListener({
                /**
                 * New remote microphone is available
                 *
                 * @param remoteMicrophone Object
                 * @param participant Object
                 */
                onAdded: function (remoteMicrophone: any, participant: any) {
                    thisClass.updateParticipantMic(remoteMicrophone, participant, false);
                },
                /**
                 *
                 * Remote microphone is unavailable
                 *
                 * @param remoteMicrophone Object
                 * @param participant Object
                 */
                onRemoved: function (remoteMicrophone: any, participant: any) {
                    thisClass.updateParticipantMic(remoteMicrophone, participant, true);
                },
                /**
                 * Remote microphone state was updated
                 *
                 * @param remoteMicrophone Object
                 * @param participant Object
                 * @param state String
                 */
                onStateUpdated: function (
                    remoteMicrophone: any,
                    participant: any,
                    state: any
                ) {
                    // mic on
                    if (state === 'VIDYO_DEVICESTATE_Resumed') {
                        thisClass.updateParticipantMic(
                            remoteMicrophone,
                            participant,
                            false
                        );
                    }
                    // mic off
                    if (state === 'VIDYO_DEVICESTATE_Paused') {
                        thisClass.updateParticipantMic(remoteMicrophone, participant, true);
                    }
                },
            })
            .then(function () {
                console.log('RegisterRemoteMicrophoneEventListener Success');
            })
            .catch(function () {
                console.error('RegisterRemoteMicrophoneEventListener Failed');
            });
    }

    /**
     * Handle participant change
     */
    handleParticipantChange() {
        let thisClass = this;
        this.vidyoConnector.ReportLocalParticipantOnJoined({
            reportLocalParticipant: true,
        });
        this.vidyoConnector
            .RegisterParticipantEventListener({
                /**
                 * Participant joined the room
                 *
                 * @param participant Object
                 */
                onJoined: function (participant: any) {
                    thisClass.getParticipantName(participant, function (name: string) {
                        if (participant.isLocal) {
                            let localParticipant = participant;
                            thisClass.setLocalParticipantCameraPrivacy(
                                thisClass.cameraPrivacy
                            );
                            thisClass.setLocalParticipantMicrophonePrivacy(
                                thisClass.microphonePrivacy
                            );
                            thisClass.statsSendingTool.setLocalParticipantId(participant.id);
                        }
                    });
                    if (!participant.isLocal) {
                        thisClass.participantsStatus = participant.name + ' Joined';
                    }
                },
                /**
                 * Participant left the room
                 *
                 * @param participant Object
                 */
                onLeft: function (participant: any) {
                    // not used for now
                    thisClass.getParticipantName(participant, function (name: any) { });
                    if (participant.isLocal) {
                        thisClass.participantsStatus = '';
                    } else {
                        thisClass.participantsStatus = participant.name + ' Left';
                    }
                },
                /**
                 * Participant changed setup
                 *
                 * @param participants Object
                 * @param cameras Object
                 */
                onDynamicChanged: function (participants: any, cameras: any) {
                    // Order of participants changed

                    let all: any = thisClass.participantsList;
                    thisClass.participantsList = [];
                    // copy/save all previous states (mic, camera) into the new participants list - copy/save current custom participant state
                    // listeners doesn't detect participant's device which is turned off if I join the meeting
                    participants.forEach((participant: any) => {
                        let p: any = { name: participant.name, id: participant.id };
                        all.forEach((user: any) => {
                            if (user.id == participant.id && user.cameraOff != undefined) {
                                p.cameraOff = user.cameraOff;
                                p.micOff = user.micOff;
                            }
                        });

                        if (participant.isLocal) {
                            p.cameraOff = thisClass.cameraPrivacy;
                            p.micOff = thisClass.microphonePrivacy;
                            p.local = true;
                        }

                        // when participant starts call and camera is off, no notification about this state
                        // when participant starts call and camera is on, a new camera is added
                        // if cameraOff is undefined, it is off
                        if (!participant.isLocal && p.cameraOff == undefined) {
                            p.cameraOff = true;
                        }
                        thisClass.participantsList.push(p);
                    });
                    console.warn(thisClass.participantsList);
                },
                /**
                 * Who is speaking
                 *
                 * @param participant Object
                 * @param audioOnly Object
                 */
                onLoudestChanged: function (participant: any, audioOnly: any) {
                    thisClass.participantsStatus = participant.name + ' Speaking';
                },
            })
            .then(function () {
                console.log('RegisterParticipantEventListener Success');
            })
            .catch(function () {
                console.error('RegisterParticipantEventListener Failed');
            });
    }
    /**
     * Handle reconnect
     */
    handleReconnect() {
        this.vidyoConnector
            .RegisterReconnectEventListener({
                onReconnecting: (
                    attempt: any,
                    attemptTimeout: any,
                    lastReason: any
                ) => {
                    console.warn(
                        `Reconnecting: attempt=${attempt}, attemptTimeout=${attemptTimeout}s, lastReason=${lastReason}`
                    );
                },
                onReconnected: () => {
                    console.warn('Reconnected');
                },
                onConferenceLost: (lastReason: any) => {
                    console.warn(`ConferenceLost: lastReason=${lastReason}`);
                }
            })
            .then(function () {
                console.log('RegisterReconnectEventListener Success');
            })
            .catch(function () {
                console.error('RegisterReconnectEventListener Failed');
            });
    }
    /**
     * Handle sharing
     */
    handleSharing() {
        let isSafari =
            navigator.userAgent.indexOf('Chrome') < 0 &&
            navigator.userAgent.indexOf('Safari') >= 0;
        let isSharingWindow = false; // Flag indicating whether a window is currently being shared
        let isSharingMonitor = false;
        let thisClass = this;

        // The monitorShares & windowShares associative arrays hold a handle to each window/monitor that are available for sharing.
        // The element with key "0" contains a value of null, which is used to stop sharing.
        this.monitorShares[0] = null;
        function StartMonitorShare() {
            // Register for monitor share status updates
            thisClass.vidyoConnector
                .RegisterLocalMonitorEventListener({
                    /**
                     * New share is available so add it to the monitorShares array and the drop-down list
                     *
                     * @param localMonitorShare Object
                     */
                    onAdded: function (localMonitorShare: any) {
                        if (localMonitorShare.name != '') {
                            thisClass.monitorDevices.push({
                                value: window.btoa(localMonitorShare.id),
                                label: localMonitorShare.name,
                            });
                            thisClass.monitorShares[window.btoa(localMonitorShare.id)] =
                                localMonitorShare;
                            console.log(
                                'Monitor share added, name : ' +
                                localMonitorShare.name +
                                ' | id : ' +
                                window.btoa(localMonitorShare.id)
                            );
                        }
                    },
                    /**
                     * Stop local monitor share
                     * @param localMonitorShare Object
                     */
                    onRemoved: function (localMonitorShare: any) {
                        let tmp: any = [];
                        thisClass.monitorDevices.forEach((item) => {
                            if (item.value != window.btoa(localMonitorShare.id)) {
                                tmp.push(item);
                            }
                        });

                        thisClass.monitorDevices = []; // reset
                        thisClass.monitorDevices = tmp; // add new devices

                        delete thisClass.monitorShares[window.btoa(localMonitorShare.id)];
                    },
                    /**
                     * Share was selected/unselected by you or automatically
                     *
                     * @param localMonitorShare Object
                     */
                    onSelected: function (localMonitorShare: any) {
                        // Share was selected/unselected by you or automatically
                        if (localMonitorShare) {
                            let tmp: any = [];
                            let notFound = true;
                            thisClass.monitorDevices.forEach((item) => {
                                if (item.selected) {
                                    delete item.selected;
                                }
                                if (item.value != window.btoa(localMonitorShare.id)) {
                                    tmp.push(item);
                                } else {
                                    tmp.push({
                                        value: window.btoa(localMonitorShare.id),
                                        label: localMonitorShare.name,
                                        selected: true,
                                    });
                                    notFound = false;
                                }
                            });

                            if (notFound) {
                                tmp.push({
                                    value: window.btoa(localMonitorShare.id),
                                    label: localMonitorShare.name,
                                    selected: true,
                                });
                            }
                            thisClass.monitorDevices = []; // reset
                            thisClass.monitorDevices = tmp; // add new devices

                            console.log('Monitor share selected : ' + localMonitorShare.name);
                            isSharingMonitor = true;
                        } else {
                            isSharingMonitor = false;
                        }
                    },
                    /**
                     * localMonitorShare state was updated
                     *
                     * @param localMonitorShare Object
                     * @param state String
                     */
                    onStateUpdated: function (localMonitorShare: any, state: any) { },
                })
                .then(function () {
                    console.log('RegisterLocalMonitorShareEventListener Success');
                })
                .catch(function () {
                    console.error('RegisterLocalMonitorShareEventListener Failed');
                });
        }

        StartMonitorShare();
    }

    /**
     * Attempt to connect to the conference
     * We will also handle connection failures
     * and network or server-initiated disconnects.
     */
    connectToConference() {
        // resource id is not implemented
        /*
                // Abort the Connect call if resourceId is invalid. It cannot contain empty spaces or "@".
                if ($("#resourceId").val().indexOf(" ") != -1 || $("#resourceId").val().indexOf("@") != -1) {
                    console.error("Connect call aborted due to invalid Resource ID");
                    connectorDisconnected("Disconnected", "");
                    $("#error").html("<h3>Failed due to invalid Resource ID" + "</h3>");
                    return;
                }
                */

        // Clear messages
        let scope = this;
        this.errorMessage = '';
        this.message = '';
        this.vcStatus = 'CONNECTING...';
        const loggerUrl = this.getFormValue('loggerUrl');
        const extData = this.getFormValue('extData');
        const extDataType = this.getFormValue('extDataType');
        this.vidyoConnector.SetAdvancedConfiguration({
            loggerURL: loggerUrl,
            extData,
            extDataType,
        });
        this.vidyoConnector
            .ConnectToRoomAsGuest({
                // Take input from options form
                host: this.getFormValue('host'),
                roomKey: this.getFormValue('roomKey'),
                displayName: this.getFormValue('displayName'),
                roomPin: this.getFormValue('roomPin'),
                // Define handlers for connection events.

                /**
                 * Connected
                 */
                onSuccess: function () {
                    //
                    scope.vcStatus = 'Connected';
                    console.log(
                        `vidyoConnector.ConnectToRoomAsGuest : onSuccess callback received`
                    );
                    // $("#options").addClass("vidyo-hide-options");
                    // $("#optionsVisibilityButton").addClass("showOptions").removeClass("hideOptions");
                    // $("#renderer").addClass("rendererFullScreen").removeClass("rendererWithOptions");
                    scope.vidyoConnector.GetConnectionProperties().then((props: any) => {
                        props.forEach((prop: any) => {
                            if (prop.name === 'Room.displayName') {
                                scope.vcStatus = `Connected to ${prop.value}`;
                            }
                        });
                    });
                    scope.statsSendingTool.startSendingStats();
                },
                /**
                 * Connection failed
                 * @param reason Object
                 */
                onFailure: function (reason: any) {
                    console.error('vidyoConnector.Connect : onFailure callback received');
                    scope.connectorDisconnected('Failed', '');
                    scope.errorMessage = 'Call Failed: ' + reason;
                    scope.statsSendingTool.stopSendingStats();
                },
                /**
                 * Disconnected
                 * @param reason String
                 */
                onDisconnected: function (reason: any) {
                    console.log(
                        'vidyoConnector.Connect : onDisconnected callback received'
                    );
                    scope.connectorDisconnected(
                        'Disconnected',
                        'Call Disconnected: ' + reason
                    );
                    scope.statsSendingTool.stopSendingStats();
                },
            })
            .then(function (status: any) {
                if (status) {
                    console.log('Connect Success');
                } else {
                    console.error('Connect Failed');
                    scope.connectorDisconnected('Failed', '');
                    scope.errorMessage = 'Call Failed';
                }
            })
            .catch(function () {
                console.error('Connect Failed');
                scope.connectorDisconnected('Failed', '');
                scope.errorMessage = 'Call Failed';
            });
    }
}
