Array.prototype.last = function(){
	return this[this.length - 1];
};

Array.prototype.popRandom = function(){
	var pos = Math.floor(Math.random() * this.length);

	var out = this.splice(pos, 1)[0];
	return out;
}

Array.prototype.equals = function(array, strict)
{
	if(!array)
		return false;

	if(arguments.length == 1)
		strict = false;

	if(this.length != array.length)
		return false;

	for(var i = 0; i < this.length; i ++)
		{
			if(this[i] instanceof Array && array[i] instanceof Array)
				{
					if(!this[i].equals(array[i], strict))
						return false;
				}

			else if(strict && this[i] != array[i])
				return false;

			else if(!strict)
				return this.sort().equals(array.sort(), true);
		}

	return true;
}