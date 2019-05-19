let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

document.customForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const mins = this.minutes.value;
    this.reset(); 
    timer(mins * 60);
});

buttons.forEach(button => button.addEventListener('click', startTimer));

function startTimer(amountOfTime) {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

function timer(seconds) {
    clearInterval(countdown); // clear existing timers so it doesn't break.
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(then);
    displayEndTime(then);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds %  60;
    const displayTime = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = displayTime;
    timerDisplay.textContent = displayTime;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be Back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}