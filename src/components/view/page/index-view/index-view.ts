import { DiscountCode } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './index-view.module.scss';
import TotalApi from '../../../../api/total-api';
import CreateTagElement from '../../../../utils/create-tag-element';
import ApiType from '../../../app/type';
import ErrorMessage from '../../../message/error-message';

export default class IndexView extends DefaultView {
  private wrapper: HTMLDivElement;

  private api: TotalApi;

  private router: Router;

  private promoList = new ElementCreator({
    tag: TagName.DIV,
    classNames: [styleCss['promo__code-list']],
    textContent: 'Use promo codes:',
  });

  constructor(router: Router, paramApi: ApiType) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['index-view']],
      textContent: '',
    };
    super(params);

    this.wrapper = new CreateTagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);

    this.router = router;

    this.api = paramApi.api;

    this.configView();
  }

  private configView() {
    this.createLinks();
    this.renderPromoCodes();
  }

  private renderPromoCodes() {
    this.api
      .getClientApi()
      .getPromoCodes()
      .then((codes) => {
        codes.body.results.forEach((code) => {
          this.renderPromoCode(code);
        });
      })

      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });

    this.wrapper.append(this.promoList.getElement());
  }

  private renderPromoCode(code: DiscountCode) {
    const promoCodeBlock = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['promo__code-block']],
      textContent: ``,
    });

    const promoCode = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['promo__code-element']],
      textContent: `${code.code}`,
    });

    const promoCodeText = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['promo__code-text']],
      textContent: `for discount %`,
    });

    promoCodeBlock.addInnerElement(promoCode);
    promoCodeBlock.addInnerElement(promoCodeText);
    this.promoList.addInnerElement(promoCodeBlock);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private createLinks() {
    const wrapper = new CreateTagElement().createTagElement('div', [styleCss['content-wrapper']]);
    this.getCreator().addInnerElement(wrapper);
  }

  private createSignInButton() {
    const linkButton = new LinkButton(LinkName.REGISTRATION, () => {
      if (localStorage.getItem('isLogin') === 'true') {
        this.router.setHref(PagePath.INDEX);
      } else {
        this.router.setHref(PagePath.REGISTRATION);
      }
    });
    return linkButton;
  }
}
