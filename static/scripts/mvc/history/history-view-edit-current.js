define(["mvc/history/history-model","mvc/history/history-view-edit","mvc/base-mvc","utils/localization"],function(a,b,c,d){var e=c.SessionStorageModel.extend({defaults:{tagsEditorShown:!1,annotationEditorShown:!1,scrollPosition:0},toString:function(){return"HistoryViewPrefs("+JSON.stringify(this.toJSON())+")"}});e.storageKey=function(){return"history-panel"};var f=b.HistoryViewEdit,g=f.extend({className:f.prototype.className+" current-history-panel",emptyMsg:d("This history is empty. Click 'Get Data' on the left tool menu to start"),noneFoundMsg:d("No matching datasets found"),HDCAViewClass:f.prototype.HDCAViewClass.extend({foldoutStyle:"drilldown"}),initialize:function(a){a=a||{},this.preferences=new e(_.extend({id:e.storageKey()},_.pick(a,_.keys(e.prototype.defaults)))),f.prototype.initialize.call(this,a),this.panelStack=[],this.currentContentId=a.currentContentId||null},_setUpListeners:function(){f.prototype._setUpListeners.call(this);var a=this;this.on("new-model",function(){a.preferences.set("scrollPosition",0)})},loadCurrentHistory:function(a){this.debug(this+".loadCurrentHistory");var b=this;return this.loadHistoryWithDetails("current",a).then(function(){b.trigger("current-history",b)})},switchToHistory:function(a,b){var c=this,d=function(){return jQuery.getJSON(Galaxy.root+"history/set_as_current?id="+a)};return this.loadHistoryWithDetails(a,b,d).then(function(){c.trigger("switched-history",c)})},createNewHistory:function(a){if(!Galaxy||!Galaxy.user||Galaxy.user.isAnonymous())return this.displayMessage("error",d("You must be logged in to create histories")),$.when();var b=this,c=function(){return jQuery.getJSON(Galaxy.root+"history/create_new_current")};return this.loadHistory(void 0,a,c).then(function(){b.trigger("new-history",b)})},setModel:function(a,b,c){return f.prototype.setModel.call(this,a,b,c),this.model&&(this.log("checking for updates"),this.model.checkForUpdates()),this},_setUpCollectionListeners:function(){f.prototype._setUpCollectionListeners.call(this),this.collection.on("state:ready",function(a){a.get("visible")||this.storage.get("show_hidden")||this.removeItemView(a)},this)},_setUpModelListeners:function(){f.prototype._setUpModelListeners.call(this),this.listenTo(this.model,"change:nice_size change:size",function(){this.trigger("history-size-change",this,this.model,arguments)},this)},_setUpBehaviors:function(a){a=a||this.$el;var b=this;return f.prototype._setUpBehaviors.call(b,a),this._debouncedScrollCaptureHandler||(this._debouncedScrollCaptureHandler=_.debounce(function(){b.$el.is(":visible")&&b.preferences.set("scrollPosition",$(this).scrollTop())},40)),b.$scrollContainer().off("scroll",this._debouncedScrollCaptureHandler).on("scroll",this._debouncedScrollCaptureHandler),b},_buildNewRender:function(){if(!this.model)return $();var a=f.prototype._buildNewRender.call(this);return a.find(".search").prependTo(a.find(".controls")),this._renderQuotaMessage(a),a},_renderQuotaMessage:function(a){return a=a||this.$el,$(this.templates.quotaMsg({},this)).prependTo(a.find(".messages"))},_renderEmptyMessage:function(a){var b=this,c=b.$emptyMessage(a),e=$(".toolMenuContainer");return _.isEmpty(b.views)&&!b.searchFor&&Galaxy&&Galaxy.upload&&e.size()?(c.empty(),c.html([d("This history is empty"),". ",d("You can "),'<a class="uploader-link" href="javascript:void(0)">',d("load your own data"),"</a>",d(" or "),'<a class="get-data-link" href="javascript:void(0)">',d("get data from an external source"),"</a>"].join("")),c.find(".uploader-link").click(function(a){Galaxy.upload.show(a)}),c.find(".get-data-link").click(function(){e.parent().scrollTop(0),e.find('span:contains("Get Data")').click()}),c.show()):f.prototype._renderEmptyMessage.call(this,a)},_renderTags:function(a){var b=this;f.prototype._renderTags.call(this,a),this.preferences.get("tagsEditorShown")&&this.tagsEditor.toggle(!0),this.tagsEditor.on("hiddenUntilActivated:shown hiddenUntilActivated:hidden",function(a){b.preferences.set("tagsEditorShown",a.hidden)})},_renderAnnotation:function(a){var b=this;f.prototype._renderAnnotation.call(this,a),this.preferences.get("annotationEditorShown")&&this.annotationEditor.toggle(!0),this.annotationEditor.on("hiddenUntilActivated:shown hiddenUntilActivated:hidden",function(a){b.preferences.set("annotationEditorShown",a.hidden)})},_swapNewRender:function(a){f.prototype._swapNewRender.call(this,a);var b=this;return _.delay(function(){var a=b.preferences.get("scrollPosition");a&&b.scrollTo(a,0)},10),this},_attachItems:function(a){f.prototype._attachItems.call(this,a);var b=this;return b.currentContentId&&b._setCurrentContentById(b.currentContentId),this},addItemView:function(a,b,c){var d=f.prototype.addItemView.call(this,a,b,c);return d&&this.panelStack.length?this._collapseDrilldownPanel():d},_setUpItemViewListeners:function(a){var b=this;return f.prototype._setUpItemViewListeners.call(b,a),a.on("expanded:drilldown",function(a,b){this._expandDrilldownPanel(b)},this),a.on("collapsed:drilldown",function(a,b){this._collapseDrilldownPanel(b)},this),this},setCurrentContent:function(a){this.$(".history-content.current-content").removeClass("current-content"),a?(a.$el.addClass("current-content"),this.currentContentId=a.model.id):this.currentContentId=null},_setCurrentContentById:function(a){var b=this.viewFromModelId(a)||null;this.setCurrentContent(b)},_expandDrilldownPanel:function(a){this.panelStack.push(a),this.$("> .controls").add(this.$list()).hide(),a.parentName=this.model.get("name"),this.$el.append(a.render().$el)},_collapseDrilldownPanel:function(){this.panelStack.pop(),this.render()},listenToGalaxy:function(a){a.on("galaxy_main:load",function(a){var b=a.fullpath,c={display:/datasets\/([a-f0-9]+)\/display/,edit:/datasets\/([a-f0-9]+)\/edit/,report_error:/dataset\/errors\?id=([a-f0-9]+)/,rerun:/tool_runner\/rerun\?id=([a-f0-9]+)/,show_params:/datasets\/([a-f0-9]+)\/show_params/},d=null,e=null;_.find(c,function(a,c){var f=b.match(a);return f&&2==f.length?(d=f[1],e=c,!0):!1}),d="dataset-"+d,this._setCurrentContentById(d)},this)},connectToQuotaMeter:function(a){return a?(this.listenTo(a,"quota:over",this.showQuotaMessage),this.listenTo(a,"quota:under",this.hideQuotaMessage),this.on("rendered rendered:initial",function(){a&&a.isOverQuota()&&this.showQuotaMessage()}),this):this},clearMessages:function(a){var b=_.isUndefined(a)?this.$messages().children('[class$="message"]'):$(a.currentTarget);return b=b.not(".quota-message"),b.fadeOut(this.fxSpeed,function(){$(this).remove()}),this},showQuotaMessage:function(){var a=this.$(".quota-message");a.is(":hidden")&&a.slideDown(this.fxSpeed)},hideQuotaMessage:function(){var a=this.$(".quota-message");a.is(":hidden")||a.slideUp(this.fxSpeed)},toString:function(){return"CurrentHistoryView("+(this.model?this.model.get("name"):"")+")"}});return g.prototype.templates=function(){var a=c.wrapTemplate(['<div class="quota-message errormessage">',d("You are over your disk quota"),". ",d("Tool execution is on hold until your disk usage drops below your allocated quota"),".","</div>"],"history");return _.extend(_.clone(f.prototype.templates),{quotaMsg:a})}(),{CurrentHistoryView:g}});
//# sourceMappingURL=../../../maps/mvc/history/history-view-edit-current.js.map