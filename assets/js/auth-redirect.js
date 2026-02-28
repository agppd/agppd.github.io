// auth-redirect.js – 手动按钮版本
(function() {
  if (!window.netlifyIdentity) {
    console.warn('Netlify Identity widget not loaded.');
    return;
  }

  // 确保只初始化一次
  if (window._netlifyIdentityInitialized) return;
  window._netlifyIdentityInitialized = true;

  // 初始化 Widget
  window.netlifyIdentity.init();

  // 获取手动按钮
  const loginBtn = document.getElementById('netlify-login-btn');
  if (loginBtn) {
    // 更新按钮文字
    function updateButtonText(user) {
      loginBtn.textContent = user ? '登出' : '登录';
    }

    // 初始状态
    updateButtonText(window.netlifyIdentity.currentUser());

    // 监听登录事件
    window.netlifyIdentity.on('login', (user) => {
      updateButtonText(user);
      // 登录后跳转逻辑
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      }
    });

    // 监听登出事件
    window.netlifyIdentity.on('logout', () => {
      updateButtonText(null);
    });

    // 按钮点击事件
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = window.netlifyIdentity.currentUser();
      if (user) {
        window.netlifyIdentity.logout();
      } else {
        window.netlifyIdentity.open();
      }
    });
  }

  // 受保护页面检查（跳转到提示页）
  const protectedPaths = ['/feedback/']; // 可按需添加其他路径
  const currentPath = window.location.pathname;
  const isProtected = protectedPaths.some(path => currentPath.startsWith(path));

  if (isProtected) {
    setTimeout(() => {
      const user = window.netlifyIdentity.currentUser();
      if (!user) {
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `/login-required/?returnTo=${returnTo}`;
      }
    }, 500);
  }
})();