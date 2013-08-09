function Form()
{
	this.formLink = document.getElementById('downloadForm');
	
	//initialize events handler
	
	this.formLink.addEventListener('change', this.check, false);
	
	this.formLink.addEventListener('submit', function(e){e.preventDefault();}, true);
	this.formLink.addEventListener('submit', this.submit, true);
}

Form.prototype =
{
	submit: function()
	{	
		var fetchData = new FetchData;
		fetchData.fetch();
	},
	
	check: function()
	{
		return true;
	}
};




