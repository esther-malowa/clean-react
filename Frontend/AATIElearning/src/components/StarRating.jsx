
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

export default function StarRating({ rating }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="text-yellow-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="text-yellow-500" />);
    }
  }

  return <div className="flex gap-1">{stars}</div>;
}
