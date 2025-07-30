// Drag and drop

function boxEnter(event) {
    this.classList.add("dragstart");
    this.classList.add("hide");
    event.dataTransfer.setData("tile-id", event.target.id);
}

function boxLeave() {
    this.classList.remove("dragstart", "hide");
}

function dragEnter(event) {
    event.preventDefault();
}

function dragOver(event) {
    event.preventDefault();
}

function dropBoxOnGrid(event) {
    event.preventDefault();

    // if it already has a tile in it, then return this tile to the rack
    const target =
        event.target.tagName == "SPAN"
            ? event.target.parentElement
            : event.target;

    // let target = event.target;

    // if (target.tagName == "SPAN") {
    //     target = target.parentElement;
    // }
    if (target.childElementCount === 1) return;

    var data = event.dataTransfer.getData("tile-id");
    var tile = document.getElementById(data);
    var new_element = document.createElement("span");
    new_element.id = data;
    new_element.classList = "temp-tile";
    new_element.innerText = tile.innerText;
    new_element.draggable = true;
    new_element.addEventListener("dragstart", boxEnter);
    new_element.addEventListener("dragend", boxLeave);
    event.target.appendChild(new_element);
    event.target.classList += " part-of-word";

    tile.parentElement.removeChild(tile);
}

function dropBoxOnRack(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("tile-id");
    var tile = document.getElementById(data);
    // because the drop effect is apparently triggered on the rack and its child elements
    var target = event.target;
    if (event.target.tagName == "SPAN") {
        target = event.target.parentElement;
    }

    target.appendChild(
        Object.assign(document.createElement("span"), {
            id: data,
            innerText: tile.innerText,
            classList: "letter",
            draggable: "true",
        })
    );
    target.lastChild.addEventListener("dragstart", boxEnter);
    target.lastChild.addEventListener("dragend", boxLeave);
    tile.parentElement.removeChild(tile);
}

// let zone = document.querySelectorAll(".square");
// let rack_zone = document.querySelectorAll(".letter_list");
// console.log("----eventing zones----");
// for (const x of zone) {
//     x.addEventListener("dragenter", dragEnter);
//     x.addEventListener("dragover", dragOver);
//     x.addEventListener("drop", dropBoxOnGrid);
//     console.log("evented zone : ", x);
// }

// console.log("----eventing rack_zones----");
// for (const x of rack_zone) {
//     x.addEventListener("dragenter", dragEnter);
//     x.addEventListener("dragover", dragOver);
//     x.addEventListener("drop", dropBoxOnRack);
//     console.log("evented rack_zone : ", x);
// }

// redefine 'letter_tiles' before invoking the two functions below
const letter_tiles = document.getElementsByClassName("letter");

function disable_letter_drag() {
    console.log("disabled");

    for (var i = 0; i < letter_tiles.length; ++i) {
        letter_tiles[i].draggable = false;
    }
}

function enable_letter_drag() {
    console.log("enabled");
    for (var i = 0; i < letter_tiles.length; ++i) {
        letter_tiles[i].draggable = true;
    }
}

export {
    boxEnter,
    boxLeave,
    dragEnter,
    dragOver,
    dropBoxOnGrid,
    dropBoxOnRack,
};
