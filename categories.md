---
layout: page
title: 分类
permalink: /categories/
---

{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
  <h2 id="{{ category[0] | slugize }}">{{ category[0] }}</h2>
  <ul>
    {% for post in category[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        ({{ post.date | date: "%Y-%m-%d" }})
      </li>
    {% endfor %}
  </ul>
{% endfor %}