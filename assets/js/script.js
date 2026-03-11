// ============================================================
// CONFIGURAÇÃO — troque pelo seu usuário do GitHub
// ============================================================
const GITHUB_USER = 'AlexandreJulioDev';

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let ringX = 0, ringY = 0;
  let dotX  = 0, dotY  = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
    cursorDot.style.left  = dotX + 'px';
    cursorDot.style.top   = dotY + 'px';
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .skill-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorRing.style.opacity   = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.opacity   = '0.5';
    });
  });
}

// ============================================================
// HEADER — scroll effect + active nav
// ============================================================
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Header background
  if (window.scrollY > 30) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// ============================================================
// MENU MOBILE
// ============================================================
const menuToggle  = document.querySelector('.menu-toggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// TYPED TEXT — efeito de digitação no hero
// ============================================================
const typedEl = document.querySelector('.typed-text');
if (typedEl) {
  const words = ['Full Stack', 'Front-end', 'Back-end', 'JavaScript'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = words[wordIndex];
    typedEl.textContent = current.substring(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 50);
    } else if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 300);
    }
  }

  setTimeout(type, 1000);
}

// ============================================================
// GITHUB — buscar perfil e preencher about + hero
// ============================================================
async function loadGithubProfile() {
  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('Erro ao buscar perfil');
    const data = await res.json();

    // Avatares
    const heroAvatar  = document.getElementById('heroAvatar');
    const aboutAvatar = document.getElementById('aboutAvatar');
    if (heroAvatar)  heroAvatar.src  = data.avatar_url;
    if (aboutAvatar) aboutAvatar.src = data.avatar_url;

    // Stats
    const statFollowers = document.getElementById('statFollowers');
    const statRepos     = document.getElementById('statRepos');
    if (statFollowers) statFollowers.textContent = data.followers;
    if (statRepos)     statRepos.textContent     = data.public_repos;

    // Botão GitHub
    const githubBtn = document.getElementById('githubBtn');
    if (githubBtn) githubBtn.href = data.html_url;

    const allReposBtn = document.getElementById('allReposBtn');
    if (allReposBtn) allReposBtn.href = data.html_url + '?tab=repositories';

  } catch (err) {
    console.warn('GitHub API:', err.message);
  }
}

// ============================================================
// GITHUB — buscar repositórios e montar carrossel
// ============================================================
async function loadProjects() {
  const swiperWrapper = document.getElementById('swiperWrapper');
  if (!swiperWrapper) return;

  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9`);
    if (!res.ok) throw new Error('Erro ao buscar repos');
    const repos = await res.json();

    const langIcons = {
      JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      Python:     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      Java:       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      HTML:       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      CSS:        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      PHP:        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'C#':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
      Go:         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      Kotlin:     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
      Swift:      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    };
    const fallbackIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg';

    // Filtrar repos sem fork e com nome
    const filtered = repos.filter(r => !r.fork).slice(0, 9);

    swiperWrapper.innerHTML = '';

    filtered.forEach(repo => {
      const lang    = repo.language || 'GitHub';
      const icon    = langIcons[lang] || fallbackIcon;
      const name    = repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const desc    = repo.description
        ? (repo.description.length > 90 ? repo.description.slice(0, 87) + '…' : repo.description)
        : 'Projeto desenvolvido e publicado no GitHub.';

      const topics = repo.topics?.length
        ? repo.topics.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')
        : `<span class="tag">${lang}</span>`;

      const deployBtn = repo.homepage
        ? `<a href="${repo.homepage}" target="_blank" class="project-link project-link-deploy">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Deploy
           </a>`
        : '';

      swiperWrapper.innerHTML += `
        <div class="swiper-slide">
          <article class="project-card">
            <div class="project-img-area">
              <img src="${icon}" alt="${lang}"
                onerror="this.src='${fallbackIcon}'">
            </div>
            <div class="project-body">
              <h3 class="project-name">${name}</h3>
              <p class="project-desc">${desc}</p>
              <div class="project-tags">${topics}</div>
              <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link project-link-gh">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                ${deployBtn}
              </div>
            </div>
          </article>
        </div>
      `;
    });

    initSwiper();

  } catch (err) {
    console.warn('GitHub Repos:', err.message);
    swiperWrapper.innerHTML = `
      <div class="swiper-slide">
        <div class="project-card" style="padding:2rem;text-align:center;color:var(--text-muted)">
          Não foi possível carregar os projetos. Tente novamente mais tarde.
        </div>
      </div>`;
    initSwiper();
  }
}

// ============================================================
// SWIPER — inicialização
// ============================================================
function initSwiper() {
  new Swiper('.projects-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,
    grabCursor: true,

    breakpoints: {
      600:  { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 },
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },

    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
  });
}

// ============================================================
// FORMULÁRIO — validação
// ============================================================
const formulario = document.getElementById('formulario');

if (formulario) {
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpar erros
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group textarea')
      .forEach(el => el.classList.remove('error'));

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let valid = true;

    function setError(fieldId, errorId, msg) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (field && error) {
        error.textContent = msg;
        field.classList.add('error');
        if (valid) field.focus();
      }
      valid = false;
    }

    const nome     = document.getElementById('nome');
    const email    = document.getElementById('email');
    const assunto  = document.getElementById('assunto');
    const mensagem = document.getElementById('mensagem');

    if (!nome?.value.trim() || nome.value.trim().length < 3)
      setError('nome', 'erro-nome', 'O nome deve ter no mínimo 3 caracteres.');

    if (!email?.value.trim().match(emailRegex))
      setError('email', 'erro-email', 'Digite um e-mail válido.');

    if (!assunto?.value.trim() || assunto.value.trim().length < 5)
      setError('assunto', 'erro-assunto', 'O assunto deve ter no mínimo 5 caracteres.');

    if (!mensagem?.value.trim())
      setError('mensagem', 'erro-mensagem', 'A mensagem não pode ser vazia.');

    if (valid) {
      const btn = formulario.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Enviando...
        `;
      }
      formulario.submit();
    }
  });
}

// spin keyframe via JS (para o botão de loading)
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// ============================================================
// INIT
// ============================================================
loadGithubProfile();
loadProjects();