
// ===== DOM =====
const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const popup = document.getElementById("popup");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const highScoreEl = document.getElementById("highScore");
const gameBoard = document.querySelector(".board");

const rulePopup = document.getElementById("rulePopup");
const ruleStart = document.getElementById("ruleStart");
const countdown = document.getElementById("countdown");

// ===== 音效 =====
const hitSound = document.getElementById("hitSound");
const goldSound = document.getElementById("goldSound");
const bombSound = document.getElementById("bombSound");
const countSound = document.getElementById("countSound");
const goSound = document.getElementById("goSound");
const gameoverSound = document.getElementById("gameoverSound");

// ===== 狀態 =====
let score = 0;
let time = 30;
let gameRunning = false;
let lastHole = null;
let moleTimer = null;
let countdownTimer = null;

// ===== 最高分 =====
let highScore = localStorage.getItem("whackHigh") || 0;
highScoreEl.textContent = highScore;

// ===== 防止重複點擊 =====
function setHit(mole){
if(mole.dataset.hit==="1") return true;
mole.dataset.hit="1";
return false;
}

// ===== 隨機洞 =====
function randomHole(){
const index = Math.floor(Math.random() * holes.length);
const hole = holes[index];
if(hole === lastHole) return randomHole();
lastHole = hole;
return hole;
}

// ===== 類型 =====
function randomType(){
const r = Math.random();
if(r < 0.7) return "normal";
if(r < 0.9) return "gold";
return "bomb";
}

// ===== 爆炸 =====
function createEffect(x,y){
const el = document.createElement("div");
el.classList.add("explode");
el.style.left = x + "px";
el.style.top = y + "px";
document.body.appendChild(el);
setTimeout(()=>el.remove(),400);
}

// ===== 飄字 =====
function floatText(x,y,text,type){
const el = document.createElement("div");
el.className = "float-text " + type;
el.innerText = text;
el.style.left = x + "px";
el.style.top = y + "px";
document.body.appendChild(el);
setTimeout(()=>el.remove(),1000);
}

// ===== 地鼠出現 =====
function popMole(){

const hole = randomHole();
const mole = hole.querySelector(".mole");

// reset
mole.dataset.hit = "0";
mole.classList.remove("gold","bomb");

const type = randomType();

if(type === "gold") mole.classList.add("gold");
if(type === "bomb") mole.classList.add("bomb");

hole.classList.add("active");

setTimeout(()=>{
hole.classList.remove("active");
mole.classList.remove("gold","bomb");
mole.dataset.hit = "0";
},800);

}

// ===== 點擊 =====
holes.forEach(hole=>{

hole.querySelector(".mole").addEventListener("click",(e)=>{

if(!gameRunning) return;

const mole = hole.querySelector(".mole");
if(setHit(mole)) return;

createEffect(e.pageX,e.pageY);

if(mole.classList.contains("gold")){
score += 3;
floatText(e.pageX,e.pageY,"+3","gold");
goldSound.play();
navigator.vibrate?.(50);
}

else if(mole.classList.contains("bomb")){
score -= 2;
floatText(e.pageX,e.pageY,"-2","red");
bombSound.play();
gameBoard.classList.add("shake");
setTimeout(()=>gameBoard.classList.remove("shake"),300);
navigator.vibrate?.([80,40,80]);
}

else{
score += 1;
floatText(e.pageX,e.pageY,"+1","normal");
hitSound.play();
navigator.vibrate?.(30);
}

scoreEl.textContent = score;
mole.classList.remove("gold","bomb");

});

});

// ===== 倒數 =====
function startCountdown(){

let num = 3;
countdown.classList.remove("hidden");
countdown.innerHTML = num;

countSound.play();

countdownTimer = setInterval(()=>{

num--;

if(num > 0){
countdown.innerHTML = num;
countSound.play();
}

else if(num === 0){
countdown.innerHTML = "GO!";
goSound.play();
}

else{
clearInterval(countdownTimer);
countdown.classList.add("hidden");
startGame();
}

},1000);

}

// ===== 開始 =====
function startGame(){

score = 0;
time = 30;
gameRunning = true;

scoreEl.textContent = score;
timeEl.textContent = time;

popup.classList.add("hidden");

moleTimer = setInterval(popMole, 900);

let timer = setInterval(()=>{

time--;
timeEl.textContent = time;

if(time <= 0){
clearInterval(timer);
clearInterval(moleTimer);
endGame();
}

},1000);

}

// ===== 結束 =====
function endGame(){

gameRunning = false;

popup.classList.remove("hidden");
finalScoreEl.textContent = score;

gameoverSound.play();

if(score > highScore){
highScore = score;
localStorage.setItem("whackHigh", highScore);
highScoreEl.textContent = highScore;
}

}

// ===== UI =====
startBtn.onclick = ()=>rulePopup.classList.remove("hidden");
ruleStart.onclick = ()=>{
rulePopup.classList.add("hidden");
startCountdown();
};

restartBtn.onclick = startCountdown;
