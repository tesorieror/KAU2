	var t5 = function(){
		var deferred = q.defer();
		setTimeout(function(){console.log("5");deferred.resolve(5);},5000);
		return deferred.promise;
	}
	var t4 = 
	function(){
		var deferred = q.defer();
		setTimeout(function(){console.log("4");deferred.resolve(4);},4000);
		return deferred.promise;
	}
	var t3 = 
	function(){
		var deferred = q.defer();
		setTimeout(function(){console.log("3");deferred.resolve(3);},3000);
		return deferred.promise;
	}
	var t2 = 
	function(){
		var deferred = q.defer();
		setTimeout(function(){console.log("2");deferred.resolve(2);},2000);
		return deferred.promise;
	}
	var t1 = 
	function(){
		var deferred = q.defer();
		setTimeout(function(){console.log("1");deferred.resolve(1);},1000);
		return deferred.promise;
	}
	
	t5().then(t4).then(t3).then(t2).then(t1).then(function(){console.log('0')});