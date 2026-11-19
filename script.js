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
const popupCta = document.querySelector('#cta-button');
// Canonical WWM-2 offer. Keep campaign identifiers on the new-tab offer,
// while this tab continues to the editorial article below.
const offerUrl = 'https://www.broevo.com/C42TG9D/M1NBQ79/';
const articleUrl = 'https://www.gamertik.com/arknights-endfield-build-a-future-on-talos-ii/';
let unlocked = false;

function getClickId() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('click_id')) return params.get('click_id');
  try { return sessionStorage.getItem('kuma_click_id') || ''; } catch (e) { return ''; }
}
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
  const clickId = getClickId();
  if (!clickId) { alert('Tracking click_id missing. Open this page from the campaign link.'); return; }
  const url = new URL(offerUrl);
  url.searchParams.set('click_id', clickId);
  const params = new URLSearchParams(window.location.search);
  ['sub1', 'subid'].forEach(key => {
    const value = params.get(key);
    if (value) url.searchParams.set(key, value);
  });
  const offerTab = window.open('about:blank', '_blank');
  if (!offerTab) {
    alert('Please allow pop-ups to continue to the offer.');
    return;
  }
  offerTab.opener = null;
  offerTab.location.replace(url.toString());
  window.location.replace(articleUrl);
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
