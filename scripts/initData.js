// @flow

import stream from 'getstream';
import faker from 'faker';

import type { UserSession, CloudClient } from '../types';

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  let apiKey = process.env.STREAM_API_KEY;
  let apiSecret = process.env.STREAM_API_SECRET;
  let appId = process.env.STREAM_APP_ID;
  if (!apiKey) {
    console.error('STREAM_API_KEY should be set');
    return;
  }

  if (!appId) {
    console.error('STREAM_APP_ID should be set');
    return;
  }

  if (!apiSecret) {
    console.error('STREAM_SECRET should be set');
    return;
  }

  let client: CloudClient = stream.connectCloud(apiKey, appId);

  function createUserSession(userId): UserSession {
    return client.createUserSession(
      stream.signing.JWTUserSessionToken(apiSecret, userId),
    );
  }

  let tripheo2410 = createUserSession('tripheo2410');
  let Epson = createUserSession('Epson');
  let a3dprinter = createUserSession('a3dprinter');
  let bowie = createUserSession('davidbowie');

  console.log('Add the following line to your .env file');
  console.log('STREAM_API_TOKEN=' + a3dprinter.token);

  await tripheo2410.user.getOrCreate({
    name: 'tripheo2410',
    url: 'tripheo0412@gmail.com',
    desc: 'Smart, violent and brutally tough solutions to crime.',
    profileImage: 'https://randomuser.me/api/portraits/men/18.jpg',
    coverImage:
      'http://colorfully.eu/wp-content/uploads/2012/10/empty-road-highway-with-fog-facebook-cover.jpg',
  });

  await Epson.user.getOrCreate({
    name: 'Epson',
    url: 'Epson.com',
    desc: 'Leader in printing',
    profileImage:
      'https://cdn6.bigcommerce.com/s-0204vzy/products/2548/images/7153/Epson__62225.1462563162.700.700.jpg?c=2',
    coverImage: '',
  });

  await a3dprinter.user.getOrCreate({
    name: 'Justice a3dprinter',
    profileImage:
      'https://images-na.ssl-images-amazon.com/images/I/81NadegaTkL._SX522_.jpg',
  });

  await bowie.user.getOrCreate({
    name: 'David Bowie',
    profileImage:
      'http://www.officialcharts.com/media/649820/david-bowie-1100.jpg?',
  });

  let randomUsers = [];
  let randomUsersPromises = [];
  for (let i = 0; i < 30; i++) {
    let session = createUserSession(`random-${i}`);
    randomUsers.push(session);
    randomUsersPromises.push(
      session.user.getOrCreate({
        name: faker.name.findName(),
        profileImage: faker.internet.avatar(),
        desc: faker.lorem.sentence(),
      }),
    );
  }
  await Promise.all(randomUsersPromises);

  await tripheo2410.followUser(Epson.user);
  await tripheo2410.followUser(bowie.user);
  await tripheo2410.followUser(a3dprinter.user);
  await a3dprinter.followUser(tripheo2410.user);
  await a3dprinter.followUser(Epson.user);
  await a3dprinter.followUser(bowie.user);

  let tripheo2410Activity = await tripheo2410.feed('user').addActivity({
    foreign_id: 'tripheo2410-3',
    time: '2018-08-13T01:23:47',

    actor: tripheo2410.user,
    verb: 'post',
    object: 'Hello everyone this is a test post',

    content: '',
  });

  let EpsonActivity = await Epson.feed('user').addActivity({
    foreign_id: 'Epson-3',
    time: '2018-07-19T13:23:47',

    actor: Epson.user,
    verb: 'comment',
    object: Epson.user,

    content: 'Great podcast with @getstream and @feeds! Thanks guys!',
  });

  let a3dprinterActivity = await a3dprinter.feed('user').addActivity({
    foreign_id: 'a3dprinter-2',
    time: '2018-07-19T13:15:12',

    actor: a3dprinter.user,
    verb: 'post',
    object: 'Introducing new a3dprinter',

    content: '',
    image: 'http://www.flashforge.com/wp-content/uploads/2016/07/Finder002.jpg',
  });
  let response;

  try {
    response = await bowie.storage('card').add('test', {
      title: '3d printer guide',
      description: 'This is a simple guide for 3d printing',
      url: 'https://www.wikihow.com/3D-Print-an-Object',
      image:
        'https://vignette.wikia.nocookie.net/h3h3/images/2/28/WikiHow_logo.png/revision/latest?cb=20171207052718',
    });
  } catch (e) {
    response = await bowie.storage('card').get('test');
  }

  let card = bowie.objectFromResponse(response);

  let bowieActivity = await bowie.feed('user').addActivity({
    foreign_id: 'bowie-2',
    time: '2018-07-19T13:12:29',

    actor: bowie.user,
    verb: 'repost',
    object: card,

    content: 'Great podcast with @getstream and @feeds! Thanks guys!',
  });

  let activities = [];
  for (let i = 1; i < 41; i++) {
    activities.push({
      foreign_id: 'filler-i',
      time: '2018-07-10T01:23:' + (60 - i),

      actor: tripheo2410.user,
      verb: 'post',
      object: 'filler number ' + i,

      content: 'filler number ' + i,
    });
  }
  await tripheo2410.feed('timeline').addActivities(activities);
  await tripheo2410.feed('notification').addActivities(activities);
  response = await tripheo2410.feed('timeline').get({
    withReactionCounts: true,
    withOwnReactions: true,
    withRecentReactions: true,
  });

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(5, 9).map((user, i) =>
        user.react('heart', tripheo2410Activity, {
          id: `random-heart-tripheo2410-3-${i}`,
          targetFeeds: [user.feed('notification', tripheo2410.user.id)],
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(8, 17).map((user, i) =>
        user.react('repost', tripheo2410Activity, {
          id: `random-repost-tripheo2410-3-${i}`,
          data: {
            text: 'The Joker is so dumb, hahaha!!!!' + i,
          },
          targetFeeds: [user.feed('notification', tripheo2410.user.id)],
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(11, 27).map((user, i) =>
        user.feed('notification', tripheo2410.user.id).addActivity({
          foreign_id: 'follow:tripheo2410-random-' + i,
          time: '2018-08-10T13:12:' + i,

          actor: user.user,
          verb: 'follow',
          object: tripheo2410.user,
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(1, 20).map((user, i) =>
        user.react('heart', EpsonActivity, {
          id: `random-heart-Epson-2-${i}`,
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(1, 5).map((user, i) =>
        user.react('repost', EpsonActivity, {
          id: `random-repost-Epson-2-${i}`,
          data: {
            text: 'best podcast ever!!!!' + i,
          },
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(7, 9).map((user, i) =>
        user.react('comment', EpsonActivity, {
          id: `random-comment-Epson-2-${i}`,
          data: {
            text: `Oh yeah! ${(user.user.data || {}).name ||
              'Unknown'} loves this!`,
          },
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(22, 26).map((user, i) =>
        user.react('heart', a3dprinterActivity, {
          id: `random-heart-a3dprinter-${i}`,
        }),
      ),
    ),
  );

  await ignore409(() =>
    Promise.all(
      randomUsers.slice(12, 19).map((user, i) =>
        user.react('comment', bowieActivity, {
          id: `random-comment-bowie-${i}`,
          data: {
            text: `${(user.user.data || {}).name ||
              'Unknown'} thinks this is the best podcast ever!`,
          },
        }),
      ),
    ),
  );

  await ignore409(async () => {
    await tripheo2410.react('heart', EpsonActivity, {
      id: `tripheo2410-heart-Epson-2`,
    });
  });
}
main();

async function ignore409(asyncfn) {
  try {
    await asyncfn();
  } catch (e) {
    if (
      !(e instanceof stream.errors.StreamApiError) ||
      e.response.statusCode != 409
    ) {
      throw e;
    }
  }
}
