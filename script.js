// Prevent browser from restoring scroll position on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Force scroll to top before unloading, and again forcefully on load to prevent scroll jumping
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    // 1. Loading Screen
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);

    // 2. Headline Character Animation
    const headline = document.querySelector('.headline');
    if (headline) {
        const text = headline.textContent;
        headline.textContent = '';
        
        // Split by words first, then characters to keep words together
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            [...word].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.transitionDelay = `${(wordIndex * 0.1) + (charIndex * 0.05)}s`;
                wordSpan.appendChild(span);
            });
            
            headline.appendChild(wordSpan);
            
            // Add space between words
            if (wordIndex < words.length - 1) {
                headline.appendChild(document.createTextNode(' '));
            }
        });

        setTimeout(() => {
            headline.classList.add('visible');
        }, 1600); // Trigger after loader
    }

    // 3. Scroll Progress Indicator
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // 4. Parallax Effect for Hero section
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled*0.0005})`;
        }
    });

    // 5. Intersection Observer for Revealing Elements
    const fadeElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Delay observing scroll elements until the page has fully reset and loader is hidden
    // This prevents elements down the page from triggering their animations improperly during refresh scroll-jumps
    setTimeout(() => {
        fadeElements.forEach(el => sectionObserver.observe(el));
    }, 1500);

    // 6. Audio Toggle Logic (YouTube)
    const toggleBtn = document.getElementById('music-toggle');
    const iconMusicOn = document.querySelector('.icon-music');
    const iconMusicOff = document.querySelector('.icon-music-off');

    let ytPlayer;
    let isPlaying = false;

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // This function creates an <iframe> (and YouTube player) after the API code downloads
    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-audio', {
            height: '0',
            width: '0',
            videoId: 'SriqJuz2PWU',
            playerVars: {
                'autoplay': 0,
                'loop': 1,
                'playlist': 'SriqJuz2PWU' // Needed for looping single video
            },
            events: {
                'onReady': (event) => {
                    event.target.setVolume(50);
                }
            }
        });
    };

    toggleBtn.addEventListener('click', () => {
        if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

        if (!isPlaying) {
            ytPlayer.playVideo();
            isPlaying = true;
            iconMusicOn.classList.remove('hidden');
            iconMusicOff.classList.add('hidden');
        } else {
            ytPlayer.pauseVideo();
            isPlaying = false;
            iconMusicOn.classList.add('hidden');
            iconMusicOff.classList.remove('hidden');
        }
    });

    // 7. Image Gallery Modal
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.grid-item img');

    if (modal && modalImg && closeBtn) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                modal.classList.add('active');
                modalImg.src = img.src;
                document.body.style.overflow = 'hidden'; // prevent scrolling
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // enable scrolling
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }


    // 8. Custom Cursor Logic
    const customCursor = document.getElementById('custom-cursor');
    const headlineElement = document.querySelector('.headline');

    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            // Use clientX and clientY for fixed position elements
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        if (headlineElement) {
            headlineElement.addEventListener('mouseenter', () => {
                customCursor.classList.add('active');
            });

            headlineElement.addEventListener('mouseleave', () => {
                customCursor.classList.remove('active');
            });
        }
    }

    // 9. Countdown Timer
    const eventDate = new Date("April 26, 2026 19:00:00").getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    if (daysEl) {
        const updateTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(updateTimer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days < 10 ? '0' + days : days;
            hoursEl.textContent = hours < 10 ? '0' + hours : hours;
            minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
            secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
        }, 1000);
    }

});
