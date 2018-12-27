<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  props: {
    chartData: Object,
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mixins: [reactiveProp],
  mounted: function() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>