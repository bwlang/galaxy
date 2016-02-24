define(["utils/localization"],function(a){function b(b){return['<form action="">','<label for="copy-modal-title">',a("Enter a title for the copied history"),":","</label><br />",'<input id="copy-modal-title" class="form-control" style="width: 100%" value="',b.defaultCopyName,'" />',"<br />","<p>",a("You can make a copy of the history that includes all datasets in the original history"),a(" or just the active (not deleted) datasets."),"</p>",'<input name="copy-what" type="radio" id="copy-non-deleted" value="copy-non-deleted" checked />','<label for="copy-non-deleted">',a("Copy only active (not deleted) datasets"),"</label><br />",'<input name="copy-what" type="radio" id="copy-all" value="copy-all" />','<label for="copy-all">',a("Copy all datasets, including deleted ones"),"</label><br />","</form>"].join("")}function c(b){if(!b){if(!Galaxy.modal.$("#invalid-title").size()){var c=$("<p/>").attr("id","invalid-title").css({color:"red","margin-top":"8px"}).addClass("bg-danger").text(a("Please enter a valid history title"));Galaxy.modal.$(".modal-body").append(c)}return!1}return b}function d(){return $(["<p>",'<span class="fa fa-spinner fa-spin"></span> ',a("Copying history"),"...","</p>"].join("")).css({"margin-top":"8px"})}function e(e,f){function g(b){var c="copy-all"===Galaxy.modal.$('input[name="copy-what"]:checked').val(),f=d();Galaxy.modal.$(".modal-body").children().replaceWith(f),Galaxy.modal.$("button").prop("disabled",!0),e.copy(!0,b,c).fail(function(){alert(a("History could not be copied. Please contact a Galaxy administrator"))}).always(function(){Galaxy.modal.hide()})}function h(){var a=Galaxy.modal.$("#copy-modal-title").val();c(a)&&g(a)}if(f=f||{},!Galaxy||!Galaxy.modal)return e.copy();var i=_.escape(e.get("name")),j="Copy of '"+i+"'";Galaxy.modal.show(_.extend({title:a("Copying history")+' "'+i+'"',body:$(b({defaultCopyName:j})),buttons:{Cancel:function(){Galaxy.modal.hide()},Copy:h},closing_events:!0},f)),$("#copy-modal-title").focus().select(),$("#copy-modal-title").on("keydown",function(a){13===a.keyCode&&h()})}return e});
//# sourceMappingURL=../../../maps/mvc/history/copy-dialog.js.map