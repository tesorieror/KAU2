q.fcall(function(){console.log('Start');})
.then(
		function(data, err){
			return q.nfcall(TagCategory.connect);
		}
)
.then(function(model, err){return q.ninvoke(model, "find");})
.then(logp)
.then(function(data, err){
	if(err) 
		throw err; 
	else 
		console.log("End");
		return data;
	})
.done();


function logp(data, err){
	if (err) {console.error(err); throw err;} else {console.log(data); return data;}
}