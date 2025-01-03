// main.js

// Initialize the game
function initializeGame() {
    console.log("Initializing Pingball Game...");

    window.addEventListener("gameReady", function () {
        console.log("Game Ready!");
        fetch("config.json")
            .then((response) => response.json())
            .then((config) => {
                console.log("Config loaded:", config);
                window.dispatchEvent(
                    new CustomEvent("setConfig", {
                        detail: {
                            timeDefault: config.TIME_DEFAULT,
                            scoreBonus: config.SCORE_BONUS,
                            goldBonusRate: config.GOLD_BONUS_RATE,
                            maxItemGoldBonus: config.MAX_ITEM_GOLD_BONUS,
                            ballBonusRate: config.BALL_BONUS_RATE,
                            maxItemBallBonus: config.MAX_ITEM_BALL_BONUS,
                            velocityBall: config.VELOCITY_BALL,
                            minBounceOfBall: config.MIN_BOUNCE_OF_BALL,
                            maxBounceOfBall: config.MAX_BOUNCE_OF_BALL,
                            BounceOfWall: config.BOUNCE_OF_WALL,
                            minDistanceBall: config.MIN_DISTANCE_BALL,
                            maxDistanceBall: config.MAX_DISTANCE_BALL,
                        },
                    })
                );
            })
            .catch((error) => console.error("Error loading config:", error));
        // Send a 'LOADED' event to the parent app
        PlayMixSDK.sendLoadedEvent();
    });

    window.addEventListener("gameOver", function (event) {
        const data = event.detail;
        // Send the user's score to the parent app
        PlayMixSDK.updateUserScore(data.score);
    });

    window.addEventListener("updateTimer", function (event) {
        
        const data = event.detail;
        // Send the timer string to the parent app
        PlayMixSDK.updateTimerString(data.timerString);
    });
}

// Start the game when the window loads
window.onload = initializeGame;

const PlayMixSDK = (() => {
    const playStateChangeListeners = [];

    // Function to send a 'LOADED' event to the parent. this should be used once game is ready to receive any events from SDK
    function sendLoadedEvent() {
        if (window.parent) {
            window.parent.postMessage({ type: "LOADED" }, "*");
        }
    }

    function updateUserScore(score) {
        if (window.parent) {
            console.log("updateUserScore:: ", score);
            window.parent.postMessage({ type: "UPDATE_USER_SCORE", value: score }, "*");
        }
    }

    function updateTimerString(timerString) {
        console.log("updateTimerString:: ", timerString);
        if (window.parent) {
            window.parent.postMessage({ type: "UPDATE_TIMER_STRING", value: timerString }, "*");
        }
    }

    // Function to handle 'PlayStateChange' from the Vue app
    function handlePlayStateChange(state) {
        playStateChangeListeners.forEach((listener) => listener(state));
    }

    // Subscribe function for PlayStateChange events
    function onPlayStateChange(listener) {
        if (typeof listener === "function") {
            playStateChangeListeners.push(listener);
        }
    }

    // Listen for messages from the parent app
    window.addEventListener("message", (event) => {
        // console.log("PlayMixSDK message received", event);
        if (event.data && event.data.type === "PLAY_STATE_CHANGE") {
            handlePlayStateChange(event.data.state);
        }
    });

    return {
        sendLoadedEvent,
        updateUserScore,
        updateTimerString,
        onPlayStateChange,
    };
})();

// Make the SDK available globally
window.PlayMixSDK = PlayMixSDK;
