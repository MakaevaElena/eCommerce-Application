import { ClientResponse, LineItem, ProductProjection } from '@commercetools/platform-sdk';
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
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

export default class CartItem extends DefaultView {
  private router: Router;

  private anonimApi: ClientApi;

  private cartSection: ElementCreator;

  private observer: Observer;

  constructor(router: Router, cartSection: ElementCreator, anonimApi: ClientApi) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.cartSection = cartSection;

    this.router = router;

    this.observer = Observer.getInstance();

    this.anonimApi = anonimApi;
  }

  public createCartItem(itemKey: string, lineItemData: LineItem[]) {
    this.anonimApi.productProjectionResponseKEY(itemKey).then(async (response: ClientResponse<ProductProjection>) => {
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

      const itemQuantityMinus = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__quantity-minus'], styleCss['cart-cell']],
        textContent: '-',
      });

      const itemQuantityPlus = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__quantity-plus'], styleCss['cart-cell']],
        textContent: '+',
      });

      itemQuantityMinus.getElement().addEventListener('click', () => {
        if (Number(itemQuantityInput.value) > 1) {
          itemQuantityInput.value = (Number(itemQuantityInput.value) - 1).toString();
          itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
          this.changeQuantityItem(itemKey, Number(itemQuantityInput.value));
        }
      });

      itemQuantityPlus.getElement().addEventListener('click', () => {
        itemQuantityInput.value = (Number(itemQuantityInput.value) + 1).toString();
        itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
        this.changeQuantityItem(itemKey, Number(itemQuantityInput.value));
      });

      itemQuantityInput.setAttribute('type', 'number');
      itemQuantityInput.setAttribute('min', '1');
      itemQuantityInput.setAttribute('value', '1');
      itemQuantityInput.value = `${lineItemData[0].quantity}`;

      itemQuantityInput.addEventListener('change', () => {
        itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
        this.changeQuantityItem(itemKey, Number(itemQuantityInput.value));
      });

      const itemOrderValue = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['item-block__order-value'], styleCss['cart-cell']],
        textContent: ``,
      });

      itemOrderSumm.getElement().textContent = `PRICE: ${(Number(lineItemData[0].totalPrice.centAmount) / 100).toFixed(
        2
      )}  ${lineItemData[0].totalPrice.currencyCode}`;

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
      itemQuantity.addInnerElement(itemQuantityMinus);
      itemQuantity.addInnerElement(itemQuantityInput);
      itemQuantity.addInnerElement(itemQuantityPlus);
      itemBlock.addInnerElement(itemQuantity);
      itemOrderValue.addInnerElement(itemOrderSumm);
      itemOrderValue.addInnerElement(itemRemoveButton);
      itemBlock.addInnerElement(itemOrderValue);
      this.cartSection.addInnerElement(itemBlock.getElement());
    });
  }

  private getItemSum(response: ClientResponse<ProductProjection>, value: string) {
    if (response.body.masterVariant.prices?.[1].discounted?.value) {
      return `PRICE: ${(
        (Number(response.body.masterVariant.prices?.[1].discounted?.value.centAmount) / 100) *
        Number(value)
      ).toFixed(2)} ${response.body.masterVariant.prices?.[1].discounted?.value.currencyCode}`;
    }
    if (response.body.masterVariant.prices?.[1].value) {
      return `PRICE: ${(
        (Number(response.body.masterVariant.prices?.[1].value?.centAmount) / 100) *
        Number(value)
      ).toFixed(2)} ${response.body.masterVariant.prices?.[1].value?.currencyCode}`;
    }
    return '';
  }

  private removeItemFromCart(response: ClientResponse<ProductProjection>) {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    // console.log('anonimCartID', anonimCartID);
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then(async (cartResponse) => {
          // this.cartSection.getElement().textContent = '';
          // await this.configView();
          const item = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === response.body.key);
          if (item[0].id) this.anonimApi.removeLineItem(anonimCartID, cartResponse.body.version, item[0].id);
        })
        .then(() => {
          this.observer.notify(EventName.TOTAL_COST_CHANGED);
          new InfoMessage().showMessage('Item removed from cart');
        })
        .catch((error) => {
          // console.log(error);
          new ErrorMessage().showMessage(error.message);
        });
  }

  // todo после изменения количества должна приходить сумма со следующей версии корзины, а не с этой же корзины.
  private changeQuantityItem(itemKey: string, quantity: number) {
    // console.log('quantity', quantity);
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);

    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          // console.log('cartResponse', cartResponse);
          const lineItemData = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === itemKey);
          this.anonimApi.changeQuantityByLineID(
            cartResponse.body.id,
            cartResponse.body.version,
            lineItemData[0].id,
            quantity
          );
          this.observer.notify(EventName.TOTAL_COST_CHANGED);
        })
        // .then(() => this.observer.notify(EventName.TOTAL_COST_CHANGED))
        .catch((error) => {
          // console.log(error);
          new ErrorMessage().showMessage(error.message);
        });
  }
}
