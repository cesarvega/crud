const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require("../secret/sa.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
}, "products");

const db = admin.firestore();

const RouteData = {"collection_name" : "products"};

router.post("/", (req, res) => {
	let data;
	if (!(req.body.data)) {
		res.send({"err" : true, "msg" : "input data missing. data is required"});
		return;
	}
	try {
		data = JSON.parse(req.body.data);
	}
	catch {
		res.send({"err" : true, "msg" : "invalid JSON format"});
		return;
	}
	if (!(data.id)) {
		res.send({"err" : true, "msg" : "input data missing. id is required"});
		return;
	}
	db.collection(RouteData.collection_name).doc(data.id).set(data).then(res_ => {
		res.send({"msg" : "data updated"});
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	});
});

router.get("/", (req, res) => {
	db.collection(RouteData.collection_name).get().then(docs => {
		let data = new Array();
		docs.forEach(doc => {
			data.push(doc.data());
		});
		res.send(data);
	}).catch(err => {
		res.send({err : true, msg : err});
	})
});

router.get("/:id", (req, res) => {
	let id = req.params.id;

	db.collection(RouteData.collection_name).doc(id).get().then(doc => {
		data = doc.data();
		if (data.data)
			data = data.data;
		res.send(data);
	}).catch(err => {
		res.send({"err" : true, "msg" : err});
	})
});

router.delete("/:id", (req, res) => {
	db.collection(RouteData.collection_name).doc(req.params.id).delete().then(() => {
		res.send({"msg" : "data deleted"});
	}).catch(err => {
		res.send({err : true, msg : err});
	})
});

module.exports = router;