import "./spinner-styles.scss";
const Spinner = ({ size = "24px" }) => (
  <div
    style={{ width: size, height: size }}
    className="spinner"
  />
);

export default Spinner;
