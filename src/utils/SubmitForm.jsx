import React from 'react'

const SubmitForm = ({redirectUrl, myData}) => {
  
  return (
    <div>
      <form
        name="paymentSummary"
        id="paymentSummary"
        action={redirectUrl.merchant.redirect_urls.success}
        method="POST"
      >
        <input
          type="hidden"
          name="transaction_id"
          id="transaction_id"
          value={myData.transaction_id}
        />
        <input
          type="hidden"
          name="order_id"
          id="order_id"
          value={myData.order_id}

        />
        <input
          type="hidden"
          name="bill_amount"
          id="bill_amount"
          value={myData.received_amount}

        />
        <input
          type="hidden"
          name="customer_account_no"
          id="customer_account_no"
          value={myData.customer_account_no}

        />
        <input
          type="hidden"
          name="status"
          id="status"
          value={myData.status}

        />
        <input
          type="hidden"
          name="received_at"
          id="received_at"
          value={myData.received_at}

        />
      </form>
    </div>
  )
}

export default SubmitForm
