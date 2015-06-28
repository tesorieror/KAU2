
	var loadTagCategories = function(){		
		deferred = q.defer();
		var obj;
		fs.readFile('../data/tag-category.json', 'utf8', function (err, data) {
		  if (err) 
			  deferred.error(err);
		  else{
			  tagCategories = JSON.parse(data);
			  deferred.resolve(tagCategories);
		  }
		});
		return deferred.promise;
	};	
	
	var removeAllTagCategories = function(){
		var deferred = q.defer();
		presistence.TagCategory.remove({},function(err, results){
			if(err) 
				deferred.error(err); 
			else{
				// console.log(results, " removed!");
				deferred.resolve(results);
			}
		});
		return deferred.promise;
	 };

	var insertTagCategory = function(tc){
		var deferred = q.defer();
		var tagCategory = new presistence.TagCategory(tc);
		tagCategory.save(function (err, res){			 
			if(err){				
				deferred.reject(err);
			} else {
				// console.log(tc, " inserted!");
				deferred.resolve(res);
			}
		});
		return deferred.promise;
	};
	 	 
	var countTagCategories = function(){
		var deferred = q.defer();
		presistence.TagCategory.find({}, null, function(err, tcs){
			if (err) 
				deferred.reject(err);
			else{
				// console.log('Count', tcs.length);
				deferred.resolve(tcs);
			}
		});
		return deferred.promise;
	};
	
	var insertTagCategories = function(tcs){
		var calls = _.map(tcs, function(tc){
			return insertTagCategory(tc);
		});
		return q.all(calls);
	};
	
	var getTagCategoryByName = function(name){
		return function(){
			var deferred = q.defer();
			console.log("Category name:", name);
			
			presistence.TagCategory.find({name:name}, null, function(err, t){
				if (err) 
					deferred.reject(err);
				else{					
					deferred.resolve(t);
				}
			});
			return deferred.promise;
		}
	};	
	
	var log = function(data, err){		
		var deferred = q.defer();
		if (err){ 
			console.log("Error ", err);
			deferred.reject(err);
		}else{					
			console.log("Log ", data);
			deferred.resolve(t);
		}
		return deferred.promise;		
	}
	
	
	// countTagCategories().then(insertTagCategory).then(countTagCategories);
	
	
// countTagCategories()
// .then(removeAllTagCategories)
// .then(countTagCategories)
// .then(loadTagCategories)
// .then(insertTagCategories)
// .then(countTagCategories)
//	
// .then(getTagCategoryByName("IT"))
// .then(function(d){
// console.log("Ended!");
// console.log(d);
// });

	var tags;

	
	var loadTags = function(){	
		console.log('loading tags...');
		deferred = q.defer();
		var obj;
		fs.readFile('../data/tag.json', 'utf8', function (err, data) {
		  if (err) {
			  console.error(err);
			  deferred.reject(err);
		  } else{
			  tags = JSON.parse(data);
			  console.log(tags.length, ' tags loaded');
			  deferred.resolve(tags);
		  }
		});
		return deferred.promise;
	};
	
	var insertTag = function(t){
		var deferred = q.defer();
		getTagCategoryByName(t.category)().then(
			function (tc){			
				t.category = tc;
				var tag = new presistence.Tag(t);
				tag.save(function (err, res) {
					if(err){
						deferred.reject(err);
					} else {					
						deferred.resolve(res);
					}
				});
		});
		return deferred.promise;
	};
	 	 
	var countTags = function(){
		var deferred = q.defer();
		presistence.Tag.find({}, null, function(err, ts){
			if (err) 
				deferred.reject(err);
			else{
				console.log('Count', ts.length);
				deferred.resolve(ts);
			}
		});
		return deferred.promise;
	};
	
	var insertTags = function(ts){
		console.log("Insert Tags", ts.length);
		var calls = _.map(ts, function(t){
			return insertTag(t);
		});
		return q.all(calls);
	};
	
	var removeAllTags = function(){
		var deferred = q.defer();
		presistence.Tag.remove({},function(err, results){
			if(err) 
				deferred.error(err); 
			else
				deferred.resolve(results);
		});
		return deferred.promise;
	 };
	
	
	
	
	var getAllTags = function(){
		
	}
	
	countTags().then(loadTags).then(insertTags).then(countTags).then(removeAllTags).then(countTags);