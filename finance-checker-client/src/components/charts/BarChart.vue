<script>
import { Bar, mixins } from "vue-chartjs";

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: Object
  },
  mounted: function() {
    this.renderChart(this.chartData, this.options);
  },
  computed: {
    options() {
      return {
        responsive: true
      };
    }
  }
};
</script>