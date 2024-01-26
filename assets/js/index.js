class Timer {
    constructor() {
        this.el = $('#hudTime');
        this.allSec = 0;
        this.minute = 0;
        this.sec = 0;
        this.workStatus = false;
        setInterval(() => {
            if (this.workStatus) {
                this.allSec++;
                this.minute = `${(((this.allSec - this.allSec % 60) / 60) < 10) ? '0' : ''}${((this.allSec - this.allSec % 60) / 60)}`;
                this.sec = `${(this.allSec % 60 < 10) ? '0' : ''}${this.allSec % 60}`;
                $(this.el).text(`${this.minute}:${this.sec}`);
            }
        }, 1000);
    }
    start() {
        this.workStatus = true;
    }
    stop() {
        this.workStatus = false;
    }
    restart() {
        this.allSec = 0;
        $(this.el).text(`00:00`);
        this.workStatus = true;
    }
    clear() {
        this.stop();
        this.restart();
    }
}
let timer = new Timer;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
}

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    moveX(key) {
        if (this.x + key >= 0 && this.x + key <= 1856) {
            this.x += key;
            $('.player').css({'left': `${this.x}px`});
            this.checkField();
        }
    }
    moveY(key) {
        if (this.y + key >= 0 && this.y + key <= 192) {
            this.y += key;
            $('.player').css({'top': `${this.y}px`});
            this.checkField();
        }
    }
    checkField() {
        for (this.cellEl of $('.cell')) {
            if ($(this.cellEl).css('top').slice(0, -2) == this.y && $(this.cellEl).css('left').slice(0, -2) == this.x) {
                if ($(this.cellEl).hasClass('stone')) {
                    game.status = false;
                    $('#screenLoss > .box-wrapper').addClass('show-block');
                    timer.stop();
                    $('#screenLoss .start-over').on('click', () => {
                        $('#screenLoss > .box-wrapper').removeClass('show-block');
                        $('#hudHearts').text('0');
                        game.restart();
                    });
                }
                if ($(this.cellEl).hasClass('heart')) {
                    $('#hudHearts').text(++game.numHearts);
                    $('img.heartemoji').addClass('heart-animate');
                    setTimeout(() => {
                        $('img.heartemoji').removeClass('heart-animate');
                    }, 800);
                    if (game.numHearts >= 10) {
                        game.status = false;
                        $('#screenRating > .box-wrapper').addClass('show-block');
                        timer.stop();
                        $('#screenRating .start-over').on('click', () => {
                            $('#screenRating > .box-wrapper').removeClass('show-block');
                            $('#hudHearts').text('0');
                            game.restart();
                        });
                    }
                }
                $(this.cellEl).removeClass('ground heart stone');
                $(this.cellEl).addClass('clear');
                break;
            }
        }
    }
}
let player = new Player;

class Game {
    constructor() {
        this.appleArray = [];
        this.stoneArray = [];
        this.num = 0;
        this.numHearts = 0;
        this.status = false;
    }
    restart() {
        this.clearField();
        $('.cell').eq(0).addClass('clear');
        $('.cell').eq(-1).addClass('player');
        $('.player').css({'top': 0, 'left': 0});
        player.x = 0;
        player.y = 0;
        this.status = true;
        this.numHearts = 0;
        this.appleArray = [];
        this.stoneArray = [];
        while (this.appleArray.length < 10) {
            this.num = getRandomInt(1, 120);
            if (!this.appleArray.includes(this.num)) this.appleArray.push(this.num);
        }
        for (this.appleEl of this.appleArray) {
            $('.cell').eq(this.appleEl).addClass('heart');
        }
        while (this.stoneArray.length < 10) {
            this.num = getRandomInt(1, 120);
            if (!this.stoneArray.includes(this.num) && !this.appleArray.includes(this.num)) this.stoneArray.push(this.num);
        }
        for (this.stoneEl of this.stoneArray) {
            $('.cell').eq(this.stoneEl).addClass('stone');
        }
        for (this.cellEl of $('.cell')) {
            if (!$(this.cellEl).hasClass('player') && !$(this.cellEl).hasClass('heart') && !$(this.cellEl).hasClass('stone') && !$(this.cellEl).hasClass('clear')) {
                $(this.cellEl).addClass('ground');
            }
        }
        timer.restart();
    }
    clearField() {
        $('.cell').removeClass('ground heart stone player clear');
    }
}
let game = new Game;

document.addEventListener('keydown', function(e) {
    if (game.status) {
        switch (e.code) {
            case 'KeyW': player.moveY(-64); break;
            case 'KeyA': player.moveX(-64); break;
            case 'KeyS': player.moveY(64); break;
            case 'KeyD': player.moveX(64); break;
        }
    }
});

$('#screenWelcome > .box-wrapper').addClass('show-block');
$('#welcomeForm > input').on('keyup', function() {
    if ($(this).val() != '') $('#welcomeForm > button').attr('disabled', false);
    else $('#welcomeForm > button').attr('disabled', true);
});
$('#welcomeForm > button').on('click', () => {
    $('#screenWelcome > .box-wrapper').removeClass('show-block');
    $('#hudUsername').text($('#welcomeForm > input').val());
    $('#hudHearts').text(game.numHearts);
    game.restart();
});