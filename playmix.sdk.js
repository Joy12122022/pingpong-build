// sdk.js
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
      window.parent.postMessage(
        { type: "UPDATE_USER_SCORE", value: score },
        "*"
      );
    }
  }

  function updateTimerString(timerString) {
    if (window.parent) {
      window.parent.postMessage(
        { type: "UPDATE_TIMER_STRING", value: timerString },
        "*"
      );
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
