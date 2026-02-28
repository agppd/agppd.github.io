// 登录重定向逻辑
(function() {
  if (window.netlifyIdentity) {
    // 登录成功后跳转
    window.netlifyIdentity.on('login', function(user) {
      var redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      }
    });

    // 若当前为受保护页面且未登录，保存原始路径
    if (window.location.pathname.startsWith('/feedback/')) {
      setTimeout(function() {
        var user = window.netlifyIdentity.currentUser();
        if (!user) {
          sessionStorage.setItem('redirectAfterLogin', window.location.href);
        }
      }, 500);
    }
  }
})();