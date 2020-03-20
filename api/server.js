const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var Schema = mongoose.Schema;

//mongoose.set('debug',true);
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
    .connect(
        //'mongodb+srv://ivanov1502:mikelancelo1.@cluster0-q271w.mongodb.net/test?retryWrites=true&w=majority',
        'mongodb+srv://ivanov1502:mikelancelo1.@cluster0-q271w.mongodb.net/Ivanov?retryWrites=true&w=majority', 
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//define mongoose schema
var schemaName = new Schema({
    title: String
}, {
    collection: 'ivanov'
});

var IvanovModel = mongoose.model('IvanovModel', schemaName);


function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }

app.get("/posts", async (req, res) => {             
      
    let page = 1;
    let perPage = 25;
    let rangeMin = 0;
    let rangeMax = 24;
  
    if (req.query.range != 'undefined') {
      const range = req.query.range.replace('[','').replace(']','').split(',').map(x => x.trim());
      rangeMin = parseInt(range[0]);
      rangeMax = parseInt(range[1]);
      perPage = rangeMax - rangeMin + 1;
      page = rangeMin == 0 ? 1 : (rangeMax + 1) / perPage;
    }
    
    const options = {
      page: page,
      limit: perPage
    };

    let totalDocuments = 0;

    const skip = page > 0 ? ( ( page - 1 ) * perPage ) : 0;

    IvanovModel.countDocuments({}, function(err, result) {
        if (err) throw err;
        if (result) {            
            totalDocuments = parseInt(result);
        }
    });

    const aggregationResult = await IvanovModel.aggregate([
        {
            $addFields: {
              'id': '$_id' 
            }    
        },
        {
            $skip: skip
        },
        {
            $limit: perPage
        }
    ]);

    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Content-Range','posts '+ rangeMin + '-'+ rangeMax +'/'+ totalDocuments);
    res.send(aggregationResult);

    
    /*
    IvanovModel.find(
        {}, 
        function(err, result) {
            if (err) throw err;
            if (result) {               

                res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                res.setHeader('Content-Range','runners '+ rangeMin + '-'+ rangeMax +'/'+ totalDocuments);
                res.send(result);
            } else {
                res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                res.setHeader('Content-Range','runners 0-0/0');
                res.send([]);
            }
    })
    .skip(page > 0 ? ( ( page - 1 ) * perPage ) : 0)
    .limit(perPage)
    ;
    */
  });
  

const PORT = 7777;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
