import vraagHTML from './vraag.html?raw';
import './vraag.css';

export function createVraag(): string {
  return vraagHTML;
}

export function initVraag(): void {
  const form = document.querySelector<HTMLFormElement>('.vraag-form');
  if (!form || form.dataset.initialized === 'true') return;

  const submitButton = form.querySelector<HTMLButtonElement>('.vraag-submit');
  const feedback = form.querySelector<HTMLElement>('.vraag-feedback');
  const phoneInput = form.elements.namedItem('telefoon') as HTMLInputElement | null;

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const raw = phoneInput.value;
      const hasLeadingPlus = raw.startsWith('+');
      const digitsOnly = raw.replace(/\D+/g, '');
      phoneInput.value = hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      naam: (form.elements.namedItem('naam') as HTMLInputElement | null)?.value.trim() ?? '',
      voornaam: (form.elements.namedItem('voornaam') as HTMLInputElement | null)?.value.trim() ?? '',
      email: (form.elements.namedItem('email') as HTMLInputElement | null)?.value.trim() ?? '',
      telefoon: (form.elements.namedItem('telefoon') as HTMLInputElement | null)?.value.trim() ?? '',
      adres: (form.elements.namedItem('adres') as HTMLInputElement | null)?.value.trim() ?? '',
      woonplaats: (form.elements.namedItem('woonplaats') as HTMLInputElement | null)?.value.trim() ?? '',
      bericht: (form.elements.namedItem('bericht') as HTMLTextAreaElement | null)?.value.trim() ?? '',
    };

    if (!payload.naam || !payload.email || !payload.bericht) {
      if (feedback) {
        feedback.textContent = 'Vul minimaal Naam, E-mail en Bericht in.';
        feedback.style.color = '#b42318';
      }
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!isValidEmail) {
      if (feedback) {
        feedback.textContent = 'Voer een geldig e-mailadres in.';
        feedback.style.color = '#b42318';
      }
      return;
    }

    if (payload.telefoon && !/^\+?\d+$/.test(payload.telefoon)) {
      if (feedback) {
        feedback.textContent = 'Telefoon mag enkel cijfers bevatten, met optioneel + vooraan.';
        feedback.style.color = '#b42318';
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Versturen...';
    }

    try {
      const response = await fetch('/admin/api/save-vraag.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let result: { success?: boolean; error?: string } = {};
      try {
        result = JSON.parse(raw);
      } catch {
        throw new Error('Server gaf geen geldige JSON terug. Start `npm run dev:full` zodat PHP API calls correct werken.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Onbekende fout bij versturen.');
      }

      form.reset();
      if (feedback) {
        feedback.textContent = 'Bedankt! Je bericht is succesvol verzonden.';
        feedback.style.color = '#067647';
      }
    } catch (error) {
      if (feedback) {
        feedback.textContent = error instanceof Error ? error.message : 'Er ging iets mis bij het verzenden.';
        feedback.style.color = '#b42318';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Verstuur';
      }
    }
  });

  form.dataset.initialized = 'true';
}