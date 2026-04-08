/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions, https} = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");
const hbsModule = require("nodemailer-express-handlebars");
const hbs = hbsModule.default || hbsModule;
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {getFirestore} = require("firebase-admin/firestore");
const crypto = require("crypto");

// Project-specific constants
const allowedOrigins = ["http://localhost:3000", "https://orto-blog.vercel.app"];
const FUNCTION_REGION = "australia-southeast1";
const PROJECT_ID = "orto-blog";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({
  maxInstances: 10,
  region: FUNCTION_REGION,
});

admin.initializeApp();
const db = getFirestore();

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_SMTP_SENDER, // Email address
    pass: process.env.NEXT_PUBLIC_EMAIL_SMTP_APP_PASS, // Gmail App Password
  },
});

const hbsOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
};

mailTransporter.use("compile", hbs(hbsOptions));

/**
 * Create sha256 hmac token for client side's link
 *
 * @param {string} id - The ID of the rating to be approved.
 * @return {string} A token that can be included in the approval link.
 */
function createApprovalToken(id) {
  const payload = Buffer.from(id, "utf8").toString("base64url");
  const signature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_EMAIL_APPROVE_SECRET)
      .update(payload)
      .digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Verify the approval token and extract the rating ID.
 *
 * @param {string} token - The approval token to verify.
 * @return {string} The ID of the rating to be approved.
 */
function verifyAndExtractId(token) {
  const parts = token.split(".");
  if (parts.length !== 2) {
    throw new Error("Invalid token format.");
  }

  const [payload, signature] = parts;
  const expectedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_EMAIL_APPROVE_SECRET)
      .update(payload)
      .digest("base64url");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error("Invalid token signature.");
  }

  return Buffer.from(payload, "base64url").toString("utf8");
}

/* On rating updated (approved), update the rating average and counter
 */
exports.updateRating = onDocumentUpdated("ratings/{id}", async (event) => {
  const evtSnapshot = event.data;
  console.log("Rating document updated with ID: ", event.params.id, " data:", event.data);

  if (!evtSnapshot) {
    console.error("No snapshot found for event:", event);
    return null;
  }

  // Find which title to update
  const title = evtSnapshot.after.data().title;
  if (!title) {
    console.error("No title found in snapshot for event:", event);
    return null;
  }

  // Find the document in rating_avg collection
  const ratingsAvgRef = db.collection("ratings_avg");

  // Find occurances in ratings collection
  try {
    const ratingsRef = db.collection("ratings").where("title", "==", title).where("status", "==", "approved");

    const aggrQuery = ratingsRef.aggregate({
      totalRating: admin.firestore.AggregateField.sum("rating"),
      averageRating: admin.firestore.AggregateField.average("rating"),
    });

    const cntSnapshot = await ratingsRef.count().get();
    const aggrSnapshot = await aggrQuery.get();
    const snapshot = {
      ...cntSnapshot.data(),
      ...aggrSnapshot.data(),
    };

    return ratingsAvgRef.doc(title).set({
      total: snapshot.totalRating,
      average: snapshot.averageRating,
      count: snapshot.count,
    });
  } catch (error) {
    console.error("Error updating rating average for title:", title, "Error:", error);
    return null;
  }
});

/*
 * Get ratings_avg for all titles
 */
exports.getRatingsAvg = https.onRequest({cors: allowedOrigins}, async (request, response) => {
  try {
    const ratingsAvgRef = db.collection("ratings_avg");
    const snapshot = await ratingsAvgRef.get();
    const ratingsAvg = {};
    snapshot.forEach((doc) => {
      ratingsAvg[doc.id] = doc.data();
    });
    // Set max-age cache for 1 hour
    response.set("Cache-Control", "public, max-age=3600");
    response.status(200).json({message: "Ratings fetched scuccessfully.", data: ratingsAvg});
  } catch (error) {
    console.error("Error fetching ratings average:", error);
    response.status(500).json({message: "Internal server error."});
  }
});

/* On new rating created, send email to admin for approval
 */
exports.sendEmail = onDocumentCreated("ratings/{id}", async (event) => {
  const id = event.params.id;
  const snapshot = event.data;

  if (!snapshot) {
    console.error("No snapshot found for event:", event);
    return null;
  }

  const data = snapshot.data();
  console.log("New rating created with ID:", id, "and data:", data);
  const token = encodeURIComponent(createApprovalToken(id));
  const approvalBaseUrl =
    `https://${FUNCTION_REGION}-${PROJECT_ID}.cloudfunctions.net`;
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL_SMTP_SENDER,
    to: process.env.NEXT_PUBLIC_EMAIL_SMTP_RECIPIENT,
    template: "rating", // match the name of handlebars files
    subject: `[ORTO] New Rating for ${data.title} from ${data.name}`,
    context: {
      name: `${data.name} (${data.email})`,
      title: data.title,
      createdAt: data.createdAt.toDate().toLocaleString(),
      rating: data.rating,
      ease_of_use: data.ease_of_use,
      expectation: data.expectation,
      setup_difficulty: data.setup_difficulty,
      usefulness: data.usefulness,
      comments: data?.comments || "N/A",
      approvalLink: `${approvalBaseUrl}/approveRating?token=${token}`,
    },
  };
  return mailTransporter.sendMail(mailOptions);
});

exports.approveRating = https.onRequest(async (request, response) => {
  try {
    const token = request.query.token || request.body?.token;
    if (!token || typeof token !== "string") {
      response.status(400).json({message: "Invalid approval token."});
      return;
    }

    const id = verifyAndExtractId(token);
    const ratingRef = admin.firestore().collection("ratings").doc(id);
    const ratingDoc = await ratingRef.get();

    if (!ratingDoc.exists) {
      response.status(404).json({message: "Rating not found."});
      return;
    }

    await ratingRef.update({status: "approved"});
    response.status(200).json({message: "Rating approved successfully."});
  } catch (error) {
    console.error("Error approving rating:", error);
    response.status(500).json({message: "Internal server error."});
  }
});
