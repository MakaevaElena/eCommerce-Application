import { ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './cart-view.module.scss';
import ClientApi from '../../../../api/client-api';
import { PagePath } from '../../../router/pages';
import ErrorMessage from '../../../message/error-message';
import InfoMessage from '../../../message/info-message';
// import ErrorMessage from '../../../message/error-message';

export default class CartView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private anonimApi: ClientApi;

  private cartSection = new ElementCreator({
    tag: TagName.SECTION,
    classNames: [styleCss['cart-section']],
    textContent: '',
  });

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.anonimApi = new ClientApi();

    this.getCreator().addInnerElement(this.wrapper);
    this.configView();
  }

  private configView() {
    this.createCartHeader();
    const anonimCartID = localStorage.getItem('anonimCartID');
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          console.log('cartResponse', cartResponse);
          cartResponse.body.lineItems.forEach((item) => {
            // console.log('item.key', item.productKey);
            if (item.productKey) this.createCartItem(item.productKey);
          });
        })
        .catch();
  }

  private createCartItem(itemKey: string) {
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
      });

      itemBlock.addInnerElement(itemImage);
      itemInfoBlock.addInnerElement(itemName);
      itemInfoBlock.addInnerElement(itemMoreDetails);
      // itemInfoBlock.addInnerElement(itemDetails);
      itemBlock.addInnerElement(itemInfoBlock);
      itemQuantity.addInnerElement(itemQuantityInput);
      itemBlock.addInnerElement(itemQuantity);
      itemOrderValue.addInnerElement(itemOrderSumm);
      itemOrderValue.addInnerElement(itemRemoveButton);
      itemBlock.addInnerElement(itemOrderValue);
      this.cartSection.addInnerElement(itemBlock.getElement());
    });
  }

  private createCartHeader() {
    const header = new ElementCreator({
      tag: TagName.SECTION,
      classNames: [styleCss['cart-header']],
      textContent: '',
    });

    const itemsImageTitle = new ElementCreator({
      tag: TagName.SECTION,
      classNames: [styleCss['cart-header__image'], styleCss['cart-cell']],
      textContent: '',
    });

    const itemsTitle = new ElementCreator({
      tag: TagName.SECTION,
      classNames: [styleCss['cart-header__title'], styleCss['cart-cell']],
      textContent: 'Items',
    });

    const itemQuantity = new ElementCreator({
      tag: TagName.SECTION,
      classNames: [styleCss['cart-header__quantity'], styleCss['cart-cell']],
      textContent: 'Quantity',
    });

    const itemOrderValue = new ElementCreator({
      tag: TagName.SECTION,
      classNames: [styleCss['cart-header__order-value'], styleCss['cart-cell']],
      textContent: 'Order Value',
    });

    header.addInnerElement(itemsImageTitle);
    header.addInnerElement(itemsTitle);
    header.addInnerElement(itemQuantity);
    header.addInnerElement(itemOrderValue);
    this.cartSection.addInnerElement(header);

    this.wrapper.append(this.cartSection.getElement());
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private removeItemFromCart(response: ClientResponse<ProductProjection>) {
    // if (!localStorage.getItem('isLogin') && !localStorage.getItem('anonimCartID')) {
    //   this.anonimApi
    //     .createCart()
    //     .then((cartResponse) => {
    //       localStorage.setItem('anonimCartID', `${cartResponse.body.id}`);
    //     })
    //     .catch((error) => new ErrorMessage().showMessage(error.message));
    // }

    const anonimCartID = localStorage.getItem('anonimCartID');
    console.log('anonimCartID', anonimCartID);
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          const item = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === response.body.key);
          console.log(item[0].id);
          this.anonimApi.removeLineItem(anonimCartID, cartResponse.body.version, item[0].id);
        })
        .then(() => new InfoMessage().showMessage('Item removed from cart'))
        .catch((error) => new ErrorMessage().showMessage(error.message));
  }
}
