
/**
  * 當menu過多時，自動適配，避免UI錯亂
  * @param {*} n
  * 傳入 1 sidebar打開時
  * 傳入 2 正常狀態下
  */

$(function () {
  const blogNameWidth = $('#site-name').width()
  const menusWidth = $('#menus').width()
  const sidebarWidth = $('#sidebar').width() || 300

  const adjustMenu = function (n) {
    const $nav = $('#nav')
    let t
    if (n === 0) t = true
    else if (n === 1) t = blogNameWidth + menusWidth > $nav.width() - sidebarWidth - 30
    else t = blogNameWidth + menusWidth > $nav.width() - 30

    if (t) {
      $nav.addClass('hide-menu')
    } else {
      $nav.removeClass('hide-menu')
    }
  }

  // 初始化header
  const initAdjust = () => {
    if (window.innerWidth < 768) adjustMenu(0)
    else adjustMenu(2)
    $('#nav').addClass('show')
  }

  /**
 * 進入post頁sidebar處理
 */
  const OpenSidebarAuto = () => {
    if (window.innerWidth > 1024 && $('#toggle-sidebar').hasClass('on')) {
      setTimeout(function () {
        openSidebar()
      }, 400)
    }
  }

  /**
 * 點擊左下角箭頭,顯示sidebar
 */

  const closeSidebar = () => {
    $('#sidebar').removeClass('tocOpenPc').animate({
      left: '-300px'
    }, 400)
    $('#menus').animate({
      paddingRight: 0
    }, 400)
    $('#body-wrap').animate({
      paddingLeft: 0
    }, 400)
    if ($('#nav').hasClass('hide-menu')) {
      setTimeout(function () {
        adjustMenu(2)
      }, 400)
    }
  }

  const openSidebar = () => {
    if (!$('#nav').hasClass('hide-menu')) {
      adjustMenu(1)
    }
    $('#sidebar').addClass('tocOpenPc').animate({
      left: 0
    }, 400)
    $('#menus').animate({
      paddingRight: 300
    }, 400)
    $('#body-wrap').animate({
      paddingLeft: 300
    }, 400)
  }

  const toggleSidebar = function () {
    $('#toggle-sidebar').on('click', function () {
      const isOpen = $(this).hasClass('on')
      isOpen ? $(this).removeClass('on') : $(this).addClass('on')
      if (isOpen) {
        closeSidebar()
      } else {
        openSidebar()
      }
    })
  }

  /**
 * 手機menu和toc按鈕點擊
 * 顯示menu和toc的sidebar
 */

  const sidebarFn = () => {
    const $toggleMenu = $('#toggle-menu')
    const $mobileSidebarMenus = $('#mobile-sidebar-menus')
    const $mobileTocButton = $('#mobile-toc-button')
    const $menuMask = $('#menu_mask')
    const $body = $('body')
    const $sidebar = $('#sidebar')

    function openMobileSidebar (name) {
      btf.sidebarPaddingR()
      $body.css('overflow', 'hidden')
      $menuMask.fadeIn()

      if (name === 'menu') {
        $toggleMenu.removeClass('close').addClass('open')
        $mobileSidebarMenus.addClass('open')
      }

      if (name === 'toc') {
        $mobileTocButton.removeClass('close').addClass('open')
        $sidebar.addClass('tocOpenMobile').css({ transform: 'translate3d(-100%,0,0)', left: '' })
      }
    }

    function closeMobileSidebar (name) {
      $body.css({ overflow: '', 'padding-right': '' })
      $menuMask.fadeOut()

      if (name === 'menu') {
        $toggleMenu.removeClass('open').addClass('close')
        $mobileSidebarMenus.removeClass('open')
      }

      if (name === 'toc') {
        $mobileTocButton.removeClass('open').addClass('close')
        $sidebar.removeClass('tocOpenMobile').css({ transform: '' })
      }
    }

    $toggleMenu.on('click', function () {
      openMobileSidebar('menu')
    })

    $mobileTocButton.on('click', function () {
      openMobileSidebar('toc')
    })

    $menuMask.on('click touchstart', function (e) {
      if ($toggleMenu.hasClass('open')) {
        closeMobileSidebar('menu')
      }
      if ($mobileTocButton.hasClass('open')) {
        closeMobileSidebar('toc')
      }
    })

    $(window).on('resize', function (e) {
      if (!$toggleMenu.is(':visible')) {
        if ($toggleMenu.hasClass('open')) closeMobileSidebar('menu')
      }
    })

    const mql = window.matchMedia('(max-width: 1024px)')
    const $toggleSidebar = $('#toggle-sidebar')
    const matchFn = (ev) => {
      if (ev.matches) {
        if ($sidebar.hasClass('tocOpenPc')) closeSidebar()
      } else {
        if ($toggleSidebar.hasClass('on')) openSidebar()
        if ($mobileTocButton.hasClass('open')) closeMobileSidebar('toc')
      }
    }

    mql.addListener(matchFn)
    document.addEventListener('pjax:send', () => { mql.removeListener(matchFn) })

    // toc元素點擊
    $sidebar.find('.toc-link').on('click', function (e) {
      e.preventDefault()
      btf.scrollToDest(decodeURI($(this).attr('href')))
      if (window.innerWidth < 1024) {
        closeMobileSidebar('toc')
      }
    })
  }

  /**
 * 首頁top_img底下的箭頭
 */
  const scrollDownInIndex = () => {
    $('#scroll-down').on('click', function () {
      btf.scrollToDest('#content-inner')
    })
  }

  /**
 * 代碼
 * 只適用於Hexo默認的代碼渲染
 */
  const addHighlightTool = function () {
    const isHighlightCopy = GLOBAL_CONFIG.highlight.highlightCopy
    const isHighlightLang = GLOBAL_CONFIG.highlight.highlightLang
    const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink
    const isShowTool = isHighlightCopy || isHighlightLang || isHighlightShrink !== undefined
    const $figureHighlight = GLOBAL_CONFIG.highlight.plugin === 'highlighjs' ? $('figure.highlight') : $('pre[class*="language-"]')

    if (isShowTool && $figureHighlight.length) {
      const isPrismjs = GLOBAL_CONFIG.highlight.plugin === 'prismjs'

      let highlightShrinkEle = ''
      let highlightCopyEle = ''
      const highlightShrinkClass = isHighlightShrink === true ? 'closed' : ''

      if (isHighlightShrink !== undefined) {
        highlightShrinkEle = `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
      }

      if (isHighlightCopy) {
        highlightCopyEle = '<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>'
      }

      if (isHighlightLang) {
        if (isPrismjs) {
          $figureHighlight.each(function () {
            const $this = $(this)
            const langName = $this.attr('data-language') !== undefined ? $this.attr('data-language') : 'Code'
            const highlightLangEle = `<div class="code-lang">${langName}</div>`
            $this.wrap('<figure class="highlight"></figure>').before(`<div class="highlight-tools ${highlightShrinkClass}">${highlightShrinkEle + highlightLangEle + highlightCopyEle}</div>`)
          })
        } else {
          $figureHighlight.each(function (i, o) {
            const $this = $(this)
            let langName = $this.attr('class').split(' ')[1]
            if (langName === 'plain' || langName === undefined) langName = 'Code'
            const highlightLangEle = `<div class="code-lang">${langName}</div>`
            $this.prepend(`<div class="highlight-tools ${highlightShrinkClass}">${highlightShrinkEle + highlightLangEle + highlightCopyEle}</div>`)
          })
        }
      } else {
        const ele = `<div class="highlight-tools ${highlightShrinkClass}">${highlightShrinkEle + highlightCopyEle}</div>`
        if (isPrismjs) $figureHighlight.wrap('<figure class="highlight"></figure>').before(ele)
        else $figureHighlight.prepend(ele)
      }

      /**
     * 代碼收縮
     */

      if (isHighlightShrink !== undefined) {
        $('.highlight-tools >.expand').on('click', function () {
          const $this = $(this)
          const $table = $this.parent().nextAll()
          $this.toggleClass('closed')
          $table.is(':visible') ? $table.css('display', 'none') : $table.css('display', 'block')
        })
      }

      /**
     * 代碼copy
     */
      if (isHighlightCopy) {
        const copy = function (text, ctx) {
          if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            document.execCommand('copy')
            if (GLOBAL_CONFIG.Snackbar !== undefined) {
              btf.snackbarShow(GLOBAL_CONFIG.copy.success)
            } else {
              $(ctx).prev('.copy-notice')
                .text(GLOBAL_CONFIG.copy.success)
                .animate({
                  opacity: 1
                }, 450, function () {
                  setTimeout(function () {
                    $(ctx).prev('.copy-notice').animate({
                      opacity: 0
                    }, 650)
                  }, 400)
                })
            }
          } else {
            if (GLOBAL_CONFIG.Snackbar !== undefined) {
              btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport)
            } else {
              $(ctx).prev('.copy-notice').text(GLOBAL_CONFIG.copy.noSupport)
            }
          }
        }

        // click events
        $('.highlight-tools >.copy-button').on('click', function () {
          const $buttonParent = $(this).parents('figure.highlight')
          $buttonParent.addClass('copy-true')
          const selection = window.getSelection()
          const range = document.createRange()
          if (isPrismjs) range.selectNodeContents($buttonParent.find('> pre code')[0])
          else range.selectNodeContents($buttonParent.find('table .code pre')[0])
          selection.removeAllRanges()
          selection.addRange(range)
          const text = selection.toString()
          copy(text, this)
          selection.removeAllRanges()
          $buttonParent.removeClass('copy-true')
        })
      }
    }
  }

  /**
 * PhotoFigcaption
 */
  function addPhotoFigcaption () {
    const images = $('#article-container img').not('.justified-gallery img')
    images.each(function (i, o) {
      const $this = $(o)
      if ($this.attr('alt')) {
        const t = $('<div class="img-alt is-center">' + $this.attr('alt') + '</div>')
        $this.after(t)
      }
    })
  }

  /**
 * justified-gallery 圖庫排版
 */

  let detectJgJsLoad = false
  const runJustifiedGallery = function () {
    const $justifiedGallery = $('.justified-gallery')
    if ($justifiedGallery.length) {
      const $imgList = $justifiedGallery.find('img')
      $imgList.unwrap()
      if ($imgList.length) {
        $imgList.each(function (i, o) {
          if ($(o).attr('data-lazy-src')) $(o).attr('src', $(o).attr('data-lazy-src'))
          $(o).wrap('<div></div>')
        })
      }

      if (detectJgJsLoad) btf.initJustifiedGallery($justifiedGallery)
      else {
        $('head').append(`<link rel="stylesheet" type="text/css" href="${GLOBAL_CONFIG.justifiedGallery.css}">`)
        $.getScript(`${GLOBAL_CONFIG.justifiedGallery.js}`, function () {
          btf.initJustifiedGallery($justifiedGallery)
        })
        detectJgJsLoad = true
      }
    }
  }

  /**
 * fancybox和 mediumZoom
 */
  const addLightBox = function () {
    if (GLOBAL_CONFIG.lightbox === 'fancybox') {
      const images = $('#article-container img:not(.gallery-group-img)').not($('a>img'))
      images.each(function (i, o) {
        const lazyloadSrc = $(o).attr('data-lazy-src') ? $(o).attr('data-lazy-src') : $(o).attr('src')
        const dataCaption = $(o).attr('alt') ? $(o).attr('alt') : ''
        $(o).wrap(`<a href="${lazyloadSrc}" data-fancybox="group" data-caption="${dataCaption}" class="fancybox"></a>`)
      })

      $().fancybox({
        selector: '[data-fancybox]',
        loop: true,
        transitionEffect: 'slide',
        protect: true,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],
        hash: false
      })
    } else {
      const zoom = mediumZoom(document.querySelectorAll('#article-container :not(a)>img'))
      zoom.on('open', function (event) {
        const photoBg = $(document.documentElement).attr('data-theme') === 'dark' ? '#121212' : '#fff'
        zoom.update({
          background: photoBg
        })
      })
    }
  }

  /**
 * 滾動處理
 */
  const scrollFn = function () {
    let initTop = 0
    let isChatShow = true
    const $rightside = $('#rightside')
    const $nav = $('#nav')
    const isChatBtnHide = typeof chatBtnHide === 'function'
    const isChatBtnShow = typeof chatBtnShow === 'function'
    $(window).scroll(btf.throttle(function (event) {
      const currentTop = $(this).scrollTop()
      const isDown = scrollDirection(currentTop)
      if (currentTop > 56) {
        if (isDown) {
          if ($nav.hasClass('visible')) $nav.removeClass('visible')
          if (isChatBtnShow && isChatShow === true) {
            chatBtnHide()
            isChatShow = false
          }
        } else {
          if (!$nav.hasClass('visible')) $nav.addClass('visible')
          if (isChatBtnHide && isChatShow === false) {
            window.chatBtnShow()
            isChatShow = true
          }
        }
        $nav.addClass('fixed')
        if ($rightside.css('opacity') === '0') {
          $rightside.css({ opacity: '1', transform: 'translateX(-38px)' })
        }
      } else {
        if (currentTop === 0) {
          $nav.removeClass('fixed').removeClass('visible')
        }
        $rightside.css({ opacity: '', transform: '' })
      }
    }, 200))

    // find the scroll direction
    function scrollDirection (currentTop) {
      const result = currentTop > initTop // true is down & false is up
      initTop = currentTop
      return result
    }
  }

  /**
 *  toc
 */
  const tocFn = function () {
    const $sidebar = $('#sidebar')
    const $tocChild = $sidebar.find('.toc-child')
    const $tocLink = $sidebar.find('.toc-link')
    const $article = $('#article-container')

    $tocChild.hide()

    // main of scroll
    $(window).scroll(btf.throttle(function (event) {
      const currentTop = $(this).scrollTop()
      scrollPercent(currentTop)
      findHeadPosition(currentTop)
    }, 100))

    // expand toc-item
    const expandToc = function ($item) {
      if ($item.is(':visible')) {
        return
      }
      $item.fadeIn(400)
    }

    const scrollPercent = function (currentTop) {
      const docHeight = $article.height()
      const winHeight = $(window).height()
      const headerHeight = $article.offset().top
      const contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : ($(document).height() - winHeight)
      const scrollPercent = (currentTop - headerHeight) / (contentMath)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      const percentage = (scrollPercentRounded > 100) ? 100
        : (scrollPercentRounded <= 0) ? 0
          : scrollPercentRounded
      $sidebar.find('.progress-num').text(percentage)
      $sidebar.find('.sidebar-toc__progress-bar').animate({
        width: percentage + '%'
      }, 100)
    }

    // anchor
    const isAnchor = GLOBAL_CONFIG.isanchor
    const updateAnchor = function (anchor) {
      if (window.history.replaceState && anchor !== window.location.hash) {
        window.history.replaceState(undefined, undefined, anchor)
      }
    }

    const autoScrollToc = function (currentTop, item) {
      const activePosition = item.offset().top
      const $tocContent = $sidebar.find('.sidebar-toc__content')
      const sidebarScrollTop = $tocContent.scrollTop()
      if (activePosition > (currentTop + $(window).height() - 100)) {
        $tocContent.scrollTop(sidebarScrollTop + 100)
      }
      if (activePosition < currentTop + 100) {
        $tocContent.scrollTop(sidebarScrollTop - 100)
      }
    }

    // find head position & add active class
    // DOM Hierarchy:
    // ol.toc > (li.toc-item, ...)
    // li.toc-item > (a.toc-link, ol.toc-2child > (li.toc-item, ...))
    const versionBiggerFive = GLOBAL_CONFIG.hexoversion.split('.')[0] >= 5
    const list = $article.find('h1,h2,h3,h4,h5,h6')

    const findHeadPosition = function (top) {
    // assume that we are not in the post page if no TOC link be found,
    // thus no need to update the status
      if ($tocLink.length === 0) {
        return false
      }

      let currentId = ''
      list.each(function () {
        const head = $(this)
        if (top > head.offset().top - 70) {
          if (versionBiggerFive) currentId = '#' + encodeURI($(this).attr('id'))
          else currentId = '#' + $(this).attr('id')
        }
      })

      if (currentId === '') {
        $tocLink.removeClass('active')
        $tocChild.hide()
      }

      const currentActive = $tocLink.filter('.active')
      if (currentId && currentActive.attr('href') !== currentId) {
        if (isAnchor) updateAnchor(currentId)

        $tocLink.removeClass('act