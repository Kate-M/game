
const doc = document;
var winMessage = doc.getElementById("win_message");
const buttonStyle = doc.querySelectorAll(".config-game");
var timer = undefined;

function init() {
  registerStyles();
  registerLevels()
  doc.getElementById("start_game").addEventListener('click', newGame);
  doc.getElementById("reset_game").addEventListener('click', stopTimer);
  doc.getElementById("reset_game").addEventListener('click', hideTimer);
  doc.getElementById("reset_game").addEventListener('click', showRules);
  doc.getElementById("new_game").addEventListener('click', newGame);

  buttonStyle.forEach(function (el, index, arr) {
    arr[index].addEventListener('click', configButtonClick);
  });
  doc.getElementById("reset_game").onclick = function (evnt) {
    actionGame(evnt, '.game-area', '.rule');
  };
}

function registerStyles() {
  var styles = [];
  styles.push(['shirt1', 'back1']);
  styles.push(['shirt2', 'back2']);
  styles.push(['shirt3', 'back3']);

  styles.forEach(function (style) {
    doc.getElementById(style[0]).onclick = function () {
      doc.querySelectorAll('.flip-back').forEach(function (el, index, arr) {
        arr[index].classList.add(style[1]);
        styles.forEach(function (s) {
          if (s != style) {
            arr[index].classList.remove(s[1]);
          }
        })
      });
    };
  });
};
function registerLevels() {
  var levels = [];
  levels.push(['level1', 20]);
  levels.push(['level2', 30]);
  levels.push(['level3', 40]);

  levels.forEach(function (level) {
    doc.getElementById(level[0]).onclick = function (evnt) {
      newGame(evnt, level[1]);
    };
  });
};
function showGameArea(evnt) {
  evnt.preventDefault();
  doc.querySelector('.rule').classList.add('hidden');
  doc.querySelector('.game-area').classList.remove('hidden');
  winMessage.classList.add('hidden');
};
function showRules(evnt) {
  evnt.preventDefault();
  doc.querySelector('.game-area').classList.add('hidden');
  doc.querySelector('.rule').classList.remove('hidden');;
  winMessage.classList.add('hidden');
};

function configButtonClick(evnt) {
  evnt.preventDefault();
  this.nextElementSibling.classList.toggle('hidden');
  this.nextElementSibling.addEventListener('click', levelSelected);
};
function levelSelected() {
  this.classList.add('hidden');

};

function createCards(count) {
  var orderedSet = [];
  var randomSet = [];

  for (let i = 0; i < count / 2; i++) {
    orderedSet.push(i + 1);
    orderedSet.push(i + 1);
  }

  for (let i = 0; i < count; i++) {
    var index = parseInt(Math.random() * orderedSet.length);
    var removed = orderedSet.splice(index, 1);
    randomSet.push(removed);
  }
  return randomSet;
}

function newGame(evnt, qCard) {
  startTimer();
  showGameArea(evnt);
  if (!qCard) {
    qCard = 20;
  }
  var cardField = doc.querySelector(".game-area");
  while (cardField.firstChild) {
    cardField.removeChild(cardField.firstChild);
  }
  var cards = createCards(qCard);
  for (let i = 0; i < qCard; i++) {
    var newCard = document.createElement("div");
    newCard.setAttribute('class', 'card')
    cardField.appendChild(newCard);

    var figureItem = document.createElement("figure");
    figureItem.setAttribute('class', 'flip noactive-card')
    newCard.appendChild(figureItem);

    var imgField = document.createElement("div");
    imgField.setAttribute('class', 'img-field img-field' + cards[i])
    figureItem.appendChild(imgField);

    var figcaptionItem = document.createElement("figcaption");
    figcaptionItem.setAttribute('class', 'flip-back back1')
    figureItem.appendChild(figcaptionItem);
  }

  var cardContainer = doc.querySelectorAll(".flip");
  var currentArr = [];
  var atr;
  function cardClick(evnt) {
    this.classList.remove('noactive-card');
    this.classList.add('active-card');
    currentFirstsCards = this.firstChild.getAttribute('class').split(' ').pop();
    currentArr.push(currentFirstsCards);
    var activeCards = doc.querySelectorAll('.active-card');
    if (currentArr.length == 2) {
      if (currentArr[0] == currentArr[1]) {
        activeCards.forEach(function (el, index, arr) {
           arr[index].classList.add('matched');
        })
        var matchedCards = doc.querySelectorAll('.matched');
        setTimeout(function () {
          matchedCards.forEach(function (el, index, arr) {
            arr[index].classList.add('deleted-card');
            setTimeout(function () {
              arr[index].remove();
              var pass = doc.querySelectorAll('.img-field');
              if (pass.length == 0) {
                winMessage.classList.remove('hidden');
                cardField.classList.add('hidden');
                stopTimer();
              }
            }, 200)
          });
        }, 800)
      } else {
        setTimeout(function () {
          activeCards.forEach(function (el, index, arr) {

            arr[index].classList.add('noactive-card');
            arr[index].classList.remove('active-card');
          });
        }, 1000)

      }
      currentArr = [];
    }
  }
  cardContainer.forEach(function (el, index, arr) {
    arr[index].addEventListener('click', cardClick);
  });

  flip = doc.querySelectorAll('.flip-back');
  winMessage.classList.add('hidden');

}

function startTimer(evnt) {
  stopTimer();
  var startTime = new Date();
  doc.getElementById('time').innerHTML = 0 + ' min : ' + 0 + ' sec';
  var createTimer = function () {
    return setInterval(function () {
      var currentTime = new Date();
      var resultTime = new Date(currentTime - startTime);
      doc.getElementById('time').innerHTML = resultTime.getMinutes() + ' min : ' + resultTime.getSeconds() + ' sec';
    }, 1000);
  }

  timer = createTimer();
};

function stopTimer() {
  return clearInterval(timer);
}

function hideTimer() {
  doc.getElementById('time').innerHTML = '';
}

doc.addEventListener('DOMContentLoaded', init)