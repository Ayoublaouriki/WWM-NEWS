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
const leadForm = document.querySelector('#lead-form');
const leadEmail = document.querySelector('#lead-email');
const leadConsent = document.querySelector('#lead-consent');
const leadStatus = document.querySelector('#lead-status');
// Use the tracker click endpoint so the stored campaign click forwards sub1
// to the configured offer.
const trackerClickUrl = 'https://trk.gameroza.com/lp/click.php';
const leadEndpoint = 'https://trk.gameroza.com/api/leads.php';
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
async function saveLead(clickId) {
  const email = leadEmail.value.trim();
  if (!leadForm.reportValidity()) return false;
  leadStatus.textContent = 'Saving…';
  try {
    const response = await fetch(leadEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, click_id: clickId, consent: leadConsent.checked, source_page: location.href})
    });
    if (!response.ok) throw new Error('lead request failed');
    leadStatus.textContent = '';
    return true;
  } catch (_) {
    leadStatus.textContent = 'Could not save your email. Please try again.';
    return false;
  }
}
async function launchOffer() {
  const clickId = getClickId();
  if (!clickId) { alert('Tracking click_id missing. Open this page from the campaign link.'); return; }
  const url = new URL(trackerClickUrl);
  url.searchParams.set('click_id', clickId);
  const offerTab = window.open('about:blank', '_blank');
  if (!offerTab) {
    alert('Please allow pop-ups to continue to the offer.');
    return;
  }
  if (!(await saveLead(clickId))) {
    offerTab.close();
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
