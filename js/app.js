/* Aetheris AI — 3D Scroll-Driven Animation & Interactive Controller */

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Global WebGL state variables
let lenis = null;
let isHeroVisible = true;


// Initialize WebGL Canvas
// Three.js Neural Core Implementation (Option B)
let scene, camera, renderer, coreGroup, innerCore, rings = [], particles;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Scene setup
  scene = new THREE.Scene();
  // We'll keep the background transparent so the CSS background shows through
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Core Group to hold everything
  coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // 1. Inner Glowing Core (Icosahedron)
  const coreGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  innerCore = new THREE.Mesh(coreGeo, coreMat);
  coreGroup.add(innerCore);

  // 2. Glassy Outer Shell
  const shellGeo = new THREE.IcosahedronGeometry(1.8, 2);
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9, // glass effect
    thickness: 0.5,
    transparent: true,
    opacity: 1
  });
  const outerShell = new THREE.Mesh(shellGeo, shellMat);
  coreGroup.add(outerShell);

  // 3. High-Tech Rings
  const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
  const ringMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const ringMatPurple = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
  
  for(let i=0; i<3; i++) {
    const ring = new THREE.Mesh(ringGeo, i % 2 === 0 ? ringMatCyan : ringMatPurple);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    rings.push(ring);
    coreGroup.add(ring);
  }

  // 4. Orbiting Data Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 400;
  const posArray = new Float32Array(particleCount * 3);
  for(let i=0; i<particleCount*3; i+=3) {
    // Sphere distribution
    const r = 4 + Math.random() * 3;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos((Math.random() * 2) - 1);
    posArray[i] = r * Math.sin(phi) * Math.cos(theta);
    posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
    posArray[i+2] = r * Math.cos(phi);
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  particles = new THREE.Points(particlesGeo, particlesMat);
  coreGroup.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const lightCyan = new THREE.PointLight(0x06b6d4, 5, 20);
  lightCyan.position.set(2, 2, 2);
  scene.add(lightCyan);

  const lightPurple = new THREE.PointLight(0xa855f7, 5, 20);
  lightPurple.position.set(-2, -2, 2);
  scene.add(lightPurple);

  window.addEventListener('resize', resizeCanvas);
  
  // Mouse tracking for parallax
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Render Loop
  const clock = new THREE.Clock();
  function renderThree() {
    const time = clock.getElapsedTime();
    
    // Smooth mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    
    // Auto-rotation
    innerCore.rotation.y = time * 0.2;
    innerCore.rotation.x = time * 0.1;
    
    rings.forEach((ring, i) => {
      ring.rotation.x += 0.005 * (i + 1);
      ring.rotation.y += 0.003 * (i + 1);
    });
    
    particles.rotation.y = time * 0.05;

    // Apply parallax to entire group
    coreGroup.rotation.x = -mouseY * 0.3;
    coreGroup.rotation.y = mouseX * 0.3;

    renderer.render(scene, camera);
    requestAnimationFrame(renderThree);
  }
  
  renderThree();
}

// Handle Canvas Resize and Viewport viewport size
function resizeCanvas() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Actual Resource Preloader for Premium Loading UX
async function preloadFrames() {
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  if (!loader || !loaderBar || !loaderPercent) return;

  const images = Array.from(document.querySelectorAll('img'));
  const totalImages = images.length;
  let imagesLoadedCount = 0;
  let fontsLoaded = false;
  let sceneInit = false;
  let progress = 0;

  const updateProgress = () => {
    let loadedParts = 0;
    const totalParts = 3;

    if (totalImages === 0 || imagesLoadedCount === totalImages) loadedParts++;
    if (fontsLoaded) loadedParts++;
    if (sceneInit) loadedParts++;

    const targetProgress = Math.round((loadedParts / totalParts) * 100);
    
    gsap.to({ val: progress }, {
      val: targetProgress,
      duration: 0.4,
      ease: "power1.out",
      onUpdate: function() {
        progress = Math.min(100, Math.round(this.targets()[0].val));
        loaderBar.style.width = `${progress}%`;
        loaderPercent.innerText = `${progress}% LOADED`;
      }
    });
  };

  const imagesPromise = new Promise((resolve) => {
    if (totalImages === 0) resolve();
    let completed = 0;
    images.forEach(img => {
      if (img.complete) {
        completed++;
        imagesLoadedCount = completed;
        if (completed === totalImages) {
          updateProgress();
          resolve();
        }
      } else {
        img.addEventListener('load', () => {
          completed++;
          imagesLoadedCount = completed;
          updateProgress();
          if (completed === totalImages) resolve();
        });
        img.addEventListener('error', () => {
          completed++;
          imagesLoadedCount = completed;
          updateProgress();
          if (completed === totalImages) resolve();
        });
      }
    });
  });

  const fontsPromise = document.fonts.ready.then(() => {
    fontsLoaded = true;
    updateProgress();
  });

  const scenePromise = new Promise((resolve) => {
    setTimeout(() => {
      sceneInit = true;
      updateProgress();
      resolve();
    }, 150);
  });

  const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));

  await Promise.race([
    Promise.all([imagesPromise, fontsPromise, scenePromise]),
    timeoutPromise
  ]);

  return new Promise(resolve => {
    gsap.to({ val: progress }, {
      val: 100,
      duration: 0.4,
      ease: "power1.out",
      onUpdate: function() {
        const p = Math.round(this.targets()[0].val);
        loaderBar.style.width = `${p}%`;
        loaderPercent.innerText = `${p}% LOADED`;
      },
      onComplete: () => {
        setTimeout(() => {
          loader.style.opacity = 0;
          loader.style.pointerEvents = 'none';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 800);
          resolve();
        }, 300);
      }
    });
  });
}

// Initialize Lenis Smooth Scroll
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
}

// Bind Canvas WebGL Shader parameters to Scroll progress
// Bind Three.js Object to Scroll progress
function initScrollCanvas() {
  const scrollContainer = document.getElementById('scroll-container');
  
  // Create a GSAP timeline for the 3D object
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1 // smooth scrubbing
    }
  });

  // Animate the core group through the scroll
  tl.to(coreGroup.position, {
    y: 0.3,
    z: 1,
    ease: "none"
  }, 0)
  .to(coreGroup.rotation, {
    z: Math.PI * 2,
    ease: "none"
  }, 0)
  .to(innerCore.scale, {
    x: 1.5, y: 1.5, z: 1.5,
    ease: "power1.inOut"
  }, 0.2)
  .to(innerCore.material, {
    emissiveIntensity: 1.0,
    ease: "none"
  }, 0.3);
}

// Circle Wipe Hero Transition Reveal
function initHeroTransition() {
  const scrollContainer = document.getElementById('scroll-container');
  const heroSection = document.querySelector('.hero-standalone');
  const canvasWrap = document.querySelector('.canvas-wrap');

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      
      // Hero cover section fades out as scroll starts
      // Fades out completely by 12% scroll
      if (p <= 0.12) {
        heroSection.style.opacity = Math.max(0, 1 - (p / 0.10));
        heroSection.style.pointerEvents = 'auto';
      } else {
        heroSection.style.opacity = 0;
        heroSection.style.pointerEvents = 'none';
      }

      // Canvas circle wipe mask expands from 0% (at 1% scroll) to 75% of viewport width (at 8% scroll)
      const wipeStart = 0.01;
      const wipeEnd = 0.08;
      let radius = 0;
      if (p >= wipeStart && p <= wipeEnd) {
        const wipeProgress = (p - wipeStart) / (wipeEnd - wipeStart);
        radius = wipeProgress * 75; // 0% to 75%
      } else if (p > wipeEnd) {
        radius = 75; // full viewport cover
      }
      
      console.log(`HERO WIPED: progress=${p.toFixed(4)}, radius=${radius.toFixed(1)}%`);
      canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
    }
  });
}

// Bind Background Dark Overlay Dimmer
function initDarkOverlay() {
  const scrollContainer = document.getElementById('scroll-container');
  const overlay = document.getElementById('dark-overlay');
  
  const ranges = [
    { start: 0.15, end: 0.30, maxOpacity: 0.15 },
    { start: 0.75, end: 0.90, maxOpacity: 0.20 }
  ];

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      let opacity = 0;
      const transitionZone = 0.03;

      for (const r of ranges) {
        if (p >= r.start - transitionZone && p < r.start) {
          opacity = ((p - (r.start - transitionZone)) / transitionZone) * r.maxOpacity;
          break;
        } else if (p >= r.start && p <= r.end) {
          opacity = r.maxOpacity;
          break;
        } else if (p > r.end && p <= r.end + transitionZone) {
          opacity = (1 - ((p - r.end) / transitionZone)) * r.maxOpacity;
          break;
        }
      }
      overlay.style.opacity = opacity;
    }
  });
}

// Horizontal text marquee animation
function initMarqueeAnimation() {
  const scrollContainer = document.getElementById('scroll-container');
  const marquee = document.querySelector('.marquee-wrap');
  const text = marquee.querySelector('.marquee-text');

  gsap.to(text, {
    xPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      let opacity = 0;
      
      if (p >= 0.22 && p < 0.28) {
        opacity = (p - 0.22) / 0.06;
      } else if (p >= 0.28 && p <= 0.60) {
        opacity = 1.0;
      } else if (p > 0.60 && p <= 0.68) {
        opacity = 1 - ((p - 0.60) / 0.08);
      }
      marquee.style.opacity = opacity;
    }
  });
}

// Section Entrance Animation Engine
function initSectionAnimations() {
  const sections = document.querySelectorAll('.scroll-section');

  sections.forEach(sec => {
    const enterVal = parseFloat(sec.dataset.enter) / 100;
    const leaveVal = parseFloat(sec.dataset.leave) / 100;
    const type = sec.dataset.animation;
    const persist = sec.dataset.persist === "true";
    
    const elements = sec.querySelectorAll(
      '.section-label, .section-heading, .section-body, .glow-card, .border-beam-container, #connect-form, .stats-grid > div'
    );

    const tl = gsap.timeline({ paused: true });

    switch (type) {
      case 'fade-up':
        tl.fromTo(elements, 
          { y: 60, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }
        );
        break;
      case 'slide-left':
        tl.fromTo(elements, 
          { x: -90, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out" }
        );
        break;
      case 'slide-right':
        tl.fromTo(elements, 
          { x: 90, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out" }
        );
        break;
      case 'scale-up':
        tl.fromTo(elements, 
          { scale: 0.86, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 1.0, stagger: 0.12, ease: "power2.out" }
        );
        break;
      case 'rotate-in':
        tl.fromTo(elements, 
          { y: 50, rotation: 3, opacity: 0 }, 
          { y: 0, rotation: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" }
        );
        break;
      case 'stagger-up':
        tl.fromTo(elements, 
          { y: 70, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
        break;
      case 'clip-reveal':
        tl.fromTo(elements, 
          { clipPath: "inset(100% 0 0 0)", opacity: 0 }, 
          { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.inOut" }
        );
        break;
    }

    ScrollTrigger.create({
      trigger: '#scroll-container',
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        
        if (p >= enterVal && (p <= leaveVal || persist)) {
          sec.classList.add('active');
          const range = leaveVal - enterVal;
          const localProgress = Math.min((p - enterVal) / (range * 0.4), 1);
          tl.progress(localProgress);
          
          // Dynamic realignment trigger for active pipeline simulator lines
          if (sec.id === 'sec-simulator') {
            updateConnectorPaths();
          }
        } else {
          if (p > leaveVal && persist) {
            sec.classList.add('active');
            tl.progress(1);
          } else {
            sec.classList.remove('active');
            if (p > leaveVal) {
              tl.progress(1);
            } else {
              tl.progress(0);
            }
          }
        }
      }
    });
  });
}

// Stats Number Counter Animation
function initStatsCounters() {
  const statsSection = document.getElementById('sec-metrics');
  
  const stats = [
    { id: "stat-count-1", target: 45, suffix: "ms", decimals: 0 },
    { id: "stat-count-2", target: 99.4, suffix: "%", decimals: 1 },
    { id: "stat-count-3", target: 1240, suffix: "", decimals: 0 },
    { id: "stat-count-4", target: 82, suffix: "%", decimals: 0 }
  ];

  let triggered = false;

  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      const statsEnter = parseFloat(statsSection.dataset.enter) / 100;
      
      if (p >= statsEnter && !triggered) {
        triggered = true;
        stats.forEach(stat => {
          const el = document.getElementById(stat.id);
          if (!el) return;
          
          gsap.fromTo(el, 
            { textContent: 0 }, 
            {
              textContent: stat.target,
              duration: 2.0,
              ease: "power1.out",
              snap: { textContent: stat.decimals === 0 ? 1 : 0.1 },
              onUpdate: function() {
                const val = parseFloat(this.targets()[0].textContent);
                const formattedVal = val.toFixed(stat.decimals);
                el.innerHTML = `${formattedVal}<span class="text-lg font-semibold text-zinc-300 ml-0.5">${stat.suffix}</span>`;
              },
              onStart: () => {
                el.classList.add('animate-pulse', 'border-brand-accentCyan');
              },
              onComplete: () => {
                el.classList.remove('animate-pulse', 'border-brand-accentCyan');
              }
            }
          );
        });
      } else if (p < statsEnter && triggered) {
        triggered = false;
      }
    }
  });
}

// Stepper interactive data
const stepsData = {
  1: {
    title: "Ingestion & Auth",
    desc: "The workflow begins by validating incoming API requests or file payloads. Access tokens are verified using JWT keys before parsing inputs into the agentic database tables."
  },
  2: {
    title: "Cognitive Routing",
    desc: "The multi-agent router selects appropriate cognitive tools based on parsed semantics. File content is extracted locally, and parameters are passed securely without exposing cloud-level configurations."
  },
  3: {
    title: "Verification & Build",
    desc: "The final output triggers automated visual builds (using Puppeteer screenshot testing) to verify pixel alignment. The result is compiled into production bundles and auto-deployed to Vercel."
  }
};

window.selectStep = function(stepNumber) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    const title = document.getElementById(`step-title-${i}`);
    if (!dot || !title) continue;
    
    if (i === stepNumber) {
      dot.className = "absolute -left-8 top-1 w-6 h-6 rounded-full bg-brand-accentCyan border border-brand-base flex items-center justify-center text-[10px] text-brand-base font-bold shadow-glow-cyan";
      dot.innerText = i;
      title.className = "font-display font-semibold text-white transition-spring";
    } else {
      dot.className = "absolute -left-8 top-1 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-brand-textSecondary font-bold backdrop-blur-md";
      dot.innerText = i;
      title.className = "font-display font-semibold text-brand-textSecondary transition-spring";
    }
  }

  const progressLine = document.getElementById('step-progress-line');
  if (progressLine) {
    const heights = { 1: "0%", 2: "50%", 3: "100%" };
    progressLine.style.height = heights[stepNumber];
  }

  const descCard = document.getElementById("step-desc-card");
  if (descCard) {
    descCard.style.opacity = "0.3";
    setTimeout(() => {
      document.getElementById("step-desc-title").innerText = stepsData[stepNumber].title;
      document.getElementById("step-desc-text").innerText = stepsData[stepNumber].desc;
      descCard.style.opacity = "1";
    }, 150);
  }
};

// Node SVG Connector Path updater
function updateConnectorPaths() {
  const container = document.getElementById('simulator-container');
  if (!container) return;

  const n1 = document.getElementById('node-1');
  const n2 = document.getElementById('node-2');
  const n3 = document.getElementById('node-3');
  const n4 = document.getElementById('node-4');

  if (!n1 || !n2 || !n3 || !n4) return;

  // Set SVG coordinate resolution to match container layout size
  const svg = container.querySelector('svg');
  if (svg) {
    svg.setAttribute('width', container.offsetWidth);
    svg.setAttribute('height', container.offsetHeight);
  }

  // Helper to compute offset left and top relative to simulator-container
  const getPos = (el) => {
    let left = el.offsetLeft;
    let top = el.offsetTop;
    let parent = el.offsetParent;
    while (parent && parent !== container) {
      left += parent.offsetLeft;
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return {
      left,
      top,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  };

  const p1 = getPos(n1);
  const p2 = getPos(n2);
  const p3 = getPos(n3);
  const p4 = getPos(n4);

  // Connection points (middle of right side for start, middle of left side for end)
  const p1_right = {
    x: p1.left + p1.width,
    y: p1.top + p1.height / 2
  };
  const p2_left = {
    x: p2.left,
    y: p2.top + p2.height / 2
  };
  const p2_right = {
    x: p2.left + p2.width,
    y: p2.top + p2.height / 2
  };
  const p3_left = {
    x: p3.left,
    y: p3.top + p3.height / 2
  };
  const p3_right = {
    x: p3.left + p3.width,
    y: p3.top + p3.height / 2
  };
  const p4_left = {
    x: p4.left,
    y: p4.top + p4.height / 2
  };

  // Helper to set path 'd' attribute
  const setPath = (pathId, start, end) => {
    const path = document.getElementById(pathId);
    if (path) {
      path.setAttribute('d', `M ${start.x},${start.y} L ${end.x},${end.y}`);
    }
  };

  setPath('path-1-2', p1_right, p2_left);
  setPath('path-1-2-active', p1_right, p2_left);

  setPath('path-1-3', p1_right, p3_left);
  setPath('path-1-3-active', p1_right, p3_left);

  setPath('path-2-4', p2_right, p4_left);
  setPath('path-2-4-active', p2_right, p4_left);

  setPath('path-3-4', p3_right, p4_left);
  setPath('path-3-4-active', p3_right, p4_left);
}

// Node Simulation
window.runSimulation = function() {
  updateConnectorPaths();
  const logEl = document.getElementById('sim-log');
  const nodes = [
    document.getElementById('node-1'),
    document.getElementById('node-2'),
    document.getElementById('node-3'),
    document.getElementById('node-4')
  ];
  
  const connector12 = document.getElementById('path-1-2-active');
  const connector13 = document.getElementById('path-1-3-active');
  const connector24 = document.getElementById('path-2-4-active');
  const connector34 = document.getElementById('path-3-4-active');

  if (!logEl || !nodes[0]) return;

  logEl.innerText = "Simulator Status: RUNNING // Ingesting Webhook Payload...";
  nodes[0].style.borderColor = '#06b6d4';
  nodes[0].classList.add('shadow-glow-cyan');

  setTimeout(() => {
    if (connector12) connector12.style.opacity = '1';
    if (connector13) connector13.style.opacity = '1';
    logEl.innerText = "Simulator Status: RUNNING // Routing logic to Semantic Classifier & RAG Fetch...";
    if (nodes[1]) {
      nodes[1].style.borderColor = '#06b6d4';
      nodes[1].classList.add('shadow-glow-cyan');
    }
    if (nodes[2]) {
      nodes[2].style.borderColor = '#a855f7';
      nodes[2].classList.add('shadow-glow-purple');
    }
  }, 1000);

  setTimeout(() => {
    if (connector24) connector24.style.opacity = '1';
    if (connector34) connector34.style.opacity = '1';
    logEl.innerText = "Simulator Status: RUNNING // Logic verification checks complete. compiling outputs...";
    if (nodes[3]) {
      nodes[3].style.borderColor = '#10b981';
      nodes[3].classList.add('shadow-glow-cyan');
    }
  }, 2000);

  setTimeout(() => {
    logEl.innerText = "Simulator Status: SUCCESS // Multi-agent output compiled successfully ✓";
    
    setTimeout(() => {
      nodes.forEach(n => {
        if (n) {
          n.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          n.classList.remove('shadow-glow-cyan', 'shadow-glow-purple');
        }
      });
      if (connector12) connector12.style.opacity = '0';
      if (connector13) connector13.style.opacity = '0';
      if (connector24) connector24.style.opacity = '0';
      if (connector34) connector34.style.opacity = '0';
      logEl.innerText = "Simulator Status: IDLE // Ready for pipeline testing";
    }, 3000);
  }, 3200);
};

// Interactive Node Inspection parameters data
const nodeConfigs = {
  "node-1": {
    "Node Type": "Trigger / Ingestion",
    "Endpoint": "https://api.aetheris.ai/v1/ingest",
    "Security": "JWT Authentication + SOC-2 Client Verification",
    "Throttle Rate": "10,000 req/sec",
    "Status": "ACTIVE"
  },
  "node-2": {
    "Node Type": "Cognitive Node / Classifier",
    "Engine": "Aetheris Semantic Router v4.2",
    "Latency": "8ms",
    "Local Caching": "ENABLED (Semantic Cache Layer)",
    "Status": "ACTIVE"
  },
  "node-3": {
    "Node Type": "Data Node / Vector Search",
    "Vector Indices": "12,000,000 document slices",
    "Retrieval Engine": "Pinecone Local Host / pgvector",
    "Query Time": "14ms",
    "Status": "ACTIVE"
  },
  "node-4": {
    "Node Type": "Success Action / Output Compiler",
    "Build System": "Vercel / Puppeteer OCR Verification",
    "Status": "IDLE"
  }
};

window.inspectNode = function(nodeId) {
  const panel = document.getElementById('node-inspect-panel');
  const title = document.getElementById('inspect-node-title');
  const jsonEl = document.getElementById('inspect-node-json');

  if (!panel || !title || !jsonEl) return;

  panel.classList.remove('hidden');
  
  // Remove border highlights from all nodes
  document.querySelectorAll('#simulator-container .glow-card').forEach(n => {
    n.classList.remove('border-brand-accentCyan', 'border-brand-accentPurple', 'border-emerald-400', 'ring-1', 'ring-brand-accentCyan/50', 'ring-brand-accentPurple/50', 'ring-emerald-400/50');
  });

  // Add highlight to current node
  const activeNode = document.getElementById(nodeId);
  if (activeNode) {
    if (nodeId === 'node-1' || nodeId === 'node-2') {
      activeNode.classList.add('border-brand-accentCyan', 'ring-1', 'ring-brand-accentCyan/50');
    } else if (nodeId === 'node-3') {
      activeNode.classList.add('border-brand-accentPurple', 'ring-1', 'ring-brand-accentPurple/50');
    } else if (nodeId === 'node-4') {
      activeNode.classList.add('border-emerald-400', 'ring-1', 'ring-emerald-400/50');
    }
  }
  
  const config = nodeConfigs[nodeId];
  title.innerText = `Inspect: ${config["Node Type"]} (${nodeId.toUpperCase()})`;
  jsonEl.innerText = JSON.stringify(config, null, 2);
  
  playUIClick();
};

window.closeInspectNode = function() {
  const panel = document.getElementById('node-inspect-panel');
  if (panel) panel.classList.add('hidden');
  
  // Remove border highlights from all nodes
  document.querySelectorAll('#simulator-container .glow-card').forEach(n => {
    n.classList.remove('border-brand-accentCyan', 'border-brand-accentPurple', 'border-emerald-400', 'ring-1', 'ring-brand-accentCyan/50', 'ring-brand-accentPurple/50', 'ring-emerald-400/50');
  });
  
  playUIClick();
};

// Pricing period Switch
const monthlyPrices = ["$3,200", "$9,500"];
const annualPrices = ["$2,560", "$7,600"];

window.setPricingPeriod = function(period) {
  const toggleMonthlyBtn = document.getElementById('toggle-monthly');
  const toggleAnnuallyBtn = document.getElementById('toggle-annually');
  const price1El = document.getElementById('price-card-1');
  const price2El = document.getElementById('price-card-2');

  if (!toggleMonthlyBtn || !toggleAnnuallyBtn || !price1El || !price2El) return;

  playUIClick();

  const isMonthly = period === 'monthly';
  const targetPrices = isMonthly ? monthlyPrices : annualPrices;

  if (isMonthly) {
    toggleMonthlyBtn.className = "px-3 py-1 text-[10px] font-semibold rounded-full bg-brand-accentCyan text-brand-base transition-spring";
    toggleAnnuallyBtn.className = "px-3 py-1 text-[10px] font-semibold rounded-full text-brand-textSecondary hover:text-white transition-spring";
  } else {
    toggleAnnuallyBtn.className = "px-3 py-1 text-[10px] font-semibold rounded-full bg-brand-accentCyan text-brand-base transition-spring";
    toggleMonthlyBtn.className = "px-3 py-1 text-[10px] font-semibold rounded-full text-brand-textSecondary hover:text-white transition-spring";
  }

  gsap.to([price1El, price2El], {
    opacity: 0,
    y: -10,
    duration: 0.15,
    onComplete: () => {
      price1El.innerHTML = `${targetPrices[0]}<span class="text-sm font-normal text-brand-textSecondary">/mo</span>`;
      price2El.innerHTML = `${targetPrices[1]}<span class="text-sm font-normal text-brand-textSecondary">/mo</span>`;
      
      gsap.to([price1El, price2El], {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "back.out(1.5)"
      });
    }
  });
};

// Form Submit
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  if (!btn) return;
  btn.innerText = "Syncing with Database Workspace...";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerText = "Deployment Blueprint Active ✓";
    btn.className = "w-full transition-spring inline-flex items-center justify-center font-semibold bg-emerald-500 text-brand-base py-4 rounded-xl shadow-glow-cyan";
    alert("Success! Aetheris Agent Workspace deployment initiated.");
  }, 1500);
};

// Glow cards
function initGlowCards() {
  document.querySelectorAll('.glow-card').forEach(card => {
    let rafId = null;
    card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (window.matchMedia('(pointer: fine)').matches) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// Magnetic buttons
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    let rafId = null;
    btn.addEventListener('mousemove', e => {
      if (window.matchMedia('(pointer: fine)').matches) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const strength = 0.35;
          btn.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.02)`;
          btn.style.transition = 'transform 0.08s ease-out';
        });
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      btn.style.transform = 'translate(0px, 0px) scale(1)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

// Sparkles
function initSparkles() {
  const sparkleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.dataset.visible = entry.isIntersecting ? "true" : "false";
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.sparkle-text').forEach(el => {
    el.style.position = 'relative';
    sparkleObserver.observe(el);
    
    setInterval(() => {
      if (document.hidden || el.dataset.visible !== "true") return;
      createSparkle(el);
    }, 380);
  });
}

function createSparkle(parent) {
  const sparkle = document.createElement('span');
  sparkle.className = 'absolute pointer-events-none animate-sparkle';
  
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = Math.random() * 10 + 6;
  
  sparkle.style.left = `${x}%`;
  sparkle.style.top = `${y}%`;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  
  sparkle.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-brand-accentCyan">
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" fill="currentColor" />
    </svg>
  `;
  
  parent.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1200);
}

// Particle Constellation
let particlesCanvas, particlesCtx;
let particlesArray = [];
let particlesMouse = { x: null, y: null, radius: 140 };

function initParticlesCanvas() {
  particlesCanvas = document.getElementById('particles-canvas');
  if (!particlesCanvas) return;
  particlesCtx = particlesCanvas.getContext('2d');
  
  resizeParticlesCanvas();
  window.addEventListener('resize', resizeParticlesCanvas);
  
  window.addEventListener('mousemove', e => {
    particlesMouse.x = e.clientX;
    particlesMouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    particlesMouse.x = null;
    particlesMouse.y = null;
  });

  class Particle {
    constructor(x, y, vx, vy, size, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.baseVx = vx;
      this.baseVy = vy;
      this.size = size;
      this.color = color;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() * 0.01) - 0.005;
    }
    draw() {
      particlesCtx.beginPath();
      if (this.size > 1.2) {
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        particlesCtx.fillStyle = this.color;
        particlesCtx.fill();
        
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2, false);
        const alpha = this.color.includes('rgba') ? parseFloat(this.color.split(',')[3]) * 0.22 : 0.06;
        const glowColor = this.color.includes('rgba') ? this.color.replace(/[\d\.]+\)$/, `${alpha})`) : 'rgba(6, 182, 212, 0.06)';
        particlesCtx.fillStyle = glowColor;
        particlesCtx.fill();
      } else {
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        particlesCtx.fillStyle = this.color;
        particlesCtx.fill();
      }
    }
    update() {
      this.angle += this.angularSpeed;
      let targetVx = this.baseVx + Math.cos(this.angle) * 0.08;
      let targetVy = this.baseVy + Math.sin(this.angle) * 0.08;

      // Ambient time-based wave force
      const time = Date.now() * 0.001;
      const waveX = Math.sin(time + this.x * 0.01) * 0.12;
      const waveY = Math.cos(time + this.y * 0.01) * 0.12;
      targetVx += waveX;
      targetVy += waveY;

      if (particlesMouse.x && particlesMouse.y) {
        const dx = particlesMouse.x - this.x;
        const dy = particlesMouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < particlesMouse.radius) {
          const force = (particlesMouse.radius - dist) / particlesMouse.radius;
          targetVx += (dx / dist) * force * 0.45;
          targetVy += (dy / dist) * force * 0.45;
        }
      }

      this.vx += (targetVx - this.vx) * 0.08;
      this.vy += (targetVy - this.vy) * 0.08;
      this.x += this.vx;
      this.y += this.vy;

      if (this.x > particlesCanvas.width || this.x < 0) {
        this.vx = -this.vx;
        this.baseVx = -this.baseVx;
      }
      if (this.y > particlesCanvas.height || this.y < 0) {
        this.vy = -this.vy;
        this.baseVy = -this.baseVy;
      }
      this.draw();
    }
  }

  function setupParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(65, Math.floor((particlesCanvas.width * particlesCanvas.height) / 19000));
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2.2 + 0.5;
      let x = Math.random() * (particlesCanvas.width - size * 2) + size;
      let y = Math.random() * (particlesCanvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.3)';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function drawConnections() {
    let opacityValue = 1;
    const maxDistance = 110;
    const maxDistanceSq = maxDistance * maxDistance;

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                     + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        if (distance < maxDistanceSq) {
          opacityValue = 1 - (distance / maxDistanceSq);
          particlesCtx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.12})`;
          particlesCtx.lineWidth = 0.6;
          particlesCtx.beginPath();
          particlesCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
          particlesCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
          particlesCtx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    if (!isHeroVisible) {
      requestAnimationFrame(animateParticles);
      return;
    }
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  setupParticles();
  animateParticles();
}

function resizeParticlesCanvas() {
  if (!particlesCanvas) return;
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}

// Connect Section ScrollTrigger Animation (scrolling naturally in page flow)
function initConnectSectionAnimation() {
  const sec = document.getElementById('sec-connect');
  if (!sec) return;
  
  const elements = sec.querySelectorAll(
    '.section-label, .section-heading, .section-body, #connect-form'
  );
  
  gsap.fromTo(elements,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    }
  );
}

// Active Nav Link Update
function updateActiveNavLink(progress) {
  const navLinks = document.querySelectorAll('.nav-link-item');
  navLinks.forEach(link => {
    link.classList.remove('text-brand-accentCyan', 'active');
    link.classList.add('text-brand-textSecondary');
  });

  let activeIndex = -1;
  if (progress >= 0.15 && progress < 0.30) activeIndex = 1; // Workspace Canvas (sec-simulator)
  else if (progress >= 0.30 && progress < 0.45) activeIndex = 0; // Services (sec-services)
  else if (progress >= 0.45 && progress < 0.60) activeIndex = 2; // Stepper (sec-stepper)
  else if (progress >= 0.60 && progress < 0.75) activeIndex = 3; // Pricing (sec-pricing)
  else if (progress >= 0.75 && progress < 0.90) activeIndex = 4; // Security (sec-metrics)

  if (activeIndex !== -1 && navLinks[activeIndex]) {
    navLinks[activeIndex].classList.add('text-brand-accentCyan', 'active');
    navLinks[activeIndex].classList.remove('text-brand-textSecondary');
  }
}

function initNavHighlight() {
  const progressBar = document.getElementById('scroll-progress-bar');
  
  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      updateActiveNavLink(p);
      
      // Update dynamic scroll progress bar track height
      if (progressBar) {
        progressBar.style.height = `${p * 100}%`;
      }
      
      // Toggle 2D hero canvas visible state to save CPU overhead
      isHeroVisible = (p <= 0.15);
    }
  });
}

// Web Audio API procedural sound system
let audioCtx = null;

function initAudio() {
  const startAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  window.addEventListener('click', startAudio, { once: true });
  window.addEventListener('touchstart', startAudio, { once: true });
}

function playUIClick() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playUIHover() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.005, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function attachSoundListeners() {
  const elements = document.querySelectorAll('.magnetic-btn, .nav-link-item, .glow-card, #simulator-container .glow-card');
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playUIHover();
    });
  });
}

// Navigation interceptor & Lenis smooth scroll mapping
function initNavClicks() {
  const navLinks = document.querySelectorAll('.nav-link-item');
  const scrollContainer = document.getElementById('scroll-container');
  if (!scrollContainer) return;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHref = link.getAttribute('href');
      const targetSec = document.querySelector(targetHref);
      
      if (targetSec && lenis) {
        playUIClick();
        const enterVal = parseFloat(targetSec.dataset.enter) / 100;
        const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
        const targetScroll = scrollContainer.offsetTop + (maxScroll * (enterVal + 0.05));
        
        lenis.scrollTo(targetScroll, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

// Connect Form validation checks & border glow highlights
function initFormValidation() {
  const form = document.getElementById('connect-form');
  if (!form) return;

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const roleInput = document.getElementById('project-role');
  const detailsInput = document.getElementById('project-details');

  function validateInput(input, condition) {
    if (!input) return;
    if (condition) {
      input.classList.remove('border-red-500/50', 'focus:border-red-500', 'shadow-glow-red');
      input.classList.add('border-emerald-500/30', 'focus:border-emerald-500');
    } else {
      input.classList.remove('border-emerald-500/30', 'focus:border-emerald-500');
      input.classList.add('border-red-500/50', 'focus:border-red-500');
    }
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      validateInput(nameInput, nameInput.value.trim().length >= 2);
    });
  }

  if (emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailInput.addEventListener('input', () => {
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
    });
  }

  if (roleInput) {
    roleInput.addEventListener('input', () => {
      validateInput(roleInput, roleInput.value.trim().length >= 2);
    });
  }

  if (detailsInput) {
    detailsInput.addEventListener('input', () => {
      validateInput(detailsInput, detailsInput.value.trim().length >= 10);
    });
  }
}

// Master Initialization on Load
window.addEventListener('DOMContentLoaded', async () => {
  initAudio();
  initCanvas();
  initLenis();
  initParticlesCanvas();
  
  await preloadFrames();
  
  initScrollCanvas();
  initHeroTransition();
  initDarkOverlay();
  initMarqueeAnimation();
  initSectionAnimations();
  initStatsCounters();
  initConnectSectionAnimation();
  initNavHighlight();
  
  initGlowCards();
  initMagneticButtons();
  initSparkles();
  
  initFormValidation();
  initNavClicks();
  attachSoundListeners();
  
  updateConnectorPaths();
  
  window.addEventListener('resize', () => {
    updateConnectorPaths();
  });
  window.addEventListener('load', () => {
    updateConnectorPaths();
  });
});
