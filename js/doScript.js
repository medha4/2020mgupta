var time_in_minutes = 1;
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + time_in_minutes*60*1000);
var highscore = 0;

var abbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];

function time_remaining(endtime){
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	var hours = Math.floor( (t/(1000*60*60)) % 24 );
	var days = Math.floor( t/(1000*60*60*24) );
	return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}

var timeinterval;
function run_clock(id,endtime){
	var clock = document.getElementById(id);
	function update_clock(){
		var t = time_remaining(endtime);
		clock.innerHTML = 'minutes: '+t.minutes+'<br>seconds: '+t.seconds;
		if(t.total<=0){ 
		    clearInterval(timeinterval); 
		    if (score > highscore)
		    {
		        highscore = score;
		        document.getElementById("high").innerHTML = "The high score is: " + highscore
		        document.getElementById("result").innerHTML = "Congratulations! You have won!"
		    }
		    else
		    {
		        document.getElementById("result").innerHTML = "Sorry:( You have lost!"
		    }
		    score = 0;
		    for(var i = 0; i < els.length; i++)
            {
                els[i].style.fill = "teal";
                els[i].onclick = null;
            }
		    document.getElementById("end").innerHTML = "The Game Has Ended; Hit the Start Game Button to Play Again!"
		    time_remaining(Date.parse(new Date()) + time_in_minutes*60*1000)
		}
	}
	update_clock(); 
	timeinterval = setInterval(update_clock,1000);
}

var curr = abbreviations[Math.floor(Math.random()*abbreviations.length)]

function beginGame(){
    run_clock('clockdiv',deadline);
    document.getElementById("abbrev").innerHTML = curr
    
    var els = document.getElementsByTagName('path');
    for(var i = 0; i < els.length; i++)
    {
        els[i].onclick=changeColor;
    }
}


var paused = false; 
var time_left; 

function pause_clock(){
	if(!paused){
		paused = true;
		clearInterval(timeinterval);
		time_left = time_remaining(deadline).total;
	}
}

function resume_clock(){
	if(paused){
		paused = false;
		deadline = new Date(Date.parse(new Date()) + time_left);
		run_clock('clockdiv',deadline);
	}
}




var score = 0
document.getElementById("score").innerHTML = "Score: " + score;
function changeColor(){
    this.style.fill = "yellow"
    
    if (curr == this.id)
    {
        for(var i = 0; i < els.length; i++)
        {
            els[i].style.fill = "teal";
        }
        
        score++;
        document.getElementById("score").innerHTML = "Score: " + score;
        curr = abbreviations[Math.floor(Math.random()*abbreviations.length)]
        document.getElementById("abbrev").innerHTML = curr
    }
   
}





