import axios from "axios";
import { toast } from "material-react-toastify";

// const navigate = useNavigate();

const axiosConfig = {
  baseURL: process.env.REACT_APP_BACKEND_API,
  timeout: 300000,
};


/**
 * Create an Axios Client for Auth Module
 */
const commonXHRInstance = axios.create(axiosConfig);

commonXHRInstance.interceptors.request.use(
  async (apiConfig) => {
    const tokenData = localStorage.getItem("token");
    const config = apiConfig ? apiConfig : {};

    const cancelController = new AbortController();
    if (!config.signal) {
      config.signal = cancelController.signal;
    }

    try {
      // config["headers"]["Content-Type"] = "application/json";
      if (tokenData) {
        config["headers"]["Authorization"] = `Bearer ${tokenData}`;
      }
    } catch (error) {
      cancelController.abort();
      return Promise.reject(error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

commonXHRInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  function (error) {
    if (
      error.response?.data?.status === 401 ||
      error.response?.data?.code === 401
      // && error.response.data.errorCode == 11
    ) {
      toast.warning(error.response.data.message);
      sessionStorage.clear();
      window.location.reload();
    } else if (error.response?.data?.status === 500) {
      toast.error(error.response.data.error);
    } else {
      console.log(error);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error.response?.data || "Something Went Wrong. Please try again.");
  }
);

export { commonXHRInstance };
