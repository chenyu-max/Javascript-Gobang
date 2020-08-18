AI = true;
var debug = false;

function analysisScore(arr) {
    var greater3 = 0;
    var equal3 = 0;
    var greater2 = 0;
    var equal2 = 0;
    var greater1 = 0;
    var equal1 = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] >= 4) {
            return 100;
        }
        if (arr[i] > 3) {
            greater3 += 1;
        } else if (arr[i] == 3) {
            equal3 += 1;
        } else if (arr[i] > 2) {
            greater2 += 1;
        } else if (arr[i] == 2) {
            equal2 += 1;
        } else if (arr[i] > 1) {
            greater1 += 1;
        } else if (arr[i] == 1) {
            equal1 += 1;
        }
    }
    if (greater3 + equal3 > 1) { //双四
        return 95;
    }
    if (greater3 > 0) { //活四
        return 90;
    }
    if (equal3 > 0 && greater2 > 0) { //四三，下一手上活四
        return 85;
    }
    if (greater2 > 1) { //双三
        return 80;
    }
    if (equal3 > 0) { //冲四
        return 60;
    }
    if (greater2 > 0 && equal2 > 0) { //活三 + 眠三
        return 50;
    }
    if (greater2 > 0 && greater1 > 0) { //活三，可继续连招
        return 30;
    }
    if (greater2 > 0) { //活三
        return 25;
    }
    if (greater1 > 1) { //活二
        return 20;
    }
    if (greater1 > 0) { //活二
        return 15;
    }
    if (equal2 > 1) { //多眠三
        return 10;
    }
    if (equal2 > 0) { //眠三
        return 5;
    }
    if (equal1 > 1) { //绝地
        return -1;
    }
    if (equal1 > 0) { //勉强连着
        return 1;
    }
    return 0;
}

function getRealScore(leftRow, leftCol, rightRow, rightCol, val) {
    if (leftRow < 0 || leftRow > 14 || leftCol < 0 || leftCol > 14 || rightRow < 0 || rightRow > 14 || rightCol < 0 || rightCol > 14) {
        return false;
    }
    if ((grid[leftRow][leftCol].value == 0 || grid[leftRow][leftCol].value == val) && (grid[rightRow][rightCol].value == 0 || grid[rightRow][rightCol].value == val)) {
        return true;
    } else {
        return false;
    }
}

function getScore(arr, val) {
    var result = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == 0) {
            continue;
        } else if (arr[i].value == val) {
            result += 1;
        } else {
            return 0;
        }
    }
    return result;
}

function analysisObliUpLine(row, col, val) { //斜上方向分析
    var maxScore = 0;
    for (var i = 0; i < 5; i++) {
        if (row + 4 - i > 14 || row + 4 - i < 4 || col - 4 + i < 0 || col - 4 + i > 10) {
            continue;
        }
        var arr = [];
        for (var j = 0; j < 5; j++) {
            arr.push(grid[row + 4 - i - j][col - 4 + i + j]);
        }
        var score = getScore(arr, val);
        var realPower = getRealScore(row + 5 - i, col - 5 + i, row - i + 1, col + i + 1, val);
        var total = score * (realPower ? 1.1 : 1);
        maxScore = maxScore > total ? maxScore : total;
    }
    return maxScore;
}

function analysisObliDownLine(row, col, val) { //斜下方向分析
    var maxScore = 0;
    for (var i = 0; i < 5; i++) {
        if (row - i + 4 > 14 || row - i < 0 || col - i + 4 > 14 || col - i < 0) {
            continue;
        }
        var arr = [];
        for (var j = 0; j < 5; j++) {
            arr.push(grid[row - i + j][col - i + j]);
        }
        var score = getScore(arr, val);
        var realPower = getRealScore(row - i - 1, col - i - 1, row + 5 - i, col + 5 - i, val);
        var total = score * (realPower ? 1.1 : 1);
        maxScore = maxScore > total ? maxScore : total;
    }
    return maxScore;
}

function analysisColLine(row, col, val) { //纵向分析
    var maxScore = 0;
    for (var i = 0; i < 5; i++) {
        if (row - i + 4 > 14 || row - i < 0) {
            continue;
        }
        var arr = [];
        for (var j = 0; j < 5; j++) {
            arr.push(grid[row - i + j][col]);
        }
        var score = getScore(arr, val);
        var realPower = getRealScore(row - i - 1, col, row - i + 5, col, val);
        var total = score * (realPower ? 1.1 : 1);
        maxScore = maxScore > total ? maxScore : total;
    }
    return maxScore;
}

function analysisRowLine(row, col, val) { //横向分析
    var maxScore = 0;
    for (var i = 0; i < 5; i++) {
        if (col - i + 4 > 14 || col - i < 0) {
            continue;
        }
        var arr = [];
        for (var j = 0; j < 5; j++) {
            arr.push(grid[row][col - i + j]);
        }
        var score = getScore(arr, val);
        var realPower = getRealScore(row, col - 1 - i, row, col + 5 - i, val);
        var total = score * (realPower ? 1.1 : 1);
        maxScore = maxScore > total ? maxScore : total;
    }
    return maxScore;
}

function analysisAttackPoint(x, y) {
    if (grid[x][y].value > 0) {
        return 0;
    }
    var score1 = analysisRowLine(x, y, 2);
    var score2 = analysisColLine(x, y, 2);
    var score3 = analysisObliUpLine(x, y, 2);
    var score4 = analysisObliDownLine(x, y, 2);
    var totalScore = analysisScore([score1, score2, score3, score4]);
    return totalScore;
}

function analysisDefensePoint(x, y) {
    if (grid[x][y].value > 0) {
        return 0;
    }
    var score1 = analysisRowLine(x, y, 1);
    var score2 = analysisColLine(x, y, 1);
    var score3 = analysisObliUpLine(x, y, 1);
    var score4 = analysisObliDownLine(x, y, 1);
    var totalScore = analysisScore([score1, score2, score3, score4]);
    return totalScore;
}

function analysisPowerScore(x, y) {
    var attackPower = 0;
    var defensePower = 0;

    var power = new Array(8);
    power[0] = x - 1 < 0 || y - 1 < 0 ? 0 : grid[x - 1][y - 1].value;
    power[1] = x - 1 < 0 ? 0 : grid[x - 1][y].value;
    power[2] = x - 1 < 0 || y + 1 > 14 ? 0 : grid[x - 1][y + 1].value;
    power[3] = y - 1 < 0 ? 0 : grid[x][y - 1].value;
    power[4] = y + 1 > 14 ? 0 : grid[x][y + 1].value;
    power[5] = x + 1 > 14 || y - 1 < 0 ? 0 : grid[x + 1][y - 1].value;
    power[6] = x + 1 > 14 ? 0 : grid[x + 1][y].value;
    power[7] = x + 1 > 14 || y + 1 > 14 ? 0 : grid[x + 1][y + 1].value;
    for (var i = 0; i < power.length; i++) {
        if (power[i] == 1) {
            defensePower += 1;
        } else if (power[i] == 2) {
            attackPower += 1;
        }
    }
    return [attackPower, defensePower];
}

function compareScore(originType, originScore, originPower, nowType, nowScore, nowPower) {
    if (originScore > nowScore) {
        return true;
    }
    if (originScore == nowScore && originPower > nowPower) {
        return true;
    }
    if (originScore == nowScore && originPower == nowPower && originType == 1) {
        return true;
    }
    return false;
}

function aiAction() {
    var bestGrid = null;
    var maxAttackScore = 0;
    var maxDefenseScore = 0;
    var maxAttackPowerScore = 0;
    var maxDefensePowerScore = 0;
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var attackScore = analysisAttackPoint(i, j);
            var defenseScore = analysisDefensePoint(i, j);
            var powerScore = analysisPowerScore(i, j);
            var attackPowerScore = powerScore[0];
            var defensePowerScore = powerScore[1];
            if (debug) {
                grid[i][j].innerHTML = "" + defenseScore;
            }
            var needChange = false;
            var attVsAtt = compareScore(1, attackScore, attackPowerScore, 1, maxAttackScore, maxAttackPowerScore);
            var attVsDef = compareScore(1, attackScore, attackPowerScore, 2, maxDefenseScore, maxDefensePowerScore);
            if (attVsAtt && attVsDef) {
                needChange = true;
            }
            var defVsAtt = compareScore(2, defenseScore, defensePowerScore, 1, maxAttackScore, maxAttackPowerScore);
            var defVsDef = compareScore(2, defenseScore, defensePowerScore, 2, maxDefenseScore, maxDefensePowerScore);
            if (defVsAtt && defVsDef) {
                needChange = true;
            }
            if (needChange) {
                bestGrid = grid[i][j];
                maxAttackScore = attackScore;
                maxAttackPowerScore = attackPowerScore;
                maxDefenseScore = defenseScore;
                maxDefensePowerScore = defensePowerScore
            }
        }
    }
    if (bestGrid == null) {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j].value == 0) {
                    bestGrid = grid[i][j];
                    break;
                }
            }
        }
    }
    if (bestGrid == null) {
        alert("平局了");
    }
    setTimeout(function () {
        bestGrid.click();
    }, 20);
}

var debugBtn = document.createElement("button");
debugBtn.innerHTML = "开启调试模式(已关闭)";
debugBtn.style.display = "block";
debugBtn.style.position = "relative";
debugBtn.style.margin = "20px auto";
debugBtn.onclick = function () {
    if (debug) {
        debug = false;
        debugBtn.innerHTML = "开启调试模式(已关闭)";
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                grid[i][j].innerHTML = "";
            }
        }
    } else {
        debug = true;
        debugBtn.innerHTML = "开启调试模式(已开启)";
    }
}
document.body.appendChild(debugBtn);