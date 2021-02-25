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
    // get task ID
    if (localStorage.getItem("taskID") == null) {
        localStorage.setItem("taskID", 0);
    }
    var taskID = localStorage.getItem("taskID");
    // if task list is empty create task list
    if (localStorage.getItem("tasks") == null) {
        localStorage.setItem("tasks", JSON.stringify({ tasks: [] }));
    }
    //read new task, JSONify and add task ID
    var task = $('#addTaskForm').serializeArray();
    task = task.reduce(function (acc, cur, i) {
        acc[cur.name] = cur.value;
        return acc;
    }, {});
    task['taskID'] = taskID
    //read task list, push new task, sort list by prio
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks['tasks'].push(task);
    tasks['tasks'] = tasks['tasks'].sort(function (obj1, obj2) {
        return obj2.priority - obj1.priority;
    });
    //set new task list, iterate task ID
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskID", parseInt(taskID) + 1);
}

function editTask(taskID) {

    //read new task, JSONify and add task ID
    var task = $('#' + taskID + "-form").serializeArray();
    console.log(task);
    task = task.reduce(function (acc, cur, i) {
        acc[cur.name] = cur.value;
        return acc;
    }, {});
    console.log(task);
    task['taskID'] = taskID;
    //delete old task with same ID, push new task, sort list by prio
    deleteTask(taskID);
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks['tasks'].push(task);
    tasks['tasks'] = tasks['tasks'].sort(function (obj1, obj2) {
        return obj2.priority - obj1.priority;
    });
    //set new task list
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload();
}

function deleteTask(taskID) {
    //remove task from collection as well as modal html
    $("." + taskID).remove();
    //pull local storage tasks, iterate and find task to delete by ID, splice it out
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let [i, task] of tasks['tasks'].entries()) {
        if (task.taskID == taskID) {
            tasks['tasks'].splice(i, 1);
        }
    }
    //push new tasks to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


$(document).ready(function () {
    M.AutoInit();
    $('#start-stop-btn').click(function () {
        $('#start-stop-btn').text($('#start-stop-btn').text() == "Start" ? "Stop" : "Start");
    });
});
