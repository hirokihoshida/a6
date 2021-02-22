$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();
    $('#start-stop-btn').click(function(){
      $('#start-stop-btn').text($('#start-stop-btn').text() == "Start" ? "Stop" : "Start");
    });
  });