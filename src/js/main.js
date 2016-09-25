/* http://www.kimcod.es */
document.addEventListener('DOMContentLoaded', function() {
	var cards = document.getElementsByClassName('card'),
		cardsLength = cards.length,
		i = 0;

	function flipCard(card, event) {
		event.preventDefault();
		
		if (card.classList.contains('flip')) {
			card.classList.remove('flip');
		} else {
			card.classList.add('flip');
		}
	}

	// add event listener to each card
	for (i; i < cardsLength; i++) {
		cards[i].addEventListener('click', function(e) {

			// enable "view live site" links
			if (!(e.target).parentElement.classList.contains('live')) {
				flipCard(this, event);
			}
		});
	}
});