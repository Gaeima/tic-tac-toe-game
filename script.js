//=============================
//3D Tic Tac Toe Game
//


let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "twoPlayer";
let difficulty = "easy";
let scoreX = 0, scoreO = 0, scoreDraw = 0;
const winningPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const turnIcon = document.getElementById("turnIcon");
const resultText = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");
const difficultyBox = document.getElementById("difficultyBox");
const difficultySelect = document.getElementById("difficulty");
const themeBtn = document.getElementById("themeBtn");
const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const scoreDrawText = document.getElementById("scoreDraw");
const playerOName = document.getElementById("playerOName");

cells.forEach(cell=>{
    cell.addEventListener("click",()=>{
        let index=Number(cell.dataset.index);
        if(!gameActive||board[index]!=="") return;
        if(gameMode==="ai"&&currentPlayer!=="X") return;
        makeMove(index,currentPlayer);
        let result=checkWinner();
        if(result){finishGame(result); return;}
        changeTurn();
        if(gameMode==="ai"&&currentPlayer==="O"&&gameActive) setTimeout(aiTurn,500);
    });
});

function makeMove(i,p){board[i]=p; cells[i].textContent=p; cells[i].classList.add(p.toLowerCase()); cells[i].disabled=true;}

function checkWinner(){
    for(let pat of winningPatterns){let [a,b,c]=pat; if(board[a]!=""&&board[a]==board[b]&&board[b]==board[c]) return {player:board[a],pattern:pat};}
    if(!board.includes("")) return {player:"draw",pattern:[]};
    return null;
}

function speak(text){
    window.speechSynthesis.cancel();
    let msg=new SpeechSynthesisUtterance(text);
    msg.lang='en-US'; msg.rate=0.9;
    window.speechSynthesis.speak(msg);
}

// ===== FINAL WINNER + LOSER WALA FUNCTION - SIRF EK BAAR HAI =====
function finishGame(result){
    gameActive = false;
    if(result.player === "draw"){
        resultText.textContent = "🤝 It's a Draw!";
        scoreDraw++;
        document.getElementById("celebrationText").textContent = "🤝 It's a Draw!";
        document.getElementById("celebrationSub").textContent = "No Winner - No Loser!";
        document.getElementById("celebration").classList.remove("hidden");
        speak("It's a draw, no winner no loser");
    } else {
        let winner = result.player;
        let loser = winner === "X"? "O" : "X";

        resultText.textContent = `🏆 Player ${winner} Wins!`;
        if(winner==="X") scoreX++; else scoreO++;
        result.pattern.forEach(i=>cells[i].classList.add("winner"));

        document.getElementById("celebrationText").textContent = `🎉 Player ${winner} is Winner! 🎉`;
        document.getElementById("celebrationSub").innerHTML = `Winner: <b style="color:#22c55e">Player ${winner}</b><br>Loser: <b style="color:#ef4444">Player ${loser}</b>`;

        document.getElementById("celebration").classList.remove("hidden");
        startConfetti();
        speak(`Player ${winner} is the winner, Player ${loser} is the loser`);
    }
    updateScore();
    cells.forEach(c=>c.disabled=true);
    statusText.textContent="Game Over";
    turnIcon.textContent="🏆";
}

function closeCelebration(){document.getElementById("celebration").classList.add("hidden"); resetGame();}
function startConfetti(){for(let i=0;i<40;i++){let d=document.createElement("div"); d.className="fall"; d.textContent="🎉"; d.style.left=Math.random()*100+"vw"; d.style.animationDuration=(Math.random()*2+2)+"s"; document.body.appendChild(d); setTimeout(()=>d.remove(),4000);}}
function changeTurn(){currentPlayer=currentPlayer==="X"?"O":"X"; updateStatus();}
function updateStatus(){
    if(!gameActive) return;
    if(gameMode==="ai"){
        if(currentPlayer==="X"){statusText.textContent="Your Turn"; turnIcon.textContent="❌";}
        else{statusText.textContent="AI Thinking..."; turnIcon.textContent="🤖";}
    }else{
        statusText.textContent=`Player ${currentPlayer}'s Turn`;
        turnIcon.textContent=currentPlayer==="X"?"❌":"⭕";
    }
}
function aiTurn(){if(!gameActive) return; let m=difficulty==="easy"?randomMove():difficulty==="medium"?mediumMove():hardMove(); if(m===null) return; makeMove(m,"O"); let r=checkWinner(); if(r){finishGame(r); return;} changeTurn();}
function randomMove(){let e=getEmptyCells(); return e.length?e[Math.floor(Math.random()*e.length)]:null;}
function mediumMove(){let m=findWinningMove("O"); if(m!==null) return m; m=findWinningMove("X"); if(m!==null) return m; if(board[4]==="") return 4; return randomMove();}
function hardMove(){let bs=-Infinity,bm=null; for(let i of getEmptyCells()){board[i]="O"; let s=minimax(board,0,false); board[i]=""; if(s>bs){bs=s; bm=i;}} return bm;}
function minimax(s,d,isMax){let w=getWinnerForBoard(s); if(w==="O") return 10-d; if(w==="X") return d-10; if(!s.includes("")) return 0; if(isMax){let b=-Infinity; for(let i=0;i<9;i++){if(s[i]===""){s[i]="O"; b=Math.max(b,minimax(s,d+1,false)); s[i]="";}} return b;}else{let b=Infinity; for(let i=0;i<9;i++){if(s[i]===""){s[i]="X"; b=Math.min(b,minimax(s,d+1,true)); s[i]="";}} return b;}}
function findWinningMove(p){for(let pat of winningPatterns){let v=pat.map(i=>board[i]); if(v.filter(x=>x===p).length===2&&v.filter(x=>x==="").length===1) return pat.find(i=>board[i]==="");} return null;}
function getEmptyCells(){return board.map((v,i)=>v===""?i:null).filter(i=>i!==null);}
function getWinnerForBoard(s){for(let pat of winningPatterns){let [a,b,c]=pat; if(s[a]!=""&&s[a]==s[b]&&s[b]==s[c]) return s[a];} return null;}
function updateScore(){scoreXText.textContent=scoreX; scoreOText.textContent=scoreO; scoreDrawText.textContent=scoreDraw;}
function resetGame(){board=["","","","","","","","",""]; currentPlayer="X"; gameActive=true; resultText.textContent=""; cells.forEach(c=>{c.textContent=""; c.disabled=false; c.classList.remove("x","o","winner");}); updateStatus();}
twoPlayerBtn.addEventListener("click",()=>{gameMode="twoPlayer"; twoPlayerBtn.classList.add("active"); aiBtn.classList.remove("active"); difficultyBox.classList.add("hidden"); playerOName.textContent="PLAYER O"; resetGame();});
aiBtn.addEventListener("click",()=>{gameMode="ai"; aiBtn.classList.add("active"); twoPlayerBtn.classList.remove("active"); difficultyBox.classList.remove("hidden"); playerOName.textContent="AI"; resetGame();});
difficultySelect.addEventListener("change",()=>{difficulty=difficultySelect.value; resetGame();});
restartBtn.addEventListener("click",resetGame);
themeBtn.addEventListener("click",()=>{document.body.classList.toggle("light"); themeBtn.textContent=document.body.classList.contains("light")?"☀️ Theme":"🌙 Theme";});
updateStatus(); updateScore();