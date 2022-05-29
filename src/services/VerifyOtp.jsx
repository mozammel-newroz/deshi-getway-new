import axios from "axios";

class VerifyOtp {
  send(data) {
    try {
      return axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/verify-otp`,
        data
      );
    } catch (err) {
      console.log(err.response);
    }
  }
}

export default new VerifyOtp();
