var cases = document.getElementsByClassName("square");
cases = Array.from(cases);

console.log(cases);

var grid = Array(6);
grid[0] = cases.slice(0, 5);
grid[1] = cases.slice(5, 10);
grid[2] = cases.slice(10, 15);
grid[3] = cases.slice(15, 20);
grid[4] = cases.slice(20, 25);
grid[5] = cases.slice(25, 30);

console.log(grid);

// i = 0;
// grid.forEach((row) => {
//   row.forEach((square) => {
//     square.innerText = i;
//   });
//   i += 1;
// });

var slctd_row = 0;
var slctd_clmn = 0;
var min = 10000000;
var max = 0;

// sending request for words
const submit = (word) => {
  fetch("wordle/check_word?word=" + word)
    .then((response) => response.text())
    .then((data) => {
      // Handle the received data
      data = JSON.parse(data);
      console.log(data);
      for (var i = 0; i < 5; i++) {
        if (data["are_letters"][i] == 0) {
          grid[slctd_row][i].classList += " grey_square";
        } else if (data["are_letters"][i] == 1) {
          grid[slctd_row][i].classList += " yellow_square";
        } else {
          grid[slctd_row][i].classList += " green_square";
        }
        console.log(i);
      }

      if (data["is_word"] == true) {
        // Won the game
        console.log("Congratulations, found the word");
      } else if (slctd_row < 5) {
        slctd_row += 1;
        slctd_clmn = 0;
      } else {
        // Lost the game
        console.log("Lost the game");
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
};

// key listener for letters and 'Enter'
document.addEventListener("keypress", (event) => {
  // if(event.keyCode > max){
  //   max = event.keyCode
  // }
  // if(event.keyCode < min){
  //   min = event.keyCode
  // }

  // console.log(event.key + " " + event.keyCode);

  // check if it is an arabic letter
  if (event.keyCode <= 1610 && event.keyCode >= 1569) {
    if (slctd_clmn >= 5) {
      // shake the squares
      return;
    }
    grid[slctd_row][slctd_clmn].innerText = event.key;
    slctd_clmn += 1;
  } else if (event.keyCode == 13) {
    if (slctd_clmn < 5) {
      // shake the squares
      return;
    }
    console.log("submitting");
    word = "";
    grid[slctd_row].forEach((element) => {
      word += element.innerText;
    });
    submit(word);
  } else if (event.keyCode == 8 && slctd_clmn != 0) {
    console.log("deleting");
    slctd_clmn -= 1;
    grid[slctd_row][slctd_clmn].innerText = "";
  }
});

// key listener for 'backspace'
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 8 && slctd_clmn != 0) {
    console.log("deleting");
    slctd_clmn -= 1;
    grid[slctd_row][slctd_clmn].innerText = "";
  }
});
