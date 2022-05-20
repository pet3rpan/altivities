"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
function drawRandom() {
    const toDraw = document.getElementById("to_draw_area");
    const current = document.getElementById("current_area");
    const drawn = document.getElementById("drawn_area");
    while (current.firstChild)
        drawn.appendChild(current.firstChild);
    const itemsArray = [];
    toDraw.childNodes.forEach((child) => {
        if (child.classList?.contains("item"))
            itemsArray.push(child);
    });
    shuffle(itemsArray);
    current.appendChild(itemsArray[0]);
    fitTextForAllCards();
    checkDraw();
}
function checkDraw() {
    const toDraw = document.getElementById("to_draw_area");
    const drawButton = document.getElementById("draw_card");
    let hasItem = false;
    toDraw.childNodes.forEach((child) => {
        if (child.classList?.contains("item"))
            hasItem = true;
    });
    if (hasItem) {
        drawButton.style.cursor = "pointer";
        drawButton.style.backgroundColor = "var(--ready-yes-color)";
        drawButton.addEventListener("click", drawRandom);
        return true;
    }
    else {
        drawButton.style.cursor = "not-allowed";
        drawButton.style.backgroundColor = "var(--ready-no-color)";
        drawButton.removeEventListener("click", drawRandom);
        return false;
    }
}
async function onMouseDown(event) {
    const target = event.currentTarget;
    const parent = target.parentElement;
    const toDraw = document.getElementById("to_draw_area");
    const current = document.getElementById("current_area");
    const drawn = document.getElementById("drawn_area");
    if (parent.id == "drawn_area") {
        while (current.firstChild) {
            toDraw.appendChild(current.firstChild);
        }
        current.appendChild(target);
    }
    else if (parent.id == "current_area") {
        toDraw.appendChild(target);
    }
    else if (parent.id == "to_draw_area") {
        while (current.firstChild)
            drawn.appendChild(current.firstChild);
        current.appendChild(target);
    }
    fitTextForAllCards();
    checkDraw();
}
async function generateMenuOptions(wordlist) {
    const menu = document.getElementById("to_draw_area");
    let num = 0;
    for (const word of wordlist) {
        const itemOutside = document.createElement("div");
        const itemInside = document.createElement("div");
        itemOutside.id = `option${num}`;
        itemOutside.addEventListener("mousedown", onMouseDown);
        itemOutside.style.order = num.toString();
        itemOutside.classList.add("item");
        itemInside.classList.add("item_inside");
        if (word.image) {
            itemOutside.style.backgroundImage = `url('${word.image}')`;
            itemOutside.style.backgroundRepeat = "no-repeat";
            itemOutside.style.backgroundPosition = "center";
            itemOutside.style.backgroundSize = "contain";
        }
        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0];
        }
        else {
            itemInside.innerText = word.en;
        }
        itemOutside.appendChild(itemInside);
        menu.appendChild(itemOutside);
        textFit(itemInside, { alignHoriz: true });
        num += 1;
    }
    checkDraw();
}
async function prepare() {
    generateMenuOptions(await prepareWordlist());
}
prepare();
function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside");
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i);
        textFit(inside, { alignHoriz: true });
    }
}
let RESIZE_FINISHED;
function resize() {
    if (RESIZE_FINISHED)
        clearTimeout(RESIZE_FINISHED);
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        fitTextForAllCards();
    }, 250);
}
resize();
window.addEventListener("resize", resize);
