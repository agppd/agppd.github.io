---
layout: default
title: 意见反馈
permalink: /feedback/
---

<div class="feedback-container">
  <h1>意见反馈</h1>
  <p>欢迎提出宝贵意见，我们将尽快回复。</p>
  <p>禁止提交广告，禁止提交垃圾与无意义信息</p>
  <p>为保障用户信息安全，请不要提交涉及自己的隐私信息，如：信用卡号，身份证号等</p>

  <form name="feedback" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <!-- 隐藏字段，用于防止机器人（可选） -->
    <p style="display: none;">
      <label>不要填写这个字段： <input name="bot-field"></label>
    </p>

    <!-- 用户信息（Netlify Identity 会自动添加当前用户信息，无需手动填写） -->
    <p>
      <label for="message">反馈内容：</label><br>
      <textarea id="message" name="message" rows="6" required style="width: 100%;"></textarea>
    </p>
    <p>
      <button type="submit">提交反馈</button>
    </p>
  </form>

  <p>提交后我们会尽快处理，感谢您的支持！</p>
  <form name="feedback" method="POST" data-netlify="true" action="/feedback/thanks/thanks.md">
  
</div>