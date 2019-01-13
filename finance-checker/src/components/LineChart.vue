<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: Object,
    stacked: {
      default: true
    }
  },
  mounted: function() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    stacked() {
      this.renderChart(this.chartData, this.options);
    }
  },
  computed: {
    options() {
      return {
        responsive: true,
        scales: {
          yAxes: [
            {
              stacked: this.stacked
            }
          ]
        }
      };
    }
  }
};
</script>