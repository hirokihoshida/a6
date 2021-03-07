//convert seconds to H:M:S
function secondsToTime(s) {
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var m = Math.floor(s / 60);
    s -= m * 60;
    return (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
}



//0 = stopped, 1 = focus, 2 = short break, 3 = long break
var timerState = 0;

function buttonClicked() {
    if (timerState == 0) {
        $('#start-stop-btn').text("Stop Focus");
        startFocus();
    } else if (timerState == 1) {
        timerState == 0;
        $('#start-stop-btn').text("Start Focus");
        stopTimer();
    } else if (timerState == 2) {
        $('#start-stop-btn').text("Start Focus");
        timerState == 0;
        stopTimer();
    } else if (timerState == 3) {
        $('#start-stop-btn').text("Start Focus");
        timerState == 0;
        stopTimer();
    }
}

//setInterval object
var timerID;
//time that shows visually
var timer = 0;
//time needed for current task
var timeNeeded;
//time completed after current focus session
var timeCompleted;


//starts timer for focus, after finished, checks if task is done. if so, start long break. else, start short break
function startFocus() {
    //default focus time, tasks list
    var focusTime = localStorage.getItem("focusTime");
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    
    //if tasks list is empty, show no tasks are available and stop
    if (tasks['tasks'].length == 0) {
        $('#start-stop-btn').removeClass("green").addClass("red");
        $('#start-stop-btn').text("No Tasks!");
        $('.menu-btn').removeClass("disabled");
        return;
    }
    //visual button changes
    $('.menu-btn').addClass("disabled");
    $('#start-stop-btn').text("Stop Focus");
    $('#info-banner').text("Currently Focused on " + tasks['tasks'][0]['taskName']);

    timerState = 1;

    //get minutes required of current task
    var taskID = tasks['tasks'][0]['taskID'];
    timeNeeded = parseInt(tasks['tasks'][0]['minutes']) * 60;
    //if time needed is less than focustime, set the timer to time needed ex: default focus time is 25, but there is 10 remaining for current task
    if (timer <= 0) {
        if (timeNeeded < focusTime) {
            timer = timeNeeded;
        } else {
            timer = focusTime;
        }
    }
    //time that would be completed once timer runs out, subtracts it from task later
    timeCompleted = timer;

    //start focus timer
    timerID = setInterval(function () {
        //visual update time
        $('#time').html(secondsToTime(timer));
        timer -= 1
        //if timer is done, delete timer
        if (timer < 0) {
            timer = 0;
            clearInterval(timerID);
            //if time needed for current task is 0, delete task
            //else, subtract time completed from time needed
            //start short or long break depending on whether task finished
            timeNeeded = timeNeeded - timeCompleted;
            if (timeNeeded <= 0) {
                $('#info-banner').text("Taking a Break After Finishing " + tasks['tasks'][0]['taskName']);
                deleteTask(taskID.toString());
                var tasksRemaining = JSON.parse(localStorage.getItem("tasks"));
                //if all tasks are done, finish
                if (tasksRemaining['tasks'].length == 0) {
                    $('#info-banner').text("You Finished All Your Tasks!");
                    buttonClicked();
                    stopTimer();
                    return;
                }
                startBreakLong();
            } else {
                tasks['tasks'][0]['minutes'] = Math.floor(timeNeeded / 60);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                $('#info-banner').text("Taking a Short Break From " + tasks['tasks'][0]['taskName']);
                startBreakShort();
            }
        }
    //interval, remove for fast timer (debug)
    }, 1000)
}

//starts timer for short break when task currently being worked on is not done
function startBreakShort() {
    timerState = 2;
    $('#start-stop-btn').text("Stop Short Break");
    var breakShortTime = localStorage.getItem("breakShortTime");
    timer = breakShortTime;
    timerID = setInterval(function () {
        //write time
        $('#time').html(secondsToTime(timer));
        timer -= 1
        //if timer is done, delete timer, start focus
        if (timer < 0) {
            clearInterval(timerID);
            startFocus();
        }
        //debug timer
    }, 1000)
}

//starts timer for long break between task completions
function startBreakLong() {
    timerState = 3;
    $('#start-stop-btn').text("Stop Long Break");
    var breakLongTime = localStorage.getItem("breakLongTime");
    timer = breakLongTime
    timerID = setInterval(function () {
        //write time
        $('#time').html(secondsToTime(timer));
        timer -= 1
        //if timer is done, delete timer, start focus
        if (timer < 0) {
            clearInterval(timerID);
            startFocus();
        }
        //debug timer
    }, 1000)
}

//stops timer when stop button clicked. depending on state of timer, change actions
function stopTimer() {
    //reenable disabled buttons
    $('.menu-btn').removeClass("disabled");
    //if currently in focus mode, remove partially completed time from task
    if (timerState == 1) {
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        if (timeNeeded - (timeCompleted - timer) >= 0) {
            timeNeeded = timeNeeded - (timeCompleted - timer);
            tasks['tasks'][0]['minutes'] = Math.floor(timeNeeded / 60);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else {
            tasks['tasks'][0]['minutes'] = Math.floor(timeNeeded / 60);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    //if on break, just cancel break
    } else if (timerState == 2 || timerState == 3) {
        timer = 0;
    }
    //stop timer
    clearInterval(timerID);
    timerState = 0;
}

//if default timings are updated from Settings page, change values in localStorage here
function saveTiming() {
    var timings = $('#settings-form').serializeArray();
    timings = timings.reduce(function (acc, cur, i) {
        acc[cur.name] = cur.value;
        return acc;
    }, {});
    localStorage.setItem("focusTime", timings['focusTime'] * 60);
    localStorage.setItem("breakShortTime", timings['breakShortTime'] * 60);
    localStorage.setItem("breakLongTime", timings['breakLongTime'] * 60);
}

//if reset button is pressed in Settings
function resetTiming() {
    localStorage.setItem("focusTime", 60 * 25);
    localStorage.setItem("breakShortTime", 60 * 5);
    localStorage.setItem("breakLongTime", 60 * 10);
    location.reload();
}

//adding a task with Create Task button and modal
function addTask() {
    // get task ID
    if (localStorage.getItem("taskID") == null) {
        localStorage.setItem("taskID", 0);
    }
    var taskID = localStorage.getItem("taskID");

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

//edit task from Schedule page
function editTask(taskID) {
    //read new task, JSONify and add task ID
    var task = $('#' + taskID + "-form").serializeArray();
    task = task.reduce(function (acc, cur, i) {
        acc[cur.name] = cur.value;
        return acc;
    }, {});
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

//if task is deleted from edit modal in Schedule page
function deleteTask(taskID) {
    //remove task from collection as well as modal html (visual)
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
    //initialize matCSS js
    M.AutoInit();
    timerState = 0;

    //first time initialization add focus and break times
    if (localStorage.getItem("focusTime") == null) {
        localStorage.setItem("focusTime", 60 * 25);
        localStorage.setItem("breakShortTime", 60 * 5);
        localStorage.setItem("breakLongTime", 60 * 10);
    }
    $('#time').html(secondsToTime(localStorage.getItem("focusTime")));

    // first time initialization create tasks JSON
    if (localStorage.getItem("tasks") == null) {
        localStorage.setItem("tasks", JSON.stringify({ tasks: [] }));
    }
});
