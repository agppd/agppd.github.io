---
layout: default
title: 请先登录
permalink: /login-required/
---

<div style="text-align: center; margin-top: 50px;">
  <h1>需要登录</h1>
  <p>您需要登录后才能访问该页面。</p>
  <p style="margin-top: 20px;"><a href="/">返回首页</a></p>
</div>

<script>
  (function() {
    // 获取 URL 中的 returnTo 参数
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo') || '/'; // 默认跳回首页

    // 如果用户已经登录，直接跳转回原页面（避免死循环）
    if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
      window.location.href = returnTo;
      return;
    }

    // 保存跳转地址到 sessionStorage，供登录后使用
    sessionStorage.setItem('redirectAfterLogin', returnTo);

  })();
</script>