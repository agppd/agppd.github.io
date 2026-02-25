---
layout: page
title: 作者
permalink: /authors/
---

{% assign authors = site.posts | map: 'author' | uniq | sort %}
{% for author in authors %}
  <h2 id="{{ author | slugize }}">{{ author }}</h2>
  <ul>
    {% for post in site.posts %}
      {% if post.author == author %}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          ({{ post.date | date: "%Y-%m-%d" }})
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}