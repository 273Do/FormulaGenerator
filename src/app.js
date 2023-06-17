//テキストエリアのデータ
var inputArea = document.getElementById("input");
//テキストエリアクリアの状態を示す変数
var textFlg = 0;

let states = []; // 過去の状態を格納する配列
let currentStateIndex = -1; // 現在の状態のインデックス

//ロード時の初期表示
window.onload = function () {
  displayNone();
  convert();
};
//テキストエリアのカーソルを末尾に移動
function cursorPos() {
  inputArea.focus();
  inputArea.value += "";
}
//テキストエリアの書き込み検知
$(function () {
  $("textarea").keyup(convert);
});
//テキストエリアに数式を代入
function strIns(str, idx, val) {
  var res = str.slice(0, idx) + val + str.slice(idx);
  return res;
}
//テキストエリアのカーソル位置を取得し，数式を代入
function funcInput(func) {
  inputArea.value = strIns(inputArea.value, inputArea.selectionStart, func);
  convert();
  cursorPos();
  states.push(inputArea.value);
}
//テキストエリアの削除
function textClear(val) {
  if ((textFlg == 0 && val == 0) || val == 1) {
    inputArea.value = "";
    convert();

    textFlg = 1;
  } else if (textFlg == 1 && val == 1) {
    inputArea.value = "";
    convert();
    //states.push(inputArea.value);
  }
}
//選択した数式を表示する
function selectInputType() {
  displayNone();
  document.getElementById(
    document.getElementById("inputTypeDisplay").value
  ).style.display = "block";
}
//全ボタン非表示
function displayNone() {
  document.getElementById("operator").style.display = "none";
  document.getElementById("brackets").style.display = "none";
  document.getElementById("fraction").style.display = "none";
  document.getElementById("logic").style.display = "none";
  document.getElementById("set").style.display = "none";
  document.getElementById("permutationAndCombination").style.display = "none";
  document.getElementById("summationAndProduct").style.display = "none";
  document.getElementById("radicalAndEexponentAndLogarithm").style.display =
    "none";
  document.getElementById("complexNumber").style.display = "none";
  document.getElementById("trigonometricFunction").style.display = "none";
  document.getElementById("limit").style.display = "none";
  document.getElementById("differential").style.display = "none";
  document.getElementById("integral").style.display = "none";
  document.getElementById("vector").style.display = "none";
  document.getElementById("matrix").style.display = "none";
  document.getElementById("space").style.display = "none";
  document.getElementById("displayFormat").style.display = "none";
  document.getElementById("fontAndSize").style.display = "none";
  document.getElementById("greekLettersUppercase").style.display = "none";
  document.getElementById("greekLettersLowercase").style.display = "none";
  document.getElementById("specialCharacter").style.display = "none";
  document.getElementById("accent").style.display = "none";
}

const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");

// テキストエリアの値が変更されたときに呼び出される関数
function onTextAreaChange() {
  // 現在の状態を配列に追加する
  states.push(inputArea.value);
  currentStateIndex = states.length - 1;
  // Redoボタンを無効にする
  redoBtn.disabled = true;
}

// Undoボタンがクリックされたときに呼び出される関数
function onUndoClick() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    inputArea.value = states[currentStateIndex];
    redoBtn.disabled = false;
    convert();
  }
  // Undoボタンを無効にする
  if (currentStateIndex === 0) {
    undoBtn.disabled = true;
  }
}

// Redoボタンがクリックされたときに呼び出される関数
function onRedoClick() {
  if (currentStateIndex < states.length - 1) {
    currentStateIndex++;
    inputArea.value = states[currentStateIndex];
    undoBtn.disabled = false;
    convert();
  }
  // Redoボタンを無効にする
  if (currentStateIndex === states.length - 1) {
    redoBtn.disabled = true;
  }
}
// イベントリスナーを登録する
inputArea.addEventListener("input", onTextAreaChange);
undoBtn.addEventListener("click", onUndoClick);
redoBtn.addEventListener("click", onRedoClick);

//MathMl形式にコピー
function copy() {
  var mathjaxElements = document.getElementsByClassName("MathJax");
  var mathmlCode = mathjaxElements[0].getElementsByTagName("math")[0].outerHTML;
  navigator.clipboard.writeText(mathmlCode);
}
//再利用部分
function convert() {
  //
  //inputを取得
  //trim()で空白削除
  var input = inputArea.value.trim();
  //
  //  Disable the display and render buttons until MathJax is done
  //
  var display = document.getElementById("display");
  var button = document.getElementById("render");
  button.disabled = display.disabled = true;
  //
  //  Clear the old output
  //
  output = document.getElementById("output");
  output.innerHTML = "";
  //
  //  Reset the tex labels (and automatic equation numbers, though there aren't any here).
  //  Get the conversion options (metrics and display settings)
  //  Convert the input to CommonHTML output and use a promise to wait for it to be ready
  //    (in case an extension needs to be loaded dynamically).
  //
  MathJax.texReset();
  var options = MathJax.getMetricsFor(output);
  options.display = display.checked;
  MathJax.tex2chtmlPromise(input, options)
    .then(function (node) {
      //
      //  The promise returns the typeset node, which we add to the output
      //  Then update the document to include the adjusted CSS for the
      //    content of the new equation.
      //
      output.appendChild(node);
      MathJax.startup.document.clear();
      MathJax.startup.document.updateDocument();
    })
    .catch(function (err) {
      //
      //  If there was an error, put the message into the output instead
      //
      output
        .appendChild(document.createElement("pre"))
        .appendChild(document.createTextNode(err.message));
    })
    .then(function () {
      //
      //  Error or not, re-enable the display and render buttons
      //
      button.disabled = display.disabled = false;
    });
}
