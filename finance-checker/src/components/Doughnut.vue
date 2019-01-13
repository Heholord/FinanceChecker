<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  props: {
    chartData: Object,
    responsive: {
      default: true
    },
    options: {
      type: Object,
      default: function() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 60,
          circumference: Math.PI,
          rotation: (Math.PI * 3) / 2
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