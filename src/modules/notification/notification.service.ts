import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as schedule from 'node-schedule';
import { HistoryMetadataEntity } from '../histories/entities/histories_metadata.entity';
import { UserEntity } from '../users/entities/users.entity';

@Injectable()
export class NotificationService {
  sendMessage = (registrationToken: string): void => {
    const message = {
      notification: {
        title: 'Drink some water!',
        body: `Don't forget to drink water!`,
      },
      webpush: {
        notification: {
          icon: `images/glass-of-water.png`,
        },
      },
      token: registrationToken,
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  };

  scheduleThisJob = (
    user: UserEntity,
    historyMetadata: HistoryMetadataEntity,
  ) => {
    const vapidKey = user.vapidKey;
    if (!vapidKey) return;
    const date = new Date(historyMetadata.drinkAt);
    schedule.scheduleJob(historyMetadata.id, date, () => {
      this.sendMessage(vapidKey);
    });
  };

  cancelScheduleJob = (id: string) => {
    const myJob = schedule.scheduledJobs[id];
    if (myJob) {
      myJob.cancel();
    }
  };

  testNotification = (user: UserEntity, meta: HistoryMetadataEntity) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 5);
    meta.drinkAt = date;
    this.scheduleThisJob(user, meta);
  };
}
