document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initEmailCopy();
});

// 모바일 메뉴 토글
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// 이메일 복사 기능
function initEmailCopy() {
    const copyButton = document.getElementById('copy-email');
    const email = 'designer1205@naver.com';

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            // Clipboard API를 사용한 복사
            navigator.clipboard.writeText(email).then(function() {
                const originalText = copyButton.textContent;
                copyButton.textContent = '복사되었습니다!';
                copyButton.classList.add('bg-green-600');
                copyButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');

                setTimeout(function() {
                    copyButton.textContent = originalText;
                    copyButton.classList.remove('bg-green-600');
                    copyButton.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                }, 2000);
            }).catch(function(err) {
                console.error('클립보드 복사 실패:', err);
                alert('이메일을 복사할 수 없습니다. 수동으로 복사해주세요: ' + email);
            });
        });
    }
}
