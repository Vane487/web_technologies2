"use strict";

let mySpan = document.getElementsByTagName('span')[0];
let myButton = document.getElementsByTagName('button')[0];

function displayStudentName(userName) {
    mySpan.innerText = userName;
}

myButton.onmouseover = function() {
    displayStudentName("Vanessa");
};