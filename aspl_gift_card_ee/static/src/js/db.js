odoo.define('aspl_gift_card_ee.db', function (require) {
    "use strict";

    var DB = require('point_of_sale.DB');
    var core = require('web.core');
    var _t = core._t;

    DB.include({
        init: function(options){
            this.partner_list = [];
            this._super(options);
        },
        add_partners: function(partners){
            for(const partner of partners){
                this.partner_list.push({'id': partner.id, 'value': partner.name, 'label': partner.name})
            }
            this._super(partners);
        },

        notification: function(type, message){
            var types = ['success','warning','info', 'danger'];
            if($.inArray(type.toLowerCase(),types) != -1){
                $('div.span4').remove();
                var newMessage = '';
                message = _t(message);
                switch(type){
                case 'success' :
                    newMessage = '<i class="fa fa-check" aria-hidden="true"></i> '+message;
                    break;
                case 'warning' :
                    newMessage = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> '+message;
                    break;
                case 'info' :
                    newMessage = '<i class="fa fa-info" aria-hidden="true"></i> '+message;
                    break;
                case 'danger' :
                    newMessage = '<i class="fa fa-ban" aria-hidden="true"></i> '+message;
                    break;
                }
                $('body').append('<div class="span4 pull-right">' +
                        '<div class="alert alert-'+type+' fade">' +
                        newMessage+
                       '</div>'+
                     '</div>');
                $(".alert").removeClass("in").show();
                $(".alert").delay(200).addClass("in").fadeOut(5000);
            }
        },
    });
});