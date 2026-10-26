(() => {
  const fv = document.querySelector('.fv');
  if (!fv) return;

  const stage = fv.querySelector('.fv__stage');

  // 飛び出す起点（雲の中心あたり）までの距離を各パーツに設定。
  // data-cx / data-cy があればパーツ内のその位置（0〜1）を中心とみなす
  const setPopOrigins = () => {
    const cx = stage.offsetWidth * 0.5;
    const cy = stage.offsetWidth * (580 / 1076);
    fv.querySelectorAll('.fv-pop, .fv-burst').forEach((el) => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      const h = el.offsetHeight || el.getBoundingClientRect().height;
      const left = parseFloat(getComputedStyle(el).left);
      const top = parseFloat(getComputedStyle(el).top);
      const x = left + w * parseFloat(el.dataset.cx ?? 0.5);
      const y = top + h * parseFloat(el.dataset.cy ?? 0.5);
      el.style.setProperty('--dx', `${cx - x}px`);
      el.style.setProperty('--dy', `${cy - y}px`);
      el.style.transformOrigin = `${(el.dataset.cx ?? 0.5) * 100}% ${(el.dataset.cy ?? 0.5) * 100}%`;
    });
  };

  const play = () => {
    setPopOrigins();
    fv.classList.add('is-play');
  };

  // 画像が揃ってから再生（読み込みが遅くても3秒で開始）
  const images = [...fv.querySelectorAll('img')];
  const loaded = images.map((img) =>
    img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
  );
  Promise.race([Promise.all(loaded), new Promise((r) => setTimeout(r, 3000))]).then(play);
})();

// キッチンカーの写真：画面の下から30%の位置まで来たら表示
(() => {
  const photos = document.querySelectorAll('.kc-photo');
  if (!photos.length || !('IntersectionObserver' in window)) {
    photos.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -30% 0px' });
  photos.forEach((el) => io.observe(el));

  // ページの最後まで来たら、30%の位置まで上がりきらない写真も表示する
  const revealAtBottom = () => {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
    photos.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    });
  };
  window.addEventListener('scroll', revealAtBottom, { passive: true });
})();
