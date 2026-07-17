// assets/js/toc.js
$(function() {
  var $tocList = $('#toc-list');
  if (!$tocList.length) return;

  var $content = $('.post-content');
  var headings = $content.find('h1, h2, h3, h4, h5, h6');

  if (headings.length === 0) {
    $tocList.parent().hide(); // 无标题则隐藏目录
    return;
  }

  // 生成目录项
  headings.each(function(index) {
    var $heading = $(this);
    var level = parseInt(this.tagName.charAt(1), 10);
    var id = $heading.attr('id') || 'heading-' + index;
    if (!$heading.attr('id')) $heading.attr('id', id);

    var text = $heading.text();
    var $li = $('<li>').addClass('toc-h' + level);
    var $a = $('<a>')
      .attr('href', '#' + id)
      .text(text)
      .data('target', id);
    $li.append($a);
    $tocList.append($li);
  });

  // 滚动监听与高亮
  var $anchors = $tocList.find('a');
  var headingPositions = [];

  function updatePositions() {
    headingPositions = [];
    headings.each(function() {
      var rect = this.getBoundingClientRect();
      var top = rect.top + window.pageYOffset;
      headingPositions.push({ id: this.id, top: top });
    });
  }

  function highlightCurrent() {
    var scrollY = window.pageYOffset + 20; // 偏移量，可根据需要调整
    var currentId = null;
    for (var i = headingPositions.length - 1; i >= 0; i--) {
      if (headingPositions[i].top <= scrollY) {
        currentId = headingPositions[i].id;
        break;
      }
    }
    $anchors.removeClass('active');
    if (currentId) {
      $anchors.filter('[data-target="' + currentId + '"]').addClass('active');
    }
  }

  // 初始化位置
  updatePositions();
  highlightCurrent();

  // 滚动时更新
  $(window).on('scroll', function() {
    highlightCurrent();
  });

  // 窗口大小变化时重新计算位置
  $(window).on('resize', function() {
    updatePositions();
    highlightCurrent();
  });

  // 点击锚点平滑滚动（可选）
  $anchors.on('click', function(e) {
    e.preventDefault();
    var targetId = $(this).data('target');
    var $target = $('#' + targetId);
    if ($target.length) {
      $('html, body').animate({
        scrollTop: $target.offset().top - 20 // 留一点余量
      }, 300);
    }
  });
});
