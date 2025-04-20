document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const revealSection = (section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add('fade-in');
    }
  };
  sections.forEach(section => {
    revealSection(section);
    window.addEventListener('scroll', () => revealSection(section));
  });

  // Section shadow and border for visual separation
  ['hero','about','skills','projects','testimonials','contact'].forEach(id => {
    const section = document.getElementById(id);
    if(section) {
      section.classList.add('rounded-2xl','shadow-2xl','border','border-zinc-800','mx-2','my-8','bg-black/80','backdrop-blur');
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
});