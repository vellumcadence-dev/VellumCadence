/* ===== VellumCadence — Script ===== */
(function () {
  'use strict';

  /* ── Enable entrance animations only when JS runs ── */
  document.body.classList.add('js-ready');

  /* ── Dynamic Portfolio from portfolio.json ── */
  (function loadPortfolio() {
    fetch('/portfolio.json?v=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(items) {
        if (!items || !items.length) return;
        var grid = document.querySelector('.portfolio-grid');
        if (!grid) return;
        var grads = ['port-grad-1','port-grad-2','port-grad-3','port-grad-4','port-grad-5','port-grad-6'];
        var html = items.map(function(item, i) {
          var isVideo = item.type === 'video';
          var media = isVideo
            ? '<video src="' + item.src + '" preload="none" muted playsinline loop class="portfolio-img" style="width:100%;height:100%;object-fit:cover;"></video>'
            : '<img src="' + item.src + '" alt="' + item.title + '" loading="lazy" class="portfolio-img">';
          var grad = grads[i % grads.length];
          return '<div class="portfolio-item anim" data-category="' + item.category + '">' +
            '<div class="portfolio-placeholder ' + grad + ' has-media">' + media + '</div>' +
            '<div class="portfolio-overlay"><span class="portfolio-tag">' + item.tag + '</span>' +
            '<span class="portfolio-title">' + item.title + '</span>' +
            (isVideo ? '' : '<button class="portfolio-open" data-src="' + item.src + '">View</button>') +
            '</div></div>';
        }).join('');
        grid.innerHTML = html;
        // Re-bind filter
        var activeFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            document.querySelectorAll('.portfolio-item').forEach(function(item) {
              item.style.display = (activeFilter === 'all' || item.getAttribute('data-category') === activeFilter) ? '' : 'none';
            });
          });
        });
        // Re-bind lightbox
        var lb = document.getElementById('lightbox');
        if (lb) {
          grid.querySelectorAll('.portfolio-open').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              lb.querySelector('.lb-img').src = btn.getAttribute('data-src') || '';
              lb.classList.add('open');
            });
          });
        }
      })
      .catch(function() {}); // no portfolio.json — keep placeholders
  })();

  /* ── i18n translations ── */
  var T = {
    en: {
      'nav.problem': 'Problem', 'nav.solution': 'Solution', 'nav.portfolio': 'Portfolio',
      'nav.packages': 'Packages', 'nav.faq': 'FAQ', 'nav.contact': 'Free Plan',
      'hero.tag': 'AI Reels & Visuals',
      'hero.title1': 'AI Content That',
      'hero.title2': 'Stops The Scroll',
      'hero.sub': 'Scroll-stopping Reels and AI product visuals for skincare, jewelry, and fashion DTC brands. Done-for-you content system. First batch in 5 days.',
      'hero.cta': 'Get Free Content Plan', 'hero.cta2': 'See Our Work',
      'hero.m1': 'Powered Production', 'hero.m2': 'Days to First Content', 'hero.m3': 'Pieces / Month',
      'pain.tag': 'The Problem', 'pain.title': "Why Your Content Isn't Working",
      'pain.sub': "People are drowning in content. Most posts vanish in under a second. Here's why yours might be invisible.",
      'pain.c1.title': 'No Visual Hook', 'pain.c1.text': "Your content doesn't stop the scroll. Users fly past in a fraction of a second without a second glance.",
      'pain.c2.title': 'Looks Like Everyone Else', 'pain.c2.text': 'Generic templates get buried in the feed. Your brand blends in instead of standing out.',
      'pain.c3.title': 'No Consistency', 'pain.c3.text': "Without a regular rhythm, there's no recognition. Your audience forgets you between sporadic posts.",
      'pain.c4.title': 'No Strategy', 'pain.c4.text': "Content without a funnel is just noise. There's no system that warms up leads and drives action.",
      'sol.tag': 'Our Solution', 'sol.title': 'The VellumCadence System',
      'sol.sub': 'Not just content. A complete attention engine that makes your growth predictable and scalable.',
      'sol.c1.label': 'speed.ai', 'sol.c1.title': 'AI Speed', 'sol.c1.text': 'AI-powered generation lets us create content fast, consistently, and at scale — no lengthy photoshoots needed.',
      'sol.c2.label': 'ai.vis', 'sol.c2.title': 'AI Visuals', 'sol.c2.text': "Visuals engineered to catch the eye and spark curiosity. Not stock templates — a unique style built for your brand.",
      'sol.c3.label': 'logic.mkt', 'sol.c3.title': 'Marketing Logic', 'sol.c3.text': 'Every piece serves a purpose in your funnel: attract attention, build trust, or drive the sale.',
      'who.tag': 'Who We Serve', 'who.title': 'Built for Visual-First Brands',
      'who.sub': 'We specialise in skincare, jewelry, and fashion DTC brands that need consistent, high-quality content — without hiring an agency.',
      'who.c1': 'DTC & E-commerce', 'who.c2': 'Skincare & Jewelry', 'who.c3': 'Fashion & Apparel',
      'who.c4': 'Med Spa & Aesthetics', 'who.c5': 'Jewelry & Accessories', 'who.c6': 'Lifestyle Brands',
      'port.tag': 'Portfolio', 'port.title': 'What We Create',
      'port.sub': 'These are the content formats we produce monthly. Real client examples coming soon.',
      'port.c1': 'Reels & Short Videos', 'port.c2': 'Carousels', 'port.c3': 'Brand Identity',
      'port.c4': 'Before / After', 'port.c5': 'Product Shoots', 'port.c6': 'Social Templates',
      'proof.tag': 'Limited Offer', 'proof.title': 'Be One of Our First 10 Clients',
      'proof.sub': 'We\'re onboarding our first clients now and offering a free 30-day content plan to early adopters. Your case study could be featured on our site.',
      'proof.p1.title': 'Free Content Plan', 'proof.p1.text': 'Get a full 30-day content strategy tailored to your brand — no commitment',
      'proof.p2.title': '3 Free Sample Posts', 'proof.p2.text': 'See our quality before you pay — we\'ll create 3 content pieces for free',
      'proof.p3.title': 'Founding Client Pricing', 'proof.p3.text': 'Lock in early-bird rates that won\'t increase as long as you\'re with us',
      'proof.cta': 'Claim Your Spot',
      'pkg.tag': 'Packages', 'pkg.title': 'Monthly Content Packages',
      'pkg.sub': 'Choose the plan that fits your business goals and budget.',
      'pkg.mo': 'mo', 'pkg.popular': 'Most Popular', 'pkg.select': 'Get Started',
      'pkg.bill.monthly': 'Monthly', 'pkg.bill.save10': '−10%', 'pkg.bill.save20': '−20%',
      'pkg.timer.label': 'Founding price valid until end of 2026', 'pkg.timer.days': 'days', 'pkg.timer.hours': 'hours', 'pkg.timer.min': 'min', 'pkg.timer.sec': 'sec',
      'pkg.s.reels': 'Reels (15-30 sec)', 'pkg.s.carousel': 'Carousel sets', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Content calendar', 'pkg.s.revisions': '1 round of revisions',
      'pkg.g.reels': 'Reels (15-30 sec)', 'pkg.g.carousel': 'Carousel sets', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Full content strategy',
      'pkg.g.revisions': '2 rounds of revisions', 'pkg.g.calendar': 'Publishing calendar',
      'pkg.sc.reels': 'Reels (15-30 sec)', 'pkg.sc.carousel': 'Carousel sets', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting included',
      'pkg.sc.revisions': 'Unlimited revisions', 'pkg.sc.manager': 'Dedicated manager',
      'pkg.e.reels': 'Reels (15-45 sec)', 'pkg.e.carousel': 'Carousel sets', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Full account management',
      'pkg.e.posting': 'Auto-posting included', 'pkg.e.revisions': 'Unlimited revisions',
      'pkg.e.manager': 'Dedicated manager', 'pkg.e.priority': 'Priority support', 'pkg.e.call': 'Monthly strategy call',
      'proc.tag': 'Process', 'proc.title': '5 Steps to Results',
      'proc.sub': 'Simple and transparent — from brief to ready-to-publish content.',
      'proc.s1.title': 'Discovery Call', 'proc.s1.text': 'We learn your niche, product, target audience, and goals in a free 30-minute call.',
      'proc.s2.title': 'Strategy & Style', 'proc.s2.text': 'We define your content direction, visual identity, and posting rhythm.',
      'proc.s3.title': 'AI Creation', 'proc.s3.text': 'Our team generates visuals, reels, and copy using AI + human creative direction.',
      'proc.s4.title': 'Review & Approve', 'proc.s4.text': 'You review everything, request changes, and approve the final materials.',
      'proc.s5.title': 'Launch & Grow', 'proc.s5.text': 'Content goes live with a full publishing calendar. Watch engagement grow.',
      'faq.tag': 'FAQ', 'faq.title': 'Frequently Asked Questions',
      'faq.q1': 'How does AI content creation work?',
      'faq.a1': 'We use advanced AI tools combined with human creative direction to generate visuals, videos, and copy. Every piece is reviewed and refined by our team to ensure it matches your brand perfectly. The result is premium content at a fraction of the time and cost of traditional production.',
      'faq.q2': 'How quickly can we get started?',
      'faq.a2': 'After our discovery call, we typically deliver your first batch of content within 5-7 business days. The onboarding process is fast — we just need your brand assets and a brief conversation about your goals.',
      'faq.q3': 'Do we own the content you create?',
      'faq.a3': 'Yes, 100%. All content we create belongs to you. You receive full rights to use it across any platform, in ads, on your website — wherever you need it. No strings attached.',
      'faq.q4': 'Can we request revisions?',
      'faq.a4': 'Absolutely. Each package includes revision rounds (1 for Lite, 2 for Pro, unlimited for Premium). We want you to be completely happy with every piece of content before it goes live.',
      'faq.q5': 'What platforms do you create content for?',
      'faq.a5': 'We create content optimized for Instagram, TikTok, Facebook, LinkedIn, and YouTube Shorts. Each piece is formatted and sized correctly for the target platform to maximize engagement.',
      'faq.q6': 'Is there a minimum contract period?',
      'faq.a6': 'We recommend a minimum of 3 months to see real results from a content system. However, there is no long-term lock-in — you can cancel with 30 days notice. Most of our clients stay because they see the results.',
      'cta.title': 'Ready to Transform Your Content?',
      'cta.sub': "Book a free strategy call or send us a message. We'll create a custom content plan for your business.",
      'cta.location': 'Based in the Netherlands',
      'form.name': 'Your Name', 'form.email': 'Email Address', 'form.business': 'Business Type',
      'form.bizPlaceholder': 'Select your industry', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Beauty & Wellness', 'form.bizOpt3': 'Fashion & Apparel',
      'form.bizOpt4': 'Med Spa & Aesthetics', 'form.bizOpt5': 'Jewelry & Accessories', 'form.bizOpt6': 'Lifestyle Brands', 'form.bizOpt7': 'Other',
      'form.website': 'Website / Instagram', 'form.goals': 'What are your main content goals?',
      'form.budget': 'Monthly content budget', 'form.budgetPlaceholder': 'Select range', 'form.budgetUnsure': 'Not sure yet',
      'form.submit': 'Get My Free Content Plan',
      'form.successTitle': 'Brief Received!', 'form.successText': "Our AI agent is analyzing your niche. You'll receive your personalized content plan within 24 hours."
    },
    nl: {
      'nav.problem': 'Probleem', 'nav.solution': 'Oplossing', 'nav.portfolio': 'Portfolio',
      'nav.packages': 'Pakketten', 'nav.faq': 'FAQ', 'nav.contact': 'Gratis plan',
      'hero.tag': 'AI Reels & Visuals',
      'hero.title1': 'AI Content Die',
      'hero.title2': 'Het Scrollen Stopt',
      'hero.sub': 'Scroll-stoppende Reels en AI productvisuals voor skincare, sieraden en fashion DTC-merken. Content systeem op maat. Eerste batch in 5 dagen.',
      'hero.cta': 'Gratis Contentplan Ontvangen', 'hero.cta2': 'Bekijk Ons Werk',
      'hero.m1': 'Productie op AI-basis', 'hero.m2': 'Dagen tot eerste content', 'hero.m3': 'Stuks / Maand',
      'pain.tag': 'Het Probleem', 'pain.title': 'Waarom Uw Content Niet Werkt',
      'pain.sub': 'Mensen verdrinken in content. De meeste posts verdwijnen binnen een seconde. Dit is waarom de uwe onzichtbaar kan zijn.',
      'pain.c1.title': 'Geen Visuele Haak', 'pain.c1.text': 'Uw content stopt het scrollen niet. Gebruikers vliegen in een fractie van een seconde voorbij zonder een tweede blik.',
      'pain.c2.title': 'Ziet Eruit Als Iedereen', 'pain.c2.text': 'Generieke templates worden begraven in de feed. Uw merk valt niet op maar verdwijnt.',
      'pain.c3.title': 'Geen Consistentie', 'pain.c3.text': 'Zonder een regelmatig ritme is er geen herkenning. Uw publiek vergeet u tussen sporadische posts.',
      'pain.c4.title': 'Geen Strategie', 'pain.c4.text': 'Content zonder funnel is gewoon ruis. Er is geen systeem dat leads opwarmt en actie stimuleert.',
      'sol.tag': 'Onze Oplossing', 'sol.title': 'Het VellumCadence Systeem',
      'sol.sub': 'Niet alleen content. Een compleet aandachtssysteem dat uw groei voorspelbaar en schaalbaar maakt.',
      'sol.c1.label': 'speed.ai', 'sol.c1.title': 'AI Snelheid', 'sol.c1.text': 'AI-aangedreven generatie maakt het mogelijk om snel, consistent en op schaal content te maken — geen lange fotoshoots nodig.',
      'sol.c2.label': 'ai.vis', 'sol.c2.title': 'AI Visuals', 'sol.c2.text': 'Visuals ontworpen om het oog te vangen en nieuwsgierigheid te wekken. Geen stock templates — een unieke stijl voor uw merk.',
      'sol.c3.label': 'logic.mkt', 'sol.c3.title': 'Marketing Logica', 'sol.c3.text': 'Elk stuk dient een doel in uw funnel: aandacht trekken, vertrouwen opbouwen, of de verkoop stimuleren.',
      'who.tag': 'Voor wie', 'who.title': 'Gebouwd voor Visual-First Merken',
      'who.sub': 'Wij zijn gespecialiseerd in skincare, sieraden en fashion DTC-merken die consistente, hoogwaardige content nodig hebben.',
      'who.c1': 'DTC & E-commerce', 'who.c2': 'Skincare & Sieraden', 'who.c3': 'Fashion & Apparel',
      'who.c4': 'Med Spa & Aesthetics', 'who.c5': 'Sieraden & Accessoires', 'who.c6': 'Lifestyle Merken',
      'port.tag': 'Portfolio', 'port.title': 'Wat wij maken',
      'port.sub': 'Dit zijn de contentformaten die wij maandelijks produceren. Echte klantvoorbeelden volgen binnenkort.',
      'port.c1': 'Reels & Korte Video\'s', 'port.c2': 'Carrousels', 'port.c3': 'Merkidentiteit',
      'port.c4': 'Voor / Na', 'port.c5': 'Productfotografie', 'port.c6': 'Social Templates',
      'proof.tag': 'Beperkt aanbod', 'proof.title': 'Word een van onze eerste 10 klanten',
      'proof.sub': 'We nemen nu onze eerste klanten aan en bieden een gratis 30-dagen contentplan aan early adopters. Uw casestudy kan op onze site verschijnen.',
      'proof.p1.title': 'Gratis contentplan', 'proof.p1.text': 'Ontvang een volledig 30-dagen contentstrategie op maat — zonder verplichtingen',
      'proof.p2.title': '3 gratis voorbeeldposts', 'proof.p2.text': 'Bekijk onze kwaliteit voordat u betaalt — wij maken 3 content-items gratis',
      'proof.p3.title': 'Oprichterstarief', 'proof.p3.text': 'Profiteer van early-bird tarieven die niet stijgen zolang u bij ons blijft',
      'proof.cta': 'Claim uw plek',
      'pkg.tag': 'Pakketten', 'pkg.title': 'Maandelijkse Contentpakketten',
      'pkg.sub': 'Kies het plan dat past bij uw bedrijfsdoelen en budget.',
      'pkg.mo': 'mnd', 'pkg.popular': 'Meest Populair', 'pkg.select': 'Aan de Slag',
      'pkg.timer.label': 'Oprichtingsprijs geldig t/m eind 2026', 'pkg.timer.days': 'dagen', 'pkg.timer.hours': 'uur', 'pkg.timer.min': 'min', 'pkg.timer.sec': 'sec',
      'pkg.s.reels': 'Reels (15-30 sec)', 'pkg.s.carousel': 'Carrousel sets', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Contentkalender', 'pkg.s.revisions': '1 revisieronde',
      'pkg.g.reels': 'Reels (15-30 sec)', 'pkg.g.carousel': 'Carrousel sets', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Volledige contentstrategie',
      'pkg.g.revisions': '2 revisierondes', 'pkg.g.calendar': 'Publicatiekalender',
      'pkg.sc.reels': 'Reels (15-30 sec)', 'pkg.sc.carousel': 'Carrousel sets', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting inbegrepen',
      'pkg.sc.revisions': 'Onbeperkte revisies', 'pkg.sc.manager': 'Toegewezen manager',
      'pkg.e.reels': 'Reels (15-45 sec)', 'pkg.e.carousel': 'Carrousel sets', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Volledig accountbeheer',
      'pkg.e.posting': 'Auto-posting inbegrepen', 'pkg.e.revisions': 'Onbeperkte revisies',
      'pkg.e.manager': 'Toegewezen manager', 'pkg.e.priority': 'Prioriteitsondersteuning', 'pkg.e.call': 'Maandelijks strategiegesprek',
      'proc.tag': 'Proces', 'proc.title': '5 Stappen naar Resultaat',
      'proc.sub': 'Eenvoudig en transparant — van briefing tot kant-en-klare content.',
      'proc.s1.title': 'Kennismakingsgesprek', 'proc.s1.text': 'We leren uw niche, product, doelgroep en doelen kennen in een gratis gesprek van 30 minuten.',
      'proc.s2.title': 'Strategie & Stijl', 'proc.s2.text': 'We bepalen uw contentrichting, visuele identiteit en postritme.',
      'proc.s3.title': 'AI Creatie', 'proc.s3.text': 'Ons team genereert visuals, reels en teksten met AI + menselijke creatieve regie.',
      'proc.s4.title': 'Beoordeling & Goedkeuring', 'proc.s4.text': 'U beoordeelt alles, vraagt wijzigingen aan en keurt de definitieve materialen goed.',
      'proc.s5.title': 'Lancering & Groei', 'proc.s5.text': 'Content gaat live met een volledig publicatieschema. Zie uw engagement groeien.',
      'faq.tag': 'FAQ', 'faq.title': 'Veelgestelde Vragen',
      'faq.q1': 'Hoe werkt AI-contentcreatie?',
      'faq.a1': 'We gebruiken geavanceerde AI-tools in combinatie met menselijke creatieve regie om visuals, video\'s en teksten te genereren. Elk stuk wordt beoordeeld en verfijnd door ons team om ervoor te zorgen dat het perfect bij uw merk past. Het resultaat is premium content tegen een fractie van de tijd en kosten van traditionele productie.',
      'faq.q2': 'Hoe snel kunnen we beginnen?',
      'faq.a2': 'Na ons kennismakingsgesprek leveren we doorgaans uw eerste batch content binnen 5-7 werkdagen. Het onboardingproces is snel — we hebben alleen uw merkassets en een kort gesprek over uw doelen nodig.',
      'faq.q3': 'Zijn wij eigenaar van de content die u maakt?',
      'faq.a3': 'Ja, 100%. Alle content die wij maken is van u. U ontvangt volledige rechten om het te gebruiken op elk platform, in advertenties, op uw website — waar u het ook nodig heeft. Zonder voorwaarden.',
      'faq.q4': 'Kunnen we revisies aanvragen?',
      'faq.a4': 'Absoluut. Elk pakket bevat revisierondes (1 voor Lite, 2 voor Pro, onbeperkt voor Premium). We willen dat u volledig tevreden bent met elk stuk content voordat het live gaat.',
      'faq.q5': 'Voor welke platforms maken jullie content?',
      'faq.a5': 'We maken content geoptimaliseerd voor Instagram, TikTok, Facebook, LinkedIn en YouTube Shorts. Elk stuk is correct geformatteerd en gedimensioneerd voor het doelplatform om engagement te maximaliseren.',
      'faq.q6': 'Is er een minimale contractperiode?',
      'faq.a6': 'We raden minimaal 3 maanden aan om echte resultaten te zien van een contentsysteem. Er is echter geen langetermijnverplichting — u kunt opzeggen met 30 dagen opzegtermijn. De meeste klanten blijven omdat ze de resultaten zien.',
      'cta.title': 'Klaar Om Uw Content Te Transformeren?',
      'cta.sub': 'Boek een gratis strategiegesprek of stuur ons een bericht. Wij maken een op maat gemaakt contentplan voor uw bedrijf.',
      'cta.location': 'Gevestigd in Nederland',
      'form.name': 'Uw Naam', 'form.email': 'E-mailadres', 'form.business': 'Bedrijfstype',
      'form.bizPlaceholder': 'Selecteer uw sector', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Beauty & Wellness', 'form.bizOpt3': 'Fashion & Kleding',
      'form.bizOpt4': 'Med Spa & Aesthetics', 'form.bizOpt5': 'Sieraden & Accessoires', 'form.bizOpt6': 'Lifestyle Merken', 'form.bizOpt7': 'Anders',
      'form.website': 'Website / Instagram', 'form.goals': 'Wat zijn uw belangrijkste contentdoelen?',
      'form.budget': 'Maandelijks contentbudget', 'form.budgetPlaceholder': 'Selecteer bereik', 'form.budgetUnsure': 'Nog niet zeker',
      'form.submit': 'Ontvang mijn gratis plan',
      'form.successTitle': 'Brief Ontvangen!', 'form.successText': 'Onze AI-agent analyseert uw niche. U ontvangt uw gepersonaliseerd plan binnen 24 uur.'
    },
    de: {
      'nav.problem': 'Problem', 'nav.solution': 'Losung', 'nav.portfolio': 'Portfolio',
      'nav.packages': 'Pakete', 'nav.faq': 'FAQ', 'nav.contact': 'Gratis Plan',
      'hero.tag': 'AI Reels & Visuals',
      'hero.title1': 'AI Content Der',
      'hero.title2': 'Das Scrollen Stoppt',
      'hero.sub': 'Scroll-stoppende Reels und KI-Produktvisuals fur DTC, Beauty und Skincare-Marken. Content-System auf Autopilot. Erste Inhalte in 5 Tagen.',
      'hero.cta': 'Kostenlosen Contentplan Erhalten', 'hero.cta2': 'Unsere Arbeit Ansehen',
      'hero.m1': 'KI-gestützte Produktion', 'hero.m2': 'Tage bis zum ersten Content', 'hero.m3': 'Stücke / Monat',
      'pain.tag': 'Das Problem', 'pain.title': 'Warum Ihr Content Nicht Funktioniert',
      'pain.sub': 'Menschen ertrinken in Content. Die meisten Posts verschwinden in unter einer Sekunde. Hier erfahren Sie warum.',
      'pain.c1.title': 'Kein Visueller Haken', 'pain.c1.text': 'Ihr Content stoppt das Scrollen nicht. Nutzer fliegen in Sekundenbruchteilen vorbei, ohne einen zweiten Blick.',
      'pain.c2.title': 'Sieht Aus Wie Alle Anderen', 'pain.c2.text': 'Generische Templates gehen im Feed unter. Ihre Marke verschmilzt statt aufzufallen.',
      'pain.c3.title': 'Keine Konsistenz', 'pain.c3.text': 'Ohne regelmassigen Rhythmus gibt es keine Wiedererkennung. Ihr Publikum vergisst Sie zwischen sporadischen Posts.',
      'pain.c4.title': 'Keine Strategie', 'pain.c4.text': 'Content ohne Funnel ist nur Rauschen. Es gibt kein System, das Leads aufwarmt und Aktionen antreibt.',
      'sol.tag': 'Unsere Losung', 'sol.title': 'Das VellumCadence System',
      'sol.sub': 'Nicht nur Content. Ein komplettes Aufmerksamkeitssystem, das Ihr Wachstum vorhersagbar und skalierbar macht.',
      'sol.c1.label': 'speed.ai', 'sol.c1.title': 'KI-Geschwindigkeit', 'sol.c1.text': 'KI-gestutzte Generierung ermoglicht es uns, Content schnell, konsistent und skalierbar zu erstellen — keine langen Fotoshootings notig.',
      'sol.c2.label': 'ai.vis', 'sol.c2.title': 'AI Visuals', 'sol.c2.text': 'Visuals, die das Auge fesseln und Neugier wecken. Keine Stock-Templates — ein einzigartiger Stil fur Ihre Marke.',
      'sol.c3.label': 'logic.mkt', 'sol.c3.title': 'Marketing-Logik', 'sol.c3.text': 'Jedes Stuck erfullt einen Zweck in Ihrem Funnel: Aufmerksamkeit erregen, Vertrauen aufbauen oder den Verkauf vorantreiben.',
      'who.tag': 'Fur wen', 'who.title': 'Fur Visual-First Marken',
      'who.sub': 'Spezialisiert auf Skincare, Schmuck und Fashion DTC-Marken, die konsistente, hochwertige Inhalte benotigen.',
      'who.c1': 'DTC & E-Commerce', 'who.c2': 'Skincare & Schmuck', 'who.c3': 'Fashion & Bekleidung',
      'who.c4': 'Med Spa & Aesthetik', 'who.c5': 'Schmuck & Accessoires', 'who.c6': 'Lifestyle Marken',
      'port.tag': 'Portfolio', 'port.title': 'Was wir erstellen',
      'port.sub': 'Das sind die Content-Formate, die wir monatlich produzieren. Echte Kundenbeispiele folgen bald.',
      'port.c1': 'Reels & Kurzvideos', 'port.c2': 'Karussells', 'port.c3': 'Markenidentitat',
      'port.c4': 'Vorher / Nachher', 'port.c5': 'Produktfotografie', 'port.c6': 'Social Templates',
      'proof.tag': 'Limitiertes Angebot', 'proof.title': 'Werden Sie einer unserer ersten 10 Kunden',
      'proof.sub': 'Wir nehmen jetzt unsere ersten Kunden auf und bieten Early Adoptern einen kostenlosen 30-Tage-Contentplan. Ihre Fallstudie könnte auf unserer Website erscheinen.',
      'proof.p1.title': 'Kostenloser Contentplan', 'proof.p1.text': 'Erhalten Sie eine 30-Tage-Contentstrategie für Ihre Marke — ohne Verpflichtung',
      'proof.p2.title': '3 kostenlose Beispiel-Posts', 'proof.p2.text': 'Sehen Sie unsere Qualität bevor Sie zahlen — wir erstellen 3 Inhalte kostenlos',
      'proof.p3.title': 'Gründer-Preise', 'proof.p3.text': 'Sichern Sie sich Early-Bird-Preise, die nicht steigen solange Sie bei uns bleiben',
      'proof.cta': 'Sichern Sie sich Ihren Platz',
      'pkg.tag': 'Pakete', 'pkg.title': 'Monatliche Content-Pakete',
      'pkg.sub': 'Wahlen Sie den Plan, der zu Ihren Geschaftszielen und Ihrem Budget passt.',
      'pkg.mo': 'Mt.', 'pkg.popular': 'Am Beliebtesten', 'pkg.select': 'Jetzt Starten',
      'pkg.timer.label': 'Grundungspreis gultig bis Ende 2026', 'pkg.timer.days': 'Tage', 'pkg.timer.hours': 'Std.', 'pkg.timer.min': 'Min.', 'pkg.timer.sec': 'Sek.',
      'pkg.s.reels': 'Reels (15-30 Sek.)', 'pkg.s.carousel': 'Karussell-Sets', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Content-Kalender', 'pkg.s.revisions': '1 Revisionsrunde',
      'pkg.g.reels': 'Reels (15-30 Sek.)', 'pkg.g.carousel': 'Karussell-Sets', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Vollstandige Content-Strategie',
      'pkg.g.revisions': '2 Revisionsrunden', 'pkg.g.calendar': 'Veroffentlichungskalender',
      'pkg.sc.reels': 'Reels (15-30 Sek.)', 'pkg.sc.carousel': 'Karussell-Sets', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting inklusive',
      'pkg.sc.revisions': 'Unbegrenzte Revisionen', 'pkg.sc.manager': 'Dedizierter Manager',
      'pkg.e.reels': 'Reels (15-45 Sek.)', 'pkg.e.carousel': 'Karussell-Sets', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Vollstandiges Account-Management',
      'pkg.e.posting': 'Auto-posting inklusive', 'pkg.e.revisions': 'Unbegrenzte Revisionen',
      'pkg.e.manager': 'Dedizierter Manager', 'pkg.e.priority': 'Prioritats-Support', 'pkg.e.call': 'Monatliches Strategiegesprach',
      'proc.tag': 'Prozess', 'proc.title': '5 Schritte zum Ergebnis',
      'proc.sub': 'Einfach und transparent — vom Briefing bis zum fertigen Content.',
      'proc.s1.title': 'Kennenlerngesprach', 'proc.s1.text': 'Wir lernen Ihre Nische, Ihr Produkt, Ihre Zielgruppe und Ihre Ziele in einem kostenlosen 30-minutigen Gesprach kennen.',
      'proc.s2.title': 'Strategie & Stil', 'proc.s2.text': 'Wir definieren Ihre Content-Richtung, visuelle Identitat und Posting-Rhythmus.',
      'proc.s3.title': 'KI-Erstellung', 'proc.s3.text': 'Unser Team generiert Visuals, Reels und Texte mit KI + menschlicher kreativer Leitung.',
      'proc.s4.title': 'Review & Freigabe', 'proc.s4.text': 'Sie prufen alles, fordern Anderungen an und genehmigen die finalen Materialien.',
      'proc.s5.title': 'Launch & Wachstum', 'proc.s5.text': 'Content geht live mit einem vollstandigen Veroffentlichungsplan. Beobachten Sie, wie Ihr Engagement wachst.',
      'faq.tag': 'FAQ', 'faq.title': 'Haufig Gestellte Fragen',
      'faq.q1': 'Wie funktioniert KI-Content-Erstellung?',
      'faq.a1': 'Wir verwenden fortschrittliche KI-Tools in Kombination mit menschlicher kreativer Leitung, um Visuals, Videos und Texte zu generieren. Jedes Stuck wird von unserem Team uberpruft und verfeinert, um sicherzustellen, dass es perfekt zu Ihrer Marke passt.',
      'faq.q2': 'Wie schnell konnen wir beginnen?',
      'faq.a2': 'Nach unserem Kennenlerngesprach liefern wir in der Regel Ihre erste Content-Charge innerhalb von 5-7 Werktagen. Der Onboarding-Prozess ist schnell — wir benotigen nur Ihre Marken-Assets und ein kurzes Gesprach uber Ihre Ziele.',
      'faq.q3': 'Gehort uns der Content, den Sie erstellen?',
      'faq.a3': 'Ja, 100%. Aller Content, den wir erstellen, gehort Ihnen. Sie erhalten volle Rechte, ihn auf jeder Plattform, in Anzeigen, auf Ihrer Website zu nutzen — wo auch immer Sie ihn brauchen.',
      'faq.q4': 'Konnen wir Revisionen anfordern?',
      'faq.a4': 'Absolut. Jedes Paket beinhaltet Revisionsrunden (1 fur Lite, 2 fur Pro, unbegrenzt fur Premium). Wir mochten, dass Sie mit jedem Stuck Content vollkommen zufrieden sind.',
      'faq.q5': 'Fur welche Plattformen erstellen Sie Content?',
      'faq.a5': 'Wir erstellen Content, der fur Instagram, TikTok, Facebook, LinkedIn und YouTube Shorts optimiert ist. Jedes Stuck ist korrekt formatiert und dimensioniert fur die Zielplattform.',
      'faq.q6': 'Gibt es eine Mindestvertragslaufzeit?',
      'faq.a6': 'Wir empfehlen mindestens 3 Monate, um echte Ergebnisse von einem Content-System zu sehen. Es gibt jedoch keine langfristige Bindung — Sie konnen mit 30 Tagen Kundigungsfrist kundigen.',
      'cta.title': 'Bereit, Ihren Content Zu Transformieren?',
      'cta.sub': 'Buchen Sie ein kostenloses Strategiegesprach oder senden Sie uns eine Nachricht. Wir erstellen einen massgeschneiderten Content-Plan fur Ihr Unternehmen.',
      'cta.location': 'Standort: Niederlande',
      'form.name': 'Ihr Name', 'form.email': 'E-Mail-Adresse', 'form.business': 'Unternehmenstyp',
      'form.bizPlaceholder': 'Wahlen Sie Ihre Branche', 'form.bizOpt1': 'E-Commerce',
      'form.bizOpt2': 'Beauty & Wellness', 'form.bizOpt3': 'Fashion & Bekleidung',
      'form.bizOpt4': 'Med Spa & Aesthetik', 'form.bizOpt5': 'Schmuck & Accessoires', 'form.bizOpt6': 'Lifestyle Marken', 'form.bizOpt7': 'Sonstiges',
      'form.website': 'Website / Instagram', 'form.goals': 'Was sind Ihre wichtigsten Content-Ziele?',
      'form.budget': 'Monatliches Content-Budget', 'form.budgetPlaceholder': 'Bereich auswählen', 'form.budgetUnsure': 'Noch nicht sicher',
      'form.submit': 'Meinen kostenlosen Plan erhalten',
      'form.successTitle': 'Brief Erhalten!', 'form.successText': 'Unser KI-Agent analysiert Ihre Nische. Sie erhalten Ihren personalisierten Plan innerhalb von 24 Stunden.'
    },
    ru: {
      'nav.problem': 'Проблема', 'nav.solution': 'Решение', 'nav.portfolio': 'Портфолио',
      'nav.packages': 'Пакеты', 'nav.faq': 'FAQ', 'nav.contact': 'Бесплатный план',
      'hero.tag': 'AI Content Company',
      'hero.title1': 'AI-контент, который',
      'hero.title2': 'останавливает скролл',
      'hero.sub': 'Мы создаём AI-визуалы и видеоконтент, которые захватывают внимание, формируют доверие и превращают подписчиков в клиентов.',
      'hero.cta': 'Бесплатный контент-план', 'hero.cta2': 'Наши работы',
      'hero.m1': 'AI-производство', 'hero.m2': 'Дней до первого контента', 'hero.m3': 'Единиц / Месяц',
      'pain.tag': 'Проблема', 'pain.title': 'Почему ваш контент не работает',
      'pain.sub': 'Люди тонут в контенте. Большинство постов исчезают меньше чем за секунду. Вот почему ваш может быть невидимым.',
      'pain.c1.title': 'Нет визуального крючка', 'pain.c1.text': 'Ваш контент не останавливает скролл. Пользователи пролетают мимо за долю секунды, не задерживая взгляд.',
      'pain.c2.title': 'Выглядит как у всех', 'pain.c2.text': 'Шаблонные визуалы тонут в ленте. Ваш бренд сливается с остальными, а не выделяется.',
      'pain.c3.title': 'Нет регулярности', 'pain.c3.text': 'Без регулярного ритма нет узнаваемости. Аудитория забывает о вас между редкими постами.',
      'pain.c4.title': 'Нет стратегии', 'pain.c4.text': 'Контент без воронки — это просто шум. Нет системы, которая прогревает лидов и побуждает к действию.',
      'sol.tag': 'Наше решение', 'sol.title': 'Система VellumCadence',
      'sol.sub': 'Не просто контент. Полноценная система внимания, которая делает ваш рост предсказуемым и масштабируемым.',
      'sol.c1.label': 'speed.ai', 'sol.c1.title': 'Скорость AI', 'sol.c1.text': 'AI-генерация позволяет создавать контент быстро, стабильно и масштабируемо — без долгих фотосессий.',
      'sol.c2.label': 'ai.vis', 'sol.c2.title': 'AI-визуалы', 'sol.c2.text': 'Визуалы, спроектированные так, чтобы цеплять взгляд и вызывать интерес. Не стоковые шаблоны — уникальный стиль для вашего бренда.',
      'sol.c3.label': 'logic.mkt', 'sol.c3.title': 'Маркетинговая логика', 'sol.c3.text': 'Каждый материал служит цели в вашей воронке: привлечь внимание, укрепить доверие или стимулировать продажу.',
      'who.tag': 'Отрасли', 'who.title': 'С кем мы работаем',
      'who.sub': 'Мы помогаем брендам из разных отраслей создавать контент-системы, останавливающие скролл.',
      'who.c1': 'E-commerce', 'who.c2': 'Красота и здоровье', 'who.c3': 'Мода и одежда',
      'who.c4': 'Med Spa и эстетика', 'who.c5': 'Украшения и аксессуары', 'who.c6': 'Lifestyle-бренды',
      'port.tag': 'Портфолио', 'port.title': 'Что мы создаём',
      'port.sub': 'Это форматы контента, которые мы производим ежемесячно. Реальные примеры клиентов скоро.',
      'port.c1': 'Reels и короткие видео', 'port.c2': 'Карусели', 'port.c3': 'Айдентика бренда',
      'port.c4': 'До / После', 'port.c5': 'Продуктовые съёмки', 'port.c6': 'Шаблоны для соцсетей',
      'proof.tag': 'Ограниченное предложение', 'proof.title': 'Станьте одним из наших первых 10 клиентов',
      'proof.sub': 'Мы набираем первых клиентов и предлагаем бесплатный 30-дневный контент-план. Ваш кейс может появиться на нашем сайте.',
      'proof.p1.title': 'Бесплатный контент-план', 'proof.p1.text': 'Получите 30-дневную контент-стратегию под ваш бренд — без обязательств',
      'proof.p2.title': '3 бесплатных примера', 'proof.p2.text': 'Оцените качество до оплаты — мы создадим 3 контент-единицы бесплатно',
      'proof.p3.title': 'Цены первых клиентов', 'proof.p3.text': 'Зафиксируйте цены, которые не вырастут, пока вы с нами',
      'proof.cta': 'Забронировать место',
      'pkg.tag': 'Пакеты', 'pkg.title': 'Ежемесячные контент-пакеты',
      'pkg.sub': 'Выберите план, подходящий вашим бизнес-целям и бюджету.',
      'pkg.mo': 'мес', 'pkg.popular': 'Самый популярный', 'pkg.select': 'Начать',
      'pkg.timer.label': 'Цена для основателей действует до конца 2026', 'pkg.timer.days': 'дн', 'pkg.timer.hours': 'ч', 'pkg.timer.min': 'мин', 'pkg.timer.sec': 'сек',
      'pkg.s.reels': 'Reels (15-30 сек)', 'pkg.s.carousel': 'Карусели', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Контент-календарь', 'pkg.s.revisions': '1 раунд правок',
      'pkg.g.reels': 'Reels (15-30 сек)', 'pkg.g.carousel': 'Карусели', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Полная контент-стратегия',
      'pkg.g.revisions': '2 раунда правок', 'pkg.g.calendar': 'Календарь публикаций',
      'pkg.sc.reels': 'Reels (15-30 сек)', 'pkg.sc.carousel': 'Карусели', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting включён',
      'pkg.sc.revisions': 'Безлимитные правки', 'pkg.sc.manager': 'Выделенный менеджер',
      'pkg.e.reels': 'Reels (15-45 сек)', 'pkg.e.carousel': 'Карусели', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Полное управление аккаунтом',
      'pkg.e.posting': 'Auto-posting включён', 'pkg.e.revisions': 'Безлимитные правки',
      'pkg.e.manager': 'Выделенный менеджер', 'pkg.e.priority': 'Приоритетная поддержка', 'pkg.e.call': 'Ежемесячный стратегический звонок',
      'proc.tag': 'Процесс', 'proc.title': '5 шагов к результату',
      'proc.sub': 'Просто и прозрачно — от брифа до готового контента.',
      'proc.s1.title': 'Знакомство', 'proc.s1.text': 'Узнаём вашу нишу, продукт, целевую аудиторию и цели на бесплатной 30-минутной консультации.',
      'proc.s2.title': 'Стратегия и стиль', 'proc.s2.text': 'Определяем направление контента, визуальную айдентику и ритм публикаций.',
      'proc.s3.title': 'AI-создание', 'proc.s3.text': 'Наша команда генерирует визуалы, рилсы и тексты с помощью AI + креативного руководства.',
      'proc.s4.title': 'Согласование', 'proc.s4.text': 'Вы просматриваете всё, запрашиваете правки и утверждаете финальные материалы.',
      'proc.s5.title': 'Запуск и рост', 'proc.s5.text': 'Контент публикуется по полному календарю. Наблюдайте, как растёт вовлечённость.',
      'faq.tag': 'FAQ', 'faq.title': 'Часто задаваемые вопросы',
      'faq.q1': 'Как работает создание AI-контента?',
      'faq.a1': 'Мы используем продвинутые AI-инструменты в сочетании с человеческим креативным руководством для генерации визуалов, видео и текстов. Каждый материал проверяется и дорабатывается нашей командой, чтобы идеально соответствовать вашему бренду.',
      'faq.q2': 'Как быстро мы можем начать?',
      'faq.a2': 'После знакомства мы обычно доставляем первую партию контента в течение 5-7 рабочих дней. Процесс онбординга быстрый — нам нужны только ваши бренд-материалы и короткий разговор о целях.',
      'faq.q3': 'Принадлежит ли нам контент, который вы создаёте?',
      'faq.a3': 'Да, на 100%. Весь контент, который мы создаём, принадлежит вам. Вы получаете полные права использовать его на любой платформе, в рекламе, на сайте — везде, где нужно.',
      'faq.q4': 'Можно ли запрашивать правки?',
      'faq.a4': 'Безусловно. Каждый пакет включает раунды правок (1 для Lite, 2 для Pro, без ограничений для Premium). Мы хотим, чтобы вы были полностью довольны каждым материалом.',
      'faq.q5': 'Для каких платформ вы создаёте контент?',
      'faq.a5': 'Мы создаём контент, оптимизированный для Instagram, TikTok, Facebook, LinkedIn и YouTube Shorts. Каждый материал правильно отформатирован для целевой платформы.',
      'faq.q6': 'Есть ли минимальный срок контракта?',
      'faq.a6': 'Мы рекомендуем минимум 3 месяца для получения реальных результатов. Однако долгосрочной привязки нет — вы можете отменить с уведомлением за 30 дней. Большинство клиентов остаются, потому что видят результаты.',
      'cta.title': 'Готовы трансформировать ваш контент?',
      'cta.sub': 'Запишитесь на бесплатную стратегическую консультацию или отправьте нам сообщение. Мы создадим индивидуальный контент-план для вашего бизнеса.',
      'cta.location': 'Мы базируемся в Нидерландах',
      'form.name': 'Ваше имя', 'form.email': 'Email', 'form.business': 'Тип бизнеса',
      'form.bizPlaceholder': 'Выберите отрасль', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Красота и здоровье', 'form.bizOpt3': 'Мода и одежда',
      'form.bizOpt4': 'Med Spa и эстетика', 'form.bizOpt5': 'Украшения и аксессуары', 'form.bizOpt6': 'Lifestyle-бренды', 'form.bizOpt7': 'Другое',
      'form.website': 'Сайт / Instagram', 'form.goals': 'Каковы ваши основные цели по контенту?',
      'form.budget': 'Ежемесячный бюджет на контент', 'form.budgetPlaceholder': 'Выберите диапазон', 'form.budgetUnsure': 'Ещё не знаю',
      'form.submit': 'Получить бесплатный план',
      'form.successTitle': 'Бриф получен!', 'form.successText': 'Наш AI-агент анализирует вашу нишу. Вы получите персонализированный план в течение 24 часов.'
    },
    uk: {
      'nav.problem': 'Проблема', 'nav.solution': 'Рішення', 'nav.portfolio': 'Портфоліо',
      'nav.packages': 'Пакети', 'nav.faq': 'FAQ', 'nav.contact': 'Безкоштовний план',
      'hero.tag': 'AI Content Company',
      'hero.title1': 'AI-контент, який',
      'hero.title2': 'зупиняє скрол',
      'hero.sub': 'Ми створюємо AI-візуали та відеоконтент, які захоплюють увагу, формують довіру та перетворюють підписників на клієнтів.',
      'hero.cta': 'Безкоштовний контент-план', 'hero.cta2': 'Наші роботи',
      'hero.m1': 'AI-виробництво', 'hero.m2': 'Днів до першого контенту', 'hero.m3': 'Одиниць / Місяць',
      'pain.tag': 'Проблема', 'pain.title': 'Чому ваш контент не працює',
      'pain.sub': 'Люди тонуть у контенті. Більшість постів зникають менш ніж за секунду. Ось чому ваш може бути невидимим.',
      'pain.c1.title': 'Немає візуального гачка', 'pain.c1.text': 'Ваш контент не зупиняє скрол. Користувачі пролітають повз за частку секунди, не затримуючи погляд.',
      'pain.c2.title': 'Виглядає як у всіх', 'pain.c2.text': 'Шаблонні візуали тонуть у стрічці. Ваш бренд зливається з рештою замість того, щоб виділятися.',
      'pain.c3.title': 'Немає регулярності', 'pain.c3.text': 'Без регулярного ритму немає впізнаваності. Аудиторія забуває про вас між рідкісними постами.',
      'pain.c4.title': 'Немає стратегії', 'pain.c4.text': 'Контент без воронки — це просто шум. Немає системи, яка прогріває лідів та спонукає до дії.',
      'sol.tag': 'Наше рішення', 'sol.title': 'Система VellumCadence',
      'sol.sub': 'Не просто контент. Повноцінна система уваги, яка робить ваше зростання передбачуваним та масштабованим.',
      'sol.c1.label': 'speed.ai', 'sol.c1.title': 'Швидкість AI', 'sol.c1.text': 'AI-генерація дозволяє створювати контент швидко, стабільно та масштабовано — без довгих фотосесій.',
      'sol.c2.label': 'ai.vis', 'sol.c2.title': 'AI Visuals', 'sol.c2.text': 'Візуали, спроєктовані так, щоб чіпляти погляд та викликати цікавість. Не стокові шаблони — унікальний стиль для вашого бренду.',
      'sol.c3.label': 'logic.mkt', 'sol.c3.title': 'Маркетингова логіка', 'sol.c3.text': 'Кожен матеріал слугує меті у вашій воронці: привернути увагу, зміцнити довіру або стимулювати продаж.',
      'who.tag': 'Галузі', 'who.title': 'З ким ми працюємо',
      'who.sub': 'Ми допомагаємо брендам з різних галузей створювати контент-системи, що зупиняють скрол.',
      'who.c1': 'E-commerce', 'who.c2': 'Краса та здоров\'я', 'who.c3': 'Мода та одяг',
      'who.c4': 'Med Spa та естетика', 'who.c5': 'Прикраси та аксесуари', 'who.c6': 'Lifestyle-бренди',
      'port.tag': 'Портфоліо', 'port.title': 'Що ми створюємо',
      'port.sub': 'Це формати контенту, які ми виробляємо щомісяця. Реальні приклади клієнтів скоро.',
      'port.c1': 'Reels та короткі відео', 'port.c2': 'Каруселі', 'port.c3': 'Айдентика бренду',
      'port.c4': 'До / Після', 'port.c5': 'Продуктові зйомки', 'port.c6': 'Шаблони для соцмереж',
      'proof.tag': 'Обмежена пропозиція', 'proof.title': 'Станьте одним з наших перших 10 клієнтів',
      'proof.sub': 'Ми набираємо перших клієнтів та пропонуємо безкоштовний 30-денний контент-план. Ваш кейс може з\'явитися на нашому сайті.',
      'proof.p1.title': 'Безкоштовний контент-план', 'proof.p1.text': 'Отримайте 30-денну контент-стратегію під ваш бренд — без зобов\'язань',
      'proof.p2.title': '3 безкоштовних приклади', 'proof.p2.text': 'Оцініть якість до оплати — ми створимо 3 контент-одиниці безкоштовно',
      'proof.p3.title': 'Ціни перших клієнтів', 'proof.p3.text': 'Зафіксуйте ціни, які не зростуть, поки ви з нами',
      'proof.cta': 'Забронювати місце',
      'pkg.tag': 'Пакети', 'pkg.title': 'Щомісячні контент-пакети',
      'pkg.sub': 'Оберіть план, що підходить вашим бізнес-цілям та бюджету.',
      'pkg.mo': 'міс', 'pkg.popular': 'Найпопулярніший', 'pkg.select': 'Почати',
      'pkg.timer.label': 'Ціна для засновників діє до кінця 2026', 'pkg.timer.days': 'дн', 'pkg.timer.hours': 'год', 'pkg.timer.min': 'хв', 'pkg.timer.sec': 'сек',
      'pkg.s.reels': 'Reels (15-30 сек)', 'pkg.s.carousel': 'Каруселі', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Контент-календар', 'pkg.s.revisions': '1 раунд правок',
      'pkg.g.reels': 'Reels (15-30 сек)', 'pkg.g.carousel': 'Каруселі', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Повна контент-стратегія',
      'pkg.g.revisions': '2 раунди правок', 'pkg.g.calendar': 'Календар публікацій',
      'pkg.sc.reels': 'Reels (15-30 сек)', 'pkg.sc.carousel': 'Каруселі', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting включено',
      'pkg.sc.revisions': 'Безлімітні правки', 'pkg.sc.manager': 'Виділений менеджер',
      'pkg.e.reels': 'Reels (15-45 сек)', 'pkg.e.carousel': 'Каруселі', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Повне управління акаунтом',
      'pkg.e.posting': 'Auto-posting включено', 'pkg.e.revisions': 'Безлімітні правки',
      'pkg.e.manager': 'Виділений менеджер', 'pkg.e.priority': 'Пріоритетна підтримка', 'pkg.e.call': 'Щомісячний стратегічний дзвінок',
      'proc.tag': 'Процес', 'proc.title': '5 кроків до результату',
      'proc.sub': 'Просто та прозоро — від брифу до готового контенту.',
      'proc.s1.title': 'Знайомство', 'proc.s1.text': 'Дізнаємось вашу нішу, продукт, цільову аудиторію та цілі на безкоштовній 30-хвилинній консультації.',
      'proc.s2.title': 'Стратегія та стиль', 'proc.s2.text': 'Визначаємо напрямок контенту, візуальну айдентику та ритм публікацій.',
      'proc.s3.title': 'AI-створення', 'proc.s3.text': 'Наша команда генерує візуали, рілси та тексти за допомогою AI + креативного керівництва.',
      'proc.s4.title': 'Погодження', 'proc.s4.text': 'Ви переглядаєте все, запитуєте правки та затверджуєте фінальні матеріали.',
      'proc.s5.title': 'Запуск та зростання', 'proc.s5.text': 'Контент публікується за повним календарем. Спостерігайте, як зростає залученість.',
      'faq.tag': 'FAQ', 'faq.title': 'Часті запитання',
      'faq.q1': 'Як працює створення AI-контенту?',
      'faq.a1': 'Ми використовуємо просунуті AI-інструменти у поєднанні з людським креативним керівництвом для генерації візуалів, відео та текстів. Кожен матеріал перевіряється та доопрацьовується нашою командою.',
      'faq.q2': 'Як швидко ми можемо почати?',
      'faq.a2': 'Після знайомства ми зазвичай доставляємо першу партію контенту протягом 5-7 робочих днів. Процес онбордингу швидкий — нам потрібні лише ваші бренд-матеріали та коротка розмова про цілі.',
      'faq.q3': 'Чи належить нам контент, який ви створюєте?',
      'faq.a3': 'Так, на 100%. Весь контент, який ми створюємо, належить вам. Ви отримуєте повні права використовувати його на будь-якій платформі, в рекламі, на сайті — скрізь, де потрібно.',
      'faq.q4': 'Чи можна запитувати правки?',
      'faq.a4': 'Безумовно. Кожен пакет включає раунди правок (1 для Lite, 2 для Pro, без обмежень для Premium). Ми хочемо, щоб ви були повністю задоволені кожним матеріалом.',
      'faq.q5': 'Для яких платформ ви створюєте контент?',
      'faq.a5': 'Ми створюємо контент, оптимізований для Instagram, TikTok, Facebook, LinkedIn та YouTube Shorts. Кожен матеріал правильно відформатований для цільової платформи.',
      'faq.q6': 'Чи є мінімальний термін контракту?',
      'faq.a6': 'Ми рекомендуємо мінімум 3 місяці для отримання реальних результатів. Однак довгострокової прив\'язки немає — ви можете скасувати з повідомленням за 30 днів.',
      'cta.title': 'Готові трансформувати ваш контент?',
      'cta.sub': 'Запишіться на безкоштовну стратегічну консультацію або надішліть нам повідомлення. Ми створимо індивідуальний контент-план для вашого бізнесу.',
      'cta.location': 'Ми базуємось у Нідерландах',
      'form.name': 'Ваше ім\'я', 'form.email': 'Email', 'form.business': 'Тип бізнесу',
      'form.bizPlaceholder': 'Оберіть галузь', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Краса та здоров\'я', 'form.bizOpt3': 'Мода та одяг',
      'form.bizOpt4': 'Med Spa та естетика', 'form.bizOpt5': 'Прикраси та аксесуари', 'form.bizOpt6': 'Lifestyle-бренди', 'form.bizOpt7': 'Інше',
      'form.website': 'Сайт / Instagram', 'form.goals': 'Які ваші основні цілі щодо контенту?',
      'form.budget': 'Щомісячний бюджет на контент', 'form.budgetPlaceholder': 'Оберіть діапазон', 'form.budgetUnsure': 'Ще не знаю',
      'form.submit': 'Отримати безкоштовний план',
      'form.successTitle': 'Бриф отримано!', 'form.successText': 'Наш AI-агент аналізує вашу нішу. Ви отримаєте персоналізований план протягом 24 годин.'
    },
    fr: {
      'nav.problem': 'Problème', 'nav.solution': 'Solution', 'nav.portfolio': 'Portfolio',
      'nav.packages': 'Forfaits', 'nav.faq': 'FAQ', 'nav.contact': 'Plan gratuit',
      'hero.tag': 'AI Content Company',
      'hero.title1': 'Du contenu IA qui',
      'hero.title2': 'arrête le scroll',
      'hero.sub': 'Nous créons des visuels et du contenu vidéo alimentés par l\'IA qui captent l\'attention, instaurent la confiance et transforment les abonnés en clients.',
      'hero.cta': 'Plan de contenu gratuit', 'hero.cta2': 'Voir nos travaux',
      'hero.m1': 'Production IA', 'hero.m2': 'Jours pour le premier contenu', 'hero.m3': 'Pièces / Mois',
      'pain.tag': 'Le problème', 'pain.title': 'Pourquoi votre contenu ne fonctionne pas',
      'pain.sub': 'Les gens sont submergés de contenu. La plupart des publications disparaissent en moins d\'une seconde.',
      'pain.c1.title': 'Pas d\'accroche visuelle', 'pain.c1.text': 'Votre contenu n\'arrête pas le défilement. Les utilisateurs passent en une fraction de seconde.',
      'pain.c2.title': 'Ressemble à tout le monde', 'pain.c2.text': 'Les visuels génériques se perdent dans le fil. Votre marque se fond au lieu de se démarquer.',
      'pain.c3.title': 'Pas de régularité', 'pain.c3.text': 'Sans rythme régulier, pas de reconnaissance. Votre audience vous oublie entre les publications.',
      'pain.c4.title': 'Pas de stratégie', 'pain.c4.text': 'Du contenu sans entonnoir, c\'est du bruit. Pas de système qui réchauffe les prospects.',
      'sol.tag': 'Notre solution', 'sol.title': 'Le système VellumCadence',
      'sol.sub': 'Pas juste du contenu. Un moteur d\'attention complet qui rend votre croissance prévisible.',
      'sol.c1.title': 'Production IA', 'sol.c1.text': 'Nous générons du contenu rapidement, régulièrement et à grande échelle — sans longues séances photo.',
      'sol.c2.title': 'Style visuel unique', 'sol.c2.text': 'Des visuels conçus pour capter le regard. Pas des templates — un style créé exclusivement pour votre marque.',
      'sol.c3.title': 'Stratégie d\'entonnoir', 'sol.c3.text': 'Chaque élément a un objectif : attirer l\'attention, instaurer la confiance ou déclencher l\'achat.',
      'who.tag': 'Secteurs', 'who.title': 'Avec qui nous travaillons',
      'who.sub': 'Nous aidons les marques de tous secteurs à créer des systèmes de contenu percutants.',
      'who.c1': 'E-commerce', 'who.c2': 'Beauté & Bien-être', 'who.c3': 'Mode & Vêtements',
      'who.c4': 'Med Spa & Esthétique', 'who.c5': 'Bijoux & Accessoires', 'who.c6': 'Marques Lifestyle',
      'port.tag': 'Portfolio', 'port.title': 'Ce que nous créons',
      'port.sub': 'Voici les formats de contenu que nous produisons chaque mois. Exemples clients réels à venir.',
      'port.c1': 'Reels & Vidéos courtes', 'port.c2': 'Carrousels', 'port.c3': 'Identité de marque',
      'port.c4': 'Avant / Après', 'port.c5': 'Shootings produit', 'port.c6': 'Templates réseaux sociaux',
      'proof.tag': 'Offre limitée', 'proof.title': 'Soyez l\'un de nos 10 premiers clients',
      'proof.sub': 'Nous accueillons nos premiers clients et offrons un plan de contenu gratuit de 30 jours aux early adopters. Votre étude de cas pourrait figurer sur notre site.',
      'proof.p1.title': 'Plan de contenu gratuit', 'proof.p1.text': 'Recevez une stratégie de contenu de 30 jours sur mesure — sans engagement',
      'proof.p2.title': '3 exemples gratuits', 'proof.p2.text': 'Voyez notre qualité avant de payer — nous créerons 3 contenus gratuitement',
      'proof.p3.title': 'Tarifs fondateurs', 'proof.p3.text': 'Bénéficiez de tarifs early-bird qui n\'augmenteront pas tant que vous êtes avec nous',
      'proof.cta': 'Réservez votre place',
      'pkg.tag': 'Forfaits', 'pkg.title': 'Forfaits mensuels de contenu',
      'pkg.sub': 'Choisissez le plan adapté à vos objectifs et votre budget.',
      'pkg.mo': 'mois', 'pkg.popular': 'Le plus populaire', 'pkg.select': 'Commencer',
      'pkg.timer.label': 'Prix fondateur valable jusqu\u2019a fin 2026', 'pkg.timer.days': 'j', 'pkg.timer.hours': 'h', 'pkg.timer.min': 'min', 'pkg.timer.sec': 'sec',
      'pkg.s.reels': 'Reels (15-30 sec)', 'pkg.s.carousel': 'Carrousels', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Calendrier de contenu', 'pkg.s.revisions': '1 tour de révisions',
      'pkg.g.reels': 'Reels (15-30 sec)', 'pkg.g.carousel': 'Carrousels', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Stratégie de contenu complète',
      'pkg.g.revisions': '2 tours de révisions', 'pkg.g.calendar': 'Calendrier de publication',
      'pkg.sc.reels': 'Reels (15-30 sec)', 'pkg.sc.carousel': 'Carrousels', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting inclus',
      'pkg.sc.revisions': 'Révisions illimitées', 'pkg.sc.manager': 'Manager dédié',
      'pkg.e.reels': 'Reels (15-45 sec)', 'pkg.e.carousel': 'Carrousels', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Gestion de compte complète',
      'pkg.e.posting': 'Auto-posting inclus', 'pkg.e.revisions': 'Révisions illimitées',
      'pkg.e.manager': 'Manager dédié', 'pkg.e.priority': 'Support prioritaire', 'pkg.e.call': 'Appel stratégique mensuel',
      'proc.tag': 'Processus', 'proc.title': '5 étapes vers les résultats',
      'proc.sub': 'Simple et transparent — du brief au contenu prêt à publier.',
      'proc.s1.title': 'Remplir le brief', 'proc.s1.text': 'Complétez un court questionnaire sur votre niche, produit, audience et objectifs.',
      'proc.s2.title': 'Analyse IA', 'proc.s2.text': 'Notre agent IA analyse votre niche, vos concurrents et votre audience — puis construit une stratégie personnalisée.',
      'proc.s3.title': 'Création IA', 'proc.s3.text': 'Notre équipe génère visuels, reels et textes avec l\'IA + direction créative humaine.',
      'proc.s4.title': 'Validation', 'proc.s4.text': 'Vous examinez tout, demandez des modifications et approuvez les matériaux finaux.',
      'proc.s5.title': 'Lancement', 'proc.s5.text': 'Le contenu est publié avec un calendrier complet. Observez l\'engagement grandir.',
      'faq.tag': 'FAQ', 'faq.title': 'Questions fréquentes',
      'faq.q1': 'Comment fonctionne la création de contenu IA ?',
      'faq.a1': 'Nous utilisons des outils IA avancés combinés à une direction créative humaine pour générer visuels, vidéos et textes. Chaque pièce est vérifiée par notre équipe pour correspondre parfaitement à votre marque.',
      'faq.q2': 'Combien de temps pour démarrer ?',
      'faq.a2': 'Après le brief, nous livrons généralement votre premier lot de contenu en 5-7 jours ouvrables.',
      'faq.q3': 'Le contenu nous appartient-il ?',
      'faq.a3': 'Oui, à 100%. Tout le contenu que nous créons vous appartient. Vous recevez tous les droits pour l\'utiliser partout.',
      'faq.q4': 'Peut-on demander des modifications ?',
      'faq.a4': 'Absolument. Chaque forfait inclut des tours de révisions (1 pour Lite, 2 pour Pro, illimité pour Premium).',
      'faq.q5': 'Pour quelles plateformes créez-vous du contenu ?',
      'faq.a5': 'Nous créons du contenu optimisé pour Instagram, TikTok, Facebook, LinkedIn et YouTube Shorts.',
      'faq.q6': 'Y a-t-il une durée minimale de contrat ?',
      'faq.a6': 'Nous recommandons un minimum de 3 mois. Cependant, pas d\'engagement long terme — vous pouvez annuler avec un préavis de 30 jours.',
      'cta.title': 'Obtenez votre stratégie de contenu gratuite',
      'cta.sub': 'Remplissez ce brief et notre agent IA analysera votre niche, votre audience et vos concurrents — puis livrera un plan de contenu personnalisé sur 30 jours.',
      'form.name': 'Votre nom', 'form.email': 'Adresse email', 'form.business': 'Type d\'entreprise',
      'form.bizPlaceholder': 'Sélectionnez votre secteur', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Beauté & Bien-être', 'form.bizOpt3': 'Mode & Vêtements',
      'form.bizOpt4': 'Med Spa & Esthétique', 'form.bizOpt5': 'Bijoux & Accessoires', 'form.bizOpt6': 'Marques Lifestyle', 'form.bizOpt7': 'Autre',
      'form.website': 'Site web / Instagram', 'form.goals': 'Quels sont vos objectifs de contenu ?',
      'form.budget': 'Budget mensuel de contenu', 'form.budgetPlaceholder': 'Sélectionnez une fourchette', 'form.budgetUnsure': 'Pas encore sûr',
      'form.submit': 'Obtenir mon plan gratuit',
      'form.successTitle': 'Brief reçu !', 'form.successText': 'Notre agent IA analyse votre niche. Vous recevrez votre plan personnalisé sous 24 heures.'
    },
    pl: {
      'nav.problem': 'Problem', 'nav.solution': 'Rozwiązanie', 'nav.portfolio': 'Portfolio',
      'nav.packages': 'Pakiety', 'nav.faq': 'FAQ', 'nav.contact': 'Darmowy plan',
      'hero.tag': 'AI Content Company',
      'hero.title1': 'Treści AI, które',
      'hero.title2': 'zatrzymują scroll',
      'hero.sub': 'Tworzymy wizualizacje i treści wideo napędzane AI, które przyciągają uwagę, budują zaufanie i zamieniają obserwujących w klientów.',
      'hero.cta': 'Darmowy plan treści', 'hero.cta2': 'Zobacz nasze prace',
      'hero.m1': 'Produkcja AI', 'hero.m2': 'Dni do pierwszych treści', 'hero.m3': 'Sztuk / Miesiąc',
      'pain.tag': 'Problem', 'pain.title': 'Dlaczego Twoje treści nie działają',
      'pain.sub': 'Ludzie toną w treściach. Większość postów znika w ułamku sekundy.',
      'pain.c1.title': 'Brak wizualnego haczyka', 'pain.c1.text': 'Twoje treści nie zatrzymują scrolla. Użytkownicy przelatują obok w ułamku sekundy.',
      'pain.c2.title': 'Wygląda jak u wszystkich', 'pain.c2.text': 'Szablonowe wizualizacje giną w feedzie. Twoja marka wtapia się zamiast wyróżniać.',
      'pain.c3.title': 'Brak regularności', 'pain.c3.text': 'Bez regularnego rytmu nie ma rozpoznawalności. Publiczność zapomina o Tobie między postami.',
      'pain.c4.title': 'Brak strategii', 'pain.c4.text': 'Treści bez lejka to tylko szum. Nie ma systemu, który rozgrzewa leady i prowadzi do działania.',
      'sol.tag': 'Nasze rozwiązanie', 'sol.title': 'System VellumCadence',
      'sol.sub': 'Nie tylko treści. Kompletny silnik uwagi, który sprawia, że Twój wzrost jest przewidywalny.',
      'sol.c1.title': 'Produkcja AI', 'sol.c1.text': 'Generujemy treści szybko, regularnie i na skalę — bez długich sesji zdjęciowych.',
      'sol.c2.title': 'Unikalny styl wizualny', 'sol.c2.text': 'Wizualizacje zaprojektowane, by przyciągać wzrok. Nie szablony — styl stworzony wyłącznie dla Twojej marki.',
      'sol.c3.title': 'Strategia lejkowa', 'sol.c3.text': 'Każdy element służy celowi: przyciąga uwagę, buduje zaufanie lub napędza sprzedaż.',
      'who.tag': 'Branże', 'who.title': 'Z kim pracujemy',
      'who.sub': 'Pomagamy markom z różnych branż budować systemy treści zatrzymujące scroll.',
      'who.c1': 'E-commerce', 'who.c2': 'Uroda i wellness', 'who.c3': 'Moda i odzież',
      'who.c4': 'Med Spa i estetyka', 'who.c5': 'Biżuteria i akcesoria', 'who.c6': 'Marki Lifestyle',
      'port.tag': 'Portfolio', 'port.title': 'Co tworzymy',
      'port.sub': 'To formaty treści, które produkujemy co miesiąc. Prawdziwe przykłady klientów wkrótce.',
      'port.c1': 'Reels i krótkie filmy', 'port.c2': 'Karuzele', 'port.c3': 'Identyfikacja marki',
      'port.c4': 'Przed / Po', 'port.c5': 'Sesje produktowe', 'port.c6': 'Szablony social media',
      'proof.tag': 'Oferta limitowana', 'proof.title': 'Bądź jednym z naszych pierwszych 10 klientów',
      'proof.sub': 'Przyjmujemy pierwszych klientów i oferujemy darmowy 30-dniowy plan treści dla early adopterów. Twoje studium przypadku może pojawić się na naszej stronie.',
      'proof.p1.title': 'Darmowy plan treści', 'proof.p1.text': 'Otrzymaj pełną 30-dniową strategię treści — bez zobowiązań',
      'proof.p2.title': '3 darmowe przykładowe posty', 'proof.p2.text': 'Zobacz naszą jakość zanim zapłacisz — stworzymy 3 treści za darmo',
      'proof.p3.title': 'Ceny założycielskie', 'proof.p3.text': 'Zablokuj ceny early-bird, które nie wzrosną dopóki jesteś z nami',
      'proof.cta': 'Zarezerwuj swoje miejsce',
      'pkg.tag': 'Pakiety', 'pkg.title': 'Miesięczne pakiety treści',
      'pkg.sub': 'Wybierz plan dopasowany do Twoich celów biznesowych i budżetu.',
      'pkg.mo': 'mies', 'pkg.popular': 'Najpopularniejszy', 'pkg.select': 'Zacznij',
      'pkg.timer.label': 'Cena zalozycielska wazna do konca 2026', 'pkg.timer.days': 'dni', 'pkg.timer.hours': 'godz', 'pkg.timer.min': 'min', 'pkg.timer.sec': 'sek',
      'pkg.s.reels': 'Reels (15-30 sek)', 'pkg.s.carousel': 'Karuzele', 'pkg.s.visuals': 'AI product visuals',
      'pkg.s.calendar': 'Kalendarz treści', 'pkg.s.revisions': '1 runda poprawek',
      'pkg.g.reels': 'Reels (15-30 sek)', 'pkg.g.carousel': 'Karuzele', 'pkg.g.visuals': 'AI product visuals',
      'pkg.g.stories': 'Stories (weekly)', 'pkg.g.strategy': 'Pełna strategia treści',
      'pkg.g.revisions': '2 rundy poprawek', 'pkg.g.calendar': 'Kalendarz publikacji',
      'pkg.sc.reels': 'Reels (15-30 sek)', 'pkg.sc.carousel': 'Karuzele', 'pkg.sc.visuals': 'AI product visuals',
      'pkg.sc.stories': 'Stories (weekly)', 'pkg.sc.posting': 'Auto-posting w zestawie',
      'pkg.sc.revisions': 'Nieograniczone poprawki', 'pkg.sc.manager': 'Dedykowany manager',
      'pkg.e.reels': 'Reels (15-45 sek)', 'pkg.e.carousel': 'Karuzele', 'pkg.e.visuals': 'AI product visuals',
      'pkg.e.stories': 'Stories (daily)', 'pkg.e.management': 'Pełne zarządzanie kontem',
      'pkg.e.posting': 'Auto-posting w zestawie', 'pkg.e.revisions': 'Nieograniczone poprawki',
      'pkg.e.manager': 'Dedykowany manager', 'pkg.e.priority': 'Priorytetowe wsparcie', 'pkg.e.call': 'Miesięczna rozmowa strategiczna',
      'proc.tag': 'Proces', 'proc.title': '5 kroków do rezultatu',
      'proc.sub': 'Prosto i przejrzyście — od briefu do gotowych treści.',
      'proc.s1.title': 'Wypełnij brief', 'proc.s1.text': 'Wypełnij krótką ankietę o swojej niszy, produkcie, grupie docelowej i celach.',
      'proc.s2.title': 'Analiza AI', 'proc.s2.text': 'Nasz agent AI analizuje Twoją niszę, konkurencję i odbiorców — następnie buduje strategię.',
      'proc.s3.title': 'Tworzenie AI', 'proc.s3.text': 'Nasz zespół generuje wizualizacje, reelsy i teksty za pomocą AI + ludzkiego kierownictwa kreatywnego.',
      'proc.s4.title': 'Zatwierdzenie', 'proc.s4.text': 'Przeglądasz wszystko, prosisz o zmiany i zatwierdzasz finalne materiały.',
      'proc.s5.title': 'Start i wzrost', 'proc.s5.text': 'Treści publikowane z pełnym kalendarzem. Obserwuj, jak rośnie zaangażowanie.',
      'faq.tag': 'FAQ', 'faq.title': 'Najczęściej zadawane pytania',
      'faq.q1': 'Jak działa tworzenie treści AI?',
      'faq.a1': 'Używamy zaawansowanych narzędzi AI w połączeniu z ludzkim kierownictwem kreatywnym do generowania wizualizacji, filmów i tekstów. Każdy element jest weryfikowany przez nasz zespół.',
      'faq.q2': 'Jak szybko możemy zacząć?',
      'faq.a2': 'Po briefie zazwyczaj dostarczamy pierwszą partię treści w ciągu 5-7 dni roboczych.',
      'faq.q3': 'Czy treści należą do nas?',
      'faq.a3': 'Tak, w 100%. Wszystkie treści, które tworzymy, należą do Ciebie. Otrzymujesz pełne prawa do użytkowania wszędzie.',
      'faq.q4': 'Czy można prosić o poprawki?',
      'faq.a4': 'Oczywiście. Każdy pakiet zawiera rundy poprawek (1 dla Lite, 2 dla Pro, bez ograniczeń dla Premium).',
      'faq.q5': 'Na jakie platformy tworzycie treści?',
      'faq.a5': 'Tworzymy treści zoptymalizowane pod Instagram, TikTok, Facebook, LinkedIn i YouTube Shorts.',
      'faq.q6': 'Czy jest minimalny okres umowy?',
      'faq.a6': 'Zalecamy minimum 3 miesiące. Nie ma jednak długoterminowego zobowiązania — możesz anulować z 30-dniowym wyprzedzeniem.',
      'cta.title': 'Otrzymaj darmową strategię treści',
      'cta.sub': 'Wypełnij brief, a nasz agent AI przeanalizuje Twoją niszę, odbiorców i konkurencję — następnie dostarczy spersonalizowany 30-dniowy plan treści.',
      'form.name': 'Twoje imię', 'form.email': 'Adres email', 'form.business': 'Typ firmy',
      'form.bizPlaceholder': 'Wybierz branżę', 'form.bizOpt1': 'E-commerce',
      'form.bizOpt2': 'Uroda i wellness', 'form.bizOpt3': 'Moda i odzież',
      'form.bizOpt4': 'Med Spa i estetyka', 'form.bizOpt5': 'Biżuteria i akcesoria', 'form.bizOpt6': 'Marki Lifestyle', 'form.bizOpt7': 'Inne',
      'form.website': 'Strona / Instagram', 'form.goals': 'Jakie są Twoje główne cele treściowe?',
      'form.budget': 'Miesięczny budżet na treści', 'form.budgetPlaceholder': 'Wybierz zakres', 'form.budgetUnsure': 'Jeszcze nie wiem',
      'form.submit': 'Otrzymaj darmowy plan',
      'form.successTitle': 'Brief otrzymany!', 'form.successText': 'Nasz agent AI analizuje Twoją niszę. Otrzymasz spersonalizowany plan w ciągu 24 godzin.'
    }
  };

  /* ── Language detection & switching ── */
  var currentLang = 'en';
  var langLabel = document.getElementById('langLabel');
  var langSwitcher = document.getElementById('langSwitcher');
  var langBtn = document.getElementById('langBtn');
  var langDropdown = document.getElementById('langDropdown');

  function detectLanguage() {
    var stored = localStorage.getItem('vc-lang');
    if (stored && T[stored]) return stored;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('nl')) return 'nl';
    if (nav.startsWith('de')) return 'de';
    if (nav.startsWith('fr')) return 'fr';
    if (nav.startsWith('pl')) return 'pl';
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('uk')) return 'uk';
    return 'en';
  }

  function applyLang(lang) {
    if (!T[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('vc-lang', lang);
    document.documentElement.lang = lang;
    langLabel.textContent = lang.toUpperCase() === 'UK' ? 'UA' : lang.toUpperCase();

    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (T[lang][key]) {
        els[i].textContent = T[lang][key];
      }
    }
  }

  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    langSwitcher.classList.toggle('open');
  });

  langDropdown.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang]');
    if (!btn) return;
    applyLang(btn.getAttribute('data-lang'));
    langSwitcher.classList.remove('open');
  });

  document.addEventListener('click', function () { langSwitcher.classList.remove('open'); });

  /* ── Nav scroll ── */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Burger ── */
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  /* ── Scroll animations ── */
  var animEls = document.querySelectorAll('.anim');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(function (el) { observer.observe(el); });

  /* ── Cursor glow (desktop) ── */
  var cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches) {
    var rafPending = false;
    var cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX; cursorY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(function () {
          cursorGlow.style.left = cursorX + 'px';
          cursorGlow.style.top = cursorY + 'px';
          if (!cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
          rafPending = false;
        });
      }
    });
  }

  /* ── 3D tilt for cards ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    var tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(function (card) {
      var tiltRaf = false, tiltX = 0, tiltY = 0;
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        tiltX = (e.clientX - rect.left) / rect.width - 0.5;
        tiltY = (e.clientY - rect.top) / rect.height - 0.5;
        if (!tiltRaf) {
          tiltRaf = true;
          requestAnimationFrame(function () {
            card.style.transform = 'perspective(800px) rotateY(' + (tiltX * 8) + 'deg) rotateX(' + (-tiltY * 8) + 'deg) scale(1.02)';
            tiltRaf = false;
          });
        }
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── Background Canvas ── */
  var canvas = document.getElementById('bgCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var pCount = 60;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
        ctx.fill();
      }
      // Draw connections
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(139,92,246,' + (0.06 * (1 - dist / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ── FAQ accordion ── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var qBtn = item.querySelector('.faq-q');
    qBtn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(function (fi) { fi.classList.remove('open'); });
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Form — submission via OpenClaw Lead API ── */
  var ctaForm = document.getElementById('ctaForm');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn = ctaForm ? ctaForm.querySelector('.form-submit') : null;

  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('formName');
      var email = document.getElementById('formEmail');
      var biz = document.getElementById('formBiz');
      var hasError = false;

      [name, email, biz].forEach(function (input) {
        if (!input.value || !input.value.trim()) {
          input.classList.add('field-error');
          input.classList.remove('field-ok');
          hasError = true;
        } else {
          input.classList.remove('field-error');
          input.classList.add('field-ok');
        }
      });

      if (email.value && !email.value.includes('@')) {
        email.classList.add('field-error');
        hasError = true;
      }

      if (hasError) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '...';
      }

      var payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        business_type: biz.value,
        website: (document.getElementById('formWebsite') || {}).value || '',
        goals: (document.getElementById('formGoals') || {}).value || '',
        budget: (document.getElementById('formBudget') || {}).value || ''
      };

      fetch('https://api.vellumcadence.com/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            ctaForm.style.display = 'none';
            formSuccess.style.display = 'block';
            var ctaSection = document.getElementById('cta');
            if (ctaSection) ctaSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            throw new Error('API error');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get My Free Content Plan';
          }
          alert('Something went wrong. Please try again.');
        });
    });
  }

  /* ── Portfolio Filtering ── */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.portfolio-item').forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });

  /* ── Lightbox ── */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.querySelectorAll('.portfolio-open').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var src = btn.getAttribute('data-src') || '';
        lightbox.querySelector('.lb-img').src = src;
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('.lb-close').addEventListener('click', function () {
      lightbox.classList.remove('open');
    });
    lightbox.querySelector('.lb-backdrop').addEventListener('click', function () {
      lightbox.classList.remove('open');
    });
  }

  /* ── Background system height sync ── */
  function syncBgHeight() {
    var bgSystem = document.querySelector('.bg-system');
    if (bgSystem) {
      bgSystem.style.height = document.documentElement.scrollHeight + 'px';
    }
  }
  syncBgHeight();
  window.addEventListener('resize', syncBgHeight);
  // Recheck after fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncBgHeight);
  }
  // Recheck periodically for dynamic content
  setTimeout(syncBgHeight, 1000);
  setTimeout(syncBgHeight, 3000);

  /* ── Countdown timer ── */
  (function () {
    var end = new Date(new Date().getFullYear() + '-12-31T23:59:59');
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var diff = end - Date.now();
      if (diff <= 0) diff = 0;
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var min = Math.floor((diff % 3600000) / 60000);
      var sec = Math.floor((diff % 60000) / 1000);
      var d = document.getElementById('ct-days');
      var h = document.getElementById('ct-hours');
      var m = document.getElementById('ct-min');
      var s = document.getElementById('ct-sec');
      if (d) d.textContent = days;
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(min);
      if (s) s.textContent = pad(sec);
    }
    tick();
    setInterval(tick, 1000);
  }());


  /* ── Hero video: fade-in after render ── */
  (function initHeroVideo() {
    var v = document.querySelector('.hero-video');
    if (!v) return;
    function showVideo() {
      setTimeout(function() { v.classList.add('ready'); }, 300);
    }
    if (v.readyState >= 3) { showVideo(); }
    else { v.addEventListener('canplay', showVideo, { once: true }); }
  }());

  /* ── Portfolio videos: delayed play on hover ── */
  document.addEventListener('mouseover', function(e) {
    var v = e.target.closest('.portfolio-item') && e.target.closest('.portfolio-item').querySelector('video');
    if (!v) return;
    if (v._playTimer) return;
    v._playTimer = setTimeout(function() {
      v.play();
      v._playTimer = null;
    }, 400);
  });
  document.addEventListener('mouseout', function(e) {
    var item = e.target.closest('.portfolio-item');
    if (!item) return;
    var v = item.querySelector('video');
    if (!v) return;
    if (v._playTimer) { clearTimeout(v._playTimer); v._playTimer = null; }
    v.pause();
  });

  /* ── Init ── */
  applyLang(detectLanguage());

})();
