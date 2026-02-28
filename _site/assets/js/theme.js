// 主题切换逻辑
(function() {
  function applyTheme(theme) {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    html.classList.remove('theme-dark', 'theme-light');
    if (theme === 'dark') {
      html.classList.add('theme-dark');
      toggleBtn.textContent = '🌙 深色';
    } else if (theme === 'light') {
      html.classList.add('theme-light');
      toggleBtn.textContent = '☀️ 浅色';
    } else {
      toggleBtn.textContent = '🌓 自动';
    }
    localStorage.setItem('theme', theme);
  }

  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    let savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    toggleBtn.addEventListener('click', () => {
      let current = localStorage.getItem('theme') || 'auto';
      if (current === 'auto') {
        applyTheme('dark');
      } else if (current === 'dark') {
        applyTheme('light');
      } else {
        applyTheme('auto');
      }
    });
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();