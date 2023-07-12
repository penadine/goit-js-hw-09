import { Notify } from 'notiflix/build/notiflix-notify-aio';
document.body.style.backgroundColor = '#ffcc99';

const refs = {
  delayInput: document.querySelector('[name="delay"]'),
  stepInput: document.querySelector('[name="step"]'),
  amountInput: document.querySelector('[name="amount"]'),
  form: document.querySelector('.form'),
};

const options = {
  position: 'center-bottom',
  distance: '15px',
  borderRadius: '15px',
  timeout: 5000,
  clickToClose: true,
  cssAnimationStyle: 'from-left',
};
refs.form.addEventListener('submit', onPromiseCreate);

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onPromiseCreate(e) {
  e.preventDefault();

  let delayInput = Number(refs.delayInput.value);
  let stepInput = Number(refs.stepInput.value);
  let amountInput = Number(refs.amountInput.value);

  for (let i = 1; i <= amountInput; i += 1) {
    if (i === 1) {
      delayInput;
    } else {
      delayInput += stepInput;
    }

    createPromise(i, delayInput)
      .then(({ position, delay }) => {
        Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`,
          options
        );
      })
      .catch(({ position, delay }) => {
        Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`,
          options
        );
      });
    e.currentTarget.reset();
  }
}
