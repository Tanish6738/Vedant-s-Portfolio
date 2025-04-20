document.addEventListener('DOMContentLoaded', () => {
  // Remove manual scroll reveal logic (no longer needed with ScrollTrigger)
  // const sections = document.querySelectorAll('section');
  // const revealSection = (section) => {
  //   const rect = section.getBoundingClientRect();
  //   if (rect.top < window.innerHeight - 100) {
  //     section.classList.add('fade-in');
  //   }
  // };
  // sections.forEach(section => {
  //   revealSection(section);
  //   window.addEventListener('scroll', () => revealSection(section));
  // });

  // Section shadow and border for visual separation
  ['hero','about','skills','projects','testimonials','contact'].forEach(id => {
    const section = document.getElementById(id);
    if(section) {
      section.classList.add('rounded-2xl','shadow-2xl','border','border-zinc-800','mx-2','my-8','bg-black','backdrop-blur');
    }
  });

  // Smooth scrolling for navbar links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70, // offset for navbar
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Navbar mobile toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if(navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navMobile.classList.toggle('hidden');
      gsap.fromTo(navMobile, {y:-30, opacity:0}, {y:0, opacity:1, duration:0.4, ease:'power2.out'});
    });
    // Auto-close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMobile.classList.add('hidden'));
    });
  }

  // Add floating effect to profile image
  const profileImg = document.querySelector('img[alt="Vedant Bobde"]');
  if (profileImg) profileImg.classList.add('float');

  // Add glowing effect to CTA button
  const ctaBtn = document.querySelector('a[href="#contact"]');
  if (ctaBtn) ctaBtn.classList.add('glow');

  // Terminal intro effect before hero reveal
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalText = document.getElementById('terminal-text');
  const heroSection = document.getElementById('hero');
  if (terminalOverlay && terminalText && heroSection) {
    // Hide hero initially
    heroSection.style.opacity = '0';
    heroSection.style.pointerEvents = 'none';
    heroSection.style.visibility = 'hidden';
    terminalOverlay.style.display = 'flex';
    terminalOverlay.style.opacity = '1';
    const lines = [
      "Welcome to Vedant Bobde's Portfolio",
      'Initializing backend wizardry... ⚡',
      'Loading Main Content...'
    ];
    let line = 0;
    let char = 0;
    terminalText.textContent = '';
    function typeLine() {
      if (line < lines.length) {
        if (char < lines[line].length) {
          terminalText.textContent += lines[line][char];
          char++;
          setTimeout(typeLine, 28);
        } else {
          terminalText.textContent += '\n';
          line++;
          char = 0;
          setTimeout(typeLine, 400);
        }
      } else {
        setTimeout(() => {
          gsap.to(terminalOverlay, { opacity: 0, duration: 0.7, onComplete: () => {
            terminalOverlay.style.display = 'none';
          }});
          gsap.to(heroSection, { opacity: 1, duration: 0.9, delay: 0.2, onStart: () => {
            heroSection.style.pointerEvents = 'auto';
            heroSection.style.visibility = 'visible';
            // Trigger hero reveal animation if any
            if (typeof window.heroRevealEffect === 'function') window.heroRevealEffect();
          }});
        }, 700);
      }
    }
    typeLine();
  }

  // Use GSAP ScrollTrigger for section reveal
  gsap.utils.toArray('section').forEach(section => {
    gsap.fromTo(section, {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  });

  // Animate Core Skills cards on scroll using GSAP
  if (window.gsap && window.ScrollTrigger) {
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    });
  }

  // Animate How I Work timeline steps on scroll using GSAP
  if (window.gsap && window.ScrollTrigger) {
    gsap.utils.toArray('.timeline-step').forEach((step, i) => {
      gsap.to(step, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.18,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    });
  }

  // Welcoming animation for hero section
  const hero = document.getElementById('hero');
  if (hero) {
    gsap.fromTo(hero.querySelector('h1'), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.fromTo(hero.querySelector('p'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 });
    gsap.fromTo(hero.querySelector('a'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1 });
  }

  // Interactive hover for project cards
  document.querySelectorAll('#projects .rounded-lg').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, boxShadow: '0 8px 32px #ff8a00aa', duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, boxShadow: '0 4px 16px #0006', duration: 0.3, ease: 'power2.in' });
    });
  });

  // Lens hover effect for project cards
  function lensEffect(container) {
    const img = container.querySelector('.project-img');
    const lens = container.querySelector('.lens-effect');
    if (!img || !lens) return;
    const zoom = 1.6;
    const lensSize = 120;
    lens.style.display = 'none';
    container.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lens.style.display = 'block';
      lens.style.background = `url('${img.src}')`;
      lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
      lens.style.backgroundPosition = `-${x * zoom - lensSize / 2}px -${y * zoom - lensSize / 2}px`;
      lens.style.width = lens.style.height = lensSize + 'px';
      lens.style.borderRadius = '50%';
      lens.style.left = (x - lensSize / 2) + 'px';
      lens.style.top = (y - lensSize / 2) + 'px';
      lens.style.boxShadow = '0 0 0 2px #ff8a00, 0 8px 32px #ff8a00aa';
      lens.style.border = '2px solid #fff2';
      lens.style.transition = 'none';
      lens.style.pointerEvents = 'none';
      lens.style.zIndex = 20;
    });
    container.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
    });
  }
  document.querySelectorAll('.lens-img-container').forEach(lensEffect);

  // Social links bounce on hover
  document.querySelectorAll('#contact a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { y: -6, scale: 1.15, color: '#ff8a00', duration: 0.25, ease: 'back.out(2)' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { y: 0, scale: 1, color: '', duration: 0.25, ease: 'back.in(2)' });
    });
  });

  // Button pulse on hover
  document.querySelectorAll('button, .btn, a.inline-block').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.18, ease: 'power1.inOut' });
    });
  });

  // 3D background
  const bg3d = document.getElementById('bg-3d');
  if (bg3d) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // transparent
    bg3d.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Create a wireframe sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff8a00, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Animate with GSAP
    gsap.to(sphere.rotation, { y: Math.PI * 2, duration: 12, repeat: -1, ease: 'linear' });
    gsap.to(sphere.rotation, { x: Math.PI * 2, duration: 18, repeat: -1, ease: 'linear' });

    // Responsive resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Matrix/coding background effect for hero section
  (function matrixBG(){
    const canvas = document.getElementById('hero-matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = document.getElementById('hero').offsetHeight;
    canvas.width = width;
    canvas.height = height;
    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = '01<>[]{}#@$%&*'.split('');
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + 'px monospace';
      ctx.fillStyle = '#ff8a00';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = document.getElementById('hero').offsetHeight;
      canvas.width = width;
      canvas.height = height;
    });
  })();
});