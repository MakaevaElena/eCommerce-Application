import { ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './cart-view.module.scss';
import ClientApi from '../../../../api/client-api';
import { PagePath } from '../../../router/pages';
import ErrorMessage from '../../../message/error-message';
import InfoMessage from '../../../message/info-message';

export default class CartItem extends DefaultView {
  private router: Router;

  private anonimApi: ClientApi;

  private cartSection: ElementCreator;

  // private cartSection = new ElementCreator({
  //   tag: TagName.SECTION,
  //   classNames: [styleCss['cart-section']],
  //   textContent: '',
  // });

  constructor(router: Router, cartSection: ElementCreator) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.cartSection = cartSection;

    this.router = router;

    this.anonimApi = new ClientApi();
  }

  public createCartItem(itemKey: string) {
    this.anonimApi.productProjectionResponseKEY(itemKey).then((response: ClientResponse<ProductProjection>) => {
      const item = response.body.masterVariant;

      const itemBlock = new ElementCreator({
        tag: TagName.SECTION,
        classNames: [styleCss['item-block']],
        textContent: '',
      });

      const itemImage = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__image'], styleCss['cart-cell']],
        textContent: '',
      });

      if (item.images) itemImage.getElement().style.backgroundImage = `url(${item.images?.[0].url})`;

      const itemInfoBlock = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__info-block'], styleCss['cart-cell']],
        textContent: '',
      });

      const itemName = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__name']],
        textContent: `${response.body.name.en}`,
      });

      const itemMoreDetails = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['item-block__details']],
        textContent: `More details`,
      });

      itemMoreDetails.getElement().addEventListener('click', () => {
        const routePath = `${PagePath.CATALOG}/${itemKey}`;
        this.router.setHref(routePath);
      });

      const itemOrderSumm = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__order-summ']],
        textContent: ``,
      });

      const itemQuantity = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__quantity'], styleCss['cart-cell']],
        textContent: '',
      });

      const itemQuantityInput = new TagElement().createTagElement('input', [
        styleCss['item-block__quantity-input'],
        styleCss['cart-cell'],
      ]);

      itemQuantityInput.setAttribute('type', 'number');
      itemQuantityInput.setAttribute('min', '1');
      itemQuantityInput.setAttribute('value', '1');
      itemQuantityInput.addEventListener('change', () => {
        const getSum = () => {
          if (response.body.masterVariant.prices?.[1].value) {
            return `PRICE: ${(
              (Number(response.body.masterVariant.prices?.[1].value?.centAmount) / 100) *
              Number(itemQuantityInput.value)
            ).toFixed(2)} ${response.body.masterVariant.prices?.[1].value?.currencyCode}`;
          }
          return '';
        };
        itemOrderSumm.getElement().textContent = `${getSum()}`;
      });

      const getPrice = () => {
        if (response.body.masterVariant.prices?.[1].value) {
          return `PRICE: ${(Number(response.body.masterVariant.prices?.[1].value?.centAmount) / 100).toFixed(
            2
          )} ${response.body.masterVariant.prices?.[1].value?.currencyCode}`;
        }
        return '';
      };

      const itemOrderValue = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__order-value'], styleCss['cart-cell']],
        textContent: ``,
      });

      itemOrderSumm.getElement().textContent = `${getPrice()}`;

      const itemRemoveButton = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['item-block__remove-button']],
        textContent: `Remove Item`,
      });

      itemRemoveButton.getElement().addEventListener('click', () => {
        this.removeItemFromCart(response);
        this.cartSection.getElement().removeChild(itemBlock.getElement());
      });

      itemBlock.addInnerElement(itemImage);
      itemInfoBlock.addInnerElement(itemName);
      itemInfoBlock.addInnerElement(itemMoreDetails);
      itemBlock.addInnerElement(itemInfoBlock);
      itemQuantity.addInnerElement(itemQuantityInput);
      itemBlock.addInnerElement(itemQuantity);
      itemOrderValue.addInnerElement(itemOrderSumm);
      itemOrderValue.addInnerElement(itemRemoveButton);
      itemBlock.addInnerElement(itemOrderValue);
      this.cartSection.addInnerElement(itemBlock.getElement());
    });
  }

  private removeItemFromCart(response: ClientResponse<ProductProjection>) {
    const anonimCartID = localStorage.getItem('anonimCartID');
    console.log('anonimCartID', anonimCartID);
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then(async (cartResponse) => {
          // this.cartSection.getElement().textContent = '';
          // await this.configView();
          const item = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === response.body.key);
          if (item[0].id) this.anonimApi.removeLineItem(anonimCartID, cartResponse.body.version, item[0].id);
        })
        .then(() => new InfoMessage().showMessage('Item removed from cart'))
        .catch((error) => {
          console.log(error);
          new ErrorMessage().showMessage(error.message);
        });
  }
}
