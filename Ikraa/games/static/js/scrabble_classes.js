import {
    boxEnter,
    boxLeave,
    dragEnter,
    dragOver,
    dropBoxOnGrid,
    dropBoxOnRack,
} from "./scrabble_drag_n_drop.js";
import { grid } from "./scrabble_clone.js";
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

class GameBoard {
    constructor() {
        // randomize the tiles' order
        this.pouch_tiles = Array(0);
        for (const letter in letter_distribution) {
            for (let i = 0; i < letter_distribution[letter]; i++)
                this.pouch_tiles.push(letter);
        }
        shuffle(this.pouch_tiles);
        this.player_count = NaN;
        this.players = Array(0);
        this.current_player = NaN;
    }

    get_tile() {
        // const rand = this.pouch_tiles[Math.floor(Math.random() * this.pouch_tiles.length)];
        // console.log(this.pouch_tiles);
        return this.pouch_tiles.pop();
    }

    add_player(new_player) {
        this.players.push(new_player);
    }

    add_drop_events() {
        let zone = document.querySelectorAll(".square");
        let rack_zone = document.querySelectorAll(".letter_list");
        // console.log("----eventing zones----");
        for (const x of zone) {
            x.addEventListener("dragenter", dragEnter);
            x.addEventListener("dragover", dragOver);
            x.addEventListener("drop", dropBoxOnGrid);
            // console.log("evented zone : ", x);
        }

        // console.log("----eventing rack_zones----");
        for (const x of rack_zone) {
            x.addEventListener("dragenter", dragEnter);
            x.addEventListener("dragover", dragOver);
            x.addEventListener("drop", dropBoxOnRack);
            // console.log("evented rack_zone : ", x);
        }
    }

    start_game(player_count) {
        this.player_count = player_count;
        for (let i = 0; i < player_count; i++) {
            let player = new Player(this, true, i + 1);
            this.add_player(player);
        }
        this.current_player = 0; // should be randomized
        this.add_drop_events();
        this.players[this.current_player].start_turn();
    }

    // called from 'check_word_button' click event listener
    next_player(used_tiles) {
        this.players[this.current_player].end_turn(used_tiles);
        this.current_player = (this.current_player + 1) % this.player_count;
        this.players[this.current_player].start_turn();
    }
}

// var game = new GameBoard();

class Player {
    constructor(game, is_real, turn) {
        this.game = game;
        // boolean
        this.is_real = is_real;
        // turn is from 1 to 4
        this.turn = turn;
        this.id = "player-" + turn;
        // assigning id to particular list
        this.html_tiles = this.refresh_tiles();
        // this.html_tiles.id = this.id;

        // generating tiles array
        this.tiles = Array(0);
        this.fill_tiles();
        // lists_container[this.turn - 1];
        this.html_tiles.style.visibility = "hidden";
    }

    fill_tiles() {
        for (var i = this.tiles.length; i < 7; i++) {
            const new_tile = this.game.get_tile();
            if (new_tile === undefined) {
                console.log("tile pouch empty");
                break;
            }

            this.tiles.push(new_tile);
        }

        // this.html_tiles.innerHTML = ``;
        while (this.html_tiles.firstChild) {
            this.html_tiles.removeChild(this.html_tiles.firstChild);
        }

        for (var i = 0; i < this.tiles.length; i++) {
            this.html_tiles.appendChild(
                Object.assign(document.createElement("span"), {
                    innerText: this.tiles[i],
                    classList: "letter",
                    draggable: "true",
                })
            );
            this.html_tiles.children[i].addEventListener("dragstart", boxEnter);
            this.html_tiles.children[i].addEventListener("dragend", boxLeave);
            // console.log("evented : ", this.html_tiles.children[i]);

            this.html_tiles.children[i].id = this.id + i;
        }
    }

    refresh_tiles() {
        // expected to not do anything past first invocation
        let lsts_cnt = document.getElementById("lists_container");
        lsts_cnt.appendChild(
            Object.assign(document.createElement("div"), {
                id: this.id,
                classList: "letter_list",
            })
        );

        this.html_tiles = lsts_cnt.lastChild;
        // this.html_tiles = document.getElementById("lists_container").children[this.turn - 1];
        return this.html_tiles;
    }

    delete_tiles(used) {
        for (var i = 0; i < used.length; i++) {
            this.tiles.splice(used[i], 1);
        }
    }

    enable_drag() {
        console.log("drag enabled for player " + this.turn);
        for (var i = 0; i < this.tiles.length; ++i) {
            this.html_tiles.children[i].draggable = true;
        }
    }

    disable_drag() {
        console.log("drag disabled for player " + this.turn);
        for (var i = 0; i < this.tiles.length; ++i) {
            this.html_tiles.children[i].draggable = false;
        }
    }

    start_turn() {
        // this.refresh_tiles();
        this.enable_drag();
        this.html_tiles.style.visibility = "visible";
        const name_tag = document.getElementById("player-number");
        name_tag.innerText = this.id;
    }

    end_turn(used_tiles) {
        this.delete_tiles(used_tiles);
        this.fill_tiles();
        this.disable_drag();
        this.html_tiles.hidden = true;
        this.html_tiles.style.visibility = "hidden";
    }
}

// initiating stuff
var game = new GameBoard();

export { game };
