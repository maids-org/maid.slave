function emoteDelay() {
  setTimeout(function () {
    document.getElementById("emote").src = "img/emotes/null.png";
  }, 3000);
}

function emote() {
  if (document.getElementById("emote").src !== "img/emotes/heart.png") {
    document.getElementById("emote").src = "img/emotes/heart.png";
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
      document.getElementById("pixelart").src = "img/character/rest.gif";
    }
    if (--timer < -interval * 2) {
      document.getElementById("pixelart").src = "img/character/default.gif";
      timer = duration;
    }
  }, 1000);
}

window.onload = function () {
  const secs = 10;
  startTimer(secs);
};
