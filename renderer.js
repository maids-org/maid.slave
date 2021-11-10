const { ipcRenderer } = require("electron");

const chosenSkin = {
  rest: "img/character/rest.gif",
  defaults: "img/character/default.gif",
};

ipcRenderer.on("SKIN", (event, data) => {
  // IPC event listener
  chosenSkin.rest = data + "rest.gif";
  chosenSkin.defaults = data + "default.gif";
  document.getElementById("pixelart").src = chosenSkin.defaults;
});

function emoteDelay() {
  setTimeout(function () {
    document.getElementById("emote").src = "img/emotes/null.png";
  }, 3000);
}

const emotes = [
    "img/emotes/heart.png",
    "img/emotes/happy.png",
    "img/emotes/dotdot.png"
]

function emote() {
  const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
  if (document.getElementById("emote").src !== randomEmote) {
    document.getElementById("emote").src = randomEmote;
    emoteDelay();
  }
}

function startTimer(duration) {
  let timer = duration,
    minutes,
    seconds;
  const interval = 20;

  setInterval(function () {
    minutes = parseInt((timer / 60).toString(), 10);
    seconds = parseInt((timer % 60).toString(), 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (--timer < 0) {
      document.getElementById("pixelart").src = chosenSkin.rest;
    }
    if (--timer < -interval * 2) {
      document.getElementById("pixelart").src = chosenSkin.defaults;
      timer = duration;
    }
  }, 1000);
}

window.onload = function () {
  const secs = 10;
  startTimer(secs);
};
