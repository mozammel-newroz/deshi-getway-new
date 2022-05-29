import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import Countdown from "react-countdown";
import { useSnackbar } from "react-simple-snackbar";

import logo from "../../logo.svg";
import sharetrip from "../../sharetrip.svg";
import { useForm } from "react-hook-form";
import qr from "../../QR.svg";
import "./Login.css";

import MerchantDetailsApi from "../../services/MerchantDetails.service";
import LoginToPay from "../../services/LoginToPay.service";
import SendOtpService from "../../services/SendOtp";
import VerifyOtpService from "../../services/VerifyOtp";

import { pusherChanelForQR } from "../../utils/pusher";
import ErrorShow from "../ErrorShow";
import TimeCountdown from "../TimeCountdown";

const Login = () => {
  const [currentPage, setCurrentPage] = useState("MobileNumber");
  const [mobileNum, setMobileNum] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  // start my code
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({});
  const [pay_type, set_pay_type] = useState("login");
  const [countDownValue, setCountDownValue] = useState(300000);
  const [errorToken, setErrorToken] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // end my code
  const [openSnackbar, closeSnackbar] = useSnackbar({
    position: "top-right",
    style: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      fontSize: "16px",
      textAlign: "center",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [payMethod, setPayMethod] = useState("LoginToPay");

  const numericOnly = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (currentPage === "MobileNumber") {
      setMobileNum(value);
    } else if (currentPage === "Otp") {
      setOtp(value);
    } else {
      setPin(value);
    }
  };

  function confirmNum(mobileNum) {
    if (mobileNum.length === 10) {
      setCurrentPage("Otp");
    }
  }

  function confirmOtp(otp) {
    if (otp.length === 6) {
      setCurrentPage("Pin");
    }
  }

  function confirmPin(pin) {
    if (pin.length === 4) {
      setCurrentPage("Pin");
    }
  }

  // start my code

  const fetchData = async () => {
    // setLoader(true);
    try {
      const url = window.location;
      const token = new URLSearchParams(url.search).get("token");
      console.log("login screen", token);

      const res = await MerchantDetailsApi.getSummery(token);
      console.log("get summery", res);
      const curtime = parseInt(countDownValue);

      if (res.data.code === 200) {
        console.log("code", res.data.code);
        // let time = moment().unix();
        let time = Date.now();

        setCurrentTime(time);
        console.log("my time", time);

        // setLoader(false);
        // setStatus(200);
        // setMerchantSummery(res.data.data);
        // setQrString(res.data.data);
        let merchantSummery = res.data.data;
        console.log("summary:", merchantSummery);
        setSummary(merchantSummery);

        setOrderId(res.data.data.order.id);

        pusherChanelForQR(
          merchantSummery.order.event,
          merchantSummery.order.channel,
          merchantSummery,
          pay_type
        );

        setTimeout(() => {
          console.log(res.data.data);
          window.location.assign(res.data.data.merchant.redirect_urls.cancel);
        }, curtime);
      } else {
        setErrorToken(true);
        console.log("else code", res.data.code);
        // setLoader(false);
      }
    } catch (error) {
      console.log("error code", error.response.data.code);

      openSnackbar(error.response.data.messages[0]);
      setErrorToken(true);
    }
  };

  const sendOtp = async () => {
    setLoading(true);

    const url = window.location;
    const token = new URLSearchParams(url.search).get("token");
    const payload = {
      order_id: summary.order.id,
      token,
      mobile_number: `+880${mobileNum}`,
    };
    console.log("payload send otp", payload);

    try {
      let res = await axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/send-otp`,
        payload
      );
      // openSnackbar("else", res);
      if (res.data.code === 200) {
        setCurrentPage("Otp");
        console.log("res", res);
      } else {
        openSnackbar(res.data.messages[0]);
      }
    } catch (error) {
      let err = error.response.data?.errors?.mobile_number[0];
      if (err) {
        openSnackbar(err);
      } else {
        let err2 = error.response?.messages?.messages[0];
        openSnackbar(err2);
      }
    }

    setLoading(false);
  };

  const VerifyOtp = async () => {
    setLoading(true);

    const url = window.location;
    const token = new URLSearchParams(url.search).get("token");
    const payload = {
      order_id: summary.order.id,
      token,
      mobile_number: `+880${mobileNum}`,
      otp: otp,
    };

    try {
      let res = await axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/verify-otp`,
        payload
      );
      if (res.data.code === 200) {
        setCurrentPage("Pin");
        console.log("res", res);
      } else {
        openSnackbar(res.data.messages[0]);
      }
    } catch (error) {
      console.log("ddddd", error.response.data.messages);
      let err = error.response.data?.errors?.otp[0];
      if (err) {
        openSnackbar(err);
      } else {
        let err2 = error.response.data.messages[0];
        openSnackbar(err2);
      }
    }
    setLoading(false);
  };

  const onSubmit = async () => {
    setLoading(true);

    const url = window.location;
    const token = new URLSearchParams(url.search).get("token");
    const payload = {
      order_id: summary.order.id,
      token,
      mobile_number: `+880${mobileNum}`,
      otp: otp,
      pin: pin,
    };

    try {
      let res = await axios.post(
        `${process.env.REACT_APP_PAYMENT_GATWAY_URL}/execute`,
        payload
      );
      if (res.data.code === 200) {
      } else {
        openSnackbar(res.data.messages[0]);
      }
    } catch (error) {
      let err = error.response.data.messages[0];
      openSnackbar(err);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    let order_id = localStorage.getItem("cancel_order_id");
    let c_url = new URL(summary.merchant.redirect_urls.cancel);
    c_url.searchParams.append("order_id", order_id);
    console.log("url", order_id, c_url);
    window.location.assign(c_url);
  };

  const Completionist = () => <span>Your time is over</span>;

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          This page will timed out in {minutes} minutes {seconds} seconds
        </span>
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // end my code

  return (
    <>
      {!errorToken ? (
        <div className="gateway">
          <div className="form-signin">
            <form>
              {/* Header    */}

              <div className="container header p-4 py-3">
                <div className="top-left">
                  <img src={sharetrip} className="me-3" alt="merchant logo" />
                  <div className="mt-3 lh-sm">
                    <h5 className="custom-title">ShareTrip Limited</h5>
                    <p className="text-secondary order-id">
                      Order ID: {summary?.order?.id}
                    </p>
                  </div>
                </div>
                <h3 className="fs-24">
                  {/* ৳ 5,000 */}
                  {summary?.order?.total_payable?.currency}{" "}
                  {summary?.order?.total_payable?.amount}
                </h3>
              </div>

              <div className="container main text-center pt-4 p-4 ">
                {currentPage === "MobileNumber" && (
                  <div>
                    <p className="payment-method">How would you like to pay?</p>
                    <div className="d-flex p-1 border border-1">
                      <button
                        type="submit"
                        className={`w-50 btn login-or-qr rounded-0 py-2 fs-4 fw-600 ${
                          payMethod === "LoginToPay" ? "active" : ""
                        }`}
                        onClick={() => {
                          setPayMethod("LoginToPay");
                          set_pay_type("login");
                        }}
                      >
                        Login to Pay
                      </button>
                      <button
                        type="submit"
                        className={`w-50 btn login-or-qr rounded-0 py-2 fs-4 fw-600 ${
                          payMethod === "ScanQR" ? "active" : ""
                        }`}
                        onClick={() => {
                          setPayMethod("ScanQR");
                          set_pay_type("qr");
                        }}
                      >
                        Scan QR Code
                      </button>
                      {/* <input type="submit" className="w-50 btn btn-loginToPay rounded-0 py-2 fs-4" value="Login to Pay" />
                                <input type="submit" className="w-50 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4" value="Scan QR Code" /> */}
                    </div>
                  </div>
                )}

                {currentPage === "MobileNumber" &&
                  payMethod === "LoginToPay" && (
                    <p className="fs-18 mt-4">Your Deshi Account Number</p>
                  )}
                {currentPage === "Otp" && (
                  <p className="fs-18">6-digit code sent to {0 + mobileNum}</p>
                )}
                {currentPage === "Pin" && (
                  <p className="fs-18">Enter Your PIN</p>
                )}

                {/* Input Field */}

                {currentPage === "MobileNumber" && payMethod === "LoginToPay" && (
                  <div className="d-flex w-100">
                    <div className="w-20 me-1">
                      <select
                        className="form-select py-3 fw-500"
                        aria-label="Default select example"
                      >
                        <option>+880</option>
                      </select>
                    </div>

                    <div className="form-floating mb-3 text-success w-80">
                      {/* <select><option>+880</option></select> */}
                      <input
                        name="phone"
                        type="tel"
                        className="form-control number"
                        id="phone"
                        autoComplete="off"
                        placeholder="Mobile number"
                        maxLength="10"
                        pattern="[0-9]*"
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        required
                      />
                      <label htmlFor="phone">Mobile number</label>
                    </div>
                  </div>
                )}

                {currentPage === "Otp" && (
                  <div className="form-floating mb-3 text-success">
                    <input
                      name="otp"
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="OTP"
                      maxLength="6"
                      value={otp}
                      onChange={numericOnly}
                      required
                    />
                    {/* <input value={otp} onChange={handleChange} /> */}
                    <label htmlFor="otp">OTP</label>
                  </div>
                )}
                {currentPage === "Pin" && (
                  <div className="form-floating mb-3 text-success">
                    <input
                      name="pin"
                      type="password"
                      className="form-control"
                      id="pin"
                      placeholder="PIN"
                      maxLength="4"
                      value={pin}
                      onChange={numericOnly}
                      required
                    />
                    <label htmlFor="pin">PIN</label>
                  </div>
                )}

                {currentPage === "MobileNumber" && payMethod === "LoginToPay" && (
                  <p className="fs-14 mb-2">
                    By clicking on <span className="fw-bold">Confirm,</span> You
                    are agreeing to the{" "}
                    <a href="#" className="text-body">
                      Terms & Conditions.
                    </a>{" "}
                  </p>
                )}
                {currentPage === "Otp" && (
                  <p className="fs-14 mb-2">
                    Didn't get the code?{" "}
                    <a href="#" className="text-body fw-500">
                      Resend
                    </a>{" "}
                  </p>
                )}
              </div>

              {payMethod === "ScanQR" && (
                <div className="d-flex justify-content-center pb-4">
                  {/* <img src={qr} className="w-75" alt="QR" /> */}
                  <QRCode
                    // className="w-75"
                    size={180}
                    value={summary.order.qr_text}
                  />
                </div>
              )}

              {/* Button */}

              {currentPage === "MobileNumber" && payMethod === "LoginToPay" && (
                <div className="d-flex">
                  <input
                    type="submit"
                    className="w-50 btn btn-lg button-close fw-bold text-white rounded-0 py-3 fs-4"
                    value="Close"
                  />
                  {!loading ? (
                    <input
                      className="w-50 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4"
                      value="Continue"
                      onClick={sendOtp}
                    />
                  ) : (
                    <div className="w-50 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4">
                      <Spinner
                        animation="border"
                        style={{ position: "relative", top: 10 }}
                      />
                    </div>
                  )}
                </div>
              )}
              {currentPage === "Otp" && (
                <div className="d-flex">
                  {!loading ? (
                    <input
                      className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4"
                      value="Continue"
                      onClick={VerifyOtp}
                    />
                  ) : (
                    <div className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4">
                      <Spinner
                        animation="border"
                        style={{ position: "relative", top: 5 }}
                      />
                    </div>
                  )}
                  {/* <input className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4 py-3" onClick={() => setCurrentPage("Pin")}>Confirm</input> */}
                </div>
              )}
              {currentPage === "Pin" && (
                <div className="d-flex">
                  {!loading ? (
                    <input
                      className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4"
                      value="Confirm"
                      onClick={onSubmit}
                    />
                  ) : (
                    <div className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4">
                      <Spinner
                        animation="border"
                        style={{ position: "relative", top: 5 }}
                      />
                    </div>
                  )}
                  {/* <input className="w-100 btn btn-lg btn-confirm fw-bold text-white rounded-0 fs-4 py-3" onClick>Confirm</input> */}
                </div>
              )}
              {payMethod === "ScanQR" && (
                <input
                  type="submit"
                  className="w-100 btn btn-lg button-close fw-bold text-white rounded-0 py-3 fs-4"
                  value="Close"
                  // onClick={handleCancel}
                />
              )}

              {/* footer */}

              <footer className="container text-secondary text-center py-3">
                <p style={{ marginBottom: 0, fontSize: 12, color: "#999" }}>
                  <Countdown
                    date={currentTime + countDownValue}
                    renderer={renderer}
                  ></Countdown>
                </p>
                Powered by <img src={logo} className="mb-2" alt="Deshi logo" />
              </footer>
            </form>
          </div>
        </div>
      ) : (
        <ErrorShow />
      )}
    </>
  );
};

export default Login;
