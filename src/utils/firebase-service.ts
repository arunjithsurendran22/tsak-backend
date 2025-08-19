// import admin from '../config/firebase-config';
// import ERROR from '../middlewares/web_server/http-error';

// class FirebaseService {

//     sendPushNotification = async (tokens: string[], title: string, message: string, linkUrl: string, imageLink: string): Promise<void> => {
//         const batchSize = 500; // Maximum tokens in a single batch
//         const batches: string[][] = [];

//         // Split tokens into batches
//         for (let i = 0; i < tokens.length; i += batchSize) {
//             const batchTokens = tokens.slice(i, i + batchSize);
//             batches.push(batchTokens);
//         }

//         // Send batches in parallel
//         const sendPromises: Promise<any>[] = batches.map(async (batchTokens) => {
//             let payload: any = {
//                 notification: {
//                     title: title,
//                     body: message,
//                     image: imageLink
//                 },
//                 data: {
//                     openURL: linkUrl
//                 },
//                 tokens: batchTokens

//             };

//             try {
//                 const response = await admin.messaging().sendEachForMulticast(payload)
//                 console.log('Firebase::Successfully sent message:', response);
//                 // if(response && response.responses && response.responses.length){
//                 //     console.log(response.responses[0].error)
//                 // }
//                 return response;
//             } catch (error) {
//                 throw new ERROR.HttpError(`Error sending message: ${error}`);

//             }
//         });

//         // Wait for all batches to complete
//         try {
//             await Promise.all(sendPromises);
//         } catch (error) {
//             throw new ERROR.HttpError(`Error sending message: ${error}`);

//         }
//     };
// }

// export = FirebaseService;