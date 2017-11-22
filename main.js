/* global document, window */

var main = {
    refreshRate: (1000 / 1),
    hintText: 'How long until ',
    hintTextAlmost: 'It\'s Almost ',
    hintTextSubject: 'Video Game and Anime Time',


    init: function () {
        main.refresh();
        window.setInterval(function () {
            main.refresh();
        }, main.refreshRate);
    },

    refresh: function () {
        'use strict';
        var until = main.getUntilTime();
        var current = main.getTime();

        if (current.getHours() <= 3) {
            main.updateTimeholder(undefined, true);
        }

        if (current.getDate() < until.getDate()) {
            if (current.getHours() >= until.getHours()) {
                main.updateTimeholder(undefined, false, ((until.getHours() - current.getHours()) <= 0));
            } else {
                var timeDifference = main.calulateDifference(current, until);
                main.updateTimeholder(timeDifference, false, ((until.getHours() - current.getHours()) <= 0));
            }
        } else {
            main.updateTimeholder(undefined, true, false);
        }
    },

    updateTimeholder: function (timeDifference, isTime, almost) {
        'use strict';
        var timeHolderElement = document.getElementById("timeholder");
        var hintTextElement = document.getElementById("hint");
        timeHolderElement.innerHTML = "";

        if (!!timeDifference) {
            if (!!timeDifference.days) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.days, 'day'));
            }
            if (!!timeDifference.hours) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.hours, 'hour'));
            }
            if (!!timeDifference.minutes) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.minutes, 'minute'));
            }
            if (!!timeDifference.seconds) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.seconds, 'second'));
            }
            if (!!timeDifference.milliseconds) {
                timeHolderElement.appendChild(main.createTimeElement(timeDifference.milliseconds, 'millisecond'));
            }
        }

        if (!!isTime) {
            timeHolderElement.appendChild(document.createElement("span").textContent('It\'s ' + main.hintTextSubject));
        }

        if (!!almost) {
            hintTextElement.innerText = main.hintTextAlmost + main.hintTextSubject + '!';
        } else {
            hintTextElement.innerText = main.hintText + main.hintTextSubject + '?';
        }
    },

    createTimeElement: function (thing, thingUnit) {
        'use strict';

        if (thing > 1) {
            thingUnit += 's';
        }

        var timeElement = document.createElement('span');
        timeElement.innerText = thing + ' ' + thingUnit;
        return timeElement;

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
        var differenceString = "";
        var differenceObject = {};

        var milliseconds = until - current;
        var seconds = milliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;


        var intDays = parseInt(days);
        if (intDays > 0) {
            differenceObject.days = intDays;
            differenceString += intDays + ' days, ';
            hours = hours % 24;
        }
        var intHours = parseInt(hours);
        if (intHours > 0) {
            differenceObject.hours = intHours;
            differenceString += intHours + ' hours, ';
            minutes = minutes % 60;
        }
        var intMinutes = parseInt(minutes);
        if (intMinutes > 0) {
            differenceObject.minutes = intMinutes;
            differenceString += intMinutes + ' minutes, ';
            seconds = seconds % 60;
        }
        var intSeconds = parseInt(seconds);
        if (intSeconds > 0) {
            differenceObject.seconds = intSeconds;
            differenceString += intSeconds + ' seconds, ';
            milliseconds = milliseconds % 1000;
        }
        var intMilliseconds = parseInt(milliseconds);
        if (intMilliseconds > 0) {
            differenceObject.milliseconds = intMilliseconds;
            differenceString += intMilliseconds + ' milliseconds';
        }

        var lastComma = differenceString.lastIndexOf(",");
        differenceString = differenceString.substring(0, lastComma) + ' and ' + differenceString.substring(lastComma + 1);
        differenceString = differenceString.replace(/\s\s+/g, ' ');
        differenceObject.string = differenceString;

        return differenceObject;
    }
};


window.onload = function () {
    'use strict';
    main.init();
}