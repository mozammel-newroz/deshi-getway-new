import * as Pusher from "pusher-js";

export const pusherChanelForQR = (
  event,
  channelName,
  redirectUrl,
  pay_type
) => {
  const PUSHER_KEY = process.env.REACT_APP_PUSHER_KEY;
  const PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_KEY_CLUSTER;

  const pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
  });

  console.log("my pusher initial", event, channelName, redirectUrl);
  console.log("my pusher channel Name", channelName);
  localStorage.setItem("cancel_order_id", redirectUrl.order.id);

  let channel = pusher.subscribe(channelName);

  channel.bind(event, function (data) {
    console.log("my pusher");
    console.log("my pusher data", data);
    console.log("my my", data.data);
    console.log(
      "success url outside QR::",
      redirectUrl.merchant.redirect_urls.success
    );

    if (data.code === 200) {
      console.log(
        "success url: ",
        `${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`
      );
      let order_id = localStorage.getItem("order_id");

      console.log("my pusher data...", data.data);
      localStorage.setItem("transaction_id", data.data.gw_transaction_id);

      localStorage.setItem("transaction_id", data.data.gw_transaction_id);
      localStorage.setItem("order_id", data.data.merchant_order_id);
      localStorage.setItem(
        "customer_account_no",
        data.data.customer_account_no
      );
      localStorage.setItem("status", data.data.status);
      localStorage.setItem("received_amount", data.data.received_amount);
      localStorage.setItem("received_at", data.data.received_at);
      // console.log("my pusher data after", data);

      if (pay_type === "qr") {
        console.log("type", pay_type);
        console.log(
          "success url inside QR::",
          redirectUrl.merchant.redirect_urls.success
        );

        // console.log(
        //   "success url in: ",
        //   `${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`
        // );
        // window.location.assign(
        //   `${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`
        // );

        let question = redirectUrl.merchant.redirect_urls.success.includes("?");
        if (question) {
          window.location.assign(
            `${redirectUrl.merchant.redirect_urls.success}&order_id=${data.data.merchant_order_id}`
          );
        } else {
          window.location.assign(
            `${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`
          );
        }
      }

      if (pay_type === "login") {
        // console.log(
        //   "login form",
        //   `redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`
        // );

        let question = redirectUrl.merchant.redirect_urls.success.includes("?");
        if (question) {
          submitFORM(
            `${redirectUrl.merchant.redirect_urls.success}&order_id=${data.data.merchant_order_id}`,
            "POST",
            {
              transaction_id: data.data.gw_transaction_id,
              order_id: data.data.order_id,
              received_amount: data.data.received_amount,
              customer_account_no: data.data.customer_account_no,
              status: data.data.status,
              received_at: data.data.received_at,
            }
          );
        } else {
          submitFORM(
            `${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`,
            "POST",
            {
              transaction_id: data.data.gw_transaction_id,
              order_id: data.data.order_id,
              received_amount: data.data.received_amount,
              customer_account_no: data.data.customer_account_no,
              status: data.data.status,
              received_at: data.data.received_at,
            }
          );
        }

        // submitFORM(`${redirectUrl.merchant.redirect_urls.success}?order_id=${data.data.merchant_order_id}`, "POST", {
        //   transaction_id: data.data.gw_transaction_id,
        //   order_id: data.data.order_id,
        //   received_amount: data.data.received_amount,
        //   customer_account_no: data.data.customer_account_no,
        //   status: data.data.status,
        //   received_at: data.data.received_at,
        // });

        function submitFORM(path, method, params) {
          method = method || "post";

          var form = document.createElement("form");
          form.setAttribute("method", method);
          form.setAttribute("action", path);

          form._submit_function_ = form.submit;

          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", params[key]);

              form.appendChild(hiddenField);
            }
          }

          document.body.appendChild(form);
          form._submit_function_();
        }
      }

      // window.location.assign(
      //   `${redirectUrl.merchant.redirect_urls.success}?order_id=${order_id}`
      // );
    } else {
      // window.location.assign(redirectUrl.merchant.redirect_urls.fail);
    }
  });
};
