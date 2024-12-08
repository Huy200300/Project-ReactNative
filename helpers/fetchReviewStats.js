import SummaryApi from "../api";

const fetchReviewStats = async (productId) => {
  const response = await fetch(
    `${SummaryApi.get_review_stats.url}/${productId}`,
    {
      method: SummaryApi.get_review_stats.method,
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (data.success) {
    return {
      reviewCount: data.reviewCount,
      averageRating: data.averageRating,
    };
  } else {
    return { reviewCount: 0, averageRating: 0 };
  }
};

export default fetchReviewStats;
