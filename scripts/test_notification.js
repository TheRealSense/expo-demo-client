// @flow
import stream from 'getstream';
import type { UserSession, CloudClient } from '../types';

async function main() {
  // let apiKey = process.env['STREAM_API_KEY'] || '';
  // let apiSecret = process.env['STREAM_API_SECRET'] || '';
  // let appId = process.env['STREAM_APP_ID'] || '';
  // let apiUrl = process.env['STREAM_API_URL'];

  let apiKey = '6hwxyxcq4rpe';
  let appId = '35808';
  let apiSecret =
    '8mdkn9n6vqe4dngtjznnm66n2e9vq3x6a2ep5e82gdxntbqbftmqmtxwqee47rjt';

  console.log(apiKey, apiSecret);
  let client: CloudClient = stream.connectCloud(apiKey, appId, {
    // urlOverride: {
    //   api: apiUrl,
    // },
    keepAlive: false,
  });

  function createUserSession(userId): UserSession {
    return client.createUserSession(
      stream.signing.JWTUserSessionToken(apiSecret, userId),
    );
  }

  let tripheo2410 = createUserSession('tripheo2410');
  let content = 'test2';
  console.log(await tripheo2410.feed('notification').get({ limit: 1 }));
  await tripheo2410.feed('notification').addActivity({
    actor: tripheo2410.user,
    verb: 'post',
    object: content,

    content: content,
  });
  console.log(await tripheo2410.feed('notification').get({ limit: 1 }));
}
main();
