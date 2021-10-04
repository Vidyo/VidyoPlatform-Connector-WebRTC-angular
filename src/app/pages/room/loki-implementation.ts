export class LokiImplementation {

    getLokiImplementation(isPushEnabled: any, baseURL: string, vidyoConnector: any) {
        const LOKI_SERVER_URL = 'vidyoinsights.vidyoqa.com';
        const LOKI_PUSH_URL = `https://${baseURL || LOKI_SERVER_URL}/loki/api/v1/push`;
        const interval = 10 * 1000;

        let intervalID: any;
        let timeoutID: any;
        let localParticipantId: any = null;

        const stopSendingStats = function () {
            clearInterval(intervalID);
            clearTimeout(timeoutID);
            localParticipantId = null;
        }

        if (isPushEnabled) {
            console.log('Loki push enabled');
        } else {
            console.log('Loki push disabled');
        }

        const startSendingStats = function () {
            if (!isPushEnabled || !LOKI_PUSH_URL || !statsProvider) {
                return;
            }
            //make sure previous interval is stoped
            stopSendingStats();

            function sendStats() {
                statsProvider().then(function (stats: any) {
                    fetch(LOKI_PUSH_URL, {
                        method: "POST",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            streams: [
                                {
                                    stream: stats.stream,
                                    values: [[Date.now() + "000000", JSON.stringify(stats.data)]],
                                },
                            ],
                        }),
                    });
                });
            }

            intervalID = setInterval(sendStats, interval);
            timeoutID = setTimeout(sendStats, 1000);
        }

        const statsProvider = function () {
            // provider
            return vidyoConnector.GetStatsJson().then((stats: any) => {
                let data = JSON.parse(stats);
                if (
                    !(data.userStats[0].roomStats.length && localParticipantId)
                ) {
                    return false;
                }

                return {
                    stream: {
                        EventType: "WebRTCClientStats",
                        ClientRouterName: data.userStats[0].roomStats[0].reflectorId,
                        ClientParticipantId: localParticipantId,
                        ClientConferenceId: data.userStats[0].roomStats[0].conferenceId,
                    },
                    data: data,
                };
            });
        };

        const setLocalParticipantId = function (participantId: any) {
            localParticipantId = participantId;
        }

        return {
            startSendingStats: startSendingStats,
            stopSendingStats: stopSendingStats,
            setLocalParticipantId: setLocalParticipantId
        }
    }

}
