// public/js/services/CommentService.js
angular.module('CommentService', []).service('Comment',['$http','$q', function($http,$q) {
	var me = this;
	
	function setSubmitter(playerid){
		me.Submitter = playerid;
	}
	
	function setTarget(targetid,callback){
		me.Target = targetid;
		if(callback){callback();}
	}
	
	
	function getComments(callback) {
		// if the user has already been retrieved then do not do it again, just return the retrieved instance
		if (me.Target) {
			$http.get('/api/comments/'+me.Target).then(function(res){
			  // set the result to a field on the service

			  callback(res.data);

			});
		}
	}
	
	function submitComment(commentData, callback) {
		// if the user has already been retrieved then do not do it again, just return the retrieved instance
		if (me.Target && me.Submitter) {
			$http.post('/api/comments/',{'target': me.Target, 'commentData': commentData, 'submitter':me.Submitter}).then(function(res){
				
				if(callback){
					console.log(res);
					if(res.data.includes("Error")){callback(res);}
					else{callback();}
				}

			});
		}
	}
    return {
		submitComment:submitComment,
		getComments:getComments,
		setSubmitter:setSubmitter,
		setTarget:setTarget

	}
}]);