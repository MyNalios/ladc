odoo.define('aspl_gift_card_ee.giftCardExchangePopup', function(require) {
    'use strict';

    const { useState, useRef } = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');
    var core = require('web.core');
    var _t = core._t;

    class giftCardExchangePopup extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            this.state = useState({ NewCardNumber: ''});
            this.NewCardNumber = useRef('NewCardNumber');
        }
        onInputKeyDownNumberVlidation(e) {
            if(e.which != 190 && e.which != 110 && e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which < 96 || e.which > 105) && (e.which < 37 || e.which > 40)) {
                e.preventDefault();
            }
        }
        async confirm() {
             let flag = true;
             if(!this.state.NewCardNumber){
                this.env.pos.db.notification('danger', _t('Please Enter Card Number!'));
                flag = false;
                return;
             }
             if(this.state.NewCardNumber && this.state.NewCardNumber.toString().trim().length == 12){
                let cardExist = await this.isCardExist(this.state.NewCardNumber);
                if(cardExist !== undefined){
                    this.env.pos.db.notification('danger', _t('Card Number Already Exist!'));
                    flag = false;
                    return;
                }
            }
            if(this.state.NewCardNumber && this.state.NewCardNumber.toString().trim().length != 12){
                this.env.pos.db.notification('warning', _t('Card Number Should be 12 Digit!'));
                flag = false;
                return;
            }
            if(flag){
               this.props.resolve({ confirmed: true, payload: await this.getPayload()});
               this.trigger('close-popup');
            }
        }
        isCardExist(code){
            return this.rpc({
                model: 'aspl.gift.card',
                method: 'search_read',
                domain: [['card_no', '=', code]],
            }, {async: true}).then((result) => {
                if(result && result.length > 0){
                    return true;
                }else{
                    return;
                }
            })
        }
        getPayload() {
            return {NewCardNumber:Number(this.state.NewCardNumber)};
        }
    }
    giftCardExchangePopup.template = 'giftCardExchangePopup';
    giftCardExchangePopup.defaultProps = {
        confirmText: 'Replace',
        cancelText: 'Cancel',
        title: '',
        body: '',
    };

    Registries.Component.add(giftCardExchangePopup);

    return giftCardExchangePopup;
});
