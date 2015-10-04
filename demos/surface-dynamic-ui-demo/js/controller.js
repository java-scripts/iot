 $(".button-collapse").sideNav();

 var $sensorholder = $('#sensorholder') ;

 
function initFeedCourousel(target,shift){
	var $feedCarouselShelf = $(target+' .feed-carousel-shelf');
	 var shelfp=0,shelfWidth =4*$feedCarouselShelf.width();;
	 $(target+' .right').click(function(){
		shelfp=(shelfp-shift)%shelfWidth;
		$feedCarouselShelf.animate({left:shelfp},200);
		$sensorholder.empty();
	 });
	  $(target+' .left').click(function(){
		shelfp=(shelfp+shift)%shelfWidth;
		$feedCarouselShelf.animate({left:shelfp},200);
		$sensorholder.empty();
	 });
	 
}

initFeedCourousel('#feed1', 200); 
initFeedCourousel('#feed2', 800);
 
$('.feed-carousel-shelf').draggable({
	axis: "x"
})

//gadget tray
$('.feedimg').dblclick(function(){	
 	 var $sensor = $(this).clone();
	 $sensor.draggable({
		revert:true,
		snap:'.feedimg',		
	 }).addClass('sensor')
	 $sensorholder.append($sensor)
	 $sensor.offset($(this).offset())
});



$('.worksheet').droppable({
			accept:".sensor",
			drop:function(event,ui){				
				var $dropped = ui.draggable;				
				var droppedOnWorksheet = $dropped.attr('droppedOnWorksheet');
				if(!droppedOnWorksheet){					
					$dropped.draggable({"revert":false}).attr('droppedOnWorksheet',true);
					var oldPosition = $dropped.offset();
					$(this).append($dropped);
					$dropped.offset(oldPosition);
					onGadgetDropped($(this).attr('name'),$dropped)	;
				}				
			}
		});

var workSheetMap={};		

//when a gadget dropped on to worksheet for the firsttime		
var onGadgetDropped	= function(sheet, $gadget){	
	//console.log('gadget dropped on ', sheet, $gadget[0]);
	
	if(!workSheetMap[sheet]){ workSheetMap[sheet] = demoUtil.createWorkSheet();}//create if not exists	
	var worksheet = workSheetMap[sheet];//get worksheet 	
	var gadget = demoUtil.createGadget($gadget);//create gadget for the dom node	
	worksheet.addGadget(gadget);	
}
		
		
		
		
		
		
		
		
		
		
		
		