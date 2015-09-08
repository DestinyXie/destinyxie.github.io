function FileProgress(file, targetID) {
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;

	this.fileProgressWrapper = $("#"+file.id);
	if (!this.fileProgressWrapper.length>0) {

		this.fileProgressWrapper = $('<div class="progressWrapper" id="'+file.id+'"></div>');

		this.fileProgressElement = $('<div class="progressContainer"></div>');

        this.fileProgressElement.html('<a class="progressCancel" href="#"> </a><div class="progressName">'+file.name+'</div><div class="progressBarStatus">&nbsp;</div><div class="progressBarInProgress"></div>');

		this.fileProgressWrapper.append(this.fileProgressElement);

		$("#"+targetID).append(this.fileProgressWrapper);
	} else {
		this.fileProgressElement = this.fileProgressWrapper.children('.progressContainer');
		this.reset();
	}

	this.height = this.fileProgressWrapper.outerHeight();
	this.setTimer(null);
}

FileProgress.prototype.setTimer = function (timer) {
	this.fileProgressElement["FP_TIMER"] = timer;
};
FileProgress.prototype.getTimer = function (timer) {
	return this.fileProgressElement["FP_TIMER"] || null;
};

FileProgress.prototype.reset = function () {
	this.fileProgressElement[0].className = "progressContainer";

	this.fileProgressElement[0].childNodes[2].innerHTML = "&nbsp;";
	this.fileProgressElement[0].childNodes[2].className = "progressBarStatus";
	
	this.fileProgressElement[0].childNodes[3].className = "progressBarInProgress";
	this.fileProgressElement[0].childNodes[3].style.width = "0%";
	
	this.appear();	
};

FileProgress.prototype.setProgress = function (percentage) {
	this.fileProgressElement[0].className = "progressContainer green";
	this.fileProgressElement[0].childNodes[3].className = "progressBarInProgress";
	this.fileProgressElement[0].childNodes[3].style.width = percentage + "%";

	this.appear();	
};
FileProgress.prototype.setComplete = function () {
	this.fileProgressElement[0].className = "progressContainer blue";
	this.fileProgressElement[0].childNodes[3].className = "progressBarComplete";
	this.fileProgressElement[0].childNodes[3].style.width = "";

	var oSelf = this;
};
FileProgress.prototype.setError = function () {
	this.fileProgressElement[0].className = "progressContainer red";
	this.fileProgressElement[0].childNodes[3].className = "progressBarError";
	this.fileProgressElement[0].childNodes[3].style.width = "";

	var oSelf = this;
};
FileProgress.prototype.setCancelled = function () {
	this.fileProgressElement[0].className = "progressContainer";
	this.fileProgressElement[0].childNodes[3].className = "progressBarError";
	this.fileProgressElement[0].childNodes[3].style.width = "";

	var oSelf = this;
};
FileProgress.prototype.setStatus = function (status) {
	this.fileProgressElement[0].childNodes[2].innerHTML = status;
};

// Show/Hide the cancel button
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
	this.fileProgressElement[0].childNodes[0].style.visibility = show ? "visible" : "hidden";
	if (swfUploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement[0].childNodes[0].onclick = function () {
			swfUploadInstance.cancelUpload(fileID);
			return false;
		};
	}
};

FileProgress.prototype.appear = function () {
	if (this.getTimer() !== null) {
		clearTimeout(this.getTimer());
		this.setTimer(null);
	}

	var fpw=this.fileProgressWrapper[0];
	
	if (fpw.filters) {
		try {
			fpw.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
		} catch (e) {
			// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
			fpw.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=100)";
		}
	} else {
		fpw.style.opacity = 1;
	}
		
	fpw.style.height = "";
	
	this.height = fpw.offsetHeight;
	this.opacity = 100;
	fpw.style.display = "";
	
};