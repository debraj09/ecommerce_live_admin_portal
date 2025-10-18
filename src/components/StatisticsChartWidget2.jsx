import { Row, Col, Card } from "react-bootstrap";
import Chart from "react-apexcharts";
// components
import ChartStatistics from "./ChartStatistics";
const StatisticsChartWidget2 = ({
  title,
  color,
  data,
  totalSales,
  target,
  lastWeek,
  lastMonth
}) => {
  const apexOpts = {
    chart: {
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "67%"
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: true,
            fontSize: "24px",
            offsetY: 12,
            formatter: val => {
              return String(val);
            }
          }
        }
      }
    },
    colors: [color],
    stroke: {
      lineCap: "round"
    }
  };
  const apexData = [data];
  return <>
      <Card>
        <Card.Body>
          <h4 className="header-title mb-2">{title}</h4>

          <div className="widget-chart text-center" dir="ltr">
            <Chart options={apexOpts} series={apexData} type="radialBar" height={180} className="apex-charts mt-0" />

            <h5 className="text-muted mt-0">Total sales made today</h5>
            <h2>{totalSales}</h2>

            <Row className="row mt-3">
              <Col className="col-4">
                <ChartStatistics title="Target" stats={target} variant="danger" />
              </Col>
              <Col className="col-4">
                <ChartStatistics title="Last week" stats={lastWeek} variant="success" />
              </Col>
              <Col className="col-4">
                <ChartStatistics title="Last Month" stats={lastMonth} variant="danger" />
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </>;
};
export default StatisticsChartWidget2;