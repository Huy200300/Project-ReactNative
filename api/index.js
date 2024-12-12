const backendDomain = "http://10.0.2.2:8080";

const SummaryApi = {
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "POST",
  },
  logout_user: {
    url: `${backendDomain}/api/logout`,
    method: "GET",
  },
  category_product: {
    url: `${backendDomain}/api/get-category`,
    method: "GET",
  },
  category_wiseProduct: {
    url: `${backendDomain}/api/category-products`,
    method: "POST",
  },
  get_new_product: {
    url: `${backendDomain}/api/get-new-product`,
    method: "POST",
  },
  get_review_stats: {
    url: `${backendDomain}/api/reviews/stats`,
    method: "GET",
  },
  filter_top_selling: {
    url: `${backendDomain}/api/top-selling-product`,
    method: "GET",
  },
  get_top_selling_product: {
    url: `${backendDomain}/api/get-top-selling-product`,
    method: "POST",
  },
  product_detail: {
    url: `${backendDomain}/api/product-detail`,
    method: "POST",
  },
  address_user: {
    url: `${backendDomain}/api/user`,
    method: "GET",
  },
  payment_momo: {
    url: `${backendDomain}/api/payment_momo`,
    method: "POST",
  },
  current_user: {
    url: `${backendDomain}/api/user/details`,
    method: "GET",
  },
  getOrderUser: {
    url: `${backendDomain}/api/orders/user`,
    method: "GET",
  },
  getOrderStaff: {
    url: `${backendDomain}/api/orders/staff`,
    method: "GET",
  },
  filter_product: {
    url: `${backendDomain}/api/filter-product`,
    method: "POST",
  },
  payment_COD: {
    url: `${backendDomain}/api/payment_cast_on_delivery`,
    method: "POST",
  },
  update_status_order: {
    url: `${backendDomain}/api/update-status-order`,
    method: "POST",
  },
  getSearchName: {
    url: `${backendDomain}/api/search`,
    method: "GET",
  },
  add_new_address: {
    url: `${backendDomain}/api/addNewAddress`,
    method: "POST",
  },
  newReview: {
    url: `${backendDomain}/api/reviews`,
    method: "POST",
  },
  getReview: {
    url: `${backendDomain}/api/get-reviews`,
    method: "POST",
  },
  reviews_like: {
    url: `${backendDomain}/api/reviews/like`,
    method: "POST",
  },
  reviews_replies: {
    url: `${backendDomain}/api/reviews/replies`,
    method: "POST",
  },
  payment_vnpay: {
    url: `${backendDomain}/api/create_payment_url`,
    method: "POST",
  },
};

export default SummaryApi;
