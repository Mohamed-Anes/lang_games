// TODO:
// - implement the backend for checking words

import {
    find_touching_tiles,
    update_grid_colors,
    check_for_contiguous_line,
    get_all_words,
    check_veracity,
    letter_values,
    letter_distribution,
    shuffle,
    reset_grid,
} from "./scrabble_funcs.js";

import {
    dragEnter,
    dragOver,
    dropBoxOnGrid,
    dropBoxOnRack,
} from "./scrabble_drag_n_drop.js";

import { game } from "./scrabble_classes.js";

var cases = document.getElementsByClassName("square");
cases = Array.from(cases);

var grid = Array(15);
for (var i = 0; i < 15; i++) {
    grid[i] = Array(15);
}

const grid_container = document.getElementsByClassName("grid_container")[0];

for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
        const temp = document.createElement("div");
        temp.classList = "square";
        temp.id = i + "-" + j;
        grid_container.appendChild(temp);
    }
}

export { grid };

let is_first_word = true;
const check_word_button = document.getElementById("check-word");
check_word_button.addEventListener("click", (event) => {
    //
    const new_word = document.getElementsByClassName("temp-tile");
    let new_tiles = Array();

    Array.from(new_word).forEach((element) => {
        let temp = String(element.parentElement.id).split("-");
        grid[parseInt(temp[1])][parseInt(temp[0])] = {
            is_perm: false,
            letter: element.innerText,
        };
        new_tiles.push({ x: parseInt(temp[1]), y: parseInt(temp[0]) });
    });

    let copy = grid.map((element) => {
        return element.map((item) => {
            return item.is_perm ? 0 : 1;
        });
    });

    // BEGIN CHECKS

    // add the permanent tiles that are touching the temp tiles
    // if a 0 letter is touching any of the 1 letters, it becomes 2
    let num = find_touching_tiles(copy);
    // TODO: remove check for first turn
    if (num === 0 && !is_first_word) {
        console.log("invalid - new word not touching any old words");
        return;
    }

    // check to see if the temp tiles form a line with no blank spaces in between
    // get the first and last temp tiles to appear when looping through 'grid', those are the first and last letter of the row
    let added_word = Array(0);
    let is_line = check_for_contiguous_line(copy, added_word);
    if (is_line) console.log("valid - yahoo");
    else return;

    let all_words = get_all_words(copy, added_word);

    let literal_words = all_words
        .filter((element) => element.length > 1)
        .map((element) => {
            return element
                .map((item) => {
                    return grid[item[0]][item[1]].letter;
                })
                .join("");
        });

    console.log(literal_words);

    if (literal_words.length === 0) {
        console.log("no valid words inputted");
        return;
    }

    // check for words' veracity
    let are_true = check_veracity(literal_words);

    if (!are_true) {
        console.log("there are invalid words inputted");
        return;
    }

    // END CHECKS

    // count points

    // storing used tiles
    let used_tiles = added_word.map((element) => {
        let id = document.getElementById(element[1] + "-" + [element[0]])
            .firstChild.id;
        return parseInt(id[id.length - 1]);
    });

    console.log("used_tiles : ", used_tiles);

    update_grid_colors(copy);

    // resetting grid
    reset_grid(grid);
    // for (let i = 0; i < copy.length; i++) {
    //     for (let j = 0; j < copy.length; j++) {
    //         if (grid[i][j] && !grid[i][j].is_perm) {
    //             // grid[i].splice(j, 1);
    //             let temp = document.getElementById(j + "-" + i).firstChild;
    //             temp.id = "";
    //             temp.classList = "perm-tile";
    //             temp.draggable = false;
    //             grid[i][j].is_perm = true;
    //         }
    //     }
    // }

    game.next_player(used_tiles);
    is_first_word = false;

    return;
});

document.getElementById("forgo-turn").addEventListener("click", (event) => {
    // reset_grid(grid, true);
    const temp_tiles = document.getElementsByClassName("temp-tile");
    for (var i = temp_tiles.length - 1; i != -1; i--) temp_tiles[i].remove();
    game.next_player([]);
});

// Game start
game.start_game(2);
