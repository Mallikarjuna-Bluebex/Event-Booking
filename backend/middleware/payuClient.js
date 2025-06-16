// utils/payuClient.js
import axios from'axios';
import crypto from 'crypto';

const PAYU_KEY = process.env.MERCHANT_KEY;
const PAYU_SALT = process.env.MERCHANT_SALT;

const generateHash = (key, command, var1, salt) => {
  const hashString = `${key}|${command}|${var1}|${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

const verifyPayment = async (txnid) => {
  console.log("txnId: ",txnid);
  const command = 'verify_payment';
  const hash = generateHash(PAYU_KEY, command, txnid, PAYU_SALT);

  const payload = new URLSearchParams({
    key: PAYU_KEY,
    command,
    hash,
    var1: txnid,
  });

  const PAYU_VERIFY_URL = 'https://test.payu.in/merchant/postservice?form=2';

  try {
    const response = await axios.post(PAYU_VERIFY_URL, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return typeof response.data === 'string'
      ? JSON.parse(response.data)
      : response.data;
  } catch (error) {
    console.error('PayU verify error:', error.response?.data || error.message);
    throw error;
  }
};

export { verifyPayment };