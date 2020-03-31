/**
 * The following file handles the front end logic to display the components of
 * the game
 */
$(document).ready(() => {
	const url = "http://localhost:3000";

	$("#start").click((event) => {
		event.preventDefault();

		// validation
		if ($("#userName").val() === '') {
			displayError("Please enter userName", "#userName");
			return;
		}
		// send user to server
		$.ajax({
			url: url + '/register',
			type: "post",
			dataType: "json",
			data: {
				userName: $("#userName").val()
			}
		}).done(() => {
			// landing of main page
			$("#welcomePage").hide();
			$("#gamePage").show();
			$("#greeting").text("Hi " + $("#userName").val()).attr('data-name', $("#userName").val());
		}).fail((data) => {
			displayError(data.responseJSON.message, "#userName");
		});
	});

	/*
	 * Function to request random cards to server
	 */
	$("select#cardsCount").change(function () {
		const count = $(this).children("option:selected").val();
		loadCard(count, $("#userName").val());
	});

	/*
	 * Function to load cards on the screen
	 */
	function loadCard(count, userName) {

		$.ajax({
			url: url + '/numbers',
			type: "get",
			dataType: "json",
			data: {
				cardCount: count
			}
		}).done((data, status, error) => {
			$("#cardsScreen").html('');
			let cardHTML = "";
			if (data.length <= 0) {
				$("#play").hide();
			} else {
				$("#play").show();
			}
			const array = data.numbers;

			// loading Cards html
			for (let i = 0; i < array.length; i++) {
				//	cardHTML += `<span class="card opened" data-card=${i}>${array[i]}</span>`;
				cardHTML =
					`<div class=" flippable-card opened" data-card=${i}>
				 <div class="flippable-card-inner">
				 <div class="flippable-card-front">
				 <p class="card-number" >${array[i]}</p>
			   </div>
				   <div class="flippable-card-back">
				   </div>
				 </div>
			   </div>`

				$("#cardsScreen").append(cardHTML);
			}



			// making copy of actual array for future use
			const copy = [...array];

			// once cards are loaded array is sorted for testing logic.
			array.sort((first, second) => {
				return first - second;
			});


			$(".flippable-card").bind("click", function () {
				if ($(this).hasClass('closed')) {
					$(this).addClass('opened').removeClass('closed');
					const actualValue = array.shift();
					const cardValue = copy[$(this).attr('data-card')];
					// to check if user is clicking on correct order
					if (actualValue == cardValue) {
						$(this).find('p').text(copy[$(this).attr('data-card')]);
						if (array.length == 0) {
							$("#resultMessage").text("Congratulations! You win :)").addClass("success");
							sendResult(userName, copy.length, "won");
						}
					}
					else {
						$(this).addClass("wrong-card");
						$("#resultMessage").text("Oops!! Better luck next time.").addClass("error");
						$(".flippable-card").removeClass('closed').addClass('opened');
						$('.flippable-card').each(function (i) {
							$(this).find('p').text(copy[$(this).attr('data-card')]);
						});
						sendResult(userName, copy.length, "failed");
					}
				}
			});
		});
	}


	$("#play").click(() => {
		$("#cardsCount").attr("disabled", true);
		$("#play").hide();
		if ($("#cardsCount").val() === '') {
			return;
		}
		$(".flippable-card").removeClass('opened').addClass('closed').find('p').text("");
	});


	function displayError(message, element) {
		$('.error').remove();
		$(element).after(`<span class="error">${message}</span>`);
	}


	function sendResult(userName, count, status) {
		$.ajax({
			url: url + '/history',
			type: "post",
			dataType: "json",
			data: {
				userName,
				history: {
					status,
					time: getDateFormat(),
					count
				}

			}
		});
	}

	$("#history").click(() => {
		$.ajax({
			url: url + '/history',
			type: "get",
			dataType: "json",
			data: {
				userName: $("#greeting").attr('data-name')
			}
		}).done((data) => {
			let table = '<table class="table"><thead><th>Date</th><th>Card Count</th><th>Status</th></thead>';
			data.forEach((item) => {
				table += `<tr><td>${item.time}</td><td>${item.count}</td><td>${item.status}</td></tr>`;
			});
			table += '</table>';
			$("#historyData").html(table);
		});
	});

	$("#reset").click(() => {
		$("#cardsCount").attr("disabled", false).val('Select');
		$("#resultMessage").text("");
		$("#cardsScreen").empty();
		$("#play").hide();

	});

	function getDateFormat() {
		const today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1;
		const yyyy = today.getFullYear();
		const hours = today.getHours();
		const minutes = today.getMinutes();
		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}
		return `${mm}-${dd}-${yyyy} ${hours}:${minutes}`;
	}
});



