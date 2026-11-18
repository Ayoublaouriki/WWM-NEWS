const heroBg = document.querySelector('#hero-bg');
heroBg.style.backgroundImage = "url('-PhPyqZg.png')";
const cardTrack = document.querySelector('#cards-track');
const originalCards = [...cardTrack.querySelectorAll('.game-card')];
for (let copy = 0; copy < 2; copy += 1) originalCards.forEach(card => cardTrack.appendChild(card.cloneNode(true)));
const cards = [...cardTrack.querySelectorAll('.game-card')];
const backdrop = document.querySelector('#offer-backdrop');
const heroCta = document.querySelector('#hero-cta');
const closeOffer = document.querySelector('#close-offer');
const swipe = document.querySelector('#swipe');
const swipeBox = document.querySelector('#swipe-box');
const swipeLabel = document.querySelector('#swipe-label');
const popupCta = document.querySelector('#popup-cta');
const offerUrl = new URL('https://www.broevo.com/C42TG9D/M1NBQ79/');
const bridgeUrl = 'https://www.gamertik.com/arknights-endfield-build-a-future-on-talos-ii/';
let unlocked = false;

new URLSearchParams(location.search).forEach((value, key) => offerUrl.searchParams.set(key, value));
cards.forEach(card => card.addEventListener('click', () => {
  cards.forEach(item => item.classList.remove('is-active'));
  card.classList.add('is-active');
  heroBg.style.backgroundImage = `url("${card.dataset.image}")`;
}));
function openPopup() {
  unlocked = false;
  swipe.disabled = false;
  swipe.value = 0;
  swipeBox.style.setProperty('--progress', '0%');
  swipeLabel.textContent = 'SWIPE TO PLAY FREE';
  popupCta.classList.add('is-disabled');
  backdrop.hidden = false;
  swipe.focus();
}
function launchOffer() {
  window.open(offerUrl.toString(), '_blank');
  window.setTimeout(() => location.assign(bridgeUrl), 80);
}
heroCta.addEventListener('click', openPopup);
closeOffer.addEventListener('click', () => { backdrop.hidden = true; });
swipe.addEventListener('input', () => {
  const value = Number(swipe.value);
  swipeBox.style.setProperty('--progress', `${value}%`);
  swipeBox.querySelector('b').style.left = `clamp(5px,calc(${value}% - 50px),calc(100% - 50px))`;
  if (value >= 98) {
    unlocked = true;
    swipe.disabled = true;
    swipeBox.classList.add('is-ready');
    popupCta.classList.remove('is-disabled');
  }
});
popupCta.addEventListener('click', event => {
  event.preventDefault();
  if (unlocked) launchOffer();
});
