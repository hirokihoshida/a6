var timerState = 0
var timerTime = 1500

function toggleTimer() {
    if (timerState == 0) {
        timerState = 1;
        $('#time').innerHTML(timerTime)
        console.log("time change")
    } else {
        timerState = 0;
        $('#time').innerHTML(Date())
    }
}

function addTask() {
    if (localStorage.getItem("tasks") == null) {
        localStorage.setItem("tasks", JSON.stringify({tasks: []}));
    }
    var task = $('#addTaskForm').serializeArray();
    task = task.reduce(function(acc, cur, i) {
        acc[cur.name] = cur.value;
        return acc;
      }, {});
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks['tasks'].push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}





$(document).ready(function () {
    M.AutoInit();
    $('#start-stop-btn').click(function () {
        $('#start-stop-btn').text($('#start-stop-btn').text() == "Start" ? "Stop" : "Start");
    });
});
