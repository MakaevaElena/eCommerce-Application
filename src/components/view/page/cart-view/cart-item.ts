import { ClientResponse, LineItem, ProductProjection } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './cart-view.module.scss';
import { PagePath } from '../../../router/pages';
import ErrorMessage from '../../../message/error-message';
import InfoMessage from '../../../message/info-message';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import debounce from '../../../../utils/debounce';
import TotalApi from '../../../../api/total-api';

export default class CartItem extends DefaultView {
  private router: Router;

  private api: TotalApi;

  private itemsWrapper: ElementCreator;

  private observer = Observer.getInstance();

  constructor(router: Router, itemsWrapper: ElementCreator, api: TotalApi) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.api = api;

    this.itemsWrapper = itemsWrapper;

    this.router = router;
  }

  public createCartItem(itemKey: string, lineItemData: LineItem[]) {
    this.api
      .getClientApi()
      .productProjectionResponseKEY(itemKey)
      .then(async (response: ClientResponse<ProductProjection>) => {
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

        itemQuantityInput.setAttribute('readonly', 'readonly');

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

        itemQuantityMinus.getElement().addEventListener(
          'click',
          debounce(async () => {
            if (Number(itemQuantityInput.value) > 1) {
              itemQuantityInput.value = (Number(itemQuantityInput.value) - 1).toString();
              await this.changeQuantityItem(itemKey, Number(itemQuantityInput.value)).then(async () => {
                itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
              });
            }
          }, 1000)
        );

        itemQuantityPlus.getElement().addEventListener(
          'click',
          debounce(async () => {
            itemQuantityInput.value = (Number(itemQuantityInput.value) + 1).toString();
            await this.changeQuantityItem(itemKey, Number(itemQuantityInput.value)).then(async () => {
              itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
            });
          }, 800)
        );

        itemQuantityInput.setAttribute('type', 'number');
        itemQuantityInput.setAttribute('min', '1');
        itemQuantityInput.setAttribute('value', '1');
        itemQuantityInput.value = `${lineItemData[0].quantity}`;

        itemQuantityInput.addEventListener(
          'change',
          debounce(async () => {
            this.changeQuantityItem(itemKey, Number(itemQuantityInput.value)).then(async () => {
              itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;
            });
          }, 800)
        );

        const itemOrderValue = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['item-block__order-value'], styleCss['cart-cell']],
          textContent: ``,
        });

        itemOrderSumm.getElement().textContent = `${this.getItemSum(response, itemQuantityInput.value)}`;

        const itemRemoveButton = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['item-block__remove-button']],
          textContent: `Remove Item`,
        });

        itemRemoveButton.getElement().addEventListener('click', () => {
          this.removeItemFromCart(response);
          this.itemsWrapper.getElement().removeChild(itemBlock.getElement());
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
        this.itemsWrapper.addInnerElement(itemBlock.getElement());
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
    this.api
      .getClientApi()
      .getActiveCart()
      .then(async (cartResponse) => {
        const cartId = cartResponse.body.id;
        localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, cartId);
        const item = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === response.body.key);
        if (item[0].id)
          this.api
            .getClientApi()
            .removeLineItem(cartId, cartResponse.body.version, item[0].id)
            .then(() => {
              this.observer.notify(EventName.TOTAL_COST_CHANGED);
              new InfoMessage().showMessage('Item removed from cart');
              this.observer.notify(EventName.UPDATE_CART);
            })
            .catch((error) => new ErrorMessage().showMessage(error.message));
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private async changeQuantityItem(itemKey: string, quantity: number) {
    this.api
      .getClientApi()
      .getActiveCart()
      .then(async (cartResponse) => {
        const lineItemData = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === itemKey);
        this.api
          .getClientApi()
          .changeQuantityByLineID(cartResponse.body.id, cartResponse.body.version, lineItemData[0].id, quantity)
          .then((response) => {
            if (response.statusCode === 200) {
              this.observer.notify(EventName.TOTAL_COST_CHANGED);
              this.observer.notify(EventName.UPDATE_CART);
            }
          })
          .catch((error) => new ErrorMessage().showMessage(error.message));
        return quantity;
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }
}
