var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    //Cuando ocurre una petición GET a la app con uri /notes/<id>
    app.get('/notes/:id', function (req, res) {
        const id = req.params.id;
        const details = { '_id' : new ObjectID(id) };

        //Buscamos registro en coleccion "notes"
        db.collection('notes').findOne(details, (err, item) => {
            if (err) {
                res.send({'error' : 'An error has occurred'});
            } else{
                res.send(item);
                console.log('Note "'+details._id+'" was returned.');
            }
        });
    });

    //Cuando ocurre una petición POST a la app con la uri /notes:
    app.post('/notes', (req, res) => {
        
        const note = { text: req.body.body, title: req.body.title };
        
        db.collection('notes').insert(note, (err, result) => {
            if (err) { 
                res.send({ 'error': 'An error has occurred' });
                console.log("Error while saving note. "+err.body); 
            } else {
                res.send(result.ops[0]);
                console.log('New note "'+note.title+'" was created.');
            }
        });
    });

    //Cuando ocurre una petición DELETE con la uri /notes/:id
    app.delete('/notes/:id', (req,res) => {
        const id = req.params.id;
        const details = { '_id' : new ObjectID(id) };
        db.collection('notes').remove(details, (err,item) =>{
            if (err) {
                res.send({'error' : 'An error has occurred'});
                console.log('Note "'+id+'" could not be deleted.');                
            } else {
                res.send('Note '+id+' deleted.');
                console.log ('Note '+id+' deleted.');
            }
        });   
    });

    //Cuando ocurre una petición UPDATE(PUT) con la uri /notes/:id
    app.put('/notes/:id', (req, res) => {
        const id = req.params.id;
        if (id.length === 24  ) { const details = { '_id' : new ObjectID(id) }; } 
        else {             
            res.send({'error' : 'Invalid id format.'});
            console.log('ERR\tInvalid id format.');            
        }
        const note = { text : req.body.body, title : req.body.title };

        if (note == null ) {
            res.send({'error' : 'Note was null.'});
            console.log('ERR\tNote was null.');
        } else if (note.text == null || !note.text || note.title == null || !note.title ){
            res.send({'error' : 'Note text or title were null.'});
            console.log('ERR\tNote text or title were null.');
        } else {
            db.collection('notes').update(details, note,  (err, item) =>{
                if (err) {
                    res.send({'error' : 'An error has occurred'});
                    console.log('ERR\tNote "'+id+'" could not be updated.');
                } else {
                    res.send('Note '+id+' updated.');
                    console.log ('Note '+id+' updated.');
                }
            });
        }           
    });
};