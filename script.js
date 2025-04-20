document.addEventListener('DOMContentLoaded', () => {
  // Section shadow and border for visual separation
  ['hero','about','skills','projects','testimonials','contact'].forEach(id => {
    const section = document.getElementById(id);
    if(section) {
      section.classList.add('rounded-2xl','shadow-2xl','border','border-zinc-800','mx-2','my-8','bg-black','backdrop-blur');
    }
  });

  // Pixel Card Effect for Hero Card (based on Reference.tsx)
  class Pixel {
    constructor(canvas, context, x, y, color, speed, delay) {
      this.width = canvas.width;
      this.height = canvas.height;
      this.ctx = context;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = this.getRandomValue(0.1, 0.9) * speed;
      this.size = 0;
      this.sizeStep = Math.random() * 0.4;
      this.minSize = 0.5;
      this.maxSizeInteger = 2;
      this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
      this.delay = delay;
      this.counter = 0;
      this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
      this.isIdle = false;
      this.isReverse = false;
      this.isShimmer = false;
    }

    getRandomValue(min, max) {
      return Math.random() * (max - min) + min;
    }

    draw() {
      const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(
        this.x + centerOffset,
        this.y + centerOffset,
        this.size,
        this.size
      );
    }

    appear() {
      this.isIdle = false;
      if (this.counter <= this.delay) {
        this.counter += this.counterStep;
        return;
      }
      if (this.size >= this.maxSize) {
        this.isShimmer = true;
      }
      if (this.isShimmer) {
        this.shimmer();
      } else {
        this.size += this.sizeStep;
      }
      this.draw();
    }

    disappear() {
      this.isShimmer = false;
      this.counter = 0;
      if (this.size <= 0) {
        this.isIdle = true;
        return;
      } else {
        this.size -= 0.1;
      }
      this.draw();
    }

    shimmer() {
      if (this.size >= this.maxSize) {
        this.isReverse = true;
      } else if (this.size <= this.minSize) {
        this.isReverse = false;
      }
      if (this.isReverse) {
        this.size -= this.speed;
      } else {
        this.size += this.speed;
      }
    }
  }

  function getEffectiveSpeed(value, reducedMotion) {
    const min = 0;
    const max = 100;
    const throttle = 0.001;
    const parsed = parseInt(value, 10);

    if (parsed <= min || reducedMotion) {
      return min;
    } else if (parsed >= max) {
      return max * throttle;
    } else {
      return parsed * throttle;
    }
  }

  // Initialize pixel card effect
  function initPixelCardEffect() {
    const canvas = document.getElementById('pixel-card-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const pixels = [];
    let animationId = null;
    let timePrevious = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Variant configuration (based on Reference.tsx VARIANTS)
    const variant = {
      gap: 5,
      speed: 35,
      colors: "#f8fafc,#f1f5f9,#cbd5e1,#ff8a00", // Added brand orange color
      activeColor: "#ff8a00"
    };

    function initPixels() {
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const colorsArray = variant.colors.split(",");
      pixels.length = 0;

      for (let x = 0; x < width; x += parseInt(variant.gap, 10)) {
        for (let y = 0; y < height; y += parseInt(variant.gap, 10)) {
          const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];

          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotion ? 0 : distance;

          pixels.push(
            new Pixel(
              canvas,
              ctx,
              x,
              y,
              color,
              getEffectiveSpeed(variant.speed, reducedMotion),
              delay
            )
          );
        }
      }
    }

    function doAnimate(fnName) {
      animationId = requestAnimationFrame(() => doAnimate(fnName));
      const timeNow = performance.now();
      const timePassed = timeNow - timePrevious;
      const timeInterval = 1000 / 60; // ~60 FPS

      if (timePassed < timeInterval) return;
      timePrevious = timeNow - (timePassed % timeInterval);

      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allIdle = true;
      for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i];
        pixel[fnName]();
        if (!pixel.isIdle) {
          allIdle = false;
        }
      }
      if (allIdle) {
        cancelAnimationFrame(animationId);
      }
    }

    function handleAnimation(name) {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => doAnimate(name));
    }

    // Event listeners
    container.addEventListener('mouseenter', () => handleAnimation("appear"));
    container.addEventListener('mouseleave', () => handleAnimation("disappear"));

    // Initialize on load and resize
    initPixels();
    handleAnimation("appear"); // Start with pixels visible

    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
      initPixels();
      handleAnimation("appear");
    });
    
    resizeObserver.observe(container);
  }

  // Call the pixel card effect initialization
  initPixelCardEffect();

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

  // Enhanced Terminal intro effect before hero reveal
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalText = document.getElementById('terminal-text');
  const terminalCursor = document.getElementById('cursor');
  const terminalProgress = document.getElementById('terminal-progress');
  const terminalProgressBar = document.getElementById('terminal-progress-bar');
  const terminalProgressText = document.getElementById('terminal-progress-text');
  const terminalInputContainer = document.getElementById('terminal-input-container');
  const terminalInput = document.getElementById('terminal-input');
  const heroSection = document.getElementById('hero');

  if (terminalOverlay && terminalText && heroSection) {
    // Hide hero initially
    heroSection.style.opacity = '0';
    heroSection.style.pointerEvents = 'none';
    heroSection.style.visibility = 'hidden';
    
    // Display terminal
    terminalOverlay.style.display = 'flex';
    terminalOverlay.style.opacity = '1';
    
    // Terminal sequences - structured as objects for better organization
    const sequences = [
      // Shorter welcome message
      {
        type: 'text',
        lines: [
          "Welcome to Vedant Bobde's Portfolio",
          "Initializing...",
          "Date: " + new Date().toLocaleDateString(),
        ],
        typingSpeed: 25,
        delayAfter: 400
      },
      // Only one system check
      {
        type: 'command',
        command: "java --version",
        response: [
          "openjdk 21.0.2 2024-04-16"
        ],
        delayAfter: 500
      },
      // Progress sequence - loading
      {
        type: 'progress',
        title: "Loading portfolio...",
        duration: 1200,
        delayAfter: 200
      },
      // Final confirmation and launch
      {
        type: 'text',
        lines: [
          "Ready! Launching portfolio..."
        ],
        typingSpeed: 30,
        delayAfter: 400
      }
    ];

    let currentSequence = 0;
    let currentLine = 0;
    let currentChar = 0;
    let currentContent = '';
    let waitingForInput = false;

    const terminalContentContainer = terminalText.parentElement;

    function scrollTerminalToBottom() {
      if (terminalContentContainer) {
        terminalContentContainer.scrollTop = terminalContentContainer.scrollHeight;
      }
    }

    // Position cursor function
    function positionCursor() {
      const textRect = terminalText.getBoundingClientRect();
      const textContent = terminalText.textContent;
      const lines = textContent.split('\n');
      const lastLine = lines[lines.length - 1] || '';
      
      // Create a temp span to measure text width
      const tempSpan = document.createElement('span');
      tempSpan.style.font = window.getComputedStyle(terminalText).font;
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.textContent = lastLine;
      document.body.appendChild(tempSpan);
      
      const width = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);
      
      // Position cursor at end of text
      const lineHeight = parseInt(window.getComputedStyle(terminalText).lineHeight);
      const top = terminalText.offsetTop + (lines.length - 1) * (lineHeight || 24);
      
      terminalCursor.style.top = `${top}px`;
      terminalCursor.style.left = `${terminalText.offsetLeft + width + 8}px`;
    }

    // Type text function
    function typeText() {
      const sequence = sequences[currentSequence];
      
      // Handle different sequence types
      if (sequence.type === 'text') {
        if (currentLine < sequence.lines.length) {
          if (currentChar < sequence.lines[currentLine].length) {
            currentContent += sequence.lines[currentLine][currentChar];
            terminalText.textContent = currentContent;
            currentChar++;
            positionCursor();
            scrollTerminalToBottom();
            setTimeout(typeText, sequence.typingSpeed);
          } else {
            currentContent += '\n';
            terminalText.textContent = currentContent;
            currentLine++;
            currentChar = 0;
            positionCursor();
            scrollTerminalToBottom();
            setTimeout(typeText, 100);
          }
        } else {
          // Move to next sequence
          currentSequence++;
          currentLine = 0;
          currentChar = 0;
          setTimeout(processSequence, sequence.delayAfter || 500);
        }
      } else if (sequence.type === 'command') {
        // Display command with prompt
        currentContent += '$ ' + sequence.command + '\n';
        terminalText.textContent = currentContent;
        positionCursor();
        scrollTerminalToBottom();
        
        // After a delay, show command response
        setTimeout(() => {
          sequence.response.forEach(line => {
            currentContent += line + '\n';
          });
          terminalText.textContent = currentContent;
          positionCursor();
          scrollTerminalToBottom();
          
          // Move to next sequence
          currentSequence++;
          setTimeout(processSequence, sequence.delayAfter || 500);
        }, 500);
      } else if (sequence.type === 'progress') {
        // Show progress bar
        currentContent += sequence.title + '\n';
        terminalText.textContent = currentContent;
        terminalProgress.classList.remove('hidden');
        positionCursor();
        scrollTerminalToBottom();
        
        // Animate progress bar
        let progress = 0;
        const interval = 30;
        const increment = interval / sequence.duration * 100;
        
        const progressInterval = setInterval(() => {
          progress += increment;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
              terminalProgress.classList.add('hidden');
              currentContent += 'Complete! [100%]\n\n';
              terminalText.textContent = currentContent;
              positionCursor();
              scrollTerminalToBottom();
              
              // Move to next sequence
              currentSequence++;
              setTimeout(processSequence, sequence.delayAfter || 500);
            }, 200);
          }
          
          terminalProgressBar.style.width = `${progress}%`;
          terminalProgressText.textContent = `${Math.round(progress)}%`;
        }, interval);
      } else if (sequence.type === 'input') {
        // Show input prompt
        currentContent += '$ ' + sequence.prompt + '\n';
        terminalText.textContent = currentContent;
        terminalInputContainer.classList.remove('hidden');
        terminalInput.focus();
        waitingForInput = true;
        positionCursor();
        scrollTerminalToBottom();
        
        // Handle autocomplete if specified
        if (sequence.autoComplete) {
          setTimeout(() => {
            if (waitingForInput) { // Only autocomplete if still waiting for input
              terminalInput.value = sequence.autoComplete;
              setTimeout(() => {
                handleInput();
              }, 500);
            }
          }, sequence.autoCompleteDelay || 1500);
        }
        
        // Handle input submission
        terminalInput.addEventListener('keydown', function inputHandler(e) {
          if (e.key === 'Enter') {
            handleInput();
            terminalInput.removeEventListener('keydown', inputHandler);
          }
        });
        
        function handleInput() {
          const userInput = terminalInput.value.trim();
          waitingForInput = false;
          terminalInputContainer.classList.add('hidden');
          
          // Show user input in terminal
          currentContent += userInput + '\n\n';
          terminalText.textContent = currentContent;
          positionCursor();
          scrollTerminalToBottom();
          
          // Move to next sequence
          currentSequence++;
          setTimeout(processSequence, sequence.delayAfter || 500);
        }
      }
    }

    // Process current sequence
    function processSequence() {
      if (currentSequence < sequences.length) {
        const sequence = sequences[currentSequence];
        
        // Branch based on sequence type
        if (sequence.type === 'text') {
          typeText();
        } else if (sequence.type === 'command') {
          typeText();
        } else if (sequence.type === 'progress') {
          typeText();
        } else if (sequence.type === 'input') {
          typeText();
        }
      } else {
        // All sequences complete, fade out terminal and show hero
        setTimeout(() => {
          gsap.to(terminalOverlay, { 
            opacity: 0, 
            duration: 0.7, 
            onComplete: () => {
              terminalOverlay.style.display = 'none';
            }
          });
          
          gsap.to(heroSection, { 
            opacity: 1, 
            duration: 0.9, 
            delay: 0.2, 
            onStart: () => {
              heroSection.style.pointerEvents = 'auto';
              heroSection.style.visibility = 'visible';
              // Trigger hero reveal animation if any
              if (typeof window.heroRevealEffect === 'function') window.heroRevealEffect();
            }
          });
        }, 500);
      }
    }

    // Start the terminal sequence
    processSequence();
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
    gsap.fromTo(hero.querySelector('h1'), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 5.8, ease: 'power3.out', delay: 0.2 });
    gsap.fromTo(hero.querySelector('p'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 5.8, ease: 'power3.out', delay: 0.7 });
    gsap.fromTo(hero.querySelector('a'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 5.2, ease: 'back.out(1.7)', delay: 1.2 });
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

  // Remove old lensEffect for image only
  // Add new lens effect for the whole card with zoomed content
  function lensEffectCard(card) {
    const lens = card.querySelector('.lens-effect');
    if (!lens) return;
    
    // Skip applying lens effect on mobile devices
    if (window.innerWidth <= 768) {
      lens.style.display = 'none';
      return;
    }
    
    const zoom = 1.6;
    const lensSize = 160;
    let lensContent = null;

    card.addEventListener('mousemove', (e) => {
      // Skip lens effect if viewport width is mobile size
      if (window.innerWidth <= 768) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lens.style.display = 'block';
      lens.style.width = lens.style.height = lensSize + 'px';
      lens.style.borderRadius = '50%';
      lens.style.left = (x - lensSize / 2) + 'px';
      lens.style.top = (y - lensSize / 2) + 'px';
      lens.style.boxShadow = '0 0 0 2px #ff8a00, 0 8px 32px #ff8a00aa';
      lens.style.border = '2px solid #fff2';
      lens.style.transition = 'none';
      lens.style.pointerEvents = 'none';
      lens.style.zIndex = 20;
      lens.style.overflow = 'hidden';
      lens.style.background = '';
      lens.style.backdropFilter = '';
      lens.style.backgroundColor = '';

      // Clone card content into lens only once
      if (!lensContent) {
        lens.innerHTML = '';
        lensContent = card.cloneNode(true);
        // Remove the lens-effect from the clone to avoid recursion
        const innerLens = lensContent.querySelector('.lens-effect');
        if (innerLens) innerLens.remove();
        lensContent.style.pointerEvents = 'none';
        lensContent.style.margin = '0';
        lensContent.style.position = 'absolute';
        lensContent.style.top = '0';
        lensContent.style.left = '0';
        lens.appendChild(lensContent);
      }
      // Scale and position the content so the area under the cursor is zoomed
      const scale = zoom;
      const offsetX = x * scale - lensSize / 2;
      const offsetY = y * scale - lensSize / 2;
      lensContent.style.transform = `scale(${scale})`;
      lensContent.style.transformOrigin = 'top left';
      lensContent.style.position = 'absolute';
      lensContent.style.left = -offsetX + 'px';
      lensContent.style.top = -offsetY + 'px';
      lensContent.style.width = card.offsetWidth + 'px';
      lensContent.style.height = card.offsetHeight + 'px';
    });
    card.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
      if (lensContent) {
        lensContent.remove();
        lensContent = null;
      }
    });
  }
  document.querySelectorAll('.project-lens-card').forEach(lensEffectCard);

  // Also update when window is resized
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.lens-effect').forEach(lens => {
        lens.style.display = 'none';
      });
    }
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

  // Progress bar and section highlight effect
  (function sectionProgressAndHighlight() {
    const progressBar = document.getElementById('progress-bar');
    const sections = [
      {id: 'hero', nav: 'Home'},
      {id: 'about', nav: 'About'},
      {id: 'skills', nav: 'Skills'},
      {id: 'projects', nav: 'Projects'},
      {id: 'testimonials', nav: 'Testimonials'},
      {id: 'contact', nav: 'Contact'}
    ];
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + '%';
    }
    function highlightSection() {
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        const sec = document.getElementById(sections[i].id);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 120) current = i;
        }
      }
      navLinks.forEach((link, i) => {
        if (i === current) {
          link.classList.add('text-orange-400', 'font-bold', 'scale-110');
          link.classList.remove('opacity-70');
        } else {
          link.classList.remove('text-orange-400', 'font-bold', 'scale-110');
          link.classList.add('opacity-70');
        }
      });
    }
    window.addEventListener('scroll', () => {
      updateProgress();
      highlightSection();
    });
    window.addEventListener('resize', updateProgress);
    updateProgress();
    highlightSection();
  })();
});