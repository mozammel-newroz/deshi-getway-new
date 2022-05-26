import axios from "axios";

class LoginToPay {
  login(data) {
    try {
      return axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/execute`,
        data
      );
    } catch (err) {
      console.log(err.response);
    }
  }
}

export default new LoginToPay();
