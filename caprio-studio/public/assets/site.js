const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
menuButton?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
const form = document.querySelector('#quote-form');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type="submit"]');
  const output = document.querySelector('#quote-result');
  const body = Object.fromEntries(new FormData(form));
  button.disabled = true; button.textContent = 'Sending…';
  output.hidden = false; output.textContent = 'Submitting your inquiry…';
  try {
    const response = await fetch('/api/quote', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Unable to send your message.');
    output.textContent = 'Thank you! Your project inquiry has been submitted.';
    form.reset();
  } catch (error) {
    const copy = `Caprio Studio project inquiry\n\n${Object.entries(body).filter(([k])=>k!=='website').map(([k,v])=>`${k}: ${v}`).join('\n')}`;
    output.textContent = `${error.message}\n\nYou can save this inquiry for later:\n\n${copy}`;
  } finally { button.disabled = false; button.textContent = 'Send inquiry ↗'; }
});
