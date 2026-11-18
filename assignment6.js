'use strict';
$(document).ready(function(){
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $search=$('#coffeeSearch');
  const $suggestions=$('#searchSuggestions');
  const $items=$('.discover-item');
  const names=$items.map(function(){return $(this).data('name');}).get();
  let activeSuggestion=-1;

  // Tasks 1-3: live filtering, autocomplete and safe text highlighting.
  $('.searchable').each(function(){$(this).data('original',$(this).text());});
  function closeSuggestions(){
    $suggestions.prop('hidden',true);$search.attr('aria-expanded','false').removeAttr('aria-activedescendant');activeSuggestion=-1;
  }
  function highlight(query){
    $('.searchable').each(function(){
      const original=$(this).data('original');$(this).empty();
      if(!query){$(this).text(original);return;}
      const lower=original.toLowerCase();let position=0,index;
      while((index=lower.indexOf(query,position))!==-1){
        this.append(document.createTextNode(original.slice(position,index)));
        $('<mark>').text(original.slice(index,index+query.length)).appendTo(this);
        position=index+query.length;
      }
      this.append(document.createTextNode(original.slice(position)));
    });
  }
  function search(showSuggestions){
    Qala.write('qalaSearch',$search.val());
    const query=$search.val().trim().toLowerCase();
    $items.each(function(){
      const content=$(this).find('.searchable').map(function(){return $(this).data('original');}).get().join(' ').toLowerCase();
      $(this).prop('hidden',!content.includes(query));
    });
    const count=$items.filter(function(){return !this.hidden;}).length;
    $('#searchStatus').text(`${count} of ${$items.length} favorites found.`);
    $('#noResults').prop('hidden',count!==0);highlight(query);
    const matches=query?names.filter(name=>name.toLowerCase().includes(query)):[];
    $suggestions.empty();activeSuggestion=-1;
    matches.forEach((name,i)=>$('<li>',{id:'suggestion'+i,role:'option','aria-selected':'false',text:name}).appendTo($suggestions));
    const open=Boolean(showSuggestions&&matches.length);
    $suggestions.prop('hidden',!open);$search.attr('aria-expanded',String(open)).removeAttr('aria-activedescendant');
    updateProgress();checkViewport();
  }
  $search.on('input',function(){search(true);}).on('focus',function(){search(true);});
  $suggestions.on('mousedown',function(event){event.preventDefault();});
  $suggestions.on('click','li',function(){$search.val($(this).text());search(false);$search.trigger('focus');closeSuggestions();});
  $search.on('keydown',function(event){
    const options=$suggestions.children();
    if(event.key==='Escape'){event.preventDefault();closeSuggestions();return;}
    if($suggestions.prop('hidden')||!options.length)return;
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();
      activeSuggestion=(activeSuggestion+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
      options.attr('aria-selected','false').eq(activeSuggestion).attr('aria-selected','true');
      $search.attr('aria-activedescendant',options.eq(activeSuggestion).attr('id'));
    }else if(event.key==='Enter'&&activeSuggestion>=0){
      event.preventDefault();$search.val(options.eq(activeSuggestion).text());search(false);
    }
  });
  $(document).on('click',function(event){if(!$(event.target).closest('.search-wrap').length)closeSuggestions();});
  $('#clearSearch').on('click',function(){$search.val('');search(false);$search.trigger('focus');});

  // Task 4: the scroll range changes after search, so recalculate it.
  function updateProgress(){
    const range=$(document).height()-$(window).height();
    const percent=range>0?Math.max(0,Math.min(100,$(window).scrollTop()/range*100)):0;
    $('#scrollProgress').css('width',percent+'%').attr('aria-valuenow',Math.round(percent));
  }

  // Task 6: validate before disabling and showing the submit spinner.
  let submitting=false;
  $('#feedbackForm').on('submit',function(event){
    event.preventDefault();if(submitting)return;
    const name=$('#feedbackName').val().trim(),message=$('#feedbackMessage').val().trim();
    $('#feedbackName').attr('aria-invalid',String(!name));$('#feedbackMessage').attr('aria-invalid',String(!message));
    $('#feedbackStatus').text('');
    if(!name||!message){$('#feedbackError').text('Please enter your name and a note.');$(name?'#feedbackMessage':'#feedbackName').trigger('focus');return;}
    $('#feedbackError').text('');submitting=true;
    $('#feedbackSubmit').prop('disabled',true).attr('aria-busy','true');
    $('.submit-spinner').prop('hidden',false);$('.submit-label').text('Please wait…');
    setTimeout(function(){
      submitting=false;$('#feedbackSubmit').prop('disabled',false).attr('aria-busy','false');
      $('.submit-spinner').prop('hidden',true);$('.submit-label').text('Preview feedback');
      $('#feedbackStatus').text(`Thanks, ${name}. Your feedback preview is ready. No data was sent.`);
      notify('Your feedback preview is ready.');
    },1300);
  });

  // Task 7: one reusable notification; cancel old animation/timer queues.
  let toastTimer;
  function notify(message){
    clearTimeout(toastTimer);
    $('#qToast').stop(true,true).text(message).prop('hidden',false).hide().fadeIn(reducedMotion?0:180);
    toastTimer=setTimeout(function(){$('#qToast').fadeOut(reducedMotion?0:350,function(){$(this).prop('hidden',true);});},2200);
  }
  const favorites=new Set(Qala.favorites());
  function syncFavorites(){
    $('.save-favorite').each(function(){
      const saved=favorites.has($(this).data('name'));
      $(this).text(saved?'Remove favorite':'Save favorite').attr('aria-pressed',String(saved));
    });
  }
  syncFavorites();
  $('.save-favorite').on('click',function(){
    const name=$(this).data('name');
    const next=new Set(favorites);
    if(next.has(name))next.delete(name);else next.add(name);
    if(!Qala.write(Qala.favoriteKey(),[...next])){notify('Could not save favorites. Allow browser storage and retry.');return;}
    favorites.clear();next.forEach(item=>favorites.add(item));syncFavorites();
    notify(favorites.has(name)?name+' saved on this browser.':name+' removed from favorites.');
  });

  // Task 8: Clipboard API on HTTPS/localhost, copy-event fallback offline.
  let copyTimer;
  function fallbackCopy(text){
    const $temporary=$('<textarea>',{class:'clipboard-buffer',readonly:true}).val(text).appendTo('body');
    const previous=document.activeElement;
    $(document).one('copy.qala',function(event){
      const clipboard=event.originalEvent.clipboardData;
      if(clipboard){clipboard.setData('text/plain',text);event.preventDefault();}
    });
    $temporary[0].select();const copied=document.execCommand('copy');
    $(document).off('copy.qala');$temporary.remove();if(previous)previous.focus();
    if(!copied)throw new Error('Clipboard unavailable');
  }
  $('#copyCaption').on('click',async function(){
    const $button=$(this),text=$('#coffeeCaption').text();$button.prop('disabled',true);
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}else{fallbackCopy(text);}
      clearTimeout(copyTimer);$('.copy-icon').text('✓');$('.copy-label').text('Copied');
      $('#copyTooltip').prop('hidden',false);$('#copyStatus').text('Copied to clipboard!');notify('Coffee caption copied.');
      copyTimer=setTimeout(function(){$('.copy-icon').text('⧉');$('.copy-label').text('Copy caption');$('#copyTooltip').prop('hidden',true);},2200);
    }catch(error){$('#copyStatus').text('Copy was blocked. Select and copy the caption manually.');}
    finally{$button.prop('disabled',false);}
  });

  // Task 9: src is assigned only when the gallery image enters the viewport.
  function loadVisibleImages(){
    $('.jq-lazy[data-src]').each(function(){
      const $image=$(this),top=$image.offset().top,bottom=top+$image.outerHeight();
      const viewportTop=$(window).scrollTop(),viewportBottom=viewportTop+$(window).height();
      if(top>viewportBottom||bottom<viewportTop)return;
      $image.one('load',function(){
        $(this).addClass('image-loaded');
      }).one('error',function(){$('#lazyStatus').text('A gallery image could not load. Reload to try again.');});
      $image.attr('src',$image.attr('data-src')).removeAttr('data-src');
    });
  }
  function checkViewport(){loadVisibleImages();}
  let framePending=false;
  $(window).on('scroll resize',function(){
    if(framePending)return;framePending=true;
    requestAnimationFrame(function(){framePending=false;updateProgress();checkViewport();});
  });
  $search.val(typeof Qala.read('qalaSearch','')==='string'?Qala.read('qalaSearch',''):'');
  search(false);updateProgress();checkViewport();
});
