import { useEffect } from 'react';

const useSmoothScroll = () => {
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const targetId = target.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId!);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth',
        });
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);
};

export default useSmoothScroll;