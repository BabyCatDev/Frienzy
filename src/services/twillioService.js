import axios from 'axios';
import {decode, encode} from 'base-64';
const qs = require('qs');

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

const accountSid = 'AC849c35786d58d1b7f2f887014f704eb2';
const authToken = 'be6ff2e75c7258584e264e5e2bd9464f';
const fromNumber = '+16203198452';

export const sendInviteSMSToUsers = async (senderUser, groupId, toUsers) => {
  return Promise.all(
    toUsers.map(async (toUser) => {
      const message = `Dear ${toUser.name},\n` +
      `You are invited to be ${senderUser}'s friend on Frienzy, an app for group travel planning.\n` +
      `Please use this link to accept the invitation.\n` +
      `https://www.frienzy.io/invite/#${groupId}\n` +
      `Regards`;
      
      return axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, qs.stringify({
        Body: message,
        To: toUser.phone,
        From: fromNumber,
      }), {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((response) => {
        console.log(`SMS sent successfully to ${toUser.phone}:`, response.data);
      }).catch((error) => {
        console.log(`Error sending SMS to ${toUser.phone}:`, error);
      });
  }));
}