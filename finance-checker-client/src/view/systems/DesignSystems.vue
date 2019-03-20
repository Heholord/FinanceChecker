<template>
  <div>
    <h1 class="headline thick">Design System Cheatsheat</h1>
    <section class="systemblock">
      <h1 class="title fs3">Fonts</h1>
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
      <h1 class="title fs3">Font Size</h1>
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
      <h1 class="title fs3">Font Weight</h1>
      <ul>
        <li class="fw1 fs5">.fw1: The dog and the cat run all day long</li>
        <li class="fw2 fs5">.fw2: The dog and the cat run all day long</li>
        <li class="fw3 fs5">.fw3: The dog and the cat run all day long</li>
        <li class="fw4 fs5">.fw4: The dog and the cat run all day long</li>
        <li class="fw5 fs5">.fw5: The dog and the cat run all day long</li>
      </ul>
    </section>
    <section class="systemblock">
      <h1 class="title fs3">Color</h1>
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
  h1.headline {
    text-align: center;
  }

  .systemblock {
    margin: 100px;
    margin-top: 0px;

    .splitcolumn,
    ul {
      list-style-type: none;
      border-radius: 0px;
      background-color: $neutral-n2;
      box-shadow: $flying-shadow-s2;
      padding: 20px;
      max-width: 800px;
      li {
        margin-bottom: 20px;
      }
    }

    .splitcolumn {
      display: grid;
      grid-template: 1fr 1fr 2fr / 1fr 1fr;
      ul.color {
        background: none;
        border: none;
        box-shadow: none;
        display: grid;
        grid-template: 1fr / repeat(9, 1fr);
        grid-gap: 5px;

        &.many {
          grid-template: 1fr 1fr 1fr / repeat(5, 1fr);
        }

        li {
          width: 40px;
          height: 40px;
          border-radius: 5px;
          padding-top: 10px;
          text-align: center;
          @include make-in-shadow($neutral-n2);
        }
      }
    }
  }
}
</style>
