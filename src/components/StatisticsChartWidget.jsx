import { Row, Col, Card } from "react-bootstrap";
import CountUp from "react-countup";
import classNames from "classnames";
import Chart from "react-apexcharts";
const StatisticsChartWidget = ({
  icon,
  variant,
  stats,
  counterOptions,
  description,
  chartConfig
}) => {
  return <>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <div className={classNames("avatar-sm", "rounded-circle", "bg-" + variant)}>
                <i className={classNames(icon, "avatar-title", "font-22", "text-white")}></i>
              </div>
            </Col>
            <Col>
              <div className="text-end">
                <h3 className="my-1">
                  <span>
                    <CountUp duration={1} end={stats} {...counterOptions} />
                  </span>
                </h3>
                <p className="text-muted mb-1 text-truncate">{description}</p>
              </div>
            </Col>
          </Row>
          <div className="mt-4">
            {chartConfig && <Chart options={chartConfig["apxOptions"]} series={chartConfig["apxSeries"]} type={chartConfig["type"]} height={chartConfig["height"]} className="apex-charts mt-0" />}
          </div>
        </Card.Body>
      </Card>
    </>;
};
export default StatisticsChartWidget;