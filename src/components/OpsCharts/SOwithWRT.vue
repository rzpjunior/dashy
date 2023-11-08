<script>
import { HorizontalBar } from "vue-chartjs";

export default {
    extends: HorizontalBar,
    props: {
    chartData: {
      type: Array | Object,
      default: null
    },
  },
  mounted() {
      Chart.pluginService.register({
        beforeRender: function(chart) {
            if (chart.config.options.showAllTooltips) {
                chart.pluginTooltips = [];
                chart.config.data.datasets.forEach(function(dataset, i) {
                    chart.getDatasetMeta(i).data.forEach(function(sector, j) {
                        chart.pluginTooltips.push(new Chart.Tooltip({
                            _chart: chart.chart,
                            _chartInstance: chart,
                            _data: chart.data,
                            _options: chart.options.tooltips,
                            _active: [sector]
                        }, chart));
                    });
                }); // turn off normal tooltips 
                chart.options.tooltips.enabled = false;
            }
        },
        afterDraw: function(chart, easing) {
            if (chart.config.options.showAllTooltips) {
                // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once 
                if (!chart.allTooltipsOnce) {
                    if (easing !== 1) return;
                    chart.allTooltipsOnce = true;
                }
                chart.options.tooltips.enabled = true;
                Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
                    tooltip.initialize();
                    tooltip.update(); // we don't actually need this since we are not animating tooltips 
                    tooltip.pivot();
                    tooltip.transition(easing).draw();
                });
                chart.options.tooltips.enabled = false;
            }
        }
    });
    // RENDER CHART
    this.renderChart(
      this.chartData,
      {
        scales: {
          yAxes: [
            {
              ticks: {
                fontFamily: 'Helvetica',
                fontSize: 12,
                fontColor: '#768F9C',
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
              {
                ticks: {
                  fontFamily: 'Helvetica',
                  fontSize: 12,
                  fontColor: '#768F9C',
                },
              gridLines: {
                display: true,
              },
            },
          ],
        },
        legend: {
          labels: {
              boxWidth: 40,
          },
          display: true,
          position: "top",
          align: "start",
          fillStyle: {
            color: "#8DC53F",
          },
        },
        tooltips: {
          fontFamily: 'Helvetica',
          bodyFontFamily: 'Helvetica',
          bodySpacing: 12,
          bodyFontColor: '768F9C',
          titleFontColor: '#768F9C',
          backgroundColor: '#FCFCFC',
          borderColor: '#8DC53F',
          borderWidth: 1,
          xPadding: 5,
          yPadding: 5,
          caretSize: 0,
          callbacks: {
              labelTextColor: function(tooltipItem, chart) {
                return '#768F9C';
              },
              title: function(tooltipItem, data) {
                return;
              }
            },
        },
        showAllTooltips: true,
        responsive: true,
        maintainAspectRatio: false,
      }
    );
  },
};
</script>
