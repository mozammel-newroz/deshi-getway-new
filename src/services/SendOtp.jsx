import axios from "axios";

class SendOtp {
  send(data) {
    try {
      return axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/send-otp`,
        data
      );
    } catch (err) {
      console.log("app error", err);
    }
  }
}

export default new SendOtp();
