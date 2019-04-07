<template>
  <div>
    <heading img="design-i.svg" heading="Design System Cheatsheat"></heading>
    <div class="width-center">
      <div class="center-conent">
        <section class="systemblock">
          <h1 class="title fs4">Fonts</h1>
          <ul>
            <li class="headline thick">
              .headline.thick: Roboto Black
              <br>Text with short linespacing. Because this is a title man.
            </li>
            <li class="headline bold">.headline.bold (for buttons): Roboto Bold</li>
            <li class="headline">.headline: Roboto</li>
            <li class="article">
              .article: Source Sans
              <br>Example: Long texts need more line spacing because it is harder to tell where the line starts. Headlines and titles on the other hand don't need as much line spacing.
            </li>
            <li>General UI: Inter; Fallback: Lato, sans-serif</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Font Size</h1>
          <ul>
            <li class="fs1">.fs1: The dog and the cat run all day long</li>
            <li class="fs2">.fs2: The dog and the cat run all day long</li>
            <li class="fs3">.fs3: The dog and the cat run all day long</li>
            <li class="fs4">.fs4: The dog and the cat run all day long</li>
            <li class="fs5">.fs5: The dog and the cat run all day long</li>
            <li class="fs6">.fs6: The dog and the cat run all day long</li>
            <li class="fs7">.fs7: The dog and the cat run all day long</li>
            <li class="fs8">.fs8: The dog and the cat run all day long</li>
            <li class="fs9">.fs9: The dog and the cat run all day long</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Font Weight</h1>
          <ul>
            <li class="fw1 fs5">.fw1: The dog and the cat run all day long</li>
            <li class="fw2 fs5">.fw2: The dog and the cat run all day long</li>
            <li class="fw3 fs5">.fw3: The dog and the cat run all day long</li>
            <li class="fw4 fs5">.fw4: The dog and the cat run all day long</li>
            <li class="fw5 fs5">.fw5: The dog and the cat run all day long</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Color</h1>
          <div class="splitcolumn">
            <p class="title">Primary</p>
            <ul class="color">
              <li class="primary1">.primary1</li>
              <li class="primary2">.primary2</li>
              <li class="primary3">.primary3</li>
              <li class="primary4">.primary4</li>
              <li class="primary5">.primary5</li>
              <li class="primary6">.primary6</li>
              <li class="primary7">.primary7</li>
              <li class="primary8">.primary8</li>
              <li class="primary9">.primary9</li>
            </ul>
            <p class="title">Neutral</p>
            <ul class="color">
              <li class="neutral1">.neutral1</li>
              <li class="neutral2">.neutral2</li>
              <li class="neutral3">.neutral3</li>
              <li class="neutral4">.neutral4</li>
              <li class="neutral5">.neutral5</li>
              <li class="neutral6">.neutral6</li>
              <li class="neutral7">.neutral7</li>
              <li class="neutral8">.neutral8</li>
              <li class="neutral9">.neutral9</li>
            </ul>
            <p class="title">Support</p>
            <ul class="color many">
              <li class="support-negative1">.support-negative1</li>
              <li class="support-negative2">.support-negative2</li>
              <li class="support-negative3">.support-negative3</li>
              <li class="support-negative4">.support-negative4</li>
              <li class="support-negative5">.support-negative5</li>
              <li class="support-positive1">.support-positive1</li>
              <li class="support-positive2">.support-positive2</li>
              <li class="support-positive3">.support-positive3</li>
              <li class="support-positive4">.support-positive4</li>
              <li class="support-positive5">.support-positive5</li>
              <li class="support-alert1">.support-alert1</li>
              <li class="support-alert2">.support-alert2</li>
              <li class="support-alert3">.support-alert3</li>
              <li class="support-alert4">.support-alert4</li>
              <li class="support-alert5">.support-alert5</li>
            </ul>
          </div>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Box shadow</h1>
          <ul class="box-shadow">
            <li class="bs1">.bs1</li>
            <li class="bs2">.bs2</li>
            <li class="bs3">.bs3</li>
            <li class="bs4">.bs4</li>
            <li class="bs5">.bs5</li>
          </ul>
        </section>

        <section class="systemblock">
          <h1 class="title fs4">Margin</h1>
          <ul class="margin-box">
            <li class="margin1">
              <p class="margin1">.margin1</p>
            </li>
            <li class="margin1">
              <p class="margin2">.margin2</p>
            </li>
            <li class="margin1">
              <p class="margin3">.margin3</p>
            </li>
            <li class="margin1">
              <p class="margin4">.margin4</p>
            </li>
            <li class="margin1">
              <p class="margin5">.margin5</p>
            </li>
            <li class="margin1">
              <p class="margin6">.margin6</p>
            </li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Padding</h1>
          <ul class="padding-box">
            <li class="margin1 padding1">.padding1</li>
            <li class="margin1 padding2">.padding2</li>
            <li class="margin1 padding3">.padding3</li>
            <li class="margin1 padding4">.padding4</li>
            <li class="margin1 padding5">.padding5</li>
            <li class="margin1 padding6">.padding6</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Height/Widht</h1>
          <ul class="size-box">
            <li class="size-width1">.size-[height1|width1]</li>
            <li class="size-width2">.size-[height2|width2]</li>
            <li class="size-width3">.size-[height3|width3]</li>
            <li class="size-width4">.size-[height4|width4]</li>
            <li class="size-width5">.size-[height5|width5]</li>
            <li class="size-width6">.size-[height6|width6]</li>
            <li class="size-width7">.size-[height7|width7]</li>
            <li class="size-width8">.size-[height8|width8]</li>
            <li class="size-width9">.size-[height9|width9]</li>
            <li class="size-width10">.size-[height10|width10]</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Border radius</h1>
          <ul class="border">
            <li class="margin1 bw-soft br-normal">.br-normal</li>
            <li class="margin1 bw-soft br-soft">.br-soft</li>
            <li class="margin1 bw-soft br-softer">.br-softer</li>
          </ul>
        </section>
        <section class="systemblock">
          <h1 class="title fs4">Border width</h1>
          <ul class="border">
            <li class="margin1 bw-soft">.bw-soft</li>
            <li class="margin1 bw-normal">.bw-normal</li>
            <li class="margin1 bw-hard">.bw-hard</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from "@/components/Heading";
export default {
  name: "DesignSystem",
  components: { Heading }
};
</script>

<style lang="scss" scoped>
div {
  text-align: left;
  .systemblock {
    display: relative;
    margin: $space5;
    margin-top: 0;
    min-width: $size10;

    .splitcolumn,
    ul {
      border-radius: 0px;
      box-shadow: $flying-shadow1;
      padding: 20px;
      background-color: white;
      list-style: none;

      > li {
        margin-bottom: 30px;
      }

      @mixin background() {
        background-image: linear-gradient(to top, $primary1, $primary2);
      }
      @mixin createBox() {
        @include make-in-shadow($neutral1);
        @include background();
        color: $primary9;
      }

      &.box-shadow {
        > li {
          @include square($size4);
          @include background();
          text-align: center;
          vertical-align: baseline;
          padding-top: $space3;
        }
      }
      &.padding-box {
        > li[class^="margin"] {
          @include createBox();
          min-width: $size4;
          border: 1px solid $primary9;
        }
      }
      &.margin-box {
        > li[class^="margin"] {
          border: 1px solid $neutral4;
          > p {
            @include square($size4);
            @include createBox();
            padding-top: $space3;
            border: 1px solid $primary9;
          }
        }
      }

      &.border {
        > li[class^="margin"] {
          padding-top: $space4;
          @include square($size5);
          @include createBox();
        }
      }

      &.box-shadow,
      &.padding-box,
      &.margin-box,
      &.border {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-content: center;
        gap: $space2;
        & > li[class^="margin"] {
          display: inline-block;
          text-align: center;
          margin: auto;
        }
      }

      &.size-box {
        > li[class^="size"] {
          height: $size3;
          background-image: linear-gradient(to left, $primary1, $primary5);
          padding-top: $space1;
          padding-right: $space1;
          @include make-in-shadow($primary1);
          text-align: right;
        }
      }
    }

    .splitcolumn {
      display: grid;
      grid-template: 1fr 1fr 1.5fr / 0.2fr 1fr;
      ul.color {
        background: none;
        border: none;
        box-shadow: none;
        display: grid;
        grid-template: 1fr 1fr / repeat(5, 1fr);
        grid-gap: $space1;
        justify-items: center;
        &.many {
          grid-template: 1fr 1fr 1fr / repeat(5, 1fr);
        }

        > li {
          @include square($size4);
          border-radius: 0px;
          padding-top: $space2;
          text-align: center;
          @include make-in-shadow($neutral1);
        }
      }
    }
  }
}
</style>
