import SummaryApi from "../api";

const fetchCategoryWiseProduct = async (category) => {
  const data = await fetch(SummaryApi.category_wiseProduct.url, {
    method: SummaryApi.category_wiseProduct.method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      category: category,
    }),
  });

  const dataApi = await data.json();

  return dataApi;
};

export default fetchCategoryWiseProduct;
