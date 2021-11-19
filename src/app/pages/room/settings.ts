import { FormControl, FormGroup } from "@angular/forms";
import { AppConfig } from "src/app/app-config";
import { FormOption } from "src/app/interfaces/form-option";

export class Settings {
    appVersion: string = "1.2.1";
    vc: any;
    state: any = "READY"; // hardcoded - not needed in this version
    rtr: any;

    showSystemMessage: boolean = true;
    showErrorMessage: boolean = true;
    errorMessage: string = "";
    message: string = "";
    vcVersion: string = "";
    vcStatus = "";
    localParticipant: any;
    participantsList: any = []; // {name: string, id: string, local: boolean, action: string (Speaking|Left|Joined), micOff : boolean, cameraOff: boolean}
    connected: boolean = false;
    videoNodeDetectorInterval: any;
    participantsStatus: string = "";
    chatSubmitButtonLabelTexts = ["Join Conference", "Send"]
    chatSubmitButtonLabel: string = this.chatSubmitButtonLabelTexts[0];

    cameraPrivacy = false;
    microphonePrivacy = false;
    speakerPrivacy = false;
    statsSendingTool: any;

    vidyoConnector: any = null;
    cameras: any = {};
    microphones: any = {};
    speakers: any = {};
    monitorShares: any = {};
    configParams: any = {};
    webrtc: boolean = true;

    chatData: any = {
        lastChatParticipant: '',
        lastChatParticipantId: '',
        chatOpen: true,
        numMissedMessages: 0,
        lastChatTime: '',
        localParticipantId: ''
    };

    chatMessages: any = []; // {  name: string, time : string, message : string, local : boolean }
    allChats: any = [];

    showMonitorSwitch: boolean = false;
    advancedContent: boolean = false;
    showCameraFrame = "";
    defaultFormOption: FormOption = { value: "-1", label: "None" };
    micDevices: FormOption[] = [{ value: "0", label: "None" }];
    videoDevices: FormOption[] = [{ value: "0", label: "None", selected: true }];
    speakerDevices: FormOption[] = [{ value: "0", label: "None" }];
    monitorDevices: FormOption[] = [{ value: "0", label: "None", selected: true }];
    videoElement: any;
    volumeMeterIndicator: boolean = true;

    lastSelectedCamera: any = null;
    lastSelectedMic: any = null;
    lastSelectedSpeaker: any = null;

    initAudio: boolean = true;
    initVideo: boolean = true;
    skipInitMedia: boolean = true;
    init: boolean = true;

    cameraIcon: string = "icon-camera";
    cameraIconOff: string = "icon-camera-off";
    cameraTooltip: string = "Camera Privacy";
    cameraTooltipOptions: string = "Choose a camera";

    phoneOn: boolean = true;
    phoneIcon: string = "icon-phone";
    phoneIconOff: string = "icon-phone-off";
    phoneTooltip: string = "Join Conference";

    micOn: boolean = true;
    micIcon: string = "icon-mic";
    micIconOff: string = "icon-mic-off";
    micTooltip: string = "Microphone Privacy";
    micTooltipOptions: string = "Choose a microphone";

    speakerOn: boolean = true;
    speakerIcon: string = "icon-speaker";
    speakerIConOff: string = "icon-speaker-off";
    speakerTooltip: string = "Speaker Privacy";
    speakerTooltipOptions = "Choose a speaker";

    chatOn: boolean = true;
    chatIcon: string = "icon-chat";
    chatIconOff: string = "icon-chat-off";
    chatTooltip: string = "Show chat";

    shareTooltip: string = "Share";

    img: string = AppConfig.settings.imgPath;
    leftPaneExpanded = true;
    rightPaneExpanded = false;
    expandIcon = true;
    sideBarFormLabels = ["Host", "Room Key", "Display Name", "Logger Url", "RoomPin", "ExtData", "ExtDataType"];
    controls: string[] = [];

    sideBarForm: FormGroup = new FormGroup({});
    host: FormControl = new FormControl("https://test.platform.vidyo.io");
    roomKey: FormControl = new FormControl();
    displayName: FormControl = new FormControl("webRTC Guest");
    loggerUrl: FormControl = new FormControl();
    roomPin: FormControl = new FormControl();
    extData: FormControl = new FormControl();
    extDataType: FormControl = new FormControl();


    camera: FormControl = new FormControl("0");
    mic: FormControl = new FormControl("default");
    speaker: FormControl = new FormControl("default");
    cameraShare: FormControl = new FormControl("none");
    monitorShare: FormControl = new FormControl("none");
    windowShare: FormControl = new FormControl("none");

    chatForm: FormGroup = new FormGroup({});
    bottomPanelCamera = new FormGroup({});
    bottomPanelMic = new FormGroup({});
    bottomPanelSpeaker = new FormGroup({});
    chat: FormControl = new FormControl({ value: '', disabled: !this.connected });

}
