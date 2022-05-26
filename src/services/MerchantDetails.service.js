import axios from "axios";

class MerchantDetails {
  getSummery(token) {
    console.log('service token', token)
    return axios.get(
      `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/summary?token=${token}`
    );
  }
}

export default new MerchantDetails();
