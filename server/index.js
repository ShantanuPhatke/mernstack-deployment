const express = require("express");
const app = express();
var cors = require('cors');
const mongoose = require("mongoose");
const FriendModel = require("./models/Friends");
require("dotenv").config();

app.use(cors());

/// DATABASE CONNECTION
mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@mern.shkwo.mongodb.net/mern-deployment?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

app.get("/addfriend", async (req, res) => {
  const name = req.body.name;
  const contact = req.body.contact;

  const friend = new FriendModel({ name: name, contact: contact });
  await friend.save();

  res.send("Success");
});

app.get("/read", async (req, res) => {
  FriendModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update", async (req, res) => {
  const newContact = req.body.contact;  
  const id = req.body.id;

  try {
    await FriendModel.findById(id, (error, friendToUpdate) => {
      friendToUpdate.contact = Number(newContact);
      friendToUpdate.save();
    })
  } catch (err) {
    console.log(err);
  }

  res.send("Updated");
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await FriendModel.findByIdAndRemove(id).exec();
  
  res.send("ItemDeleted");
})

app.listen(process.env.PORT || 3001, () => {
  console.log("You are connected!");
});
