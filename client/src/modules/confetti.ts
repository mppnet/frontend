import { getClient } from '../util/state';
import { openModal, closeModal } from '../util/modal';
import type { ConfettiParticle } from '../types';
import { i18next, i18nextify } from '../util/translations';

export function initConfetti(): void {
  const gClient = getClient();

  let maxParticleCount = 500;
  let particleSpeed = 2;
  let streamingConfetti = false;
  let animationTimer: number | null = null;
  let particles: ConfettiParticle[] = [];
  let waveAngle = 0;
  const colors = ['DodgerBlue', 'OliveDrab', 'Gold', 'Pink', 'SlateBlue', 'LightBlue', 'Violet', 'PaleGreen', 'SteelBlue', 'SandyBrown', 'Chocolate', 'Crimson'];

  function resetParticle(particle: Partial<ConfettiParticle>, width: number, height: number): ConfettiParticle {
    particle.color = colors[(Math.random() * colors.length) | 0];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;
    return particle as ConfettiParticle;
  }

  function startConfetti() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.setAttribute('style', 'display:block;z-index:999999;pointer-events:none;position:absolute;top:0;left:0');
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener('resize', () => { canvas!.width = window.innerWidth; canvas!.height = window.innerHeight; }, true);
    }
    const context = canvas.getContext('2d')!;
    while (particles.length < maxParticleCount) particles.push(resetParticle({}, width, height));
    streamingConfetti = true;
    if (animationTimer === null) {
      (function runAnimation() {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (particles.length === 0) animationTimer = null;
        else { updateParticles(); drawParticles(context); animationTimer = requestAnimationFrame(runAnimation); }
      })();
    }
  }
  function stopConfetti() { streamingConfetti = false; }
  function removeConfetti() { stopConfetti(); particles = []; }

  function drawParticles(context: CanvasRenderingContext2D) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      context.beginPath();
      context.lineWidth = p.diameter;
      context.strokeStyle = p.color;
      context.shadowColor = 'rgba(0, 0, 0, .3)';
      context.shadowBlur = 4;
      context.shadowOffsetY = 2;
      context.shadowOffsetX = 0;
      const x = p.x + p.tilt;
      context.moveTo(x + p.diameter / 2, p.y);
      context.lineTo(x, p.y + p.tilt + p.diameter / 2);
      context.stroke();
    }
  }

  function updateParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    waveAngle += 0.01;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!streamingConfetti && p.y < -15) p.y = height + 100;
      else {
        p.tiltAngle += p.tiltAngleIncrement;
        p.x += Math.sin(waveAngle);
        p.y += (Math.cos(waveAngle) + p.diameter + particleSpeed) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;
      }
      if (p.x > width + 20 || p.x < -20 || p.y > height) {
        if (streamingConfetti && particles.length <= maxParticleCount) resetParticle(p, width, height);
        else { particles.splice(i, 1); i--; }
      }
    }
  }

  if (window !== top) {
    alert('Hey, it looks like you\'re visiting our site through another website. Consider playing Multiplayer Piano directly at https://multiplayerpiano.net');
  }

  (async () => {
    const translationIdsWithNames = [{"code":"bg","name":"Bulgarian","native":"Български"},{"code":"cs","name":"Czech","native":"Česky"},{"code":"de","name":"German","native":"Deutsch"},{"code":"en","name":"English","native":"English"},{"code":"es","name":"Spanish","native":"Español"},{"code":"fr","name":"French","native":"Français"},{"code":"hu","name":"Hungarian","native":"Magyar"},{"code":"is","name":"Icelandic","native":"Íslenska"},{"code":"ja","name":"Japanese","native":"日本語"},{"code":"ko","name":"Korean","native":"한국어"},{"code":"lv","name":"Latvian","native":"Latviešu"},{"code":"nb","name":"Norwegian Bokmål","native":"Norsk bokmål"},{"code":"nl","name":"Dutch","native":"Nederlands"},{"code":"pl","name":"Polish","native":"Polski"},{"code":"pt","name":"Portuguese","native":"Português"},{"code":"ru","name":"Russian","native":"Русский"},{"code":"sk","name":"Slovak","native":"Slovenčina"},{"code":"sv","name":"Swedish","native":"Svenska"},{"code":"tr","name":"Turkish","native":"Türkçe"},{"code":"zh","name":"Chinese","native":"中文"}];
    const languages = document.getElementById('languages')!;

    function createTranslationOptions() {
      translationIdsWithNames.forEach((z) => {
        const option = document.createElement('option');
        option.value = z.code;
        option.innerText = z.native;
        if (z.code === i18next.language.split('-')[0]) option.selected = true;
        option.setAttribute('translated', '');
        languages.appendChild(option);
      });
    }

    if (i18next.isInitialized) createTranslationOptions();
    else i18next.on('initialized', () => { createTranslationOptions(); });

    document.getElementById('lang-btn')!.addEventListener('click', () => { openModal('#language'); });
    document.querySelector('#language > button')!.addEventListener('click', async () => {
      await i18next.changeLanguage((document.querySelector('#languages') as HTMLSelectElement).selectedOptions[0].value);
      i18nextify.forceRerender();
      closeModal();
    });
  })();

  gClient.start();
}
