      (function(){
        const toggle = document.getElementById('lang-toggle');
        const title = document.getElementById('loading-title');
        const desc = document.getElementById('loading-desc');
        const start = document.getElementById('loading-start');

        const EN = {
          title: 'Welcome to the Filipino Sign Language Buddy',
          desc: 'Discover signs with dual-angle videos. Click below to get started.',
          start: 'Get Started',
          btnLabel: 'Filipino'
        };

        const PH = {
          title: 'Maligayang Pagdating sa Filipinong Wikang Pasenyas',
          desc: 'Matutong magsenyas gamit ang malinaw at inklusibong mga bidyo. Pindutin sa ibaba upang magsimula.',
          start: 'Magsimula',
          btnLabel: 'English'
        };

        // default: Tagalog
        let lang = localStorage.getItem('site-lang') || 'ph';

        function apply(langKey){
          const data = langKey === 'en' ? EN : PH;
          title.textContent = data.title;
          desc.textContent = data.desc;
          start.textContent = data.start;
          toggle.textContent = data.btnLabel;
          toggle.setAttribute('aria-pressed', langKey === 'en');
          localStorage.setItem('site-lang', langKey);
        }

        toggle.addEventListener('click', function(){
          lang = (lang === 'en') ? 'ph' : 'en';
          apply(lang);
        });

        // initialize
        apply(lang);
      })();