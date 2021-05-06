import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe(
//   'pk_test_51IWNL3JMGciq6dxqMnbSC6S7Sa15oelmIKAEPuQ3E31c7rHhpzJVSMvZsIDcFksrPb8KN3aDnYamqoe46bIlVnMW00nC7lvWaY'
// ); pass Stripe const inside the export const buyProducts

export const buyProduct = async (menId) => {
  const stripe = Stripe(
    'pk_test_51IWNL3JMGciq6dxqMnbSC6S7Sa15oelmIKAEPuQ3E31c7rHhpzJVSMvZsIDcFksrPb8KN3aDnYamqoe46bIlVnMW00nC7lvWaY'
  );
  try {
    // 1) Get (The session ) checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${menId}`
    );
    console.log(session);

    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    if (res.success) {
      delete req.session.cart;
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

