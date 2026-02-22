import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} color="#ffc107" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
    else stars.push(<FaRegStar key={i} color="#ddd" />);
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {stars}
    </div>
  );
};

export default RatingStars;