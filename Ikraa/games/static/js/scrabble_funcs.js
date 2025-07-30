// Helper functions, all used in checking board for submitting

function find_touching_tiles(copy) {
    let count = 0;
    for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy.length; j++) {
            if (copy[i][j] === 0) {
                // conquer right
                if (i != 14 && copy[i + 1][j] === 1) {
                    copy[i][j] = 2;
                    count++;
                    for (let k = i - 1; k >= 0; k--) {
                        if (copy[k][j] === 0) {
                            copy[k][j] = 2;
                            count++;
                        } else break;
                    }
                }
                // conquer left
                if (i != 0 && copy[i - 1][j] === 1) {
                    copy[i][j] = 2;
                    count++;
                    for (let k = i + 1; k < 15; k++) {
                        if (copy[k][j] === 0) {
                            copy[k][j] = 2;
                            count++;
                        } else break;
                    }
                }
                // conquer up
                if (j != 14 && copy[i][j + 1] === 1) {
                    copy[i][j] = 2;
                    count++;
                    for (let k = j - 1; k >= 0; k--) {
                        if (copy[i][k] === 0) {
                            copy[i][k] = 2;
                            count++;
                        } else break;
                    }
                }
                // conquer down
                if (j != 0 && copy[i][j - 1] === 1) {
                    copy[i][j] = 2;
                    count++;
                    for (let k = j + 1; k < 15; k++) {
                        if (copy[i][k] === 0) {
                            copy[i][k] = 2;
                            count++;
                        } else break;
                    }
                }
            }
        }
    }
    return count;
}

function update_grid_colors(copy) {
    for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy.length; j++) {
            if (copy[i][j] === 0) {
                let element = document.getElementById(j + "-" + i);
                element.style.backgroundColor = "#c3c3c3";
            } else if (copy[i][j] === 1) {
                let element = document.getElementById(j + "-" + i);
                element.style.backgroundColor = "#959eff";
            } else if (copy[i][j] === 2) {
                let element = document.getElementById(j + "-" + i);
                element.style.backgroundColor = "#ced2ff";
            } else {
                let element = document.getElementById(j + "-" + i);
                element.style.backgroundColor = "white";
            }
        }
    }
}

function check_for_contiguous_line(copy, temp) {
    for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy.length; j++) {
            if (copy[i][j] === 1) {
                temp.push([i, j]);
            }
        }
    }

    if (temp.length == 0) {
        console.log("invalid - no tiles placed");
        return false;
    }
    // vertical
    if (temp[0][0] === temp[temp.length - 1][0]) {
        // travel the distance in between the start and the end
        let x = temp[0][0];
        let k = 1; // for looping through 'temp'
        for (let y = temp[0][1] + 1; y < temp[temp.length - 1][1]; y++) {
            if (copy[x][y] === 1) {
                if (temp[k][0] === x && temp[k][1] === y) {
                    // good
                    k++;
                } else {
                    console.log("invalid - tiles do not form a line");
                    return false;
                }
            } else if (copy[x][y] === 2) {
                continue;
            } else {
                console.log("invalid - tiles do not form a line");
                return false;
            }
        }
        if (k != temp.length - 1) {
            console.log("invalid - tiles do not form a line");
            return false;
        }
    }

    // horizontal
    else if (temp[0][1] === temp[temp.length - 1][1]) {
        // travel the distance in between the start and the end
        let y = temp[0][1];
        let k = 1; // for looping through 'temp'
        for (let x = temp[0][0] + 1; x < temp[temp.length - 1][0]; x++) {
            if (copy[x][y] === 1) {
                if (temp[k][1] === y && temp[k][0] === x) {
                    // good
                    k++;
                } else {
                    console.log("invalid - tiles do not form a line");
                    return false;
                }
            } else if (copy[x][y] === 2) {
                continue;
            } else {
                console.log("invalid - tiles do not form a line");
                return false;
            }
        }
        if (k != temp.length - 1) {
            console.log("invalid - tiles do not form a line");
            return false;
        }
    }

    // error
    else {
        console.log("invalid - tiles do not form a line");
        return false;
    }

    return true;
}

// helper functions for the one after
function get_word_vertical(copy, x, y) {
    let i = x;
    let j = y;
    let temp_word = Array(0);
    while (j != 0 && (copy[i][j - 1] === 1 || copy[i][j - 1] === 2)) j--;
    while (j != 15 && (copy[i][j] === 1 || copy[i][j] === 2)) {
        temp_word.push([i, j]);
        j++;
    }
    return temp_word;
}

function get_word_horizontal(copy, x, y) {
    let i = x;
    let j = y;
    let temp_word = Array(0);
    while (i != 0 && (copy[i - 1][j] === 1 || copy[i - 1][j] === 2)) i--;
    while (i != 15 && (copy[i][j] === 1 || copy[i][j] === 2)) {
        temp_word.push([i, j]);
        i++;
    }
    return temp_word;
}

function get_all_words(copy, added_word) {
    var all_words = Array(0);

    let is_vertical = true;
    if (added_word[0][0] === added_word[added_word.length - 1][0])
        is_vertical = true;
    else is_vertical = false;

    if (is_vertical) {
        let temp_word = Array(0);
        // travel up then down to gather all the dragon balls (letters that belong to the word)
        let x = added_word[0][0];
        let y = added_word[0][1];
        while (y != 0 && (copy[x][y - 1] === 1 || copy[x][y - 1] === 2)) y--;

        while (y != 15 && (copy[x][y] === 1 || copy[x][y] === 2)) {
            temp_word.push([x, y]);
            if (copy[x][y] === 1)
                all_words.push(get_word_horizontal(copy, x, y));
            y++;
        }
        // got the first word
        all_words.push(temp_word);
    } else {
        let temp_word = Array(0);
        // travel right then left to gather all the dragon balls (letters that belong to the word)
        let x = added_word[0][0];
        let y = added_word[0][1];
        while (x != 0 && (copy[x - 1][y] === 1 || copy[x - 1][y] === 2)) x--;

        while (x != 15 && (copy[x][y] === 1 || copy[x][y] === 2)) {
            temp_word.push([x, y]);
            if (copy[x][y] === 1) all_words.push(get_word_vertical(copy, x, y));
            x++;
        }
        // got the first word
        all_words.push(temp_word);
    }

    return all_words;
}

function check_veracity(all_words) {
    // send to the back_end
    fetch("scrabble/check_words", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: all_words }),
    })
        .then((response) => response.text())
        .then((data) => {
            // Handle the received data
            data = JSON.parse(data);
            console.log(data);
            // for (var i = 0; i < 5; i++) {
            //     if (data["are_letters"][i] == 0) {
            //         grid[slctd_row][i].classList += " grey_square";
            //     } else if (data["are_letters"][i] == 1) {
            //         grid[slctd_row][i].classList += " yellow_square";
            //     } else {
            //         grid[slctd_row][i].classList += " green_square";
            //     }
            //     console.log(i);
            // }

            // if (data["is_word"] == true) {
            //     // Won the game
            //     console.log("Congratulations, found the word");
            // } else if (slctd_row < 5) {
            //     slctd_row += 1;
            //     slctd_clmn = 0;
            // } else {
            //     // Lost the game
            //     console.log("Lost the game");
            // }
        })
        .catch((error) => {
            // Handle any errors
            console.error(error);
        });
    return true;
}

function reset_grid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j] && !grid[i][j].is_perm) {
                let temp = document.getElementById(j + "-" + i).firstChild;
                temp.id = "";
                temp.classList = "perm-tile";
                temp.draggable = false;
                grid[i][j].is_perm = true;
            }
        }
    }
}

// Game Constants
// const letter_values = {
//     A: 1,
//     E: 1,
//     I: 1,
//     O: 1,
//     U: 1,
//     L: 1,
//     N: 1,
//     S: 1,
//     T: 1,
//     R: 1,
//     D: 2,
//     G: 2,
//     B: 3,
//     C: 3,
//     M: 3,
//     P: 3,
//     F: 4,
//     H: 4,
//     V: 4,
//     W: 4,
//     Y: 4,
//     K: 5,
//     J: 8,
//     X: 8,
//     Q: 10,
//     Z: 10,
// };

// const letter_distribution = {
//     E: 15,
//     A: 9,
//     I: 8,
//     N: 7,
//     O: 6,
//     S: 6,
//     T: 6,
//     R: 5,
//     L: 4,
//     U: 2,
//     D: 6,
//     G: 4,
//     B: 2,
//     P: 2,
//     M: 1,
//     H: 3,
//     F: 2,
//     V: 2,
//     W: 2,
//     Y: 2,
//     K: 3,
//     J: 1,
// };

const letter_values = {
    ﺍ: 1,
    ﻝ: 1,
    ﺝ: 1,
    ﺡ: 1,
    ﺥ: 1,
    ﻡ: 1,
    ﻥ: 1,
    ﻩ: 1,
    ﻭ: 1,
    ي: 1,
    ﺏ: 2,
    ﺕ: 2,
    ﺭ: 2,
    ﺩ: 2,
    ﺱ: 2,
    ﺙ: 2,
    ﻑ: 3,
    ﻕ: 3,
    ﺫ: 3,
    ﺵ: 3,
    ﺯ: 3,
    ﺹ: 4,
    ﺽ: 4,
    ﻉ: 4,
    ﻙ: 4,
    ﻁ: 4,
    ﻅ: 5,
    ﺉ: 6,
    ﻍ: 8,
    ﺀ: 8,
    ﺃ: 10,
    ﺅ: 10,
};

const letter_distribution = {
    ﺍ: 8,
    ﻝ: 4,
    ﺝ: 4,
    ﺡ: 3,
    ﺥ: 3,
    ﻡ: 3,
    ﻥ: 3,
    ﻩ: 3,
    ﻭ: 3,
    ي: 3,
    ﺏ: 4,
    ﺕ: 4,
    ﺭ: 3,
    ﺩ: 3,
    ﺱ: 3,
    ﺙ: 3,
    ﻑ: 3,
    ﻕ: 3,
    ﺫ: 3,
    ﺵ: 3,
    ﺯ: 3,
    ﺹ: 3,
    ﺽ: 3,
    ﻉ: 3,
    ﻙ: 3,
    ﻁ: 2,
    ﻅ: 2,
    ﺉ: 2,
    ﻍ: 2,
    ﺀ: 2,
    ﺃ: 2,
    ﺅ: 2,
};

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export {
    find_touching_tiles,
    update_grid_colors,
    check_for_contiguous_line,
    get_all_words,
    check_veracity,
    letter_values,
    letter_distribution,
    shuffle,
    reset_grid,
};
