/**
 * jQuery Form Builder List Serialization Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Modified from the serialize list plugin
 * http://www.botsko.net/blog/2009/01/jquery_serialize_list_plugin/
 */
(function ($) {
  $.fn.serializeFormList = function (options) {
    // Extend the configuration options with user-provided
    var defaults = {
      prepend: 'ul',
      is_child: false,
      attributes: ['class']
    };
    var opts = $.extend(defaults, options);
    if (!opts.is_child) {
      opts.prepend = '&' + opts.prepend;
    }
    var serialStr = '';
    // Begin the core plugin
    this.each(function () {
      var ul_obj = this;
      var li_count = 0;
      var c = 1;
      $(this).children().each(function () {
        for (att = 0; att < opts.attributes.length; att++) {
          var key = (opts.attributes[att] === 'class' ? 'cssClass' : opts.attributes[att]);
          serialStr += opts.prepend + '[' + li_count + '][' + key + ']=' + encodeURIComponent($(this).attr(opts.attributes[att]));
          // append the form field values
          if (opts.attributes[att] === 'class') {
            serialStr += opts.prepend + '[' + li_count + '][required]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input.required').attr('checked'));
            switch ($(this).attr(opts.attributes[att])) {
            case 'text':
              serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($('#' + $(this).attr('id') + ' textarea').val());
              $('#' + $(this).attr('id') + ' textarea').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                  if ( $(this).attr('id').indexOf('question_') != -1 ) {
                    qid = $(this).attr('id').replace("question_", "");
                    serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                  }
                }
              });
              break;
            case 'textarea':
              serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($('#' + $(this).attr('id') + ' textarea').val());
              $('#' + $(this).attr('id') + ' textarea').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                  if ( $(this).attr('id').indexOf('question_') != -1 ) {
                    qid = $(this).attr('id').replace("question_", "");
                    serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                  }
                }
              });
              break;
            case 'checkbox':
              c = 1;
              $('#' + $(this).attr('id') + ' textarea').each(function () {
                if ($(this).attr('name') === 'title') {
                  serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                }
                if ( $(this).attr('id').indexOf('question_') != -1 ) {
                  qid = $(this).attr('id').replace("question_", "");
                  serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                }
              }); 
              $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                 if($(this).attr('id').indexOf("choice_") != -1) {
                    aid = $(this).attr('id').replace("choice_", "");
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][choice_id]=' + aid;
                  }
                }
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][default_option]=' + $(this).prev().attr('checked'); 
                c++;
              });
              break;
            case 'radio':
              c = 1;
              $('#' + $(this).attr('id') + ' textarea').each(function () {
                if ($(this).attr('name') === 'title') {
                  serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                }
                if ( $(this).attr('id').indexOf('question_') != -1 ) {
                  qid = $(this).attr('id').replace("question_", "");
                  serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                }
              });
              $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                  if($(this).attr('id').indexOf("choice_") != -1) {
                    aid = $(this).attr('id').replace("choice_", "");
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][choice_id]=' + aid;
                  }
                }
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][default_option]=' + $(this).prev().attr('checked');            
                c++;
              });
              break;
            case 'select':
              c = 1;
              $('#' + $(this).attr('id') + ' textarea').each(function () {
                if ($(this).attr('name') === 'title') {
                  serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                }
                if ( $(this).attr('id').indexOf('question_') != -1 ) {
                  qid = $(this).attr('id').replace("question_", "");
                  serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                }
              });
              $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                  if($(this).attr('id').indexOf("choice_") != -1) {
                    aid = $(this).attr('id').replace("choice_", "");
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][choice_id]=' + aid;
                  }
                }
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
                serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][default_option]=' + $(this).prev().attr('checked');            
                
                c++;
              });
              break;
            case 'heading':
              serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
              serialStr += opts.prepend + '[' + li_count + '][subtext]=' + encodeURIComponent($('#' + $(this).attr('id') + ' textarea').val());
              $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                if(typeof($(this).attr('id')) === 'string' ) {
                  if ( $(this).attr('id').indexOf('question_') != -1 ) {
                    qid = $(this).attr('id').replace("question_", "");
                    serialStr += opts.prepend + '[' + li_count + '][question_id]=' +qid;
                  }
                }
              });
              break;
            }
          }
        }
        li_count++;
      });
    });
    return (serialStr);
  };
})(jQuery);