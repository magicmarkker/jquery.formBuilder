(function ($) {
  var defaults = {
    save_url              : false,
    update_url            : false,
    load_url              : false,
    control_box_target    : false,
    serialize_prefix      : 'survey',
    frmb_id               : 'question-' + $('ul[id^=survey-]').length++,
    last_id               : 1,
    div_id                : '#formBuilder',
    messages: {
      save                : "Preview Survey",
      add_new_field       : "Select an option",
      add_new_heading     : "Heading",
      text                : "Text Field",
      title               : "Question",
      title_heading       : "Title",
      heading             : "Heading",
      paragraph           : "Paragraph",
      checkboxes          : "Multiple Choice (more than one answer)",
      radio               : "Multiple Choice (one answer)",
      select              : "Dropdown List",
      text_field          : "Text Field",
      label               : "Label",
      paragraph_field     : "Paragraph Field",
      select_options      : "Responses",
      add                 : "add+",
      checkbox_group      : "Multiple Choice Group",
      remove_message      : "Are you sure you want to remove this element?",
      remove              : "delete",
      clone               : "copy",
      radio_group         : "Multiple Choice Group (one answer)",
      selections_message  : "Allow Multiple Selections",
      hide                : "hide",
      required            : "Required",
      show                : "show",
      description         : "Description",
      cancel              : "Cancel"
    }
  };
  var methods = {
    init : function( options ) {
      // Extend the configuration options with user-provided
      var opts = $.extend(defaults, options);
      return this.each(function(){
        var ul_obj     = $(this).append('<ul id="' + opts.frmb_id + '" class="frmb"></ul>').find('ul'),
            field      = '',
            field_type = '',
            help       = '',
            form_db_id = '';
        // Add a unique class to the current element
        $(ul_obj).addClass(opts.frmb_id);
        // load existing form data
        if (opts.load_url) {
          $.getJSON(opts.load_url, function(json) {
            form_db_id = json.form_id;
            methods.fromJson(json.form_structure);
          });
        }

        methods.controlBox();
        methods.fieldControls();
      });
    },
    fromJson : function ( json ) {
      var values  = '',
          options = false,
          box_id  = defaults.frmb_id + '-control-box';
      $.each(json, function(index, i) {
        // checkbox type
        if (this.cssClass === 'checkbox') {
          options = [this.title];
          values = [];
          $.each(this.values, function (index, i) {
            values.push([this.value, this.default_option, index]);
          });
        }
        // radio type
        else if (this.cssClass === 'radio') {
          options = [this.title];
          values = [];
          $.each(this.values, function (index, i) {
            values.push([this.value, this.default_option, index]);
          });
        }
        // select type
        else if (this.cssClass === 'select') {
          options = [this.title, this.multiple];
          values = [];
          $.each(this.values, function (index, i) {
            values.push([this.value, this.default_option, index]);
          });
        } 
        else if (this.cssClass === "text") {
          values = [this.title];
        }
        else if (this.cssClass === "textarea") {
          values = [this.title];
        }
        else if (this.cssClass === "heading") {
          values = [this.title, this.subtext];
        }
        else {
          values = [this.values];
        }
        methods.appendNewField(this.cssClass, values, options, this.answer_required, i['id']);
      });
    },
    appendNewField : function (type, values, options, required, question_id) {
      var field      = '',
          field_type = type;
      if (typeof (values) === 'undefined') {
        values = '';
      }
      switch (type) {
        case 'text':
          methods.appendTextInput( values, options, required, question_id, field_type );
          break;
        case 'textarea':
          methods.appendTextarea( values, options, required, question_id, field_type );
          break;
        case 'checkbox':
          methods.appendCheckboxGroup( values, options, required, question_id, field_type );
          break;
        case 'radio':
          methods.appendRadioGroup( values, options, required, question_id, field_type );
          break;
        case 'select':
          methods.appendSelectList( values, options, required, question_id, field_type );
          break;
        case 'heading':
          methods.appendHeading( values, options, 0, question_id, field_type );
          break;
      }
    },
    //Sing line input type="text"
    appendTextInput : function ( values, options, required, question_id, field_type ) {
      var field = '';
      field += '<label>' + defaults.messages.label + '</label>';
      field += '<textarea name="title" class="fld-title" id="question_' + question_id + '" type="text">' + values + '</textarea>';
      methods.appendFieldLi(defaults.messages.text, field, required, field_type);
    },
    // multi-line textarea
    appendTextarea : function ( values, options, required, question_id, field_type ) {
      var field = '';
      field += '<label>' + defaults.messages.label + '</label>';
      field += '<textarea name="title" class="fld-title" id="question_'+question_id+'" type="text">' + values + '</textarea>';
      methods.appendFieldLi(defaults.messages.paragraph_field, field, required, field_type);
    },
    // check box element
    appendCheckboxGroup : function ( values, options, required, question_id, field_type ) {
      var title = '',
          field = '';
      if (typeof (options) === 'object') {
        title = options[0];
      }
      field += '<div class="chk_group">';
      field += '<div class="frm-fld"><label>' + defaults.messages.title + '</label>';
      field += '<textarea class="fld-title" id="question_'+question_id+'" type="text" name="title">' + title + '</textarea></div>';
      field += '<div class="false-label">' + defaults.messages.select_options + '</div>';
      field += '<div class="fields">';
      if (typeof (values) === 'object') {
        for (i = 0; i < values.length; i++) {
          field += methods.checkboxFieldHtml(values[i]);
        }
      }
      else {
        field += methods.checkboxFieldHtml('');
      }
      field += '<div class="add-area"><a href="#" class="add add_ck"><strong>[ ' + defaults.messages.add + ' ]</strong></a></div>';
      field += '</div>';
      field += '</div>';
      methods.appendFieldLi(defaults.messages.checkbox_group, field, required, field_type);
    },
    // checkbox field html, since there may be multiple
    checkboxFieldHtml : function ( values ) {
      var checked = false,
          field   = '',
          value   = '';
      if (typeof (values) === 'object') {
        value = values[0];
        checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
      }
      if (values.length < 3) {
        values[2] = 'undefined';
      }
      field = '';
      field += '<div>';
      field += '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + ' class="checkbox" />';
      field += '<input class="choice" id="choice_'+values[2]+'" type="text" value="' + value + '" />';
      field += '<a href="#" class="remove" title="' + defaults.messages.remove_message + '">' + defaults.messages.remove + '</a>';
      field += '</div>';
      return field;
    },
    // adds a radio element
    appendRadioGroup : function ( values, options, required, question_id, field_type ){
      var title = '',
          field = '';

      if (typeof (options) === 'object') {
        title = options[0];
      }
      field += '<div class="rd_group">';
      field += '<div class="frm-fld"><label>' + defaults.messages.title + '</label>';
      field += '<textarea class="fld-title" id="question_'+question_id+'" type="text" name="title">' + title + '</textarea></div>';
      field += '<div class="false-label">' + defaults.messages.select_options + '</div>';
      field += '<div class="fields">';
      if (typeof (values) === 'object') {
        for (i = 0; i < values.length; i++) {
          field += methods.radioFieldHtml(values[i], 'frm-' + defaults.last_id + '-fld');
        }
      }
      else {
        field += methods.radioFieldHtml('', 'frm-' + defaults.last_id + '-fld');
      }
      field += '<div class="add-area"><a href="#" class="add add_rd"><strong>[ ' + defaults.messages.add + ' ]</strong></a></div>';
      field += '</div>';
      field += '</div>';
      methods.appendFieldLi(defaults.messages.radio_group, field, required, field_type);
    },
    // radio field html, since there may be multiple
    radioFieldHtml : function ( values, name ) {
      var checked = false,
          field   = '',
          value   = '';
      if (typeof (values) === 'object') {
        value = values[0];
        checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
      }
      field = '';
      field += '<div>';
      field += '<input type="radio"' + (checked ? ' checked="checked"' : '') + ' name="radio_' + name + '" class="radio" />';
      field += '<input class="choice" id="choice_'+values[2]+'" type="text" value="' + value + '" />';
      field += '<a href="#" class="remove" title="' + defaults.messages.remove_message + '">' + defaults.messages.remove + '</a>';
      field += '</div>';
      return field;
    },
    // adds a select/option element
    appendSelectList : function ( values, options, required, question_id, field_type ) {
      var multiple = false,
          field    = '',
          title    = '';
      if (typeof (options) === 'object') {
        title = options[0];
        multiple = options[1] === 'true' ? true : false;
      }
      field += '<div class="opt_group">';
      field += '<div class="frm-fld"><label>' + defaults.messages.title + '</label>';
      field += '<textarea class="fld-title" id="question_'+question_id+'" type="text" name="title">' + title + '</textarea></div>';
      field += '';
      field += '<div class="false-label">' + defaults.messages.select_options + '</div>';
      field += '<div class="fields">';
      if (typeof (values) === 'object') {
        for (i = 0; i < values.length; i++) {
          field += methods.selectFieldHtml(values[i], multiple);
        }
      }
      else {
        field += methods.selectFieldHtml('', multiple);
      }
      field += '<div class="add-area"><a href="#" class="add add_opt"><strong>[ ' + defaults.messages.add + ' ]</strong></a></div>';
      field += '</div>';
      field += '</div>';
      methods.appendFieldLi(defaults.messages.select, field, required, field_type);
    },
    // Select field html, since there may be multiple
    selectFieldHtml : function ( values, multiple ) {
      if (multiple) {
        return methods.checkboxFieldHtml(values);
      } else {
        return methods.radioFieldHtml(values);
      }
    },
    // add a heading
    appendHeading : function ( values, options, required, question_id, field_type ) {
      var title       = '',
          field       = '',
          description = '';
      if (typeof (values) === 'object') {
        title = values[0];
        if (values.length > 1) {
          description = values[1];
        }
      }
      field += '<div class="opt_group">';
      field += '<div class="frm-fld"><label>' + defaults.messages.title_heading + '</label>';
      field += '<input class="fld-title" id="question_'+question_id+'" type="text" name="title" value="' + title + '" /></div>';
      field += '<div class="frm-fld"><label>' + defaults.messages.description + '</label>';
      field += '<textarea class="fld-desc" id="question_'+question_id+'" name="subtext">' + description + '</textarea></div>';
      field += '</div>';
      methods.appendFieldLi(defaults.messages.heading, field, required, field_type);
    },
    // appends the new field markup to the editor
    appendFieldLi : function ( title, field_html, required, field_type ) {
      var li = '';
      if (required) {
        required = required === 1 ? true : false;
      }
      li += '<li id="frm-' + defaults.last_id + '-item" class="' + field_type + '">';
      li += '<div class="legend">';
      li += '<a id="frm-' + defaults.last_id + '" class="toggle-form" href="#">' + defaults.messages.hide + '</a>';
      li += '<span> | </span>'
      li += '<a id="clone-' + defaults.last_id + '" class="clone" href="#">' + defaults.messages.clone + '</a>';
      li += '<span> | </span>'
      li += '<a id="del_' + defaults.last_id + '" class="del-button delete-confirm" href="#" title="' + defaults.messages.remove_message + '">' + defaults.messages.remove + '</a>';
      li += '</div><strong id="txt-title-' + defaults.last_id + '">' + title + '</strong>';
      li += '<div id="frm-' + defaults.last_id + '-fld" class="frm-holder">';
      li += '<div class="frm-elements">';
      if (title !== "Heading") {
        li += '<div class="frm-fld"><label for="required-' + defaults.last_id + '">' + defaults.messages.required + '</label>';
        li += '<input class="required" type="checkbox" value="1" name="required-' + defaults.last_id + '" id="required-' + defaults.last_id + '"' + (required ? ' checked="checked"' : '') + ' /></div>';
      }
      li += field_html;
      li += '</div>';
      li += '</div>';
      li += '</li>';
      $('ul#'+defaults.frmb_id).append(li);
      $('#frm-' + defaults.last_id + '-item').hide();
      $('#frm-' + defaults.last_id + '-item').animate({
        opacity: 'show',
        height: 'show'
      }, 'slow');
      defaults.last_id++;

      // check if toggle-all should be shown
      if ($('ul#'+defaults.frmb_id).children().length > 0) {
        $('.toggle-all').css('display', 'block');
      }
    },
    // add control select element for fields
    controlBox : function () {
      var select      = '',
          box_content = '',
          save_button = '',
          hide_submit = '',
          box_id      = defaults.frmb_id + '-control-box',
          save_id     = defaults.frmb_id + '-save-button';

      // add the available options
      select += '<option value="0">' + defaults.messages.add_new_field + '</option>';
      select += '<option value="heading">' + defaults.messages.add_new_heading + '</option>';
      select += '<option value="text">' + defaults.messages.text + '</option>';
      select += '<option value="textarea">' + defaults.messages.paragraph + '</option>';
      select += '<option value="checkbox">' + defaults.messages.checkboxes + '</option>';
      select += '<option value="radio">' + defaults.messages.radio + '</option>';
      select += '<option value="select">' + defaults.messages.select + '</option>';

      // build the control box and search button content
      box_content = '<select id="' + box_id + '" class="frmb-control original">' + select + '</select>';
      collapse_content = '<a href="#" class="toggle-all" style="display: none; float: right;">Hide Questions</a>';

      // build save button
      save_button = '<div style="'+hide_submit+'" class="hide_submit"><div class="divider" style="margin-top: 20px;"><img alt="Blank" src="/images/blank.gif?1351094302"></div><button type="submit" id="' + save_id + '" class="frmb-submit btn btn-primary">'+ defaults.messages.save +'</button> <a href="/survey/'+$('#survey_id').val()+'" class="frmb-cancel btn">'+ defaults.messages.cancel +'</a></div>';

      // insert the control box into page
      $(defaults.div_id).append(box_content);
      $('ul#'+defaults.frmb_id).before(collapse_content);

      // insert the save button
      $(defaults.div_id).append(save_button);

      // set the form save action
      $(defaults.div_id).on('click', '#' + save_id, function (event) {
        event.preventDefault();
        methods.save();
      });

      // add a callback to the select element
      $(defaults.div_id).on('change', 'select.frmb-control', function(e) {
        methods.appendNewField($(this).val(), [''], [''], 1);
        $(this).val(0).blur();
        // This solves the scrollTo dependency
        $('html, body').animate({
          scrollTop: $('#frm-' + (defaults.last_id - 1) + '-item').offset().top
        }, 500);
        $('.toggle-all').css('display', 'block');
        $('.hide_submit').show();
        e.preventDefault();
      });
    },
    // add field controls for add/delete/copy/hide/show etc...
    fieldControls : function () {
      // handle clone links
      $(defaults.div_id).on('click', '.clone', function() {
        parent_li = $(this).parents('li');
        textarea_val = parent_li.find('textarea').val();
        new_li = parent_li.clone(true).appendTo('ul#'+defaults.frmb_id);
        new_li.find('textarea').val(textarea_val);
        size = $('ul#'+defaults.frmb_id).children().length;
        $(new_li).attr('id', 'frm-'+size+'-item');
        $('.legend .toggle-form', new_li).attr('id', 'frm-'+size);
        $('.legend .del-button', new_li).attr('id', 'del_'+size);
        $('.legend .clone', new_li).attr('id', 'clone-'+size);
        $('.frm-holder', new_li).attr('id', 'frm-'+size+'-fld');
        $('.fld-title', new_li).attr('id', 'question_undefined');
        $('.fields div', new_li).each(function() {
          $('.choice', $(this)).attr('id', 'choice_undefined');
          $('.radio', $(this)).attr('name', 'radio_frm-'+size+'-fld');
        });
        var old_radio = parent_li.find('input[checked="checked"]');
        $.each(old_radio, function() {
          if ($(this)[0].className == "radio") {
            $(this).attr('checked', 'checked');
          }
        });
        return false;
      });

      // handle field delete links
      $(defaults.div_id).on('click', '.remove', function () {
        $(this).parent('div').animate({
          opacity: 'hide',
          height: 'hide',
          marginBottom: '0px'
        }, 'fast', function () {
          $(this).remove();
        });
        return false;
      });

      // handle field display/hide
      $(defaults.div_id).on('click', '.toggle-form', function () {
        var target = $(this).attr("id");
        if ($(this).html() === defaults.messages.hide) {
          $(this).removeClass('open').addClass('closed').html(defaults.messages.show);
          $('#' + target + '-fld').animate({
            opacity: 'hide',
            height: 'hide'
          }, 'slow');
          return false;
        }
        if ($(this).html() === defaults.messages.show) {
          $(this).removeClass('closed').addClass('open').html(defaults.messages.hide);
          $('#' + target + '-fld').animate({
            opacity: 'show',
            height: 'show'
          }, 'slow');
          return false;
        }
        return false;
      });

      // handle field display/hide
      $(defaults.div_id).on('click', '.toggle-all',function () {
        if ($(this).html() === 'Hide Questions') {
          $('.toggle-form').each(function() {
            $(this).text('show');
            $('.frm-holder').animate({
              opacity: 'hide',
              height: 'hide'
            }, 'slow');
          });
          $(this).html('Show Questions');
        } else {
          $('.toggle-form').each(function() {
            $(this).text('hide');
            $('.frm-holder').animate({
              opacity: 'show',
              height: 'show'
            }, 'slow');
          });
          $(this).html('Hide Questions');
        }
        return false;
      });

      // handle delete confirmation
      $(defaults.div_id).on('click', '.delete-confirm', function () {
        var delete_id = $(this).attr("id").replace(/del_/, '');
        if (confirm($(this).attr('title'))) {
          $('#frm-' + delete_id + '-item').animate({
            opacity: 'hide',
            height: 'hide',
            marginBottom: '0px'
          }, 'slow', function () {
            $(this).remove();
          });
        }
        return false;
      });

      // attach a callback to add new checkboxes
      $(defaults.div_id).on('click', '.add_ck', function () {
        values = ['', 'undefined', 'undefined'];
        $(this).parent().before(methods.checkboxFieldHtml(values));
        return false;
      });

      // attach a callback to add new options
      $(defaults.div_id).on('click', '.add_opt', function () {
        $(this).parent().before(methods.selectFieldHtml('', false));
        return false;
      });

      // attach a callback to add new radio fields
      $(defaults.div_id).on('click', '.add_rd', function () {
        $(this).parent().before(methods.radioFieldHtml(false, $(this).parents('.frm-holder').attr('id')));
        return false;
      });

      // handle cancel button
      $(defaults.div_id).on('click', '.frmb-cancel', function () {
        window.history.back();
      });
    },
    // save form
    save : function () {
      if (defaults.save_url || defaults.update_url) {
        var id    = $("#survey_id").val(),
            has_q = $("#survey_has_questions").val();
        $.ajax({
          type: "POST",
          url: (has_q == "true") ? defaults.update_url : defaults.save_url,
          data: $('ul#'+defaults.frmb_id).serializeFormList() + "&form_id=" + id + "&survey_id=" +id +"&survey_has_questions="+has_q,
          success: function () {}
        });
      }
    }
  };
  $.fn.formbuilder = function (method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.formBuilder' );
    } 
  };
})(jQuery);