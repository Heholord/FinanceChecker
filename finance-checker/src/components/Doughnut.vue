<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp, reactiveData } = mixins;

export default {
  extends: Doughnut,
  props: ["chartData", "options"],
  mixins: [reactiveProp, reactiveData],
  mounted: function() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>