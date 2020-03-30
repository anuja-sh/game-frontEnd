/**
 * The following file handles the front end logic to display the components of
 * the game
 */
const url = "http://ec2-3-125-116-112.eu-central-1.compute.amazonaws.com:3000";

$(document).ready(()=>{
		$("#start").click(function(event) {
			event.preventDefault();
			
			// validation
			if( $("#userName").val() === ''){
				displayError("Please enter userName", "#userName");
			return;
			}
			// send user to server
		     $.ajax({
		            url: url+'/register',
		            type: "post",
		            dataType: "json",
		            data: {
		            	userName : $("#userName").val()
		            }
		     }).done(function(data){
		    	 // landing of main page
	    				$("#welcomePage").hide();
	    				$("#gamePage").show();
	    				$("#greeting").text("Hi "+$("#userName").val()).attr('data-name', $("#userName").val());
		        }).fail(function(data, status, error){
					displayError(data.responseJSON.message, "#userName");
		     });		
		});	
		
		/*
		 * Function to request random cards to server
		 */
		$("select#cardsCount").change(function(event){
			const count = $(this).children("option:selected").val();
			loadCard(count, $("#userName").val());
		});
		
		/*
		 * Function to load cards on the screen
		 */
		function loadCard(count, userName){
			
			$.ajax({
	            url: url+'/numbers',
	            type: "get",
	            dataType: "json",
	            data: {
	            	cardCount: count
	            }
			}).done(function(data, status, error){
				$("#cardsScreen").html("");
				let cardHTML = "";
				if(data.length <= 0){
					$("#play").hide();
				}else{
					$("#play").show();
				}
				const array = data.numbers;

				for(let i=0;i<array.length;i++){
			 cardHTML += `<span class="card opened" data-card=${i}>${array[i]}</span>`;
			/*
			 * cardHTML = `<div class="flip-card"> <div
			 * class="flip-card-inner"> <div class="flip-card-front"> <span
			 * class="card opened" data-="${array[i]}>${array[i]}</span> </div>
			 * <div class="flip-card-back"> <span class="card closed"
			 * data-attr="${array[i]}></span> </div> </div> </div>`;
			 * $("#cardsScreen").append(cardHTML);
			 */
				}
				$("#cardsScreen").append(cardHTML);
				
				const copy = [...array];
				
				// once cards are loaded array is sorted for testing logic.
				array.sort((first, second)=>{
					return first - second;
				});
				
				
				$(".card").bind( "click",function(){
					if($(this).hasClass('closed')){
						$(this).removeClass('closed').addClass('correct');
						const value = array.shift();
						const cardValue = copy[$(this).attr('data-card')];
						// to check if user is clicking on correct order
						if(value == cardValue){
							$(this).text(copy[$(this).attr('data-card')]);
						// $(this).addClass('correct');
							if(array.length == 0){
								$("#resultMessage").text("Congratulations! You win :)").addClass("success").focus()
								sendResult(userName,copy.length, "won");
							}
						}
						else{
							$(this).addClass("wrongCard");
							$("#resultMessage").text("Oops!! Better luck next time.").addClass("error");
							$(".card").removeClass('closed').addClass('opened');
							$('.card').each(function(i){
								$(this).text(copy[$(this).attr('data-card')]);
							});
							sendResult(userName, copy.length, "fail");
						}
					}
				});
			});
		}
		
		
		$("#play").click(function(){
			$("#cardsCount").attr("disabled", true);
			$("#play").hide();
			if($("#cardsCount").val() === ''){
				return;
			}
			$(".card").removeClass('opened').addClass('closed').css({"display": "inline-block"});
			$(".card").text("");
		});
		
		
		function displayError (message, element){
			$('.error').remove();
			$(element).after(`<span class="error">${message}</span>`);
		}
		

		function sendResult(userName,count, status){
			$.ajax({
	            url: url+'/history',
	            type: "post",
	            dataType: "json",
	            data: {
	            	userName,
	            	history:{
	            		status,
		            	time: getDateFormat(),
		            	count
	            	}
	            	
	            }
			}).done(function(data){
				
			});
		}
		
		$("#history").click(function(){
			$.ajax({
	            url: url+'/history',
	            type: "get",
	            dataType: "json",
	            data: {
	            	userName:$("#greeting").attr('data-name')	
	            }
			}).done(function(data){
				let table = '<table><th>Time</th><th>Card Count</th><th>Status</th>'
				data.forEach(function(item){
					table+=`<tr><td>${item.time}</td><td>${item.count}</td><td>${item.status}</td></tr>`;
				});
				 table += '</table>'
					$("#historyData").html(table);
			});
		});
	
		$("#reset").click(function(){
			$("#cardsCount").attr("disabled", false).val('Select');
			$("#resultMessage").text("");
			$("#cardsScreen").empty();
			$("#play").hide();
			
		});
		
		function getDateFormat(){
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear();
			if(dd<10) 
			{
			    dd='0'+dd;
			} 

			if(mm<10) 
			{
			    mm='0'+mm;
			} 
			return mm+'-'+dd+'-'+yyyy;
		}
});



