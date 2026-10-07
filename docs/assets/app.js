'use strict';
const steps = {
  find: [
    { label: 'Topic card', file: 'screens/topic-card.html?v=f2d70548', caption: 'A topic card: Worried about money' },
    { label: 'Scripture & context', file: 'screens/what-god-says.html?v=18079adc', caption: 'Read Scripture in its context' },
    { label: 'Topics', file: 'screens/topics.html?v=b842ba28', caption: 'Explore 90 topics in 10 categories' },
    { label: 'Whole chapter', file: 'screens/chapter.html?v=6a1cec21', caption: 'Read the whole chapter in its place' }
  ],
  pray: [
    { label: 'Private journal', file: 'screens/journal.html?v=8f46037b', caption: 'Write down what you are carrying' },
    { label: 'For someone I love', file: 'screens/for-someone.html?v=4e86f794', caption: 'A prayer for someone you love' }
  ],
  return: [
    { label: 'Timeline', file: 'screens/08-timeline.html?v=d3f3725e', caption: 'Look back on how things changed' },
    { label: 'Check-in', file: 'screens/07-check-in.html?v=36f2358c', caption: 'A few days later: How is it now?' }
  ]
};
let activeStep = 'find';
const stepButtons = [...document.querySelectorAll('[data-step]')];
const frame = document.querySelector('#journey-frame');
const choicesContainer = document.querySelector('.screen-choices');
function renderScreenChoices() {
  choicesContainer.replaceChildren(...steps[activeStep].map((screen, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.screen = String(index);
    button.textContent = screen.label;
    button.setAttribute('aria-pressed', String(index === 0));
    return button;
  }));
}
function showScreen(index) {
  const screen = steps[activeStep][index];
  frame.src = screen.file;
  frame.title = 'App preview: ' + screen.caption;
  document.querySelector('#journey-caption').textContent = screen.caption;
  choicesContainer.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}
function showStep(button) {
  activeStep = button.dataset.step;
  stepButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#journey-panel').setAttribute('aria-labelledby', button.id);
  renderScreenChoices();
  showScreen(0);
}
stepButtons.forEach((button, index) => {
  button.addEventListener('click', () => showStep(button));
  button.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % stepButtons.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + stepButtons.length) % stepButtons.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = stepButtons.length - 1;
    if (target !== undefined) { event.preventDefault(); stepButtons[target].focus(); showStep(stepButtons[target]); }
  });
});
choicesContainer.addEventListener('click', event => {
  const button = event.target.closest('[data-screen]');
  if (button) showScreen(Number(button.dataset.screen));
});

document.querySelectorAll('[data-preview-step]').forEach(link => {
  link.addEventListener('click', () => {
    const step = stepButtons.find(button => button.dataset.step === link.dataset.previewStep);
    if (step) {
      showStep(step);
      if (Number(link.dataset.previewScreen) !== 0) showScreen(Number(link.dataset.previewScreen));
    }
  });
});

// Restore the original reading motion while keeping the phone preview contained.
// Hover is optional; touch, keyboard and the visible control can toggle the same preview.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.device').forEach(phone => {
  const glass = document.createElement('span');
  glass.className = 'phone-glass';
  glass.setAttribute('aria-hidden', 'true');
  phone.append(glass);
  const phoneFrame = phone.querySelector('iframe');
  const motionButton = phoneFrame.id === 'journey-frame' ? document.querySelector('.screen-motion-toggle') : null;
  let playing = false;
  const setPlaying = value => {
    playing = value;
    phone.setAttribute('aria-pressed', String(value));
    phoneFrame.contentDocument?.documentElement?.classList.toggle('play', value);
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(value));
      motionButton.textContent = value ? 'Back to top' : 'Scroll screen';
    }
  };
  phoneFrame.addEventListener('load', () => setPlaying(false));
  phone.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !reduceMotion.matches) setPlaying(true); });
  phone.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') setPlaying(false); });
  phone.addEventListener('click', () => setPlaying(!playing));
  phone.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPlaying(!playing); }
  });
  motionButton?.addEventListener('click', () => setPlaying(!playing));
});

