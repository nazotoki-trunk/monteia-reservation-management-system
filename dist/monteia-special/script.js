// 控えめなスクロール演出。JavaScript無効時もすべての本文を表示します。
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  items.forEach(item => {
    if (item.getBoundingClientRect().top > window.innerHeight) item.classList.add('pending');
    observer.observe(item);
  });
  document.documentElement.classList.add('motion-enabled');
})();
