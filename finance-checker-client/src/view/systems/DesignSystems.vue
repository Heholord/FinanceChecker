<template>
  <div>
    <div class="heading primary7">
      <div class="content">
        <h1 class="headline thick">Design System Cheatsheat</h1>
        <img class="headline-img" src="@/assets/design.svg">
      </div>
    </div>

    <section class="systemblock">
      <h1 class="title fs4">Fonts</h1>
      <ul>
        <li class="headline thick">.headline.thick: Roboto Black
          <br>Text with short linespacing. Because this is a title man.
        </li>
        <li class="headline bold">.headline.bold (for buttons): Roboto Bold</li>
        <li class="headline">.headline: Roboto</li>
        <li class="article">.article: Source Sans
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
        <li class="fs4">.fs4: The dog and the cat run all day long</li>
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
        <p class="title">.primary</p>
        <ul class="color">
          <li class="primary1">.p1</li>
          <li class="primary2">.p2</li>
          <li class="primary3">.p3</li>
          <li class="primary4">.p4</li>
          <li class="primary5">.p5</li>
          <li class="primary6">.p6</li>
          <li class="primary7">.p7</li>
          <li class="primary8">.p8</li>
          <li class="primary9">.p9</li>
        </ul>
        <p class="title">.neutral</p>
        <ul class="color">
          <li class="neutral1">.n1</li>
          <li class="neutral2">.n2</li>
          <li class="neutral3">.n3</li>
          <li class="neutral4">.n4</li>
          <li class="neutral5">.n5</li>
          <li class="neutral6">.n6</li>
          <li class="neutral7">.n7</li>
          <li class="neutral8">.n8</li>
          <li class="neutral9">.n9</li>
        </ul>
        <p class="title">.support[.negative|.positive|.alert]</p>
        <ul class="color many">
          <li class="support-negative1">.n1</li>
          <li class="support-negative2">.n2</li>
          <li class="support-negative3">.n3</li>
          <li class="support-negative4">.n4</li>
          <li class="support-negative5">.n5</li>
          <li class="support-positive1">.p1</li>
          <li class="support-positive2">.p2</li>
          <li class="support-positive3">.p3</li>
          <li class="support-positive4">.p4</li>
          <li class="support-positive5">.p5</li>
          <li class="support-alert1">.a1</li>
          <li class="support-alert2">.a2</li>
          <li class="support-alert3">.a3</li>
          <li class="support-alert4">.a4</li>
          <li class="support-alert5">.a5</li>
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
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs4">Border radius</h1>
      <ul class="border">
        <li class="margin1 bw-normal br-normal">.br-normal</li>
        <li class="margin1 bw-normal br-soft">.br-soft</li>
        <li class="margin1 bw-normal br-softer">.br-softer</li>
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
</template>

<script>
export default {
  name: "DesignSystem",
  components: {}
};
</script>

<style lang="scss">
@import "@/variables.scss";

div {
  text-align: left;
  .heading {
    position: relative;
    height: 100px;
    width: 100%;
    padding: 20px;
    box-shadow: $flying-shadow2;
    margin: 0 0 80px 0;

    .content {
      position: relative;
      text-align: center;
      max-width: $size10;
      min-width: $size9;
      h1.headline {
        text-align: left;
        margin: 0;
      }
      .headline-img {
        position: absolute;
        right: 10%;
        top: -10px;
        background: $primary9;
        box-shadow: $flying-shadow2;
        border-radius: 50%;
        @include square($size5);
      }
    }
  }

  .systemblock {
    display: relative;
    margin: 100px;
    margin-top: 0px;
    min-width: $size9;

    .splitcolumn,
    ul {
      list-style-type: none;
      border-radius: 0px;
      box-shadow: $flying-shadow1;
      padding: 20px;
      max-width: $size9;
      background-color: white;

      > li {
        margin-bottom: 30px;
      }

      &.box-shadow {
        display: grid;
        grid-template: 1fr / repeat(5, 1fr);
        grid-gap: $space1;
        justify-items: center;
        > li {
          @include square($size3);
          padding-top: $space2;
          text-align: center;
        }
      }

      @mixin createBox() {
        @include make-in-shadow($neutral1);
        background-image: linear-gradient(
          to top,
          $primary2,
          $primary3,
          $primary4,
          $primary5
        );
        color: $primary9;
      }

      &.padding-box {
        > li[class^="margin"] {
          @include createBox();
          border: 2px solid $primary9;
        }
      }
      &.margin-box {
        > li[class^="margin"] {
          border: 1px solid $neutral4;
          > p {
            padding-top: $space2;
            @include square($size3);
            @include createBox();
            border: 2px solid $primary9;
          }
        }
      }

      &.border {
        display: grid;
        grid-template: 1fr / 1fr 1fr 1fr;
        justify-items: center;
        > li[class^="margin"]{
            padding-top: $space4;
            @include square($size5);
            @include createBox();
          }
        }
      }

      &.padding-box,
      &.margin-box,
      &.border {
        > li[class^="margin"] {
          display: inline-block;
          text-align: center;
        }
      }

      &.size-box {
        max-width: $size10 + 40px;
        min-width: $size10 + 40px;
        > li.size {
          height: $size3;
          background-image: linear-gradient(
            to left,
            $primary1,
            $primary3,
            $primary5,
            $primary7,
            $primary9
          );
          padding-top: $space1;
          padding-right: $space1;
          @include make-in-shadow($primary1);
          text-align: right;
        }
      }
    }

    .splitcolumn {
      display: grid;
      grid-template: 1fr 1fr 1.5fr / 1fr 1fr;
      ul.color {
        background: none;
        border: none;
        box-shadow: none;
        display: grid;
        grid-template: 1fr / repeat(9, 1fr);
        grid-gap: 5px;
        justify-items: center;
        &.many {
          grid-template: 1fr 1fr 1fr / repeat(5, 1fr);
        }

        > li {
          @include square($size3);
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
