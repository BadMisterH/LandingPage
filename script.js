document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des animations au scroll
    initScrollAnimations();

    // Initialisation du compteur à rebours pour le workshop
    initWorkshopCountdown();

    // Initialisation des interactions de la section workshop-format
    initWorkshopFormatInteractions();

    // Initialisation de la timeline verticale
    if (typeof initVerticalTimeline === 'function') {
        initVerticalTimeline();
    }

    // S'assurer que la section benefits est visible
    ensureBenefitsSectionVisibility();

    // Correction du bouton de soumission du formulaire
    fixSubmitButton();

    // Testimonial Slider
    const dots = document.querySelectorAll('.indicator');
    const testimonials = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    function showSlide(index) {
        // Vérifier si les éléments existent
        if (!testimonials.length || !dots.length) {
            // console.log('Éléments de témoignage non trouvés');
            return;
        }

        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show the selected testimonial and activate its dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Initialize the slider
    showSlide(currentSlide);

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            currentSlide = index;
        });
    });

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Form submission
    const form = document.getElementById('registration-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const formDataObj = {};

            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            // Here you would typically send the data to your backend
            // For this example, we'll just log it and show a success message
            // console.log('Form submitted with data:', formDataObj);

            // Show success message
            form.innerHTML = `
                <div class="success-message">
                    <h3>Merci pour ton inscription !</h3>
                    <p>Tu recevras bientôt un email de confirmation avec les détails de connexion.</p>
                </div>
            `;

            // Track conversion
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                    'event_callback': function() {
                        // console.log('Conversion tracked successfully');
                    }
                });
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fonction pour initialiser les animations au scroll avec des effets avancés
    function initScrollAnimations() {
        // Vérifier que GSAP et ScrollTrigger sont disponibles
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP ou ScrollTrigger non chargés. Les animations au scroll sont désactivées.');
            return;
        }

        // Enregistrer le plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Animation de préchargement pour la transition initiale
        const pageLoadTimeline = gsap.timeline();

        // On gère temporairement le scroll pendant le chargement
        gsap.set('body', { overflow: 'hidden' });
        // Ne pas masquer tout le contenu pour éviter les problèmes de visibilité
        // gsap.set('main > *', { autoAlpha: 0 });

        // Création d'un overlay qui disparaîtra
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        document.body.appendChild(overlay);

        // Création du logo pour l'animation initiale
        const logoWrapper = document.createElement('div');
        logoWrapper.style.transform = 'scale(1.5)';
        logoWrapper.innerHTML = '<img src="images/logo.png" alt="DataBird Logo" style="max-width: 180px;">';
        overlay.appendChild(logoWrapper);

        // Animation d'entrée
        pageLoadTimeline
            .to(logoWrapper, {
                scale: 1,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            })
            .to(logoWrapper, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                delay: 0.2,
                ease: "power2.in"
            })
            .to(overlay, {
                height: 0,
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => {
                    overlay.remove();
                    gsap.set('body', { overflow: 'auto' });

                    // S'assurer que toutes les sections sont visibles
                    gsap.set('main > section', {
                        autoAlpha: 1,
                        visibility: 'visible',
                        display: 'block'
                    });

                    // Assurer spécifiquement que la section benefits est visible
                    const benefitsSection = document.querySelector('.benefits');
                    if (benefitsSection) {
                        benefitsSection.style.display = 'block';
                        benefitsSection.style.visibility = 'visible';
                        benefitsSection.style.opacity = '1';
                    }
                }
            });

        // Animation de la section Hero - Effet d'entrée avec plus d'impact
        const heroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero',
                start: 'top bottom',
                end: 'bottom top',
                toggleActions: 'play none none reverse'
            }
        });

        heroTimeline
            .from('.hero-content h1', {
                opacity: 0,
                y: -40,
                rotationX: 20,
                transformOrigin: "center top",
                duration: 1.2,
                ease: "back.out(1.7)"
            })
            .from('.hero-content .subtitle', {
                opacity: 0,
                y: -20,
                duration: 0.7,
                ease: "power2.out"
            }, '-=0.7')
            .from('.hero-content p:not(.subtitle):not(.cta-urgency)', {
                opacity: 0,
                y: -15,
                duration: 0.7,
                ease: "power2.out"
            }, '-=0.5')
            .from('.cta-container', {
                opacity: 0,
                y: -20,
                scale: 0.95,
                duration: 0.8,
                ease: "back.out(1.2)"
            }, '-=0.4')
            .from('.hero-image', {
                opacity: 0,
                scale: 0.8,
                rotation: -4,
                transformOrigin: "center center",
                duration: 1.2,
                ease: "power3.out"
            }, '-=0.9');

        // Effet de parallaxe 3D avancé sur le héro
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-wrapper';
        parallaxContainer.style.position = 'absolute';
        parallaxContainer.style.top = '0';
        parallaxContainer.style.left = '0';
        parallaxContainer.style.width = '100%';
        parallaxContainer.style.height = '100%';
        parallaxContainer.style.overflow = 'hidden';
        parallaxContainer.style.pointerEvents = 'none';
        parallaxContainer.style.zIndex = '-1';

        // Création de quelques formes abstraites pour l'effet de parallaxe
        const shapes = [];
        const shapesCount = 8;
        const colors = ['rgba(94, 23, 235, 0.1)', 'rgba(122, 58, 255, 0.1)', 'rgba(74, 18, 192, 0.1)'];

        for (let i = 0; i < shapesCount; i++) {
            const shape = document.createElement('div');
            shape.style.position = 'absolute';
            shape.style.borderRadius = '50%';

            const size = Math.random() * 300 + 100;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];

            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.left = `${posX}%`;
            shape.style.top = `${posY}%`;
            // shape.style.backgroundColor = color;
            shape.style.filter = 'blur(40px)';

            parallaxContainer.appendChild(shape);
            shapes.push(shape);
        }

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.position = 'relative';
            heroSection.style.overflow = 'hidden';
            heroSection.insertBefore(parallaxContainer, heroSection.firstChild);

            // Animation des formes en parallaxe
            shapes.forEach((shape, i) => {
                const direction = i % 2 === 0 ? 1 : -1;
                const speed = Math.random() * 100 + 50;

                gsap.to(shape, {
                    y: direction * speed,
                    x: -direction * speed / 2,
                    scrollTrigger: {
                        trigger: heroSection,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });
        }

        // Effet de parallaxe sur l'image hero
        gsap.to('.hero-image', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            },
            y: 100,
            scale: 1.05,
            rotation: 1,
            ease: "none"
        });

        // Animation du texte au scroll avec effet de vitesse différentielle
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            },
            y: -50,
            ease: "none"
        });

        // Animation des sections au scroll avec effet de révélation
        gsap.utils.toArray('section').forEach((section, i) => {
            // Animation de fond pour chaque section
            gsap.fromTo(section,
                {
                    backgroundPosition: '0% 50%'
                },
                {
                    backgroundPosition: '100% 50%',
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );

            // Animation pour l'apparition des sections
            const sectionTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'center center',
                    toggleActions: 'play none none reverse'
                }
            });

            // Animation pour créer une révélation des éléments de la section
            sectionTimeline.fromTo(section,
                {
                    clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
                },
                {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    duration: 1,
                    ease: "power2.out",
                    clearProps: "clipPath" // Pour éviter les problèmes de rendu après l'animation
                }, 0);

            // Animation spécifique pour l'en-tête de section avec split text
            const sectionHeader = section.querySelector('.section-header, .format-header');
            if (sectionHeader) {
                // Animation du tag
                const tag = sectionHeader.querySelector(':scope > span');
                if (tag) {
                    sectionTimeline.from(tag, {
                        opacity: 0,
                        y: 20,
                        scale: 0.8,
                        duration: 0.7,
                        ease: "back.out(1.4)"
                    }, 0.2);
                }

                // Animation du titre avec effet de reveal
                const title = sectionHeader.querySelector(':scope > h2');
                if (title) {
                    // On crée un wrapper pour l'effet de reveal
                    const titleText = title.innerHTML;
                    title.innerHTML = '';

                    const titleWrapper = document.createElement('div');
                    titleWrapper.style.position = 'relative';
                    titleWrapper.style.overflow = 'hidden';

                    const titleInner = document.createElement('div');
                    titleInner.innerHTML = titleText;
                    titleInner.style.transform = 'translateY(100%)';
                    titleInner.style.opacity = '0';

                    titleWrapper.appendChild(titleInner);
                    title.appendChild(titleWrapper);

                    sectionTimeline.to(titleInner, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out"
                    }, 0.3);
                }

                // Animation du texte d'intro
                const intro = sectionHeader.querySelector('.section-intro, .format-intro');
                if (intro) {
                    sectionTimeline.from(intro, {
                        opacity: 0,
                        y: 20,
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.5);
                }
            }
        });

        // Animation avancée pour les cartes de bénéfices avec effets 3D
        const benefitsSection = document.querySelector('.benefits-grid');
        if (benefitsSection) {
            // Ajouter un fond dynamique pour cette section
            const effectsLayer = document.createElement('div');
            effectsLayer.className = 'benefits-effects-layer';
            effectsLayer.style.position = 'absolute';
            effectsLayer.style.top = '0';
            effectsLayer.style.left = '0';
            effectsLayer.style.width = '100%';
            effectsLayer.style.height = '100%';
            effectsLayer.style.zIndex = '-1';
            effectsLayer.style.backgroundColor = 'transparent';
            effectsLayer.style.opacity = '0.2';

            // Créer un canvas pour l'effet de particules
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = 400;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            effectsLayer.appendChild(canvas);

            const parentSection = document.querySelector('.benefits');
            if (parentSection) {
                parentSection.style.position = 'relative';
                parentSection.style.overflow = 'hidden';
                parentSection.appendChild(effectsLayer);

                // Animation de fond en scroll
                gsap.fromTo(effectsLayer,
                    { opacity: 0 },
                    {
                        opacity: 0.2,
                        scrollTrigger: {
                            trigger: parentSection,
                            start: 'top 80%',
                            end: 'top 30%',
                            scrub: true,
                        }
                    }
                );
            }
        }

        // Créer une séquence d'animation pour les cartes
        const benefitsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.benefits-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Temporairement désactivé pour résoudre les problèmes de visibilité
        /*
        // Configurer les cartes initialement avec une opacité plus élevée pour éviter les problèmes de visibilité
        gsap.set('.benefit-card', {
            opacity: 0.5,
            y: 40,
            rotationY: 5,
            transformPerspective: 800,
            clearProps: "display,visibility"
        });
        */

        // Au lieu de cela, s'assurer que les cartes sont toujours visibles
        gsap.set('.benefit-card', {
            opacity: 1,
            y: 0,
            rotationY: 0,
            transformPerspective: 800,
        });

        // Animer chaque carte avec effet 3D avancé
        document.querySelectorAll('.benefit-card').forEach((card, i) => {
            const delay = i * 0.2;

            benefitsTimeline.to(card, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 1,
                delay: delay,
                ease: "power3.out",
                clearProps: "transformPerspective" // Nettoyer après animation
            }, 0);

            // Animation avancée au survol pour chaque carte
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    scale: 1.05,
                    y: -10,
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Effet spécial sur l'icône
                const icon = this.querySelector('.icon');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.2,
                        rotation: '+=20',
                        duration: 0.5,
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });

            card.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    scale: 1,
                    y: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    duration: 0.4,
                    ease: "power2.inOut"
                });

                // Retour à l'état normal pour l'icône
                const icon = this.querySelector('.icon');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });        });

        // Animation des icônes avec rotation et apparition
        gsap.from('.benefit-content .icon', {
            scrollTrigger: {
                trigger: '.benefits-grid',
                start: 'top 70%',
                toggleActions: 'play none none reverse',
                once: false // Assure que l'animation se joue à chaque fois que l'élément entre dans la vue
            },
            rotate: -45,
            opacity: 0,
            scale: 0.2,
            transformOrigin: "center center",
            duration: 1.2,
            stagger: {
                each: 0.2,
                from: "start",
                ease: "power1.in"
            },
            ease: "elastic.out(1, 0.3)",
            clearProps: "opacity,rotate,scale,x,y,transform,transformOrigin" // Nettoie explicitement toutes les propriétés CSS qui pourraient causer des problèmes
        });

        // Animation des numéros de bénéfices avec effet 3D
        gsap.from('.benefit-number', {
            scrollTrigger: {
                trigger: '.benefits-grid',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.2,
            rotationX: 90,
            transformOrigin: "center bottom",
            duration: 1.2,
            stagger: 0.25,
            ease: "back.out(2)"
        });

        // Animation avancée de la timeline avec effet de tracé et connexion
        const timelineContainer = document.querySelector('.format-timeline');
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (timelineItems.length > 0 && timelineContainer) {
            // Créer une ligne de connexion SVG entre les points
            const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgLine.setAttribute('class', 'timeline-connector');
            svgLine.style.position = 'absolute';
            svgLine.style.top = '0';
            svgLine.style.left = '0';
            svgLine.style.width = '100%';
            svgLine.style.height = '100%';
            svgLine.style.zIndex = '1';
            svgLine.style.pointerEvents = 'none';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', '#5e17eb');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-dasharray', '5,5');
            svgLine.appendChild(path);

            // Insérer le SVG dans le conteneur de la timeline
            timelineContainer.style.position = 'relative';
            timelineContainer.insertBefore(svgLine, timelineContainer.firstChild);

            // Fonction pour dessiner le chemin entre les points
            function drawTimelinePath() {
                const dots = document.querySelectorAll('.timeline-dot');
                if (dots.length < 2) return;

                let pathD = `M ${dots[0].offsetLeft + dots[0].offsetWidth/2} ${dots[0].offsetTop + dots[0].offsetHeight/2}`;

                for (let i = 1; i < dots.length; i++) {
                    const x = dots[i].offsetLeft + dots[i].offsetWidth/2;
                    const y = dots[i].offsetTop + dots[i].offsetHeight/2;
                    pathD += ` L ${x} ${y}`;
                }

                path.setAttribute('d', pathD);

                // Animation du tracé de la ligne
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;

                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: timelineContainer,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }

            // Dessiner le chemin après le chargement de la page
            window.addEventListener('load', drawTimelinePath);
            window.addEventListener('resize', drawTimelinePath);

            // Animation des items de timeline avec effet de zoom et déplacement
            timelineItems.forEach((item, i) => {
                const timelineItemTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });

                timelineItemTl
                    .from(item, {
                        opacity: 0,
                        xPercent: -10,
                        duration: 0.7,
                        ease: "power3.out"
                    })
                    .from(item.querySelector('.timeline-content'), {
                        opacity: 0,
                        x: -20,
                        duration: 0.6,
                        ease: "power2.out"
                    }, '-=0.4');
            });

            // Animation des points de timeline avec effet rebondissant
            gsap.from('.timeline-dot', {
                scrollTrigger: {
                    trigger: '.format-timeline',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                opacity: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            });

            // Animation des icônes dans les points avec rotation 3D
            gsap.from('.timeline-dot i', {
                scrollTrigger: {
                    trigger: '.format-timeline',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                rotationY: 360,
                opacity: 0,
                scale: 0.5,
                stagger: 0.3,
                duration: 1,
                delay: 0.2,
                ease: "back.out(1.7)"
            });

            // Animer les spans dans timeline-topics avec apparition décalée
            document.querySelectorAll('.timeline-topics span').forEach((span, i) => {
                const parent = span.closest('.timeline-item');
                gsap.from(span, {
                    opacity: 0,
                    y: 20,
                    delay: 0.5 + (i % 5) * 0.1,
                    duration: 0.4,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: parent,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        }

        // Animation avancée des caractéristiques avec un effet d'apparition et interaction
        const formatFeaturesContainer = document.querySelector('.format-features');
        const formatFeatures = document.querySelectorAll('.format-feature');

        if (formatFeatures.length > 0 && formatFeaturesContainer) {
            // Ajouter un effet de grille brillante en arrière-plan
            const gridEffect = document.createElement('div');
            gridEffect.className = 'feature-grid-effect';
            gridEffect.style.position = 'absolute';
            gridEffect.style.top = '0';
            gridEffect.style.left = '0';
            gridEffect.style.width = '100%';
            gridEffect.style.height = '100%';
            gridEffect.style.backgroundImage = 'radial-gradient(circle, rgba(94, 23, 235, 0.05) 1px, transparent 1px)';
            gridEffect.style.backgroundSize = '30px 30px';
            gridEffect.style.opacity = '0';
            gridEffect.style.zIndex = '-1';

            formatFeaturesContainer.style.position = 'relative';
            formatFeaturesContainer.appendChild(gridEffect);

            // Animation de la grille
            gsap.to(gridEffect, {
                opacity: 1,
                scrollTrigger: {
                    trigger: formatFeaturesContainer,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    scrub: true
                }
            });

            // Animation des features avec 3D hover
            formatFeatures.forEach((feature, i) => {
                gsap.from(feature, {
                    opacity: 0,
                    x: i % 2 === 0 ? -40 : 40,
                    y: 20,
                    rotationY: i % 2 === 0 ? 10 : -10,
                    transformOrigin: i % 2 === 0 ? "left center" : "right center",
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formatFeaturesContainer,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                });

                // Animation au survol
                feature.addEventListener('mouseenter', function() {
                    gsap.to(this, {
                        backgroundColor: 'rgba(94, 23, 235, 0.05)',
                        scale: 1.03,
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                        duration: 0.3
                    });
                });

                feature.addEventListener('mouseleave', function() {
                    gsap.to(this, {
                        backgroundColor: 'transparent',
                        scale: 1,
                        boxShadow: 'none',
                        duration: 0.3
                    });
                });
            });

            // Animation des icônes avec effet brillant
            gsap.from('.feature-icon', {
                scale: 0.5,
                rotation: -30,
                transformOrigin: "center center",
                stagger: 0.2,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: formatFeaturesContainer,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                onComplete: function() {
                    // Ajouter un effet brillant après apparition
                    document.querySelectorAll('.feature-icon').forEach(icon => {
                        const shine = document.createElement('div');
                        shine.className = 'icon-shine';
                        shine.style.position = 'absolute';
                        shine.style.top = '0';
                        shine.style.left = '-100%';
                        shine.style.width = '50%';
                        shine.style.height = '100%';
                        shine.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)';
                        shine.style.transform = 'skewX(-25deg)';

                        icon.style.position = 'relative';
                        icon.style.overflow = 'hidden';
                        icon.appendChild(shine);

                        // Animation du brillant
                        gsap.to(shine, {
                            left: '150%',
                            duration: 1,
                            ease: "power2.inOut",
                            delay: Math.random() * 1
                        });
                    });
                }
            });
        }

        // Animation dynamique des témoignages avec effets interactifs
        const testimonialsSection = document.querySelector('.testimonials');
        const testimonialCards = document.querySelectorAll('.testimonial-card');

        if (testimonialCards.length > 0 && testimonialsSection) {
            // Créer un effet de fond vibrant
            const glowEffect = document.createElement('div');
            glowEffect.className = 'testimonials-glow';
            glowEffect.style.position = 'absolute';
            glowEffect.style.top = '10%';
            glowEffect.style.left = '50%';
            glowEffect.style.transform = 'translateX(-50%)';
            glowEffect.style.width = '70%';
            glowEffect.style.height = '50%';
            glowEffect.style.borderRadius = '50%';
            glowEffect.style.background = 'radial-gradient(ellipse at center, rgba(94, 23, 235, 0.1) 0%, rgba(94, 23, 235, 0) 70%)';
            glowEffect.style.filter = 'blur(40px)';
            glowEffect.style.opacity = '0';
            glowEffect.style.zIndex = '-1';

            testimonialsSection.style.position = 'relative';
            testimonialsSection.style.overflow = 'hidden';
            testimonialsSection.appendChild(glowEffect);

            // Animation du glow
            gsap.to(glowEffect, {
                opacity: 1,
                duration: 1,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: testimonialsSection,
                    start: 'top 70%',
                    end: 'center center',
                    scrub: true
                }
            });

            // Animation 3D des cartes de témoignages
            const testimonialsTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Masquer initialement les cartes
            gsap.set(testimonialCards, {
                opacity: 0,
                y: 60,
                rotationX: 15,
                transformPerspective: 1000,
                transformStyle: "preserve-3d"
            });

            // Animation d'entrée des cartes avec décalage
            testimonialCards.forEach((card, i) => {
                testimonialsTl.to(card, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "power3.out"
                }, 0);

                // Animation au survol pour effet 3D
                card.addEventListener('mouseenter', function(e) {
                    // Calcul de l'angle en fonction de la position de la souris
                    const cardRect = this.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;

                    // Calcul de l'angle de rotation (limité à +/- 5 degrés)
                    const rotateY = ((mouseX - cardCenterX) / cardRect.width) * 5;
                    const rotateX = -((mouseY - cardCenterY) / cardRect.height) * 5;

                    gsap.to(this, {
                        rotateY: rotateY,
                        rotateX: rotateX,
                        scale: 1.03,
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                        ease: "power1.out",
                        duration: 0.5
                    });

                    // Animation de l'avatar
                    const avatar = this.querySelector('.testimonial-avatar');
                    if (avatar) {
                        gsap.to(avatar, {
                            scale: 1.08,
                            rotation: rotateY * 0.5,
                            duration: 0.5
                        });
                    }
                });

                // Retour à la position normale
                card.addEventListener('mouseleave', function() {
                    gsap.to(this, {
                        rotateY: 0,
                        rotateX: 0,
                        scale: 1,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        ease: "power2.out",
                        duration: 0.5
                    });

                    // Retour de l'avatar
                    const avatar = this.querySelector('.testimonial-avatar');
                    if (avatar) {
                        gsap.to(avatar, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.5
                        });
                    }
                });
            });

            // Suivi du mouvement de la souris pour l'effet de glow
            testimonialsSection.addEventListener('mousemove', function(e) {
                const sectionRect = this.getBoundingClientRect();
                const x = e.clientX - sectionRect.left;
                const y = e.clientY - sectionRect.top;

                gsap.to(glowEffect, {
                    left: `${(x / sectionRect.width) * 100}%`,
                    top: `${(y / sectionRect.height) * 100}%`,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });

            // Animation des avatars avec effet 3D
            gsap.from('.testimonial-avatar', {
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                scale: 0,
                rotation: -15,
                y: 30,
                stagger: 0.25,
                duration: 1,
                delay: 0.3,
                ease: "elastic.out(1, 0.5)"
            });

            // Animation scintillante des étoiles
            const stars = document.querySelectorAll('.testimonial-stars i');
            stars.forEach((star, i) => {
                const parent = star.closest('.testimonial-card');
                gsap.from(star, {
                    opacity: 0,
                    scale: 0,
                    rotation: 90,
                    transformOrigin: "center center",
                    duration: 0.3,
                    delay: 0.8 + (i % 5) * 0.1,
                    ease: "back.out(2)",
                    scrollTrigger: {
                        trigger: parent,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    onComplete: function() {
                        // Animation scintillante une fois les étoiles apparues
                        gsap.to(star, {
                            scale: 1.2,
                            duration: 0.3,
                            repeat: 1,
                            yoyo: true,
                            ease: "power1.inOut"
                        });
                    }
                });
            });

            // Animation des résultats chiffrés
            const resultValues = document.querySelectorAll('.result-value');
            resultValues.forEach(value => {
                const parent = value.closest('.testimonial-card');
                const text = value.textContent;
                let numValue = 0;

                // Extraire la valeur numérique si présente
                const matches = text.match(/(\d+)/);
                if (matches && matches[1]) {
                    numValue = parseInt(matches[1]);
                    value.setAttribute('data-value', text);
                    value.textContent = text.replace(numValue, "0");

                    // Animation de comptage
                    gsap.to({val: 0}, {
                        val: numValue,
                        duration: 1.5,
                        delay: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: parent,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse'
                        },
                        onUpdate: function() {
                            value.textContent = text.replace(numValue, Math.round(this.targets()[0].val));
                        }
                    });
                }
            });
        }

        // Animation interactive du formulaire d'inscription
        const registrationSection = document.querySelector('.registration');
        const registrationForm = document.querySelector('#registration-form');

        if (registrationForm && registrationSection) {
            // Créer un effet de fond
            const formBackground = document.createElement('div');
            formBackground.className = 'form-background';
            formBackground.style.position = 'absolute';
            formBackground.style.top = '0';
            formBackground.style.left = '0';
            formBackground.style.width = '100%';
            formBackground.style.height = '100%';
            formBackground.style.zIndex = '-1';
            formBackground.style.opacity = '0';
            formBackground.style.background = 'linear-gradient(135deg, rgba(94, 23, 235, 0.05) 0%, rgba(255, 255, 255, 0) 50%, rgba(94, 23, 235, 0.05) 100%)';

            registrationSection.style.position = 'relative';
            registrationSection.style.overflow = 'hidden';
            registrationSection.insertBefore(formBackground, registrationSection.firstChild);

            // Animation du fond
            gsap.to(formBackground, {
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: registrationSection,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Animation avancée du formulaire avec séquence et effets de transition
            const formTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: registrationSection,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Titre avec effet de découverte
            const title = registrationSection.querySelector('h2');
            if (title) {
                // Cacher initialement
                gsap.set(title, { overflow: 'hidden' });

                const titleContent = title.innerHTML;
                title.innerHTML = '';

                const titleWrapper = document.createElement('div');
                titleWrapper.innerHTML = titleContent;
                titleWrapper.style.opacity = '0';
                titleWrapper.style.transform = 'translateY(30px)';

                title.appendChild(titleWrapper);

                formTimeline.to(titleWrapper, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.5)"
                });
            }

            // Animation des places limitées avec effet spécial
            formTimeline.from('.limited-spots', {
                opacity: 0,
                scale: 0.8,
                y: 15,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)"
            }, '-=0.3');

            // Style initial pour les champs de formulaire
            gsap.set('.form-group input, .form-group checkbox-group', {
                opacity: 0,
                y: 30,
                filter: 'blur(5px)'
            });

            // Animation séquentielle des champs de formulaire
            document.querySelectorAll('.form-group').forEach((group, i) => {
                formTimeline.to(group.querySelector('input, checkbox-group'), {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.5,
                    ease: "power2.out"
                }, `-=${i > 0 ? 0.3 : 0}`);

                // Ajouter des effets d'interaction sur les champs
                const input = group.querySelector('input');
                if (input) {
                    input.addEventListener('focus', function() {
                        gsap.to(this, {
                            boxShadow: '0 0 0 3px rgba(94, 23, 235, 0.2)',
                            duration: 0.3
                        });
                    });

                    input.addEventListener('blur', function() {
                        gsap.to(this, {
                            boxShadow: 'none',
                            duration: 0.3
                        });
                    });
                }
            });

            // Animation spéciale pour le bouton (désactivée pour éviter les problèmes de visibilité)
            // Nous laissons le bouton de soumission visible en permanence
            /*
            formTimeline
                .from('#registration-form button', {
                    opacity: 0,
                    y: 25,
                    scale: 0.9,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                }, '-=0.2')
            */


            // Animation au survol du bouton
            const submitBtn = registrationForm.querySelector('button');
            if (submitBtn) {
                submitBtn.addEventListener('mouseenter', function() {
                    gsap.to(this, {
                        scale: 1.05,
                        boxShadow: '0 10px 20px rgba(94, 23, 235, 0.3)',
                        duration: 0.3
                    });
                });

                submitBtn.addEventListener('mouseleave', function() {
                    gsap.to(this, {
                        scale: 1,
                        boxShadow: '0 4px 12px rgba(94, 23, 235, 0.2)',
                        duration: 0.3
                    });
                });
            }
        }

        // Animation du CTA flottant
        gsap.to('.primary-cta', {
            y: '-8px',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Animation du compteur de places (pulse)
        gsap.to('.highlight-number', {
            scale: 1.1,
            color: '#ff3860',
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // Fonction pour créer les particules animées dans la hero section

    // Fonction pour animer une particule en continu
    function animateParticle(particle, duration) {
        // Positions aléatoires
        const newX = Math.random() * 100;
        const newY = Math.random() * 100;

        // Animation de mouvement
        gsap.to(particle, {
            left: `${newX}%`,
            top: `${newY}%`,
            duration: duration,
            ease: "power1.inOut",
            onComplete: () => animateParticle(particle, duration)
        });

        // Animation de taille et opacité
        gsap.to(particle, {
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            duration: duration * 0.6,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
        });
    }

    // Ajout d'un effet de parallaxe sur la souris pour la section hero
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroSection && heroContent && heroImage) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to(heroImage, {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: "power2.out"
            });

            gsap.to(heroContent, {
                x: -xPos * 0.5,
                y: -yPos * 0.5,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // Animation des badges au hover
    const badges = document.querySelectorAll('.format-badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, {
                y: -8,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, {
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    // Observer pour détecter les éléments visibles
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter la classe visible pour déclencher l'animation
                entry.target.classList.add('visible');

                // Si c'est une section ou un en-tête, animer également les enfants
                if (entry.target.classList.contains('section-header') ||
                    entry.target.classList.contains('format-header')) {
                    entry.target.querySelectorAll('h2, .section-tag, .section-intro, .format-intro').forEach(child => {
                        child.classList.add('visible');
                    });
                }

                // Animer les cartes à l'intérieur des sections
                if (entry.target.classList.contains('benefits-grid')) {
                    entry.target.querySelectorAll('.benefit-card').forEach((card, index) => {
                        // Ajouter un délai progressif pour l'effet en cascade
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }

                // Animer les cartes des témoignages
                if (entry.target.classList.contains('testimonials-grid')) {
                    entry.target.querySelectorAll('.testimonial-card').forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 150);
                    });
                }

                // Arrêter d'observer cet élément une fois animé
                observer.unobserve(entry.target);

                // console.log(`Element rendu visible: ${entry.target.className}`);
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-on-scroll
    document.querySelectorAll('.animate-on-scroll, .section-header, .format-header, .benefit-card, .testimonial-card, .benefits-grid, .testimonials-grid, .format-feature').forEach(element => {
        // S'assurer que l'élément a la classe animation-ready
        if (!element.classList.contains('animation-ready')) {
            element.classList.add('animation-ready');
        }
        observer.observe(element);
    });

    // Fonction pour initialiser le compteur à rebours avec animations
    function initWorkshopCountdown() {
        // console.log('🕒 Initialisation du compte à rebours');

        // Date de l'événement (11 jours à partir de maintenant pour les tests)
        const now = new Date();
        const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 11,
                                  now.getHours() + 1, now.getMinutes() + 14).getTime();

        // Sélection des éléments du DOM
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');

        if (!daysElement || !hoursElement || !minutesElement) {
            console.warn('⚠️ Éléments du compte à rebours non trouvés');
            return;
        }

        // Variables pour stocker les valeurs précédentes
        let prevDays = -1;
        let prevHours = -1;
        let prevMinutes = -1;

        // Fonction pour animer le changement de valeur
        function animateValue(element, newValue) {
            // Si l'élément existe et que la valeur a changé
            if (element) {
                // Appliquer la nouvelle valeur
                element.innerText = newValue;

                // Ajouter une animation simple
                element.style.transform = 'scale(1.1)';
                element.style.color = '#5e17eb';

                // Revenir à la normale après l'animation
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = '';
                    element.style.transition = 'all 0.3s ease';
                }, 300);
            }
        }

        // Mise à jour du compteur toutes les secondes
        const countdownTimer = setInterval(function() {
            // Date actuelle
            const currentTime = new Date().getTime();

            // Différence entre la date de l'événement et maintenant
            const distance = eventDate - currentTime;

            // Si le compteur est terminé
            if (distance < 0) {
                clearInterval(countdownTimer);
                if (document.querySelector('.countdown-container')) {
                    document.querySelector('.countdown-container').innerHTML = '<div class="countdown-title">Le workshop a commencé !</div>';
                }
                return;
            }

            // Calculs pour jours, heures, minutes
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            // Animer seulement lorsque les valeurs changent
            if (days !== prevDays) {
                animateValue(daysElement, days);
                prevDays = days;
            }

            if (hours !== prevHours) {
                animateValue(hoursElement, hours);
                prevHours = hours;
            }

            if (minutes !== prevMinutes) {
                animateValue(minutesElement, minutes);
                prevMinutes = minutes;
            }

        }, 1000);

        // console.log('✅ Compte à rebours initialisé avec succès');
    }

    // Fonction pour initialiser les interactions de la section workshop-format
    function initWorkshopFormatInteractions() {
        // Gestion du clic sur les items de la timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        const progressFill = document.querySelector('.progress-fill');
        const progressSteps = document.querySelectorAll('.progress-step');

        timelineItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Retirer la classe active de tous les items
                timelineItems.forEach(i => i.classList.remove('active'));

                // Ajouter la classe active à l'item cliqué
                this.classList.add('active');

                // Mise à jour de la barre de progression
                if (progressFill) {
                    progressFill.style.width = `${(index + 1) * 25}%`;
                }

                // Mise à jour des étapes de progression
                if (progressSteps.length) {
                    progressSteps.forEach((step, i) => {
                        if (i <= index) {
                            step.classList.add('active');
                        } else {
                            step.classList.remove('active');
                        }
                    });
                }
            });
        });

        // Gestion du clic sur les boutons de secteur
        const sectorButtons = document.querySelectorAll('.sector-btn');

        sectorButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                sectorButtons.forEach(btn => btn.classList.remove('active'));

                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');

                // Ici, vous pourriez ajouter du code pour charger dynamiquement du contenu
                // spécifique au secteur sélectionné
                const sector = this.getAttribute('data-sector');
                // console.log(`Secteur sélectionné : ${sector}`);
            });
        });

        // Gestion du formulaire de question préalable
        const preQuestionForm = document.querySelector('.question-input-group');

        if (preQuestionForm) {
            const questionInput = preQuestionForm.querySelector('.pre-question-input');
            const questionBtn = preQuestionForm.querySelector('.pre-question-btn');

            questionBtn.addEventListener('click', function() {
                if (questionInput.value.trim() !== '') {
                    // Ici, vous pourriez envoyer la question à un serveur
                    // console.log(`Question soumise : ${questionInput.value}`);

                    // Afficher un message de confirmation
                    preQuestionForm.innerHTML = '<p class="question-success">Votre question a bien été envoyée. Merci !</p>';
                }
            });
        }
    }

    // Fonction pour s'assurer que la section benefits est visible
    function ensureBenefitsSectionVisibility() {
        const benefitsSection = document.querySelector('.benefits');
        if (benefitsSection) {
            // Forcer la visibilité de la section benefits avec des propriétés importantes
            benefitsSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; overflow: visible !important;';

            // S'assurer que le container est visible
            const container = benefitsSection.querySelector('.container');
            if (container) {
                container.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
            }            // S'assurer que la grille est visible et configurée en 2 colonnes et 2 lignes
            const grid = benefitsSection.querySelector('.benefits-grid');
            if (grid) {
                grid.style.cssText = 'display: grid !important; grid-template-columns: repeat(2, 1fr) !important; grid-template-rows: repeat(2, auto) !important; visibility: visible !important; opacity: 1 !important;';
                // Ajouter les classes animation-ready et visible
                if (!grid.classList.contains('animation-ready')) {
                    grid.classList.add('animation-ready');
                }
                if (!grid.classList.contains('visible')) {
                    grid.classList.add('visible');
                }
            }

            // S'assurer que les cartes sont visibles
            const benefitCards = benefitsSection.querySelectorAll('.benefit-card');
            benefitCards.forEach(card => {
                card.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            });

            // console.log('Visibilité de la section benefits forcée avec !important');
        } else {
            console.error('Section benefits non trouvée');
        }
    }

    // Réexécuter après un court délai pour s'assurer que tout est bien appliqué
    setTimeout(ensureBenefitsSectionVisibility, 1000);
    // Et encore une fois après le chargement complet de la page
    window.addEventListener('load', ensureBenefitsSectionVisibility);

    // Fonction pour initialiser la timeline verticale
    function initVerticalTimeline() {
        // console.log("Initialisation de la timeline verticale...");

        // Sélection du conteneur de la timeline verticale
        const timelineContainer = document.querySelector('.format-timeline.vertical');

        if (!timelineContainer) {
            console.warn("Le conteneur de timeline verticale n'a pas été trouvé");
            return;
        }

        // Forcer les styles importants
        timelineContainer.style.display = "flex";
        timelineContainer.style.flexDirection = "column";
        timelineContainer.style.visibility = "visible";
        timelineContainer.style.opacity = "1";

        // Sélection des éléments
        const verticalTimelineItems = document.querySelectorAll('.format-timeline.vertical .timeline-item');

        if (verticalTimelineItems && verticalTimelineItems.length > 0) {
            // console.log("Timeline verticale trouvée avec", verticalTimelineItems.length, "éléments");

            // Ajouter une classe pour l'initialisation GSAP
            timelineContainer.classList.add('gsap-init');

            // S'assurer que les items sont visibles
            verticalTimelineItems.forEach(item => {
                item.style.visibility = "visible";
                item.style.opacity = "1";
                item.style.display = "block";

                // Gestion du clic sur l'élément
                item.addEventListener('click', function() {
                    // Retirer la classe active de tous les items
                    verticalTimelineItems.forEach(i => i.classList.remove('active'));

                    // Ajouter la classe active à l'item cliqué
                    this.classList.add('active');

                    // console.log("Élément de timeline activé:", this.querySelector('h3')?.textContent || "Sans titre");
                });
            });

            // Si GSAP est disponible, ajouter des animations améliorées
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                // Réinitialiser d'abord les animations existantes pour éviter les conflits
                gsap.killTweensOf('.format-timeline.vertical .timeline-item');

                // S'assurer que les éléments sont visibles
                gsap.set('.format-timeline.vertical .timeline-item', {clearProps: 'all'});

                // Animation d'entrée avec décalage pour chaque élément
                const timelineTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.format-timeline.vertical',
                        start: 'top 80%',
                        once: true,
                        toggleActions: 'play none none none'
                    }
                });

                // Animation des éléments de la timeline
                timelineTl.from('.format-timeline.vertical .timeline-item', {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.7,
                    ease: "back.out(1.2)",
                    clearProps: "opacity,transform"
                });

                // Animation des points de la timeline
                timelineTl.from('.format-timeline.vertical .timeline-dot', {
                    scale: 0.5,
                    opacity: 0.5,
                    stagger: 0.2,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                }, "-=0.5");
            }
        } else {
            // console.log("Aucune timeline verticale trouvée dans le document");
        }
    }

    // Initialiser la timeline verticale
    initVerticalTimeline();

    // Observer pour détecter quand la timeline devient visible
    function setupTimelineObserver() {
        if (!('IntersectionObserver' in window)) return;

        const timelineContainer = document.querySelector('.format-timeline.vertical');
        if (!timelineContainer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // La timeline est visible, déclencher l'animation si pas déjà animée
                    if (!timelineContainer.classList.contains('animated')) {
                        timelineContainer.classList.add('animated');
                        // Réinitialiser l'animation GSAP pour la déclencher à nouveau
                        if (typeof gsap !== 'undefined') {
                            // L'animation sera gérée par la fonction initVerticalTimeline
                            initVerticalTimeline();
                        }
                    }
                }
            });
        }, {
            threshold: 0.2,  // Déclenche quand au moins 20% de l'élément est visible
            rootMargin: '0px 0px -100px 0px'  // Un peu avant que l'élément soit complètement visible
        });

        observer.observe(timelineContainer);
    }

    // Configurer l'observer après un court délai pour s'assurer que le DOM est prêt
    setTimeout(setupTimelineObserver, 500);

    /**
     * Fonction pour corriger les problèmes d'affichage du bouton de soumission
     */
    function fixSubmitButton() {
        // Récupérer le bouton de soumission
        const submitButton = document.querySelector('.submit-button');

        if (submitButton) {
            // console.log('🛠️ Correction du bouton de soumission...');

            // Suppression d'éventuels styles inline problématiques
            submitButton.removeAttribute('style');
            submitButton.style.opacity = '1';
            submitButton.style.transform = 'none';
            submitButton.style.boxShadow = '0 10px 20px rgba(94, 23, 235, 0.2)';
            submitButton.style.visibility = 'visible';
            submitButton.style.position = 'relative';

            // Ajouter une classe pour appliquer des styles supplémentaires
            submitButton.classList.add('form-button-fixed');

            // console.log('✅ Styles du bouton de soumission corrigés');

            // Observer les changements de style pour maintenir la visibilité
            if (window.MutationObserver) {
                const submitButtonObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'style') {
                            if (submitButton.style.opacity === '0' ||
                                submitButton.style.transform.includes('translate') ||
                                submitButton.style.visibility === 'hidden') {

                                // Réappliquer les corrections
                                submitButton.style.opacity = '1';
                                submitButton.style.transform = 'none';
                                submitButton.style.visibility = 'visible';
                                // console.log('🔄 Styles du bouton réappliqués');
                            }
                        }
                    });
                });

                // Démarrer l'observation
                submitButtonObserver.observe(submitButton, { attributes: true });
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Date cible du workshop (25 mai 2025 à 12h)
    const workshopDate = new Date('2025-05-25T12:00:00+02:00');

    // Éléments du compteur
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');

    // Créer un élément pour les secondes si nécessaire
    let secondsElement = document.getElementById('countdown-seconds');

    // Si l'élément des secondes n'existe pas, on le crée dynamiquement
    if (!secondsElement) {
        const timerContainer = document.getElementById('workshop-countdown');

        if (timerContainer) {
            // Créer l'élément pour les secondes
            const secondsItem = document.createElement('div');
            secondsItem.className = 'countdown-item';

            // Créer l'élément pour la valeur des secondes
            secondsElement = document.createElement('span');
            secondsElement.className = 'countdown-value';
            secondsElement.id = 'countdown-seconds';
            secondsElement.textContent = '00';

            // Créer l'élément pour le label des secondes
            const secondsLabel = document.createElement('span');
            secondsLabel.className = 'countdown-label';
            secondsLabel.textContent = 'Secondes';

            // Ajouter les éléments au DOM
            secondsItem.appendChild(secondsElement);
            secondsItem.appendChild(secondsLabel);
            timerContainer.appendChild(secondsItem);
        }
    }

    // Fonction pour mettre à jour le compteur
    function updateCountdown() {
        // Date et heure actuelles
        const now = new Date();

        // Différence en millisecondes
        const diff = workshopDate - now;

        // Si la date est passée
        if (diff <= 0) {
            daysElement.textContent = '0';
            hoursElement.textContent = '0';
            minutesElement.textContent = '0';
            if (secondsElement) secondsElement.textContent = '0';
            return;
        }

        // Calcul des jours, heures, minutes, secondes restants
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Mise à jour des éléments HTML avec animation
        updateElementWithAnimation(daysElement, days);
        updateElementWithAnimation(hoursElement, hours);
        updateElementWithAnimation(minutesElement, minutes);
        if (secondsElement) updateElementWithAnimation(secondsElement, seconds, true);
    }

    // Fonction pour mettre à jour un élément avec animation
    function updateElementWithAnimation(element, newValue, isSeconds = false) {
        // Formater la valeur (ajouter un zéro devant si nécessaire)
        const formattedValue = newValue < 10 && isSeconds ? `0${newValue}` : newValue.toString();

        // Si la valeur est différente, on anime
        if (element.textContent !== formattedValue) {
            // Animation différente pour les secondes (plus subtile)
            if (isSeconds) {
                element.textContent = formattedValue;
                element.classList.add('countdown-seconds-update');
                setTimeout(() => {
                    element.classList.remove('countdown-seconds-update');
                }, 500);
            } else {
                // Animation standard pour les autres éléments
                element.classList.add('countdown-update');

                // Après un court délai, mettre à jour la valeur
                setTimeout(() => {
                    element.textContent = formattedValue;

                    // Retirer la classe d'animation après la mise à jour
                    setTimeout(() => {
                        element.classList.remove('countdown-update');
                    }, 300);
                }, 200);
            }
        }
    }

    // Mettre à jour le compteur immédiatement
    updateCountdown();

    // Mettre à jour le compteur toutes les secondes pour un décompte fluide
    setInterval(updateCountdown, 1000);

    // Ajouter une animation de pulsation pour indiquer que le compteur est actif
    function addPulseEffect() {
        if (secondsElement) {
            secondsElement.classList.add('pulse-effect');
            setTimeout(() => {
                secondsElement.classList.remove('pulse-effect');
            }, 500);
        }
    }

    // Faire pulser les secondes chaque seconde pour montrer que le compteur est actif
    setInterval(addPulseEffect, 1000);
});


// Script de débogage pour les animations
(function() {
    // Fonction de débogage sans bouton
    function debugAnimations() {
        // console.log('🔍 Vérification des animations activée');
        // La fonction est conservée mais sans créer de bouton visible
    }

    // Réinitialiser toutes les animations
    function resetAllAnimations() {
        // console.log('🔄 Réinitialisation des animations...');

        // Supprimer toutes les classes 'visible'
        document.querySelectorAll('.visible').forEach(el => {
            el.classList.remove('visible');
        });

        // Ajouter la classe animation-ready à tous les éléments animables
        const animatableSelectors = [
            '.animate-on-scroll',
            '.section-header',
            '.format-header',
            '.benefit-card',
            '.format-feature',
            '.testimonial-card',
            '.footer-column'
        ];

        document.querySelectorAll(animatableSelectors.join(', ')).forEach(el => {
            if (!el.classList.contains('animation-ready')) {
                el.classList.add('animation-ready');
            }
        });

        // Déclencher le scroll pour redémarrer les observers
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);

        // console.log('✅ Animations réinitialisées! Faites défiler pour voir les animations.');
    }

    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Activer le débogage des animations sans bouton
        setTimeout(debugAnimations, 1500);

        // Log pour confirmer que le script est chargé
        // console.log('🔍 Script de débogage d\'animations chargé');
    });
})();



class TrafficSourceTracker {
    constructor() {
        this.utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
        this.storageKey = 'databird_traffic_source';
        this.conversionStorageKey = 'databird_conversion_data';
        this.init();
    }

    init() {
        // Capture des paramètres UTM à l'arrivée sur la page
        if (this.hasUtmParameters()) {
            const utmData = this.captureUtmParameters();
            this.storeTrafficSource(utmData);
            // console.log('UTM parameters captured:', utmData);
        }

        // Écoute des événements de conversion
        this.listenForConversions();
    }

    hasUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return this.utmParams.some(param => urlParams.has(param));
    }

    captureUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {};

        this.utmParams.forEach(param => {
            if (urlParams.has(param)) {
                utmData[param] = urlParams.get(param);
            }
        });

        // Ajout de données supplémentaires
        utmData.timestamp = new Date().toISOString();
        utmData.landingPage = window.location.pathname;
        utmData.referrer = document.referrer;
        utmData.device = this.getDeviceType();

        return utmData;
    }

    storeTrafficSource(utmData) {
        localStorage.setItem(this.storageKey, JSON.stringify(utmData));
    }

    getTrafficSource() {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    listenForConversions() {
        // Écoute du formulaire d'inscription
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => {
                this.trackConversion('form_submission', {
                    formId: 'registration-form',
                    formAction: 'workshop_registration'
                });
            });
        }

        // Écoute des clics sur les CTA
        const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button');
        ctaButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                this.trackConversion('cta_click', {
                    buttonId: button.id || `cta-${index}`,
                    buttonText: button.textContent.trim(),
                    buttonPosition: this.getElementPosition(button)
                });
            });
        });
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            top: rect.top + scrollTop,
            section: this.findParentSection(element)
        };
    }

    findParentSection(element) {
        let parent = element.parentElement;
        while (parent && parent.tagName !== 'SECTION') {
            parent = parent.parentElement;
        }
        return parent ? parent.id || parent.className : 'unknown';
    }

    trackConversion(eventType, eventData) {
        // Récupération de la source de trafic
        const trafficSource = this.getTrafficSource();

        // Création de l'événement de conversion
        const conversionEvent = {
            eventType,
            eventData,
            trafficSource,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            sessionId: this.getSessionId()
        };

        // Envoi à l'analytics
        this.sendToAnalytics(conversionEvent);

        // Stockage local pour debug
        this.storeConversionEvent(conversionEvent);

        // console.log('Conversion tracked:', conversionEvent);
        return conversionEvent;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('databird_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('databird_session_id', sessionId);
        }
        return sessionId;
    }

    storeConversionEvent(conversionEvent) {
        let storedEvents = localStorage.getItem(this.conversionStorageKey);
        const events = storedEvents ? JSON.parse(storedEvents) : [];
        events.push(conversionEvent);
        localStorage.setItem(this.conversionStorageKey, JSON.stringify(events));
    }

    sendToAnalytics(conversionEvent) {
        // Envoi à Google Analytics 4
        if (typeof gtag === 'function') {
            gtag('event', conversionEvent.eventType, {
                traffic_source: conversionEvent.trafficSource?.utm_source || 'direct',
                traffic_medium: conversionEvent.trafficSource?.utm_medium || 'none',
                traffic_campaign: conversionEvent.trafficSource?.utm_campaign || 'none',
                event_data: JSON.stringify(conversionEvent.eventData)
            });
        }

        // Envoi à Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('trackCustom', conversionEvent.eventType, {
                traffic_source: conversionEvent.trafficSource?.utm_source || 'direct',
                traffic_medium: conversionEvent.trafficSource?.utm_medium || 'none',
                traffic_campaign: conversionEvent.trafficSource?.utm_campaign || 'none',
                content: conversionEvent.trafficSource?.utm_content || 'none',
                event_data: conversionEvent.eventData
            });
        }

        // Envoi à notre serveur pour analyse avancée
        this.sendToServer(conversionEvent);
    }

    sendToServer(conversionEvent) {
        // Endpoint fictif - à remplacer par votre vrai endpoint
        const endpoint = 'https://analytics.databird.co/api/track';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversionEvent),
        })
        .then(response => response.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.error('Error sending to server:', error));
    }

    // Méthodes d'analyse des conversions
    getConversionsBySource() {
        const storedEvents = localStorage.getItem(this.conversionStorageKey);
        if (!storedEvents) return {};

        const events = JSON.parse(storedEvents);
        const conversionsBySource = {};

        events.forEach(event => {
            const source = event.trafficSource?.utm_source || 'direct';
            if (!conversionsBySource[source]) {
                conversionsBySource[source] = [];
            }
            conversionsBySource[source].push(event);
        });

        return conversionsBySource;
    }

    getConversionRateBySource() {
        // Cette fonction nécessiterait des données de visite totales par source
        // Pour une démo, nous utilisons des données fictives
        return {
            'facebook': 0.042, // 4.2%
            'instagram': 0.038, // 3.8%
            'linkedin': 0.065, // 6.5%
            'google': 0.028, // 2.8%
            'direct': 0.015 // 1.5%
        };
    }

    // Méthode pour générer un rapport
    generateSourceReport() {
        const conversionsBySource = this.getConversionsBySource();
        const conversionRates = this.getConversionRateBySource();

        const report = {
            timestamp: new Date().toISOString(),
            totalConversions: 0,
            sourceBreakdown: {}
        };

        for (const source in conversionsBySource) {
            const conversions = conversionsBySource[source];
            report.totalConversions += conversions.length;

            report.sourceBreakdown[source] = {
                conversions: conversions.length,
                conversionRate: conversionRates[source] || 'N/A',
                events: conversions
            };
        }

        // console.log('Conversion Report:', report);
        return report;
    }
}

// Initialisation du tracker
const trafficTracker = new TrafficSourceTracker();

// Exposition globale pour utilisation dans la console
window.trafficTracker = trafficTracker;

// Fonction pour générer un dashboard simple
function createConversionDashboard() {
    // Cette fonction pourrait être utilisée pour créer un dashboard visuel
    // des conversions par source de trafic
    const report = trafficTracker.generateSourceReport();
    // console.log('Dashboard data prepared:', report);

    // Ici, vous pourriez injecter un élément visuel dans la page
    // pour les administrateurs ou pour le debug
}

// Création d'un petit helper pour les URL UTM
window.createUtmUrl = function(baseUrl, params) {
    const url = new URL(baseUrl);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    return url.toString();
};

// Exemple d'utilisation:
// createUtmUrl('https://databird.co/workshop', {
//     utm_source: 'facebook',
//     utm_medium: 'cpc',
//     utm_campaign: 'workshop_ia_mai',
//     utm_content: 'image_1'
// });

/**
 * Tracking des clics sur les liens et boutons
 * Optimisation des performances et de la couverture du tracking
 */
document.addEventListener('DOMContentLoaded', function() {
    // Tracking des clics sur les boutons CTA
    trackCTAClicks();

    // Tracking des clics sur les liens d'ancre
    trackAnchorLinks();

    // Tracking des formulaires
    trackForms();
});

/**
 * Tracker les clics sur les boutons CTA principaux
 */
function trackCTAClicks() {
    // Sélectionner tous les boutons CTA
    const ctaButtons = document.querySelectorAll('.cta-button, .primary-cta, .secondary-cta, .secondary-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Récupérer le texte du bouton pour l'identifier
            const buttonText = this.textContent.trim();

            // Récupérer la section où se trouve le bouton
            const sectionId = findParentSection(this);

            // Envoyer l'événement à Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    event_category: 'engagement',
                    event_label: buttonText,
                    section: sectionId
                });
            }

            // Envoyer l'événement à Meta Pixel
            if (typeof fbq === 'function') {
                fbq('trackCustom', 'CTAClick', {
                    button_text: buttonText,
                    section: sectionId
                });
            }

            // console.log('CTA click tracked:', buttonText, 'in section:', sectionId);
        });
    });
}

/**
 * Tracker les clics sur les liens d'ancre pour analyser la navigation
 */
function trackAnchorLinks() {
    // Sélectionner tous les liens d'ancre (internes à la page)
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Récupérer la cible du lien
            const targetId = this.getAttribute('href').replace('#', '');

            // Récupérer le texte du lien
            const linkText = this.textContent.trim();

            // Envoyer l'événement à Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'navigation', {
                    event_category: 'engagement',
                    event_label: `${linkText} (${targetId})`,
                    destination: targetId
                });
            }

            // console.log('Navigation tracked:', linkText, 'to section:', targetId);
        });
    });
}

/**
 * Tracker les soumissions de formulaires
 */
function trackForms() {
    // Trouver le formulaire d'inscription
    const regForm = document.getElementById('registration-form');

    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            // Le formulaire est déjà tracké dans le script principal, mais on pourrait ajouter des métriques ici
            // console.log('Form submission tracked');
        });
    }

    // Trouver le formulaire de questions préalables
    const questionForm = document.getElementById('pre-question-form');

    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer la question
            const questionInput = this.querySelector('input[name="question"]');
            const question = questionInput ? questionInput.value : '';

            // Envoyer l'événement à Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'question_submission', {
                    event_category: 'engagement',
                    event_label: question.substring(0, 30) + '...'
                });
            }

            // console.log('Question submission tracked');

            // Simuler l'envoi du formulaire (à remplacer par votre API réelle)
            setTimeout(() => {
                if (questionInput) questionInput.value = '';
                alert('Merci pour votre question ! Notre formateur la prendra en compte.');
            }, 1000);
        });
    }

    // Trouver le formulaire de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Envoyer l'événement à Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'conversion',
                    event_label: 'footer_signup'
                });
            }

            // Envoyer l'événement à Meta Pixel
            if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                    content_name: 'Newsletter Signup',
                    content_category: 'Newsletter'
                });
            }

            // console.log('Newsletter submission tracked');

            // Simuler l'envoi du formulaire (à remplacer par votre API réelle)
            setTimeout(() => {
                const emailInput = this.querySelector('input[type="email"]');
                if (emailInput) emailInput.value = '';
                alert('Merci pour votre inscription à la newsletter !');
            }, 1000);
        });
    }
}

/**
 * Trouver la section parente d'un élément
 * @param {HTMLElement} element - L'élément dont on cherche la section parente
 * @return {string} - L'ID de la section parente ou "unknown" si non trouvé
 */
function findParentSection(element) {
    let currentElement = element;

    // Remonter l'arbre DOM jusqu'à trouver une section ou atteindre le body
    while (currentElement && currentElement !== document.body) {
        // Vérifier si l'élément est une section
        if (currentElement.tagName.toLowerCase() === 'section') {
            return currentElement.id || 'unnamed-section';
        }

        // Passer au parent
        currentElement = currentElement.parentElement;
    }

    return 'unknown';
}


// Script pour corriger les animations au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour initialiser les animations au défilement
    function initScrollAnimations() {
        // console.log('🎬 Initialisation des animations au défilement');

        // Liste des types d'éléments à animer
        const animatableSelectors = [
            '.animate-on-scroll',
            '.section-header',
            '.format-header',
            '.benefit-card',
            '.format-feature',
            '.testimonial-card',
            '.footer-column',
            '.footer-brand',
            '.footer-nav',
            '.footer-resources',
            '.footer-contact',
            '.benefits-grid',
            '.testimonials-grid'
        ];

        // Sélectionne tous les éléments à animer
        const elementsToAnimate = document.querySelectorAll(animatableSelectors.join(', '));

        // Ajoute la classe animation-ready à tous ces éléments
        elementsToAnimate.forEach(element => {
            if (!element.classList.contains('animation-ready')) {
                element.classList.add('animation-ready');
                // console.log(`✅ Élément préparé pour animation: ${element.className}`);
            }

            // Pour les sections, animer également les enfants spécifiques
            if (element.classList.contains('section-header') || element.classList.contains('format-header')) {
                element.querySelectorAll('h2, .section-tag, .section-intro, .format-intro').forEach(child => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(20px)';
                    child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                });
            }
        });

        // console.log(`🎬 ${elementsToAnimate.length} éléments préparés pour l'animation au défilement`);
    }

    // Créer un nouvel observateur pour forcer l'animation des éléments qui sont déjà visibles
    function forceVisibleAnimations() {
        // Options plus permissives pour attraper les éléments déjà visibles
        const immediateOptions = {
            threshold: 0.01,
            rootMargin: "0px"
        };

        const immediateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    immediateObserver.unobserve(entry.target);
                    // console.log(`🎬 Animation forcée: ${entry.target.className}`);
                }
            });
        }, immediateOptions);

        // Observer tous les éléments avec la classe animation-ready
        document.querySelectorAll('.animation-ready').forEach(element => {
            immediateObserver.observe(element);
        });
    }

    // S'assurer que la fonction est exécutée après le chargement du DOM
    initScrollAnimations();

    // Forcer l'animation des éléments visibles après un court délai
    setTimeout(forceVisibleAnimations, 300);

    // Réexécuter après un délai plus long pour s'assurer que tous les éléments sont bien préparés
    setTimeout(initScrollAnimations, 1000);
    setTimeout(forceVisibleAnimations, 1200);
      // Ajouter un gestionnaire d'événements pour corriger les animations au scroll
    window.addEventListener('scroll', function() {
        // Déclencher à nouveau l'animation des éléments qui devraient être visibles
        setTimeout(forceVisibleAnimations, 100);
    }, { passive: true });

    // Ajouter des délais progressifs aux éléments pour créer un effet en cascade
    function addStaggeredDelays() {
        // Applique des délais aux cartes de bénéfices
        document.querySelectorAll('.benefit-card').forEach((card, index) => {
            card.style.setProperty('--i', index);
        });

        // Applique des délais aux cartes de témoignages
        document.querySelectorAll('.testimonial-card').forEach((card, index) => {
            card.style.setProperty('--i', index);
        });

        // Applique des délais aux fonctionnalités
        document.querySelectorAll('.format-feature').forEach((feature, index) => {
            feature.style.setProperty('--i', index);
        });

        // Applique des délais aux colonnes du footer
        document.querySelectorAll('.footer-column, .footer-brand, .footer-nav, .footer-resources, .footer-contact').forEach((column, index) => {
            column.style.setProperty('--i', index);
        });

        // console.log('⏱️ Délais en cascade ajoutés');
    }

    // Exécuter après un court délai
    setTimeout(addStaggeredDelays, 200);
});

// Script de débogage pour les animations
(function() {
    // Fonction de débogage sans bouton
    function debugAnimations() {
        // console.log('🔍 Vérification des animations activée');
        // La fonction est conservée mais sans créer de bouton visible
    }

    // Réinitialiser toutes les animations
    function resetAllAnimations() {
        // console.log('🔄 Réinitialisation des animations...');

        // Supprimer toutes les classes 'visible'
        document.querySelectorAll('.visible').forEach(el => {
            el.classList.remove('visible');
        });

        // Ajouter la classe animation-ready à tous les éléments animables
        const animatableSelectors = [
            '.animate-on-scroll',
            '.section-header',
            '.format-header',
            '.benefit-card',
            '.format-feature',
            '.testimonial-card',
            '.footer-column'
        ];

        document.querySelectorAll(animatableSelectors.join(', ')).forEach(el => {
            if (!el.classList.contains('animation-ready')) {
                el.classList.add('animation-ready');
            }
        });

        // Déclencher le scroll pour redémarrer les observers
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);

        // console.log('✅ Animations réinitialisées! Faites défiler pour voir les animations.');
    }

    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Activer le débogage des animations sans bouton
        setTimeout(debugAnimations, 1500);

        // Log pour confirmer que le script est chargé
        // console.log('🔍 Script de débogage d\'animations chargé');
    });
})();


document.addEventListener('DOMContentLoaded', function() {
    // Date cible du workshop (25 mai 2025 à 12h)
    const workshopDate = new Date('2025-05-25T12:00:00+02:00');

    // Éléments du compteur
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');

    // Créer un élément pour les secondes si nécessaire
    let secondsElement = document.getElementById('countdown-seconds');

    // Si l'élément des secondes n'existe pas, on le crée dynamiquement
    if (!secondsElement) {
        const timerContainer = document.getElementById('workshop-countdown');

        if (timerContainer) {
            // Créer l'élément pour les secondes
            const secondsItem = document.createElement('div');
            secondsItem.className = 'countdown-item';

            // Créer l'élément pour la valeur des secondes
            secondsElement = document.createElement('span');
            secondsElement.className = 'countdown-value';
            secondsElement.id = 'countdown-seconds';
            secondsElement.textContent = '00';

            // Créer l'élément pour le label des secondes
            const secondsLabel = document.createElement('span');
            secondsLabel.className = 'countdown-label';
            secondsLabel.textContent = 'Secondes';

            // Ajouter les éléments au DOM
            secondsItem.appendChild(secondsElement);
            secondsItem.appendChild(secondsLabel);
            timerContainer.appendChild(secondsItem);
        }
    }

    // Fonction pour mettre à jour le compteur
    function updateCountdown() {
        // Date et heure actuelles
        const now = new Date();

        // Différence en millisecondes
        const diff = workshopDate - now;

        // Si la date est passée
        if (diff <= 0) {
            daysElement.textContent = '0';
            hoursElement.textContent = '0';
            minutesElement.textContent = '0';
            if (secondsElement) secondsElement.textContent = '0';
            return;
        }

        // Calcul des jours, heures, minutes, secondes restants
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Mise à jour des éléments HTML avec animation
        updateElementWithAnimation(daysElement, days);
        updateElementWithAnimation(hoursElement, hours);
        updateElementWithAnimation(minutesElement, minutes);
        if (secondsElement) updateElementWithAnimation(secondsElement, seconds, true);
    }

    // Fonction pour mettre à jour un élément avec animation
    function updateElementWithAnimation(element, newValue, isSeconds = false) {
        // Formater la valeur (ajouter un zéro devant si nécessaire)
        const formattedValue = newValue < 10 && isSeconds ? `0${newValue}` : newValue.toString();

        // Si la valeur est différente, on anime
        if (element.textContent !== formattedValue) {
            // Animation différente pour les secondes (plus subtile)
            if (isSeconds) {
                element.textContent = formattedValue;
                element.classList.add('countdown-seconds-update');
                setTimeout(() => {
                    element.classList.remove('countdown-seconds-update');
                }, 500);
            } else {
                // Animation standard pour les autres éléments
                element.classList.add('countdown-update');

                // Après un court délai, mettre à jour la valeur
                setTimeout(() => {
                    element.textContent = formattedValue;

                    // Retirer la classe d'animation après la mise à jour
                    setTimeout(() => {
                        element.classList.remove('countdown-update');
                    }, 300);
                }, 200);
            }
        }
    }

    // Mettre à jour le compteur immédiatement
    updateCountdown();

    // Mettre à jour le compteur toutes les secondes pour un décompte fluide
    setInterval(updateCountdown, 1000);

    // Ajouter une animation de pulsation pour indiquer que le compteur est actif
    function addPulseEffect() {
        if (secondsElement) {
            secondsElement.classList.add('pulse-effect');
            setTimeout(() => {
                secondsElement.classList.remove('pulse-effect');
            }, 500);
        }
    }

    // Faire pulser les secondes chaque seconde pour montrer que le compteur est actif
    setInterval(addPulseEffect, 1000);
});


// Fonction spécifique pour garantir la visibilité et responsivité de la benefits-grid
function ensureBenefitsGridVisibility() {
    const benefitsGrids = document.querySelectorAll('.benefits-grid');

    if (benefitsGrids.length) {
        benefitsGrids.forEach(grid => {
            // S'assurer que la grille a la classe animation-ready et visible
            grid.classList.add('animation-ready', 'visible');

            // Appliquer des styles inline importants pour garantir la visibilité
            grid.style.display = 'grid';
            grid.style.visibility = 'visible';
            grid.style.opacity = '1';

            // Appliquer des styles responsive en fonction de la largeur d'écran
            if (window.innerWidth <= 768) {
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }

            // S'assurer que tous les enfants directs sont également visibles
            const children = grid.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.visibility = 'visible';
                children[i].style.opacity = '1';
                children[i].classList.add('visible');
            }

            console.log('✅ Visibilité de benefits-grid forcée avec succès');
        });
    } else {
        console.warn('⚠️ Aucune grille benefits-grid trouvée dans le document');
    }
}

// Exécuter cette fonction après chargement du DOM et après un délai
document.addEventListener('DOMContentLoaded', ensureBenefitsGridVisibility);
setTimeout(ensureBenefitsGridVisibility, 500);
setTimeout(ensureBenefitsGridVisibility, 1500);

// Également au redimensionnement de la fenêtre pour garantir la responsivité
window.addEventListener('resize', ensureBenefitsGridVisibility);


  // Force un rafraîchissement du cache pour les fichiers JS et CSS
        document.addEventListener('DOMContentLoaded', function() {
            // Ajoute un timestamp au chargement pour forcer le rafraîchissement des fichiers
            const timestamp = new Date().getTime();
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            const scripts = document.querySelectorAll('script[src]');

            stylesheets.forEach(link => {
                if (link.href.includes('fix-animations.css')) {
                    link.href = link.href.split('?')[0] + '?' + timestamp;
                }
            });

            scripts.forEach(script => {
                if (script.src.includes('fix-animations.js') || script.src.includes('debug-animations.js')) {
                    script.src = script.src.split('?')[0] + '?' + timestamp;
                }
            });

        });
