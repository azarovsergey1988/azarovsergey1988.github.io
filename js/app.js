    let card = document.getElementsByClassName("card");         /*записываем все карты в HTMLCollection*/
    let cards = [...card];                                      /*перекидываем их в обычный массив*/
    console.log(cards);
    const deck = document.getElementById("card-deck");          /*все карты в игре*/
    let moves = 0;                                              /*подсчет шагов*/
    let counter = document.querySelector(".moves");             /*подсчет шагов*/
    let matchedCard = document.getElementsByClassName("match"); /*объявление совпадающих карт*/
    let closeicon = document.querySelector(".close");           /*закрыть попап с результатом*/
    let modal = document.getElementById("popup1");               /*объявление попапа с результатом*/
    var stat = {};
    var openedCards = [];                                       /*массив открытых карт*/




    function shuffle(array) {                   /*перетусовка карт*/
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    document.body.onload = startGame();         /*перетасовка карт когда страница обнавляется*/

    function startGame(){               /*Старт игры*/

        cards = shuffle(cards);         /*перетусовка колоды*/

        for (var i = 0; i < cards.length; i++){         /*удалить все классы у каждой карты*/
            deck.innerHTML = "";
            [].forEach.call(cards, function(item) {
                deck.appendChild(item);
            });
            cards[i].classList.remove("show", "open", "match", "disabled");
        }

        moves = 0;          /*сброс количества ходов*/
        counter.innerHTML = moves;

        second = 0;     /*сброс таймера*/
        minute = 0;
        hour = 0;
        var timer = document.querySelector(".timer");
        timer.innerHTML = "0 min 0 sec";
        clearInterval(interval);
    }

    var displayCard = function (){          /*переключение открытых и показанных карт*/
        this.classList.toggle("open");
        this.classList.toggle("show");
        this.classList.toggle("disabled");
    };

    function cardOpen() {          /*добавляем открытую карту в список OpenedCard[] и сверяем, соответствуют карты или нет.*/
        openedCards.push(this);
        var len = openedCards.length;
        if(len === 2){
            moveCounter();
            if(openedCards[0].type === openedCards[1].type){
                matched();
            } else {
                unmatched();
            }
        }
    };

    function matched(){             /*когда карты совпали*/
        openedCards[0].classList.add("match", "disabled");
        openedCards[1].classList.add("match", "disabled");
        openedCards[0].classList.remove("show", "open", "no-event");
        openedCards[1].classList.remove("show", "open", "no-event");
        openedCards = [];
    }

    function unmatched(){           /*когда карты не совпали*/
        openedCards[0].classList.add("unmatched");
        openedCards[1].classList.add("unmatched");
        disable();
        setTimeout(function(){
            openedCards[0].classList.remove("show", "open", "no-event","unmatched");
            openedCards[1].classList.remove("show", "open", "no-event","unmatched");
            enable();
            openedCards = [];
        },1100);
    }

    function disable(){         /*временно выключить карту*/
        Array.prototype.filter.call(cards, function(card){
            card.classList.add('disabled');
        });
    }

    function enable(){              /*включить карты и отключить сопоставленные карты*/
        Array.prototype.filter.call(cards, function(card){
            card.classList.remove('disabled');
            for(var i = 0; i < matchedCard.length; i++){
                matchedCard[i].classList.add("disabled");
            }
        });
    }

    function moveCounter(){         /*подсчет ходов*/
        moves++;
        counter.innerHTML = moves;

        if(moves == 1){     /*запуск таймера с 1 хода*/
            second = 0;
            minute = 0;
            hour = 0;
            startTimer();
        }
    }

    var second = 0, minute = 0; hour = 0;           /*таймер*/
    var timer = document.querySelector(".timer");
    var interval;
    function startTimer(){
        interval = setInterval(function(){
            timer.innerHTML = minute+" min "+second+" sec";
            second++;
            if(second == 60){
                minute++;
                second=0;
            }
            if(minute == 60){
                hour++;
                minute = 0;
            }
        },1000);
    }

    function congratulations(){             /*когда все карты совпадают, показываем модалку и ходы, время и рейтинг*/
        if (matchedCard.length == 16){
            clearInterval(interval);
            finalTime = timer.innerHTML;
            modal.classList.add("show");        /*запуск поздравительного окна*/
            document.getElementById("finalMove").innerHTML = moves;         /*показываем кол-во ходов, времени в окне*/
            document.getElementById("totalTime").innerHTML = finalTime;
            var name = prompt("Ваше Имя");
            stat.moves = moves;
            stat.finalTime = finalTime;
            localStorage.setItem(name, JSON.stringify(stat));
            var usersArray = getBestPlayers();
            setLocalStorage(usersArray);
            printPlayers();
            closeModal();       /*закрываем окно*/
        };
    }

    function table(){

            clearInterval(interval);
            modal.classList.add("show");        /*запуск поздравительного окна*/

            printPlayers();
            closeModal();       /*закрываем окно*/

    }

    function printPlayers() {               /*распечатываем 8 лучших игроков*/
        document.getElementById("stats").innerHTML = "";
        var bestPlayers = [];
        bestPlayers = getBestPlayers();
        var trueLength = bestPlayers.length >= 8 ? 8 : bestPlayers.length;
        for ( var i=0; i< trueLength; i++ ) {
             document.getElementById("stats").innerHTML = document.getElementById("stats").innerHTML +
                ('Name: '+bestPlayers[i].k+', moves: '+ bestPlayers[i].lll.moves + ', time: '+ bestPlayers[i].lll.finalTime + "<br />");
        }
    }
    
     function getBestPlayers() {            /*выбираем всех игроков из хранилища*/
       // var pars = {};
        var people = [];
        //var trueLength = localStorage.length >= 8 ? 8 : localStorage.length;
        for ( var i=0; i< localStorage.length; i++ ) {
            var k=localStorage.key(i);
            var lll= JSON.parse(localStorage[k]);
            people.push({k, lll});
        }
        var temp = userSortFunk(people);

        return temp;
    }

    function userSortFunk(peopleArr) {          /*сортировка и оставление первых 8*/
        var temp;
        for(var k=0; k<peopleArr.length; k++){
            for (var i=0; i<peopleArr.length; i++) {
                var carrentValue = peopleArr[k].lll.moves;
                var peopleArrValue = peopleArr[i].lll.moves;
                if (carrentValue < peopleArrValue){
                    temp = peopleArr[k];
                    peopleArr[k] = peopleArr[i];
                    peopleArr[i]=temp;
                }
            }
        }
        peopleArr.splice(7,10);
        return peopleArr;
    }

    function setLocalStorage(newData){      /*очиска и запись в localStorage*/
        localStorage.clear();
        for ( var i=0; i< newData.length; i++ ) {
            var fuck = JSON.stringify(newData[i]);
            var statt = {};
            var userName = newData[i].k;
            statt.moves = newData[i].lll.moves;
            statt.finalTime = newData[i].lll.finalTime;
            localStorage.setItem(userName, JSON.stringify(statt));
        }
    }

    function clearLoc() {                   /*очистка localStorage*/

        localStorage.clear()

    }

    function closeModal(){              /*закрыть окно*/
        closeicon.addEventListener("click", function(e){
            modal.classList.remove("show");
            startGame();
        });
    }

    for (var i = 0; i < cards.length; i++){         /*добавляем addEventListener каждой карте*/
        card = cards[i];
        card.addEventListener("click", displayCard);
        card.addEventListener("click", cardOpen);
        card.addEventListener("click",congratulations);
    };
