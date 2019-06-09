
module.exports = function (app, db) {
  var ObjectID = require('mongodb').ObjectID;


  /* GET SPA pure  html, our jQuery Mobile app */
  app.get('/', async function (req, res) {
    res.sendFile('mySPA.html', { root: __dirname });
  });

  //app.get('/notelist', async function (req, res) {
  app.get('/notelist', async function (req, res) {
    try {
      var doc = await db.collection('UserCollection3').find().toArray();
      Notes = doc;
      Notes.sort(compare);
      res.send(Notes);
    }
    catch (err) {
      console.log('get all failed');
      console.error(err);
    }
  });


  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }



  // /* GET New Note page. */  Do not need to ask server for new form page, our SPA has it!
  // app.get('/newnote', function (req, res) {
  //   res.render('newnoteJade', { title: 'Add New Note' });
  // });

  app.post('/addnote/', (req, res) => {
    // const note = {
    //   Priority: req.body.priority,
    //   Subject: req.body.subject,
    //   Description: req.body.description
    // };
    var newNote = req.body
    //newNote.subject = newNote.subject.replace(/\s*$/, '');//Remove trail space part.
    db.collection('UserCollection3').insertOne(newNote, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.sendStatus(200)
      }
    });
  });

  // // form to let user enter name to get details   Do not need to ask server for new form page, our SPA has it!
  // app.get('/notebysubject/', function (req, res) {
  //   res.render('notebysubjectJade', { title: 'Get more details, by Subject' });
  // });

  app.get('/findnote/:id', (req, res) => {    // was app.post)
    var whichname = req.params.id;

    //function search(nameKey, myArray) {
    //for (var i = 0; i < Notes.length; i++) {
    //  if (Notes[i].subject === whichSubject) {
    //    res.send(Notes[i]);
    //  }
    //}
    // }
    const details = { name: whichname };
    db.collection('UserCollection3').findOne(details, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        if (item == null) {
          item = {
            age: '99',
            name: 'No such note',
            yearborn: 'No such note'
          }
        }
        res.send(item);
      }
    });
  });

  app.delete('/deletenote/:id', (req, res) => {
    const id = req.params.id;
    //for (var i = 0; i < Notes.length; i++) {
    //  if (Notes[i].subject === id) {
    //    Notes.splice(i, 1);  // remove 1 element at loc i
    //    res.send('success');
    //  }
    //}

    const which = { 'name': id };  // delete by Subject
    db.collection('UserCollection3').deleteOne(which, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        console.log(item)
        res.send('success');
      }
    });
  });

  app.post('/updatenote/:id', (req, res) => {
    const name = req.params.id;
    const note = req.body;
    const newage = note.age;
    const newyearborn = note.yearborn
    const newname = note.name;
    var suggestion = note.suggestion;
    console.log(name)
    console.log(note)
    //const details = { '_id': new ObjectID(who_id) };  // not going to try and update by _id
    // wierd bson datatype add complications

    // if uddating more than one field: 
    //db.collection('UserCollection').updateOne({ username: who_id }, { $set: { "email": newEmail, "title": newTitle } }, (err, result) => {

    // updating age and/or yearborn, not name
    db.collection('UserCollection3').updateOne({ name: name }, { $set: { "age": newage, "name": newname, "yearborn": newyearborn, "description":suggestion } }, (err, result) => {
      if (err) {
        console.log(err)
        res.send({ 'error': 'An error has occurred' });
      } else {
        console.log(result)
        res.send("Success");
      }
    });
  });


};  // end of mod exports