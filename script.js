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
// Always send CTA clicks through TRACKZIN so the click is recorded and the
// offer receives the click id as sub1. Never link the affiliate URL directly.
const trackerClickUrl = 'https://trk.gameroza.com/lp/click.php';
const bridgeUrl = 'https://www.gamertik.com/arknights-endfield-build-a-future-on-talos-ii/';
let unlocked = false;

function getClickId() {
  const fromUrl = new URLSearchParams(location.search).get('click_id');
  if (fromUrl) return fromUrl;
  try {
    const fromSession = sessionStorage.getItem('kuma_click_id');
    if (fromSession) return fromSession;
  } catch (_) { /* storage can be unavailable in private browsing */ }
  const cookie = document.cookie.split('; ').find(row => row.startsWith('kuma_click_id='));
  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
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
  if (!clickId) {
    window.alert('Tracking click_id is missing. Open this page from the campaign tracking link.');
    return;
  }
  const clickUrl = new URL(trackerClickUrl);
  clickUrl.searchParams.set('click_id', clickId);
  window.open(clickUrl.toString(), '_blank', 'noopener,noreferrer');
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
