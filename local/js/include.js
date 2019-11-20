$(window).load(function() {
	$('#modals').load('../include/modals.html', function(){
		console.log('modals loaded');
	});
	$('#menu').load('../include/menu.html', function() {
		console.log('menu loaded');
	});
	$('#innerFooter').load('../include/footer.html', function() {
		console.log('fooooter loaded');
	});
});