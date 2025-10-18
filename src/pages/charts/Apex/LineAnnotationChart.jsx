import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";
const LineAnnotationChart = () => {
  const chartOptions = {
    chart: {
      type: "line",
      height: 380
    },
    annotations: {
      yaxis: [{
        y: 8200,
        borderColor: "#0acf97",
        label: {
          text: "Support",
          style: {
            color: "#fff",
            background: "#0acf97"
          }
        }
      }],
      xaxis: [{
        x: new Date("2017-11-23").getTime(),
        borderColor: "#775DD0",
        label: {
          text: "Anno Test",
          style: {
            color: "#fff",
            background: "#775DD0"
          }
        }
      }],
      points: [{
        x: new Date("2017-11-27").getTime(),
        y: 8506.9,
        marker: {
          size: 8,
          fillColor: "#fff",
          strokeColor: "#fa5c7c"
        },
        label: {
          text: "Point Annotation",
          style: {
            color: "#fff",
            background: "#fa5c7c"
          }
        }
      }]
    },
    xaxis: {
      type: "datetime",
      categories: ["2017-11-13", "2017-11-14", "2017-11-15", "2017-11-16", "2017-11-17", "2017-11-20", "2017-11-21", "2017-11-22", "2017-11-23", "2017-11-24", "2017-11-27", "2017-11-28", "2017-11-29", "2017-11-30", "2017-12-01", "2017-12-04", "2017-12-05", "2017-12-06", "2017-12-07", "2017-12-08"]
    },
    colors: ["#39afd1"],
    stroke: {
      curve: "straight",
      width: 3
    },
    title: {
      text: "Line with Annotations",
      align: "left"
    },
    grid: {
      borderColor: "#f1f3fa"
    }
  };
  const chartSeries = [{
    name: "Prices",
    data: [8107.85, 8128, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85, 8487.7, 8506.9, 8626.2, 8668.95, 8602.3, 8607.55, 8512.9, 8496.25, 8600.65, 8881.1, 9340.85]
  }];
  return <Card>
      <Card.Body>
        <h4 className="header-title mb-3">Line Chart with Annotations</h4>
        <Chart options={chartOptions} series={chartSeries} type="line" className="apex-charts" />
      </Card.Body>
    </Card>;
};
export default LineAnnotationChart;