---
layout: default
title: 公告
permalink: /announcements/
---

<h3><a href="https://agppd.netlify.app/admin/">发布公告（仅限管理员）</a ></h3>

<h1>最新公告</h1>

{% assign announcements = site.announcements | sort: 'date' | reverse %}
<ul class="announcement-list">
  {% for announcement in announcements %}
    <li>
      <a href="{{ announcement.url | relative_url }}">{{ announcement.title }}</a>
      <span class="date">{{ announcement.date | date: "%Y-%m-%d" }}</span>
      <p>{{ announcement.excerpt | strip_html | truncate: 120 }}</p>
    </li>
  {% endfor %}
</ul>