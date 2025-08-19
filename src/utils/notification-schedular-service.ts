// import { IPushNotification } from "../models/push-notification/push-notification-model";
// import { pushNotificationRepository, userRepository } from "../repositories";
// import * as cron from 'node-cron';
// import FirebaseService from "./firebase-service";
// const timeZone = 'Asia/Kolkata'; // Specify your desired time zone

// let scheduledJobs: { [key: string]: cron.ScheduledTask } = {};

// async function notificationSchedular(): Promise<void> {
//     scheduledJobs = {};
//     try {

//         let activeNotifications = await pushNotificationRepository.getAllActiveNotifications();
//         if (activeNotifications && activeNotifications.length) {
//             //let promises = [];

//             activeNotifications.forEach((notification) => {
//                 scheduleNotification(notification);
//             });
//         }

//     } catch (e) {
//         console.log(e)
//     }
// }

// const scheduleNotification = (notification: IPushNotification) => {
//     const { _id, time, fromDate, toDate, interval, paused } = notification;

//     if (paused) {
//         console.log(`Notification ${_id} is paused.`);
//         scheduledJobs[_id as string].stop();
//         delete scheduledJobs[_id as string];
//         return;
//     }
//     const now = new Date();
//     // Ensure the notification is within the date range
//     if (new Date(fromDate) > now || (toDate && new Date(toDate) < now)) {
//         console.log(
//             `Notification ${_id} is outside the date range.`
//         );
//         return;
//     }

//     const [hour, minute] = time.split(":").map(Number);

//     // Calculate the cron expression for day intervals
//     const cronExpression =
//         interval === 0
//             ? `0 ${minute} ${hour} * * *` // Daily
//             : `0 ${minute} ${hour} */${interval + 1} * *`; // For intervals

//     // Cancel any existing job for this notification
//     if (scheduledJobs[_id as string]) {
//         scheduledJobs[_id as string].stop();
//     }

//     scheduledJobs[_id as string] = cron.schedule(cronExpression, () => {
//         const now = new Date();

//         if (toDate && new Date(toDate) < now) {
//             console.log(`Notification ${_id} expired.`);
//             scheduledJobs[_id as string].stop();
//             delete scheduledJobs[_id as string];
//             return;
//         }
//         sendNotification(notification);
//     },
//         {
//             scheduled: true,
//             timezone: timeZone,
//         }
//     );

//     console.log(
//         `Notification ${_id} scheduled with cron: ${cronExpression}, interval: ${interval}`
//     );
// }

// const sendNotification = async (notification: IPushNotification) => {
//     let recipientTokens: string[] = [];
//     //if (notification.recipients.includes('all')) {
//         let userType = 'all';
//         recipientTokens = await userRepository.getFCMTokens(userType);
//     //}
//     const firebaseService = new FirebaseService();
//     //console.log(firebaseService, recipientTokens)
//     await firebaseService.sendPushNotification(recipientTokens, notification.title, notification.description, notification.link, notification.imageUrl);
// }

// const removeNotification = (notification: IPushNotification) => {
//     const { _id } = notification;

//     if (_id) {
//         console.log(`Notification ${_id} is removed.`);
//         scheduledJobs[_id as string].stop();
//         delete scheduledJobs[_id as string];
//         return;
//     }
// }

// export {
//     notificationSchedular,
//     scheduleNotification,
//     removeNotification
// }