import '../css/common.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';
document.body.style.backgroundColor = '#ffcc99';

const refs = {
  btnStart: document.querySelector('button[data-start]'),
  calendar: document.querySelector('#datetime-picker'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;

let intervalId = null;
let selectedDate = null;
let currentDate = null;

flatpickr(refs.calendar, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      Report.failure('Please choose a date in the future');
    } else {
      selectedDate = selectedDates[0].getTime();
      refs.btnStart.disabled = false;
    }
    console.log(selectedDates[0]);
  },
});

const timer = {
  start() {
    intervalId = setInterval(() => {
      currentDate = new Date().getTime();
      const deltaTime = selectedDate - currentDate;
      updateTimerface(convertMs(deltaTime));

      if (deltaTime <= 1000) {
        this.stop();
        Report.info('Timer stopped!');
        return;
      }
    }, 1000);
  },

  stop() {
    clearInterval(intervalId);
    this.intervalId = null;
  },
};

refs.btnStart.addEventListener('click', () => {
  timer.start();
});

function updateTimerface({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = `${days}`;
  refs.dataHours.textContent = `${hours}`;
  refs.dataMinutes.textContent = `${minutes}`;
  refs.dataSeconds.textContent = `${seconds}`;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}