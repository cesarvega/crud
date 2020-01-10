const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require("../secret/sa.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
}, "db_2");

const db = admin.firestore();

const RouteData = {"collection_name" : "dashboard_2"};

router.post("/", (req, res) => {
	if (!req.body.data) {
		res.send({"err" : true, "msg" : "no input data"});
		return;
	}
	try {
		data = JSON.parse(req.body.data);
		if (Array.isArray(data)) {
			data = {"data" : data};
		}
	}
	catch {
		res.send({"err" : true, "msg" : "invalid JSON format"});
		return;
	}
	db.collection(RouteData.collection_name).doc("db_data").set(data).then(res_ => {
		res.send({"msg" : "data updated"});
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	});
});

router.get("/", (req, res) => {
	db.collection(RouteData.collection_name).doc("db_data").get().then(doc => {
		data = doc.data();
		if (data.data)
			data = data.data;
		res.send(data);
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	})
});

router.delete("/", (req, res) => {
	db.collection(RouteData.collection_name).doc("db_data").delete().then(() => {
		res.send({"msg" : "data deleted"});
	}).catch(err => {
		res.send({err : true, msg : err});
	})
});

module.exports = router;