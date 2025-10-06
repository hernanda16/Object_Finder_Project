// ================================================================
// Connect to ROS
var ros = new ROSLIB.Ros({
    url: 'ws://' + '10.7.101.232' + ':9090'
});

ros.on('connection', function () {
    console.log('Connected to websocket server.');
    document.getElementById('status').innerText = 'Connected to ROS';
});

ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
    document.getElementById('status').innerText = 'Error connecting to ROS';
});

ros.on('close', function () {
    console.log('Connection to websocket server closed.');
    document.getElementById('status').innerText = 'Disconnected from ROS';
});
// ================================================================
// Global variables
var isFinding = false;
var isNext = false;

// ================================================================
// ROS
var objekPublisher = new ROSLIB.Topic({
    ros: ros,
    name: '/objek',
    messageType: 'std_msgs/String'
});

var hasilSubscriber = new ROSLIB.Topic({
    ros: ros,
    name: '/hasil',
    messageType: 'std_msgs/String'
});

hasilSubscriber.subscribe(function (message) {
    if (!isFinding) return;

    isFinding = false;
    var resultBox = document.getElementById('resultBox');
    var resultText = document.getElementById('resultText');
    var resultBadge = document.getElementById('resultBadge');

    resultText.innerText = message.data;
    resultBadge.innerText = '✓';
    resultBox.classList.remove('loading');

    isNext = false;
    document.getElementById('nextBtn').className = 'primary';
    document.getElementById('findBtn').className = 'ghost';
    document.getElementById('findRecBtn').className = 'ghost';
});

// ================================================================
// UI elements
document.getElementById('reloadBtn').addEventListener('click', function () {
    location.reload();
});

document.getElementById('nextBtn').addEventListener('click', function () {
    var selectedObject = document.getElementById('objectSelect').value;
    if (selectedObject === "" || isNext) return;

    document.getElementById('recInput').value = 'glass';

    isNext = true;
    document.getElementById('nextBtn').className = 'ghost';
    document.getElementById('findBtn').className = 'primary';
    document.getElementById('findRecBtn').className = 'primary';
});

document.getElementById('findBtn').addEventListener('click', function () {
    if (!isNext) return;

    var selectedObject = document.getElementById('objectSelect').value;
    console.log(selectedObject);

    if (selectedObject === "" || isFinding) return;
    // =============================================================
    var msg = new ROSLIB.Message({
        data: selectedObject
    });

    objekPublisher.publish(msg);
    console.log('Published: ' + selectedObject);
    // =============================================================
    var resultBox = document.getElementById('resultBox');
    var resultText = document.getElementById('resultText');
    var resultBadge = document.getElementById('resultBadge');

    // Show loading state
    resultBox.classList.add('loading');
    resultText.innerText = 'Mencari...';
    resultBadge.innerText = '-';

    isFinding = true;
});

document.getElementById('findRecBtn').addEventListener('click', function () {
    if (!isNext) return;

    var recInput = document.getElementById('recInput').value.trim();
    console.log(recInput);

    if (recInput === "" || isFinding) return;
    // =============================================================
    var msg = new ROSLIB.Message({
        data: recInput
    });

    objekPublisher.publish(msg);
    console.log('Published: ' + recInput);
    // =============================================================
    var resultBox = document.getElementById('resultBox');
    var resultText = document.getElementById('resultText');
    var resultBadge = document.getElementById('resultBadge');

    // Show loading state
    resultBox.classList.add('loading');
    resultText.innerText = 'Mencari...';
    resultBadge.innerText = '-';

    isFinding = true;
});