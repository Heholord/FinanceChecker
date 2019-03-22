<template>
  <div>
    <div class="heading primary p7">
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
          <li class="primary p1">.p1</li>
          <li class="primary p2">.p2</li>
          <li class="primary p3">.p3</li>
          <li class="primary p4">.p4</li>
          <li class="primary p5">.p5</li>
          <li class="primary p6">.p6</li>
          <li class="primary p7">.p7</li>
          <li class="primary p8">.p8</li>
          <li class="primary p9">.p9</li>
        </ul>
        <p class="title">.neutral</p>
        <ul class="color">
          <li class="neutral n1">.n1</li>
          <li class="neutral n2">.n2</li>
          <li class="neutral n3">.n3</li>
          <li class="neutral n4">.n4</li>
          <li class="neutral n5">.n5</li>
          <li class="neutral n6">.n6</li>
          <li class="neutral n7">.n7</li>
          <li class="neutral n8">.n8</li>
          <li class="neutral n9">.n9</li>
        </ul>
        <p class="title">.support[.negative|.positive|.alert]</p>
        <ul class="color many">
          <li class="support negative n1">.n1</li>
          <li class="support negative n2">.n2</li>
          <li class="support negative n3">.n3</li>
          <li class="support negative n4">.n4</li>
          <li class="support negative n5">.n5</li>
          <li class="support positive p1">.p1</li>
          <li class="support positive p2">.p2</li>
          <li class="support positive p3">.p3</li>
          <li class="support positive p4">.p4</li>
          <li class="support positive p5">.p5</li>
          <li class="support alert a1">.a1</li>
          <li class="support alert a2">.a2</li>
          <li class="support alert a3">.a3</li>
          <li class="support alert a4">.a4</li>
          <li class="support alert a5">.a5</li>
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
        <li>.margin</li>
        <li class="margin m1">
          <p class="margin m1">.m1</p>
        </li>
        <li class="margin m1">
          <p class="margin m2">.m2</p>
        </li>
        <li class="margin m1">
          <p class="margin m3">.m3</p>
        </li>
        <li class="margin m1">
          <p class="margin m4">.m4</p>
        </li>
        <li class="margin m1">
          <p class="margin m5">.m5</p>
        </li>
        <li class="margin m1">
          <p class="margin m6">.m6</p>
        </li>
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs4">Padding</h1>
      <ul class="padding-box">
        <li>.padding</li>
        <li class="margin m1 padding p1">.m1</li>
        <li class="margin m1 padding p2">.m2</li>
        <li class="margin m1 padding p3">.m3</li>
        <li class="margin m1 padding p4">.m4</li>
        <li class="margin m1 padding p5">.m5</li>
        <li class="margin m1 padding p6">.m6</li>
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs4">Height/Widht</h1>
      <ul class="size-box">
        <li>.size</li>
        <li class="size w1">.h1|.w1</li>
        <li class="size w2">.h2|.w2</li>
        <li class="size w3">.h3|.w3</li>
        <li class="size w4">.h4|.w4</li>
        <li class="size w5">.h5|.w5</li>
        <li class="size w6">.h6|.w6</li>
        <li class="size w7">.h7|.w7</li>
        <li class="size w8">.h8|.w8</li>
        <li class="size w9">.h9|.w9</li>
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs4">Border radius</h1>
      <ul class="border">
        <li>.border-radius</li>
        <li class="margin m1 border-radius">/</li>
        <li class="margin m1 border-radius br-soft">.br-soft</li>
        <li class="margin m1 border-radius br-softer">.br-softer</li>
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs4">Border width</h1>
      <ul class="border">
        <li>.border-width</li>
        <li class="margin m1 border-width bw-soft">.bw-soft</li>
        <li class="margin m1 border-width">/</li>
        <li class="margin m1 border-width bw-hard">.bw-hard</li>
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
    box-shadow: $flying-shadow-s2;
    margin: 0 0 80px 0;

    .content {
      position: relative;
      text-align: center;
      max-width: 1000px;
      min-width: 850px;
      h1.headline {
        text-align: left;
        margin: 0;
      }
      .headline-img {
        position: absolute;
        right: 10%;
        top: -10px;
        background: $primary-p9;
        box-shadow: $flying-shadow-s2;
        border-radius: 50%;
        @include square($size4);
      }
    }
  }

  .systemblock {
    display: relative;
    margin: 100px;
    margin-top: 0px;

    .splitcolumn,
    ul {
      list-style-type: none;
      border-radius: 0px;
      box-shadow: $flying-shadow-s1;
      padding: 20px;
      max-width: $size8;
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
          @include square($size2);
          padding-top: $space2;
          text-align: center;
        }
      }

      @mixin createBox() {
        border: 2px solid $primary-p9;
        @include make-in-shadow($neutral-n2);
        background-image: linear-gradient(
          to right bottom,
          $primary-p2,
          $primary-p3,
          $primary-p4,
          $primary-p5
        );
        color: $primary-p9;
      }

      &.padding-box {
        > li.margin {
          @include createBox();
        }
      }
      &.margin-box {
        > li.margin {
          border: 1px solid $neutral-n4;
          > p {
            width: $size2;
            @include make-in-shadow($neutral-n2);
            @include createBox();
          }
        }
      }

      &.border {
        > li.margin {
          padding-top: $space4;
          @include square($size4);
          @include make-in-shadow($neutral-n2);
          @include createBox();
        }
      }

      &.padding-box,
      &.margin-box,
      &.border {
        > li.margin {
          display: inline-block;
          text-align: center;
        }
      }

      &.size-box {
        max-width: $size9 + 40px;
        min-width: $size9 + 40px;
        > li.size {
          height: $size1;
          background-image: linear-gradient(
            to left,
            $primary-p1,
            $primary-p3,
            $primary-p5,
            $primary-p7,
            $primary-p9
          );
          padding-top: $space1;
          padding-right: $space1;
          @include make-in-shadow($support-alert-a3);
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
          @include square($size2);
          border-radius: 0px;
          padding-top: $space2;
          text-align: center;
          @include make-in-shadow($neutral-n1);
        }
      }
    }
  }
}
</style>
