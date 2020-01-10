const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require("../secret/sa.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
}, "user_media");

const db = admin.firestore();

const RouteData = {"collection_name" : "user_media"};

router.post("/", (req, res) => {
	if (!(req.body.data && req.body.id)) {
		res.send({"err" : true, "msg" : "input data missing. id and data is required"});
		return;
	}
	try {
		data = JSON.parse(req.body.data);
		data = {data : data};
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
	
	if (!req.query.id)  {
		res.send({"err" : true, "msg" : "id not given"});
		return;
	}

	db.collection(RouteData.collection_name).doc(req.query.id).get().then(doc => {
		data = doc.data();
		if (data.data)
			data = data.data;
		res.send(data);
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	})
});

router.delete("/", (req, res) => {
	db.collection(RouteData.collection_name).doc(req.query.id).delete().then(() => {
		res.send({"msg" : "data deleted"});
	}).catch(err => {
		res.send({err : true, msg : err});
	})
});

module.exports = router;