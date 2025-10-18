import classNames from "classnames";
const ChartStatistics = ({
  title,
  icon,
  stats,
  variant
}) => {
  return <>
      <p className="text-muted font-15 mb-1 text-truncate">{title}</p>
      <h4>
        <i className={classNames(icon, "text-" + variant, "me-1")}></i>
        {stats}
      </h4>
    </>;
};
export default ChartStatistics;