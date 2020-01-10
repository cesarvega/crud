const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require("../secret/sa.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
}, "about");

const db = admin.firestore();

const RouteData = {"collection_name" : "about"};

router.post("/", (req, res) => {
	if (!(req.body.data && req.body.id)) {
		res.send({"err" : true, "msg" : "input data missing. id and data is required"});
		return;
	}
	try {
		data = JSON.parse(req.body.data);
		if (Array.isArray(data)) {
			res.send({"err" : true, "msg" : "Array can not be argument"});
			return;
		}
	}
	catch {
		res.send({"err" : true, "msg" : "invalid JSON format"});
		return;
	}
	db.collection(RouteData.collection_name).doc(req.body.id).set(data).then(res_ => {
		res.send({"msg" : "data updated"});
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	});
});

router.get("/", (req, res) => {
	db.collection(RouteData.collection_name).doc(req.query.id).get().then(doc => {
		data = doc.data();
		if (data.data)
			data = data.data;
		res.send(data);
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	});
});

module.exports = router;