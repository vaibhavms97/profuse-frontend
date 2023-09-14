import "./burger.css";
import "./styles.css";

export const BurgerBoughie = ({ isClosed }) => (
  <span className={`burger burger-boughie ${isClosed && "is-closed"}`} />
);
