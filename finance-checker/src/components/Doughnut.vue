<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  props: {
    chartData: Object,
    options: {
      type: Object,
      default: function() {
        return {
          cutoutPercentage: 60,
          circumference: Math.PI,
          rotation: Math.PI
        };
      }
    }
  },
  mixins: [reactiveProp],
  mounted: function() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>