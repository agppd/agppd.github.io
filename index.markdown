---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
{% assign latest = site.announcements | sort: 'date' | reverse | first %}
{% if latest %}
<div class="latest-announcement">
  <h3>最新公告：<a href="{{ latest.url }}">{{ latest.title }}</a></h3>
  <p>{{ latest.excerpt | strip_html | truncate: 100 }}</p>
</div>
{% endif %}