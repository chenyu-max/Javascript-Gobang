var chess; //棋盘对象
var grid; //二维数组，记录棋盘点是否有棋子，什么棋子
var chessWidth = 15; //棋盘格数
var count = 0; //棋子数，根据棋子数判定当前该是白棋还是黑棋
var block = false; //点击时间锁
var AI = false; //AI开关
function createGrid(x, y) { //创建棋盘节点div
    var temp = document.createElement("div");
    temp.classList.add("grid");
    temp.style.left = (7 + x * 50) + "px";
    temp.style.top = (7 + y * 50) + "px";
    temp.x = x;
    temp.y = y;
    temp.value = 0; //0为空位，1为黑子，2为白子
    return temp;
}

function checkLine(x, y) { //检查是否横向，纵向，斜上，斜下构成五子
    var result1 = 3,
        result2 = 3,
        result3 = 3,
        result4 = 3;
    for (var i = 0; i < 5; i++) {
        // 按位与
        result1 &= y + i > 14 ? 0 : grid[x][y + i].value; //判断横向五子
        result2 &= x + i > 14 ? 0 : grid[x + i][y].value; //判断纵向五子
        result3 &= x + i > 14 || y - i < 0 ? 0 : grid[x + i][y - i].value; //判断斜上五子
        result4 &= x + i > 14 || y + i > 14 ? 0 : grid[x + i][y + i].value; //判断斜下五子
    }
    // 按位或
    return result1 | result2 | result3 | result4;
}

function checkFinish() { //检查是否有获胜的一方
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value == 0) {
                continue;
            }
            var result = checkLine(i, j);
            if (result > 0) {
                return result;
            }
        }
    }
    return 0;
}

function init() { //初始化方法
    grid = new Array(chessWidth);
    for (var i = 0; i < grid.length; i++) { //初始化二维棋盘
        grid[i] = new Array(chessWidth);
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j] = createGrid(j, i);
            grid[i][j].onclick = function () { //棋盘节点点击事件
                if (this.value > 0 || block) { //被锁住时或者已有棋子时直接return
                    return;
                }
                block = true; //开启锁
                this.style.backgroundImage = "url('./img/" + (count % 2 + 1) + ".png')"; //将节点背景更换，根据count计算当前时白子还是黑子。
                this.value = count % 2 + 1; //设置节点的value
                count += 1; //棋盘棋子数+1
                var result = checkFinish(); //检查是否结束
                if (result == 0) { //没结束
                    if (AI && count % 2 == 1) { //判断是否有AI
                        block = false; //关闭锁
                        aiAction(); //AI落子
                    }
                    block = false; //关闭锁
                } else { //结束了
                    setTimeout(function () {
                        alert(result == 1 ? "黑棋胜" : "白棋胜"); //弹出获胜方
                    }, 200);
                }
            }
            chess.appendChild(grid[i][j]);
        }
    }
}
window.onload = function () {
    chess = document.getElementById("chess");
    init();
}
var AIflag = document.getElementById('AIflag');
AIflag.onclick = function () {
    AI = AI == true ? false : true;
    if (AI) {
        AIflag.innerHTML = 'AI对战:开';
    } else {
        AIflag.innerHTML = 'AI对战:关';
    }
}