/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css, PropertyValueMap, unsafeCSS} from 'lit';
import {customElement} from 'lit/decorators.js';
import Swiper from 'swiper';
import {Autoplay, Manipulation} from 'swiper/modules';
import styles from './node_modules/swiper/swiper.min.css';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = [
    css`
      .swiper {
        width: 100%;
        height: 100%;
      }
      .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;

        /* Center slide text vertically */
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
    unsafeCSS(styles),
  ];

  override firstUpdated(
    _changedProperties: PropertyValueMap<never> | Map<PropertyKey, unknown>
  ): void {
    this.initSwiper();
  }

  swiper: Swiper | null = null;

  override render() {
    return html`
      <div class="swiper">
        <div class="swiper-wrapper"></div>
        <slot @slotchange="${this.handleSlotChange}"></slot>
      </div>
    `;
  }

  handleSlotChange() {
    // When content in the slot changes, reinitialize Swiper
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.initSwiper();
    }
  }

  initSwiper() {
    const slot = this.shadowRoot!.querySelector('slot')!;
    const assignedNodes = slot
      .assignedNodes({flatten: true})
      .filter((el) => el.nodeType === Node.ELEMENT_NODE);

    this.swiper = new Swiper(
      this.shadowRoot!.querySelector<HTMLElement>('.swiper')!,
      {
        loop: true,
        autoplay: true,
        pagination: {el: '.swiper-pagination'},
        modules: [Autoplay, Manipulation],
        on: {
          init: (swiper) => {
            swiper.appendSlide(
              assignedNodes.map((node) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.appendChild(node);
                return slide;
              })
            );
          },
        },
      }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
