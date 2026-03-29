function MetricCard({ label, value, detail, accent = 'teal' }) {
  return (
    <article className={`metric-card metric-card--${accent}`}>
      <p className="metric-card__label">{label}</p>
      <h3>{value}</h3>
      <p className="metric-card__detail">{detail}</p>
    </article>
  );
}

export default MetricCard;
