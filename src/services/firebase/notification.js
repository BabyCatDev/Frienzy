import axios from 'axios';

export const sendNotification = async ({
    tokens, title, message
}) => {
    return axios.post(`https://sendhttppushnotification-ea5ezd33ta-uc.a.run.app`, {
        tokens,
        title,
        message
    }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(`SMS fcm notification successfully:`, tokens, response.data);
      }).catch((error) => {
        console.log(`Error sending fcm:`, error);
      });
}