var audio = document.getElementById('playback');
var segmentEnd;

audio.addEventListener('timeupdate', function (){
    console.log(audio.currentTime);
    if (segmentEnd && audio.currentTime >= segmentEnd) {
        audio.pause();
    }   
}, false);

function playSegment(startTime, endTime){
    segmentEnd = endTime;
    audio.currentTime = startTime;
    audio.play();
}