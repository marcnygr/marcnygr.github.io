/* global document, window */
var appGlobals = {
    minutes: (1000 * 60),
    hours: (1000 * 60 * 60),
    refreshRates: {
        '60': (1000 / 60),
        '30': (1000 / 30),
        '15': (1000 / 15),
        '5': (1000 / 5),
    }
};

var main = {
    hintText: 'How long until ',
    hintTextAlmost: 'It\'s Almost ',
    hintTextSubject: 'Video Game and Anime Time',
    textChanged: false,
    imagesPath: '../images/',
    displayingSadGirl: false,
    displayingHappyGirl: false,
    displayingFinalText: false,
    displayingFridayNightExtra: false,
    animationLimit: 30 * appGlobals.minutes,
    animationIntenseLimit: 5 * appGlobals.minutes,

    init: function () {
        'use strict';
        main.refresh();
        window.setInterval(function () {
            main.refresh();
        },  appGlobals.refreshRates['30']);
    },

    refresh: function () {
        'use strict';
        var until = main.getUntilTime();
        var current = main.getTime();

        if (current.getHours() <= 3) {
            main.updateTimeholder(undefined);
        }

        var timeDifference = main.calulateDifference(current, until);
        main.updateTimeholder(timeDifference, (current >= until));
    },

    updateTimeholder: function (timeDifference) {
        'use strict';

        var isTime = timeDifference.totalDifference <= 0;

        var timeHolderElement = document.getElementById('timeholder');
        var hintTextElement = document.getElementById('hint');
        timeHolderElement.innerHTML = '';

        if (timeDifference.totalDifference >= 0) {
            if (!!timeDifference.days) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.days, 'day'));
            }
            if (!!timeDifference.hours || timeDifference.hours === 0) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.hours, 'hour'));
            }
            if (!!timeDifference.minutes || timeDifference.minutes === 0) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.minutes, 'minute'));
            }
            if (!!timeDifference.seconds || timeDifference.seconds === 0) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.seconds, 'second'));
            }
            if (!!timeDifference.milliseconds || timeDifference.milliseconds === 0) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.milliseconds, 'millisecond'));
            }
        }

        if (!main.textChanged) {
            if (timeDifference.totalDifference <= 5 * appGlobals.minutes) {
                hintTextElement.innerText = main.hintTextAlmost + main.hintTextSubject + '!';
                main.textChanged = true;
                main.displayingFinalText = false;
            }
        } else {
            if (timeDifference.totalDifference > 5 * appGlobals.minutes) {
                hintTextElement.innerText = main.hintText + main.hintTextSubject + '?';
                main.textChanged = false;
                main.displayingFinalText = false;
            }
        }

        var imageHolder = document.getElementById('imageholder');
        var imageElement = document.createElement('img');
        if (!isTime && !main.displayingSadGirl && timeDifference.totalDifference > 6 * appGlobals.hours) {
            imageHolder.innerHTML = '';
            imageElement.id = 'sadimage';
            imageElement.src = main.createImagePath('sadgirl.png');
            imageElement.alt = 'Image of a girl';
            imageElement.classList = 'sobbing';
            imageHolder.appendChild(imageElement);
            main.displayingSadGirl = true;
        }

        if (main.displayingSadGirl && timeDifference.totalDifference < 6 * appGlobals.hours) {
            imageHolder.innerHTML = '';
            main.displayingSadGirl = false;
        }

        if (!main.displayingHappyGirl && (timeDifference.totalDifference <= main.animationLimit)) {
            imageHolder.innerHTML = '';
            main.displayingHappyGirl = true;
            imageElement.id = 'girlimage';
            imageElement.src = main.createImagePath('girl.png');
            imageElement.alt = 'Image of a girl';
            imageElement.classList = 'shaking';
            imageHolder.appendChild(imageElement);
        }

        if (main.displayingHappyGirl) {
            if (timeDifference.totalDifference > main.animationLimit) {
                imageHolder.innerHTML = '';
                main.displayingHappyGirl = false;
            } else {
                var girlImage = document.getElementById('girlimage');
                if (!!girlImage) {
                    if (timeDifference.totalDifference <= main.animationIntenseLimit) {
                        girlImage.classList.add('intense');
                    } else {
                        girlImage.classList.remove('intense');
                    }
                } else {
                    main.displayingHappyGirl = false;
                }
            }
        }

        if (main.isFridayNight()) {
            if (!main.displayingFridayNightExtra) {
                main.displayingFridayNightExtra = true;
                var mainWrapper = document.getElementById('main');
                var fridayElement = document.createElement('div');
                fridayElement.id = 'fridaynight';
                
                var fridayImage = document.createElement('img');
                
                var images = ['homealonebad.png', 'homealonegood.png'];
                var index = Math.floor((Math.random() * images.length));
                console.log(index);
                var selectedImage = images[index];
                console.log(selectedImage);
                fridayImage.src = main.createImagePath(selectedImage);
                fridayImage.alt = 'Friday Night image';
                fridayElement.appendChild(fridayImage);
                mainWrapper.appendChild(fridayElement);
            }
        } else {
            if (main.displayingFridayNightExtra) {
                var mainWrapper = document.getElementById('main');
                var fridaynight = document.getElementById('fridaynight');
                if (!!fridaynight) {
                    mainWrapper.removeChild(fridaynight);
                }
                main.displayingFridayNightExtra = false;
            } 
        }

        if (!!isTime) {
            if(timeDifference.totalDifference <= -1 * appGlobals.hours) {
                imageHolder.innerHTML = '';
                main.displayingHappyGirl = false;
                main.displayingSadGirl = false;
            }

            if (!main.displayingFinalText) {
                hintTextElement.innerHTML = '';
                var itsTimeElement = document.createElement('span');
                itsTimeElement.innerText = 'It\'s ' + main.hintTextSubject + '!';
                hintTextElement.appendChild(itsTimeElement);
                main.displayingFinalText = true;
            }
        }
    },

    createTimeElement: function (thing, thingUnit) {
        'use strict';
        var displayUnit = thingUnit;
        if (thing !== 1) {
            displayUnit += 's';
        }

        var wrapperElement = document.createElement('p');
        wrapperElement.classList.add('timeunit');
        wrapperElement.classList.add(thingUnit);

        var timeElement = document.createElement('span');
        timeElement.classList.add('time');
        timeElement.innerText = thing;

        var unitElement = document.createElement('span');
        unitElement.classList.add('unit');
        unitElement.innerText = displayUnit;

        wrapperElement.appendChild(timeElement);
        wrapperElement.appendChild(unitElement);

        return wrapperElement;

    },

    getTime: function () {
        'use strict';
        return new Date();
    },

    getUntilTime: function () {
        'use strict';
        var until = new Date();
        until.setHours(17);
        until.setMinutes(0);
        until.setSeconds(0);
        until.setMilliseconds(0);
        return until;
    },

    calulateDifference: function (current, until) {
        'use strict';
        var differenceString = '';
        var differenceObject = {};

        var milliseconds = until - current;
        var seconds = milliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;

        differenceObject.totalDifference = milliseconds;

        var intDays = parseInt(days);
        if (intDays >= 0) {
            differenceObject.days = intDays;
            differenceString += intDays + ' days, ';
            hours = hours % 24;
        }
        var intHours = parseInt(hours);
        if (intHours >= 0) {
            differenceObject.hours = intHours;
            differenceString += intHours + ' hours, ';
            minutes = minutes % 60;
        }
        var intMinutes = parseInt(minutes);
        if (intMinutes >= 0) {
            differenceObject.minutes = intMinutes;
            differenceString += intMinutes + ' minutes, ';
            seconds = seconds % 60;
        }
        var intSeconds = parseInt(seconds);
        if (intSeconds >= 0) {
            differenceObject.seconds = intSeconds;
            differenceString += intSeconds + ' seconds, ';
            milliseconds = milliseconds % 1000;
        }
        var intMilliseconds = parseInt(milliseconds);
        if (intMilliseconds >= 0) {
            differenceObject.milliseconds = intMilliseconds;
            differenceString += intMilliseconds + ' milliseconds';
        }

        var lastComma = differenceString.lastIndexOf(',');
        differenceString = differenceString.substring(0, lastComma) + ' and ' + differenceString.substring(lastComma + 1);
        differenceString = differenceString.replace(/\s\s+/g, ' ');
        differenceObject.string = differenceString;

        return differenceObject;
    },

    createImagePath: function (filename) {
        'use strict'
        return main.imagesPath + filename;
    },

    isFridayNight: function () {
        'use strict'
        var currentTime = main.getTime();
        return ((currentTime.getDay() === 5) && currentTime.getHours() >= 19)
    }
};


window.onload = function () {
    'use strict';
    main.init();
}