const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors")({origin: true});
const app = express();
require("dotenv").config();
app.use(cors);
app.use(express.urlencoded({extended: false}));
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X_CERT_URL,
};
let gen = "";
let age = "";
let first = true;
let nickname = null;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "http://localhost:5001/peoplevoice-fcea9/asia-northeast1/app",
});

const request = require("request-promise");

const kakaoRequestMeUrl =
  "https://kapi.kakao.com/v2/user/me?secure_resource=true";

/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {String} kakaoAccessToken Access token retrieved by Kakao Login
 * @return {Promiise<Response>}      User profile response in a promise
 */
function requestMe(kakaoAccessToken) {
  console.log("Requesting user profile from Kakao API server.");
  return request({
    method: "GET",
    headers: {Authorization: "Bearer " + kakaoAccessToken},
    url: kakaoRequestMeUrl,
  });
}

/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param  {String} userId        user id per app
 * @param  {String} email         user's email address
 * @param  {String} displayName   user
 * @param  {String} gender      profile photo url
 * @param  {String} age
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
function updateOrCreateUser(userId, email, displayName) {
  console.log("updating or creating a firebase user");
  const updateParams = {
    provider: "KAKAO",
    displayName: displayName,
  };
  if (displayName) {
    updateParams["displayName"] = displayName;
  } else {
    updateParams["displayName"] = email;
  }
  console.log(updateParams);
  return admin
      .auth()
      .updateUser(userId, updateParams)
      .then((first = false))
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          first = true;
          updateParams["uid"] = userId;
          if (email) {
            updateParams["email"] = email;
          }
          return admin.auth().createUser(updateParams);
        }
        throw error;
      });
}

/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {String} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<String>}                  Firebase token in a promise
 */
function createFirebaseToken(kakaoAccessToken) {
  return requestMe(kakaoAccessToken)
      .then((response) => {
        const body = JSON.parse(response);
        console.log(body);
        const userId = `kakao:${body.id}`;
        if (body.properties) {
          nickname = body.properties.nickname;
        }
        if (!body.kakao_account.has_age_range) {
          age = "no";
        } else {
          age = body.kakao_account.age_range;
        }
        if (!body.kakao_account.has_gender) {
          gen = "no";
        } else {
          gen = body.kakao_account.gender;
        }
        console.log(gen);
        console.log(age);
        return updateOrCreateUser(userId, body.kakao_account.email, nickname);
      })
      .then((userRecord) => {
        console.log(userRecord);
        const userId = userRecord.uid;
        console.log(`creating a custom firebase token based on uid ${userId}`);
        return admin.auth().createCustomToken(userId, {provider: "KAKAO"});
      });
}
/**
 * deleteUser - delete in firebase authification
 *
 * @param  {String} userid access auth
 * @return {Promise<String>}     empty promise
 */
function deleteUser(userid) {
  return admin.auth().deleteUser(userid);
}

app.post("/login", function(req, res) {
  const token = req.body.token;
  console.log("hi");
  console.log(token);
  if (!token) {
    res
        .header("Access-Control-Allow-Origin", "*")
        .status(400)
        .send({error: "There is no token."});
  } else {
    console.log(`Verifying Kakao token: ${token}`);
    createFirebaseToken(token).then((firebaseToken) => {
      console.log(`Returning firebase token to user: ${firebaseToken}`);
      res.header("Access-Control-Allow-Origin", "*").status(200).send({
        firebase_token: firebaseToken,
        gender: gen,
        age: age,
        first: first,
        nickname: nickname,
      });
    });
  }
});
app.post("/fix", function(req, res) {
  const uid = req.body.uid;
  const name = req.body.nick;
  const email = req.body.email;
  console.log(uid);
  if (!uid || !name) {
    res
        .header("Access-Control-Allow-Origin", "*")
        .status(400)
        .send({error: "There is no uid or name."});
  } else {
    console.log(`Changing ${uid}'s name: ${name}`);
    updateOrCreateUser(uid, email, name).then(() => {
      res
          .header("Access-Control-Allow-Origin", "*")
          .status(200)
          .send({win: "정상변경 완료되었습니다."});
    });
  }
});
app.post("/delete", function(req, res) {
  const uid = req.body.uid;
  if (!uid) {
    res
        .header("Access-Control-Allow-Origin", "*")
        .status(400)
        .send({error: "There is no uid."});
  } else {
    console.log(`Deleting Auth: ${uid}`);
    deleteUser(uid).then(() => {
      res
          .header("Access-Control-Allow-Origin", "*")
          .status(200)
          .send({win: "정상적인 삭제가 완료되었습니다."});
    });
  }
});

exports.app = functions.region("asia-northeast1").https.onRequest(app);
