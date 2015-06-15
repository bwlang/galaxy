define([],function(){return Backbone.View.extend({initialize:function(a,b){this.app=a,this.text_enable=a.options.text_enable||"Enable",this.text_disable=a.options.text_disable||"Disable",this.cls_enable=a.options.cls_enable||"fa fa-caret-square-o-down",this.cls_disable=a.options.cls_disable||"fa fa-caret-square-o-up",this.field=b.field,this.default_value=b.default_value,this.setElement(this._template(b)),this.$field=this.$el.find(".ui-table-form-field"),this.$optional=this.$el.find(".ui-table-form-optional"),this.$optional_icon=this.$el.find(".ui-table-form-optional").find(".icon"),this.$error_text=this.$el.find(".ui-table-form-error-text"),this.$error=this.$el.find(".ui-table-form-error"),this.$field.prepend(this.field.$el),this.field.collapsed=b.collapsible&&b.value&&JSON.stringify(b.value)==JSON.stringify(b.collapsible_value),this._refresh();var c=this;this.$optional.on("click",function(){c.field.collapsed=!c.field.collapsed,c._refresh(),c.app.trigger("change")})},error:function(a){this.$error_text.html(a),this.$error.show(),this.$el.addClass("ui-error")},reset:function(){this.$error.hide(),this.$el.removeClass("ui-error")},_refresh:function(){this.$optional_icon.removeClass().addClass("icon"),this.field.collapsed?(this.$field.hide(),this._tooltip(this.text_enable,this.cls_enable),this.field.value&&this.field.value(this.default_value)):(this.$field.fadeIn("fast"),this._tooltip(this.text_disable,this.cls_disable),this.app.trigger("change"))},_tooltip:function(a,b){this.$optional.length&&this.$optional_icon.addClass(b).tooltip({placement:"bottom"}).attr("data-original-title",a).tooltip("fixTitle").tooltip("hide")},_template:function(a){var b='<div class="ui-table-form-element"><div class="ui-table-form-error ui-error"><span class="fa fa-arrow-down"/><span class="ui-table-form-error-text"/></div><div class="ui-table-form-title">';return b+=a.collapsible?'<div class="ui-table-form-optional"><i class="icon"/>'+a.label+"</div>":a.label,b+='</div><div class="ui-table-form-field">',b+='<div class="ui-table-form-info">',a.help&&(b+=a.help),b+="</div>",b+="</div></div>"}})});
//# sourceMappingURL=../../../maps/mvc/form/form-input.js.map