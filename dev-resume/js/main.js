document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initThemeToggle();
    initScrollReveal();
    initScrollSpy();
});

/**
 * 모바일 햄버거 메뉴 열기/닫기 + 메뉴 내 링크 클릭 시 자동 닫힘
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuToggle || !mobileMenu) return;

    const closeMenu = () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        menuToggle.setAttribute('aria-expanded', String(!isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * 다크 모드 토글 + localStorage 저장.
 * 초기 진입 시 테마 적용은 index.html <head>의 인라인 스크립트가 담당하며,
 * 여기서는 사용자가 명시적으로 클릭했을 때의 런타임 전환만 처리한다.
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
    });
}

/**
 * 섹션이 뷰포트에 들어오면 페이드인 (선택 기능)
 */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
}

/**
 * 현재 스크롤 위치의 섹션에 대응하는 데스크톱 네비 링크에 활성 스타일 부여
 */
function initScrollSpy() {
    const navLinks = document.querySelectorAll('#navbar .nav-link');
    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map(
        [...navLinks].map((link) => [link.getAttribute('href').slice(1), link])
    );

    const sections = [...linkById.keys()]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const setActive = (id) => {
        navLinks.forEach((link) => link.classList.remove('is-active'));
        linkById.get(id)?.classList.add('is-active');
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
            setActive(visible[0].target.id);
        }
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
}
